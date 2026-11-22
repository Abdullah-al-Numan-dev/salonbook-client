"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Check, Eye, Search, X } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import AdminAppointmentDetails from "./AdminAppointmentDetails";
import Button from "@/components/ui/Button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import EmptyState from "@/components/ui/EmptyState";
import StatusBadge from "@/components/ui/StatusBadge";
import { fieldClass } from "@/components/ui/FormField";
import { useDebounce } from "@/hooks/useDebounce";
import { useFetch } from "@/hooks/useFetch";
import { api, getErrorMessage } from "@/lib/api";
import { cn, formatDate, formatPrice } from "@/lib/utils";
import type { AdminAppointment } from "@/types";

const STATUS_FILTERS = ["all", "pending", "confirmed", "cancelled"] as const;
const PAYMENT_FILTERS = ["all", "unpaid", "paid"] as const;

function Chips<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-muted">{label}</p>
      <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
        {options.map((o) => (
          <button
            key={o}
            type="button"
            aria-pressed={value === o}
            onClick={() => onChange(o)}
            className={cn(
              "rounded-full border px-3.5 py-1 text-sm font-medium capitalize transition-colors",
              value === o
                ? "border-primary bg-primary text-white"
                : "border-border bg-surface hover:border-primary hover:text-primary"
            )}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ManageAppointments() {
  const [status, setStatus] = useState<(typeof STATUS_FILTERS)[number]>("all");
  const [payment, setPayment] = useState<(typeof PAYMENT_FILTERS)[number]>("all");
  const [date, setDate] = useState("");
  const [searchText, setSearchText] = useState("");
  const search = useDebounce(searchText, 400);

  const { data, loading, error, refetch } = useFetch(
    () =>
      api<{ data: AdminAppointment[] }>("/api/admin/appointments", {
        auth: true,
        query: {
          status: status === "all" ? "" : status,
          paymentStatus: payment === "all" ? "" : payment,
          date,
          search: search.trim(),
        },
      }),
    [status, payment, date, search]
  );

  const [details, setDetails] = useState<AdminAppointment | null>(null);
  const [toCancel, setToCancel] = useState<AdminAppointment | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const items = data?.data ?? [];
  const hasFilters = status !== "all" || payment !== "all" || date || searchText;

  function clearFilters() {
    setStatus("all");
    setPayment("all");
    setDate("");
    setSearchText("");
  }

  async function confirm(a: AdminAppointment) {
    setConfirmingId(a._id);
    try {
      await api(`/api/admin/appointments/${a._id}/confirm`, { method: "PATCH", auth: true });
      toast.success("Appointment confirmed");
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not confirm the appointment"));
    } finally {
      setConfirmingId(null);
      refetch(); // always show the real state
    }
  }

  async function confirmCancel() {
    if (!toCancel) return;
    setCancelling(true);
    try {
      await api(`/api/admin/appointments/${toCancel._id}/cancel`, { method: "PATCH", auth: true });
      toast.success("Appointment cancelled");
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not cancel the appointment"));
    } finally {
      setCancelling(false);
      setToCancel(null);
      refetch();
    }
  }

  return (
    <>
      <PageHeader
        title="Manage Appointments"
        description="Review requests, confirm pending ones and cancel when needed."
      />

      <div className="mb-5 space-y-4 rounded-xl border border-border bg-surface p-4">
        <div className="grid gap-3 sm:grid-cols-[1fr_200px]">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search by customer or service"
              aria-label="Search by customer or service"
              className={cn(fieldClass, "h-11 pl-10")}
            />
          </div>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            aria-label="Filter by appointment date"
            className={cn(fieldClass, "h-11")}
          />
        </div>

        <div className="flex flex-wrap gap-x-8 gap-y-3">
          <Chips label="Status" options={STATUS_FILTERS} value={status} onChange={setStatus} />
          <Chips label="Payment" options={PAYMENT_FILTERS} value={payment} onChange={setPayment} />
        </div>

        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm font-medium text-primary hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl border border-border bg-primary-soft" />
          ))}
        </div>
      ) : error ? (
        <EmptyState
          title="Could not load appointments"
          description={error}
          action={<Button onClick={refetch}>Try again</Button>}
        />
      ) : items.length === 0 ? (
        <EmptyState
          title="No appointments found"
          description={hasFilters ? "Try different filters." : "New requests will appear here."}
          action={hasFilters ? <Button onClick={clearFilters}>Clear filters</Button> : undefined}
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-surface">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="border-b border-border bg-primary-soft/50 text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">Service</th>
                <th className="px-4 py-3 font-semibold">Date and time</th>
                <th className="px-4 py-3 font-semibold">Price</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Payment</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((a) => {
                const canConfirm = a.status === "pending";
                const canCancel =
                  (a.status === "pending" || a.status === "confirmed") &&
                  a.paymentStatus === "unpaid";
                return (
                  <tr key={a._id}>
                    <td className="px-4 py-3">
                      <p className="font-medium">{a.customer?.name ?? "Unknown"}</p>
                      <p className="text-xs text-muted">{a.customer?.email ?? "-"}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{a.service?.serviceName ?? "Service removed"}</p>
                      <p className="text-xs text-muted">{a.service?.category ?? "-"}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p>{formatDate(a.appointmentDate)}</p>
                      <p className="text-xs text-muted">{a.timeSlot}</p>
                    </td>
                    <td className="px-4 py-3 font-medium">{formatPrice(a.servicePrice)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={a.status} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={a.paymentStatus} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDetails(a)}
                          aria-label={`View details for ${a.customer?.name ?? "customer"}`}
                        >
                          <Eye className="h-4 w-4" aria-hidden="true" />
                          Details
                        </Button>
                        {canConfirm && (
                          <Button
                            size="sm"
                            loading={confirmingId === a._id}
                            onClick={() => confirm(a)}
                          >
                            {confirmingId !== a._id && (
                              <Check className="h-4 w-4" aria-hidden="true" />
                            )}
                            Confirm
                          </Button>
                        )}
                        {canCancel && (
                          <Button variant="danger" size="sm" onClick={() => setToCancel(a)}>
                            <X className="h-4 w-4" aria-hidden="true" />
                            Cancel
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <AdminAppointmentDetails appointment={details} onClose={() => setDetails(null)} />

      <ConfirmDialog
        open={!!toCancel}
        danger
        title="Cancel this appointment?"
        message={`${toCancel?.customer?.name ?? "The customer"}'s appointment for ${
          toCancel?.service?.serviceName ?? "this service"
        } on ${toCancel ? formatDate(toCancel.appointmentDate) : ""} at ${
          toCancel?.timeSlot ?? ""
        } will be cancelled and the time slot released.`}
        confirmText="Yes, cancel it"
        cancelText="Keep it"
        loading={cancelling}
        onConfirm={confirmCancel}
        onCancel={() => setToCancel(null)}
      />
    </>
  );
}