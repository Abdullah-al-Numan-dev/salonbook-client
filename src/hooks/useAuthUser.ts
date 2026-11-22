"use client";

export type AuthUser = {
  name: string;
  email: string;
  image?: string | null;
  role: "admin" | "customer";
};

// PLACEHOLDER. Replaced with Better Auth's useSession in the auth step.
// To preview the logged-in navbar, temporarily change null to:
// { name: "Jane Doe", email: "jane@example.com", role: "customer" }
const PLACEHOLDER_USER: AuthUser | null = null;

export function useAuthUser() {
  return {
    user: PLACEHOLDER_USER,
    isPending: false,
    signOut: async () => {},
  };
}