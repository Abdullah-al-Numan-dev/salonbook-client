import AuthGuard from "@/components/auth/AuthGuard";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard role="customer">{children}</AuthGuard>;
}