"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { CalendarDays, Clock } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import AppointmentDetailsDialog from "./AppointmentDetailsDialog";
import Button, { buttonStyles } from "@/components/ui/Button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import EmptyState from "@/components/ui/EmptyState";
import StatusBadge from "@/components/ui/StatusBadge";
import { useFetch } from "@/hooks/useFetch";
import { api, getErrorMessage } from "@/lib/api";
import { cn, formatDate, formatDateTime, formatPrice } from "@/lib/utils";
import type { Appointment } from "@/types";

const FILTERS = ["all", "pending", "confirmed", "cancelled"] as const;

export default function MyAppointments() {
  const { data, loading, error, refetch } = useFetch(() =>
    api<{ data: Appointment[] }>("/api/appointments/my", { auth: true })
  );

  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");
  const [details, setDetails] = useState<Appointment | null>(null);
  const [toCancel, setToCancel] = useState<Appointment | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [payingId, setPayingId] = useState<string | null>(null);

  const all = data?.data ?? [];
  const visible = filter === "all" ? all : all.filter((a) => a.status === filter);

  async function confirmCancel() {
    if (!toCancel) return;
    setCancelling(true);
    try {
      await api(`/api/appointments/${toCancel._id}/cancel`, { method: "PATCH", auth: true });
      toast.success("Appointment cancelled");
      setToCancel(null);
      refetch();
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not cancel the appointment"));
      setToCancel(null);
      refetch(); // the status may have changed, so show the truth
    } finally {
      setCancelling(false);
    }
  }

  async function payNow(a: Appointment) {
    setPayingId(a._id);
    try {
      const res = await api<{ data: { url: string } }>("/api/payments/checkout-session", {
        method: "POST",
        auth: true,
        body: { appointmentId: a._id },
      });
      window.location.href = res.data.url; // on success the browser leaves for Stripe
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not start the payment"));
      setPayingId(null);
    }
  }

  return (
    <>
      <PageHeader
        title="My Appointments"
        description="Track your requests, cancel pending ones and pay once confirmed."
        action={
          <Link href="/services" className={buttonStyles()}>
            Book a Service
          </Link>
        }
      />

      <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Filter by status">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium capitalize transition-colors",
              filter === f
                ? "border-primary bg-primary text-white"
                : "border-border bg-surface hover:border-primary hover:text-primary"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-36 animate-pulse rounded-xl border border-border bg-primary-soft" />
          ))}
        </div>
      ) : error ? (
        <EmptyState
          title="Could not load your appointments"
          description={error}
          action={<Button onClick={refetch}>Try again</Button>}
        />
      ) : visible.length === 0 ? (
        <EmptyState
          title={all.length === 0 ? "No appointments yet" : `No ${filter} appointments`}
          description={
            all.length === 0
              ? "Browse our services and send your first appointment request."
              : "Try a different filter."
          }
          action={
            all.length === 0 ? (
              <Link href="/services" className={buttonStyles()}>
                Browse Services
              </Link>
            ) : undefined
          }
        />
      ) : (
        <ul className="space-y-4">
          {visible.map((a) => {
            const canCancel = a.status === "pending";
            const canPay = a.status === "confirmed" && a.paymentStatus === "unpaid";
            return (
              <li
                key={a._id}
                className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-4 sm:flex-row sm:p-5"
              >
                {a.service?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={a.service.image}
                    alt={a.service.serviceName ?? "Service"}
                    className="aspect-[4/3] w-full rounded-lg object-cover sm:h-28 sm:w-36"
                  />
                ) : (
                  <div className="aspect-[4/3] w-full rounded-lg bg-primary-soft sm:h-28 sm:w-36" />
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                        {a.service?.category ?? "Service"}
                      </p>
                      <h3 className="truncate text-lg font-semibold">
                        {a.service?.serviceName ?? "Service removed"}
                      </h3>
                    </div>
                    <p className="text-lg font-semibold text-primary-dark">
                      {formatPrice(a.servicePrice)}
                    </p>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="h-4 w-4" aria-hidden="true" />
                      {formatDate(a.appointmentDate)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-4 w-4" aria-hidden="true" />
                      {a.timeSlot}
                    </span>
                    <span>Requested {formatDateTime(a.createdAt)}</span>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="text-xs text-muted">Appointment</span>
                    <StatusBadge status={a.status} />
                    <span className="ml-2 text-xs text-muted">Payment</span>
                    <StatusBadge status={a.paymentStatus} />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={() => setDetails(a)}>
                      View Details
                    </Button>
                    {canCancel && (
                      <Button variant="danger" size="sm" onClick={() => setToCancel(a)}>
                        Cancel Request
                      </Button>
                    )}
                    {canPay && (
                      <Button size="sm" loading={payingId === a._id} onClick={() => payNow(a)}>
                        {payingId === a._id ? "Redirecting..." : "Pay Now"}
                      </Button>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <AppointmentDetailsDialog appointment={details} onClose={() => setDetails(null)} />

      <ConfirmDialog
        open={!!toCancel}
        danger
        title="Cancel this request?"
        message={`Your request for ${toCancel?.service?.serviceName ?? "this service"} on ${
          toCancel ? formatDate(toCancel.appointmentDate) : ""
        } at ${toCancel?.timeSlot ?? ""} will be cancelled and the time slot released.`}
        confirmText="Yes, cancel it"
        cancelText="Keep it"
        loading={cancelling}
        onConfirm={confirmCancel}
        onCancel={() => setToCancel(null)}
      />
    </>
  );
}