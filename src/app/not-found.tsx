import { Suspense } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ErrorView from "@/components/ui/ErrorView";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Suspense fallback={<div className="h-16 border-b border-border" />}>
        <Navbar />
      </Suspense>
      <main className="flex-1">
        <ErrorView
          code="404"
          title="Page not found"
          description="The page you are looking for does not exist or has been moved."
        />
      </main>
      <Footer />
    </div>
  );
}