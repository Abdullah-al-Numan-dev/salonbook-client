import { Suspense } from "react";
import AuthGuard from "@/components/auth/AuthGuard";
import ServiceDetails from "@/components/services/ServiceDetails";
import PageLoader from "@/components/ui/PageLoader";

export default function ServiceDetailsPage() {
  return (
    <Suspense fallback={<PageLoader label="Loading service details..." />}>
      <AuthGuard>
        <ServiceDetails />
      </AuthGuard>
    </Suspense>
  );
}