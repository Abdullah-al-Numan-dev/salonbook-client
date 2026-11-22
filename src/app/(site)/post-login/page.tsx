"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import PageLoader from "@/components/ui/PageLoader";
import { useAuthUser } from "@/hooks/useAuthUser";
import { authClient } from "@/lib/auth-client";
import { clearTokenCache } from "@/lib/api";
import { getRoleHome } from "@/lib/roles";

export default function PostLoginPage() {
  const router = useRouter();
  const { user, isPending } = useAuthUser();

  useEffect(() => {
    if (isPending) return;

    if (!user) {
      router.replace("/signin");
      return;
    }

    if (user.isBlocked) {
      authClient.signOut().finally(() => {
        clearTokenCache();
        toast.error("Your account has been blocked. Please contact support", { id: "blocked" });
        router.replace("/signin");
      });
      return;
    }

    clearTokenCache();
    router.replace(getRoleHome(user.role));
  }, [user, isPending, router]);

  return <PageLoader label="Signing you in..." />;
}