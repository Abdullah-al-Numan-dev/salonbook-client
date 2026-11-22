import AuthGuard from "@/components/auth/AuthGuard";
import DashboardShell from "@/components/dashboard/DashboardShell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard role="admin">
      <DashboardShell role="admin">{children}</DashboardShell>
    </AuthGuard>
  );
}