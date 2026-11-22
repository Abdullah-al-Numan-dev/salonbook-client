import { authClient } from "./auth-client";
import { API_URL } from "./constants";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

let cachedToken: { token: string; exp: number } | null = null;

// Call this after sign in, sign up and sign out, so a new user never reuses an old token
export function clearTokenCache() {
  cachedToken = null;
}

async function getToken(): Promise<string | null> {
  if (cachedToken && cachedToken.exp > Date.now() + 30_000) {
    return cachedToken.token;
  }
  const { data, error } = await authClient.token();
  if (error || !data?.token) return null;

  try {
    const base64 = data.token
      .split(".")[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    const payload = JSON.parse(atob(padded));
    if (typeof payload.exp === "number") {
      cachedToken = { token: data.token, exp: payload.exp * 1000 };
    } else {
      cachedToken = null;
    }
  } catch {
    cachedToken = null;
  }
  return data.token;
}

type ApiOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  formData?: FormData;
  auth?: boolean;
  query?: Record<string, string | number | undefined | null>;
};

export async function api<T = unknown>(path: string, options: ApiOptions = {}): Promise<T> {
  const headers: Record<string, string> = {};

  if (options.auth) {
    const token = await getToken();
    if (!token) throw new ApiError(401, "Please sign in to continue");
    headers.Authorization = `Bearer ${token}`;
  }

  let body: BodyInit | undefined;
  if (options.formData) {
    body = options.formData; // the browser sets the multipart header itself
  } else if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(options.body);
  }

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(options.query ?? {})) {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  }
  const qs = params.toString();
  const url = `${API_URL}${path}${qs ? `?${qs}` : ""}`;

  let res: Response;
  try {
    res = await fetch(url, {
      method: options.method ?? "GET",
      headers,
      body,
      cache: "no-store",
    });
  } catch {
    throw new ApiError(0, "Cannot reach the server. Check your connection and try again");
  }

  const json = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiError(res.status, json?.message || "Something went wrong");
  }
  return json as T;
}

export function getErrorMessage(err: unknown, fallback = "Something went wrong") {
  return err instanceof Error && err.message ? err.message : fallback;
}

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export function validateImageFile(file: File): string {
  if (!IMAGE_TYPES.includes(file.type)) return "Only JPG, PNG, WEBP or GIF images are allowed";
  if (file.size > MAX_IMAGE_SIZE) return "Image must be 5MB or smaller";
  return "";
}

// Uploads through the Express server, which keeps the ImgBB key secret
export async function uploadImage(file: File): Promise<string> {
  const problem = validateImageFile(file);
  if (problem) throw new ApiError(400, problem);

  const formData = new FormData();
  formData.append("image", file);
  const res = await api<{ data: { url: string } }>("/api/upload/image", {
    method: "POST",
    formData,
    auth: true,
  });
  return res.data.url;
}