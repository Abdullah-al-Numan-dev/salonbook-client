export function validateName(value: string) {
  const v = value.trim();
  if (v.length < 2) return "Name must be at least 2 characters";
  if (v.length > 60) return "Name must be 60 characters or fewer";
  return "";
}

export function validateEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? "" : "Enter a valid email address";
}

// Same rules as the server: 6+ characters, one uppercase, one lowercase
export function validatePassword(value: string) {
  if (value.length < 6) return "Password must be at least 6 characters";
  if (!/[A-Z]/.test(value)) return "Password must include an uppercase letter";
  if (!/[a-z]/.test(value)) return "Password must include a lowercase letter";
  return "";
}

export function validateImageUrl(value: string) {
  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:"
      ? ""
      : "Image URL must start with http:// or https://";
  } catch {
    return "Enter a valid image URL";
  }
}