import { Suspense } from "react";
import PageLoader from "@/components/ui/PageLoader";

export default function DashboardRootLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}