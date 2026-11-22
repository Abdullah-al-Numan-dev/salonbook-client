import { Suspense } from "react";
import EditService from "@/components/admin/EditService";
import PageLoader from "@/components/ui/PageLoader";

export default function EditServicePage() {
  return (
    <Suspense fallback={<PageLoader label="Loading service..." />}>
      <EditService />
    </Suspense>
  );
}