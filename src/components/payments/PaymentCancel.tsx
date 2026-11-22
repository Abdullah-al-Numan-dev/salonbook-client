import Link from "next/link";
import { XCircle } from "lucide-react";
import Container from "@/components/ui/Container";
import { buttonStyles } from "@/components/ui/Button";

export default function PaymentCancel() {
  return (
    <Container className="flex justify-center py-12 sm:py-16">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-surface p-6 text-center shadow-sm sm:p-8">
        <XCircle className="mx-auto h-12 w-12 text-warning" aria-hidden="true" />
        <h1 className="mt-4 text-3xl font-semibold">Payment cancelled</h1>
        <p className="mt-2 text-sm text-muted">
          You left the checkout page, so nothing was charged. Your appointment is still
          confirmed, and you can pay whenever you are ready.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/dashboard/customer/appointments" className={buttonStyles()}>
            Back to My Appointments
          </Link>
          <Link href="/services" className={buttonStyles({ variant: "outline" })}>
            Browse Services
          </Link>
        </div>
      </div>
    </Container>
  );
}