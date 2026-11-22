import { Suspense } from "react";
import type { Metadata } from "next";
import AuthGuard from "@/components/auth/AuthGuard";
import PaymentSuccess from "@/components/payments/PaymentSuccess";
import PageLoader from "@/components/ui/PageLoader";

export const metadata: Metadata = { title: "Payment Successful" };

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<PageLoader label="Loading..." />}>
      <AuthGuard role="customer">
        <PaymentSuccess />
      </AuthGuard>
    </Suspense>
  );
}