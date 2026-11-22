import { Suspense } from "react";
import type { Metadata } from "next";
import ServiceBrowser from "@/components/services/ServiceBrowser";
import PageLoader from "@/components/ui/PageLoader";

export const metadata: Metadata = {
  title: "Browse Services",
  description: "Explore salon services, filter by category and sort by price.",
};

export default function ServicesPage() {
  return (
    <Suspense fallback={<PageLoader label="Loading services..." />}>
      <ServiceBrowser />
    </Suspense>
  );
}