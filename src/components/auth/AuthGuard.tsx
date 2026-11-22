"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import PageLoader from "@/components/ui/PageLoader";
import { isLoggingOut, useAuthUser } from "@/hooks/useAuthUser";
import { getRoleHome, type Role } from "@/lib/roles";

// Wrap a page or layout. Pass `role` to restrict it to admins or customers.
export default function AuthGuard({
  children,
  role,
}: {
  children: ReactNode;
  role?: Role;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isPending, signOut } = useAuthUser();

  const allowed = !!user && !user.isBlocked && (!role || user.role === role);

  useEffect(() => {
    if (isPending) return;

    if (!user) {
      if (isLoggingOut()) return; // the navbar is already sending them Home
      router.replace(`/signin?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (user.isBlocked) {
      signOut().finally(() => {
        toast.error("Your account has been blocked. Please contact support", { id: "blocked" });
        router.replace("/signin");
      });
      return;
    }

    if (role && user.role !== role) {
      toast.error("You do not have access to that page", { id: "no-access" });
      router.replace(getRoleHome(user.role));
    }
  }, [user, isPending, role, pathname, router, signOut]);

  if (!allowed) {
    return <PageLoader label={isPending ? "Checking your session..." : "Redirecting..."} />;
  }

  return <>{children}</>;
}