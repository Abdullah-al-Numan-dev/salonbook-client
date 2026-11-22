"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import PageLoader from "@/components/ui/PageLoader";
import AuthGuard from "@/components/auth/AuthGuard";
import { useAuthUser } from "@/hooks/useAuthUser";
import { getRoleHome } from "@/lib/roles";

function Forward() {
  const router = useRouter();
  const { user } = useAuthUser();

  useEffect(() => {
    if (user) router.replace(getRoleHome(user.role));
  }, [user, router]);

  return <PageLoader label="Opening your dashboard..." />;
}

export default function DashboardIndexPage() {
  return (
    <AuthGuard>
      <Forward />
    </AuthGuard>
  );
}