import AuthGuard from "@/components/auth/AuthGuard";
import DashboardShell from "@/components/dashboard/DashboardShell";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard role="customer">
      <DashboardShell role="customer">{children}</DashboardShell>
    </AuthGuard>
  );
}