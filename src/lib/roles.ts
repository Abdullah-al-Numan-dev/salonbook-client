export type Role = "admin" | "customer";

export function getRoleHome(role: Role) {
  return role === "admin" ? "/dashboard/admin" : "/dashboard/customer";
}

// Only allows internal paths, so a crafted link can't send users to another site
export function safeRedirect(path: string | null | undefined) {
  if (!path) return null;
  if (!path.startsWith("/") || path.startsWith("//") || path.startsWith("/\\")) return null;
  if (path.startsWith("/signin") || path.startsWith("/signup")) return null;
  return path;
}