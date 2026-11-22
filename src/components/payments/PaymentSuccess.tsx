"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import Container from "@/components/ui/Container";
import Spinner from "@/components/ui/Spinner";
import Button, { buttonStyles } from "@/components/ui/Button";
import StatusBadge from "@/components/ui/StatusBadge";
import { api } from "@/lib/api";
import { formatDate, formatDateTime, formatPrice } from "@/lib/utils";

type PaymentResult = {
  amount: number;
  currency: string;
  stripeSessionId: string;
  status: "paid" | "failed";
  createdAt: string;
  serviceName: string | null;
  appointmentDate: string | null;
  timeSlot: string | null;
};

type View = "checking" | "paid" | "failed" | "timeout" | "error";

const INTERVAL_MS = 2000;
const MAX_ATTEMPTS = 20;

export default function PaymentSuccess() {
  const sessionId = useSearchParams().get("session_id");
  const [view, setView] = useState<View>("checking");
  const [result, setResult] = useState<PaymentResult | null>(null);
  const [runKey, setRunKey] = useState(0);

  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    setView("checking");

    async function check(attempt: number) {
      try {
        const res = await api<{ processing: boolean; data: PaymentResult | null }>(
          `/api/payments/session/${encodeURIComponent(sessionId as string)}`,
          { auth: true }
        );
        if (cancelled) return;

        if (!res.processing && res.data) {
          setResult(res.data);
          setView(res.data.status === "paid" ? "paid" : "failed");
          return;
        }
        if (attempt >= MAX_ATTEMPTS) {
          setView("timeout");
          return;
        }
        timer = setTimeout(() => check(attempt + 1), INTERVAL_MS);
      } catch {
        if (!cancelled) setView("error");
      }
    }

    check(1);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [sessionId, runKey]);

  const shell = (children: React.ReactNode) => (
    <Container className="flex justify-center py-12 sm:py-16">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-surface p-6 text-center shadow-sm sm:p-8">
        {children}
      </div>
    </Container>
  );

  const actions = (
    <div className="mt-6 flex flex-wrap justify-center gap-3">
      <Link href="/dashboard/customer/appointments" className={buttonStyles()}>
        My Appointments
      </Link>
      <Link href="/services" className={buttonStyles({ variant: "outline" })}>
        Browse Services
      </Link>
    </div>
  );

  if (!sessionId) {
    return shell(
      <>
        <AlertTriangle className="mx-auto h-12 w-12 text-warning" aria-hidden="true" />
        <h1 className="mt-4 text-2xl font-semibold">No payment found</h1>
        <p className="mt-2 text-sm text-muted">
          This page needs a payment reference. Open your appointments to check your payments.
        </p>
        {actions}
      </>
    );
  }

  if (view === "checking") {
    return shell(
      <div role="status">
        <Spinner className="mx-auto h-10 w-10 text-primary" />
        <h1 className="mt-4 text-2xl font-semibold">Confirming your payment</h1>
        <p className="mt-2 text-sm text-muted">
          Please wait a moment while we verify it with Stripe. Do not close this page.
        </p>
      </div>
    );
  }

  if (view === "paid" && result) {
    return shell(
      <>
        <CheckCircle2 className="mx-auto h-12 w-12 text-success" aria-hidden="true" />
        <h1 className="mt-4 text-3xl font-semibold">Payment successful</h1>
        <p className="mt-2 text-sm text-muted">
          Thank you! Your appointment is confirmed and paid.
        </p>

        <dl className="mt-6 divide-y divide-border rounded-lg border border-border text-left text-sm">
          {[
            ["Service", result.serviceName ?? "-"],
            [
              "Appointment",
              result.appointmentDate
                ? `${formatDate(result.appointmentDate)} at ${result.timeSlot}`
                : "-",
            ],
            ["Amount paid", formatPrice(result.amount, result.currency)],
            ["Paid on", formatDateTime(result.createdAt)],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4 px-4 py-2.5">
              <dt className="text-muted">{label}</dt>
              <dd className="text-right font-medium">{value}</dd>
            </div>
          ))}
          <div className="flex justify-between gap-4 px-4 py-2.5">
            <dt className="text-muted">Status</dt>
            <dd>
              <StatusBadge status="paid" />
            </dd>
          </div>
          <div className="flex justify-between gap-4 px-4 py-2.5">
            <dt className="text-muted">Reference</dt>
            <dd className="font-mono text-xs">…{result.stripeSessionId.slice(-10)}</dd>
          </div>
        </dl>
        {actions}
      </>
    );
  }

  if (view === "failed") {
    return shell(
      <>
        <XCircle className="mx-auto h-12 w-12 text-danger" aria-hidden="true" />
        <h1 className="mt-4 text-2xl font-semibold">Payment failed</h1>
        <p className="mt-2 text-sm text-muted">
          Your payment could not be completed and you were not charged. You can try again from
          My Appointments.
        </p>
        {actions}
      </>
    );
  }

  if (view === "timeout") {
    return shell(
      <>
        <AlertTriangle className="mx-auto h-12 w-12 text-warning" aria-hidden="true" />
        <h1 className="mt-4 text-2xl font-semibold">Still confirming</h1>
        <p className="mt-2 text-sm text-muted">
          Your payment is taking longer than usual to confirm. If you were charged, your
          appointment will show as paid shortly. Check My Appointments in a minute.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button onClick={() => setRunKey((k) => k + 1)}>Check again</Button>
          <Link
            href="/dashboard/customer/appointments"
            className={buttonStyles({ variant: "outline" })}
          >
            My Appointments
          </Link>
        </div>
      </>
    );
  }

  return shell(
    <>
      <AlertTriangle className="mx-auto h-12 w-12 text-warning" aria-hidden="true" />
      <h1 className="mt-4 text-2xl font-semibold">Could not check your payment</h1>
      <p className="mt-2 text-sm text-muted">
        We could not reach the server. Your payment is safe. Try again in a moment.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button onClick={() => setRunKey((k) => k + 1)}>Try again</Button>
        <Link
          href="/dashboard/customer/appointments"
          className={buttonStyles({ variant: "outline" })}
        >
          My Appointments
        </Link>
      </div>
    </>
  );
}