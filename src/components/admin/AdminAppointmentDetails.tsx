"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import { formatDate, formatDateTime, formatDuration, formatPrice } from "@/lib/utils";
import type { AdminAppointment } from "@/types";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border py-2.5 text-sm last:border-0">
      <dt className="shrink-0 text-muted">{label}</dt>
      <dd className="min-w-0 break-words text-right font-medium">{children}</dd>
    </div>
  );
}

export default function AdminAppointmentDetails({
  appointment,
  onClose,
}: {
  appointment: AdminAppointment | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!appointment) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [appointment, onClose]);

  if (!appointment) return null;
  const a = appointment;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-appointment-title"
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl bg-surface p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id="admin-appointment-title" className="text-xl font-semibold">
            Appointment details
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1.5 hover:bg-primary-soft"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <h3 className="mt-5 font-sans text-sm font-semibold uppercase tracking-wider text-accent">
          Customer
        </h3>
        <dl className="mt-1">
          <Row label="Name">{a.customer?.name ?? "Unknown"}</Row>
          <Row label="Email">{a.customer?.email ?? "-"}</Row>
          <Row label="Phone">{a.customer?.phone || "Not provided"}</Row>
        </dl>

        <h3 className="mt-5 font-sans text-sm font-semibold uppercase tracking-wider text-accent">
          Service
        </h3>
        <dl className="mt-1">
          <Row label="Service">{a.service?.serviceName ?? "Service removed"}</Row>
          <Row label="Category">{a.service?.category ?? "-"}</Row>
          {a.service?.duration && <Row label="Duration">{formatDuration(a.service.duration)}</Row>}
          <Row label="Price">{formatPrice(a.servicePrice)}</Row>
        </dl>

        <h3 className="mt-5 font-sans text-sm font-semibold uppercase tracking-wider text-accent">
          Booking
        </h3>
        <dl className="mt-1">
          <Row label="Date">{formatDate(a.appointmentDate)}</Row>
          <Row label="Time">{a.timeSlot}</Row>
          <Row label="Appointment status">
            <StatusBadge status={a.status} />
          </Row>
          <Row label="Payment status">
            <StatusBadge status={a.paymentStatus} />
          </Row>
          <Row label="Requested on">{formatDateTime(a.createdAt)}</Row>
          {a.paidAt && <Row label="Paid on">{formatDateTime(a.paidAt)}</Row>}
          <Row label="Customer message">{a.message || "None"}</Row>
        </dl>
      </div>
    </div>
  );
}