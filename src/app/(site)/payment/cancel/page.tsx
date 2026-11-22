import { Suspense } from "react";
import type { Metadata } from "next";
import AuthGuard from "@/components/auth/AuthGuard";
import PaymentCancel from "@/components/payments/PaymentCancel";
import PageLoader from "@/components/ui/PageLoader";

export const metadata: Metadata = { title: "Payment Cancelled" };

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={<PageLoader label="Loading..." />}>
      <AuthGuard role="customer">
        <PaymentCancel />
      </AuthGuard>
    </Suspense>
  );
}