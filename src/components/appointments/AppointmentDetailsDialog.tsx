"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import { formatDate, formatDateTime, formatDuration, formatPrice } from "@/lib/utils";
import type { Appointment } from "@/types";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border py-2.5 text-sm last:border-0">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right font-medium">{children}</dd>
    </div>
  );
}

export default function AppointmentDetailsDialog({
  appointment,
  onClose,
}: {
  appointment: Appointment | null;
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
        aria-labelledby="appointment-title"
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-surface p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id="appointment-title" className="text-xl font-semibold">
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

        {a.service?.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={a.service.image}
            alt={a.service.serviceName ?? "Service"}
            className="mt-4 aspect-[16/9] w-full rounded-lg object-cover"
          />
        )}

        <dl className="mt-4">
          <Row label="Service">{a.service?.serviceName ?? "Service removed"}</Row>
          <Row label="Category">{a.service?.category ?? "-"}</Row>
          {a.service?.duration && <Row label="Duration">{formatDuration(a.service.duration)}</Row>}
          <Row label="Date">{formatDate(a.appointmentDate)}</Row>
          <Row label="Time">{a.timeSlot}</Row>
          <Row label="Price">{formatPrice(a.servicePrice)}</Row>
          <Row label="Appointment status">
            <StatusBadge status={a.status} />
          </Row>
          <Row label="Payment status">
            <StatusBadge status={a.paymentStatus} />
          </Row>
          <Row label="Requested on">{formatDateTime(a.createdAt)}</Row>
          <Row label="Your message">{a.message || "None"}</Row>
        </dl>
      </div>
    </div>
  );
}