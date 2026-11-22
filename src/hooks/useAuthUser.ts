"use client";

import { authClient } from "@/lib/auth-client";
import { clearTokenCache } from "@/lib/api";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  phone?: string | null;
  role: "admin" | "customer";
  isBlocked: boolean;
};

let loggingOut = false;
export function isLoggingOut() {
  return loggingOut;
}

export function useAuthUser() {
  const { data, isPending } = authClient.useSession();

  const user: AuthUser | null = data?.user
    ? {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        image: data.user.image,
        phone: (data.user.phone as string | null | undefined) ?? null,
        role: data.user.role === "admin" ? "admin" : "customer",
        isBlocked: Boolean(data.user.isBlocked),
      }
    : null;

  return {
    user,
    isPending,
    signOut: async () => {
      loggingOut = true;
      try {
        await authClient.signOut();
        clearTokenCache();
      } finally {
        setTimeout(() => {
          loggingOut = false;
        }, 3000);
      }
    },
  };
}