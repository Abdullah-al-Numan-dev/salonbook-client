"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import StatusBadge from "@/components/ui/StatusBadge";
import { fieldClass } from "@/components/ui/FormField";
import { useDebounce } from "@/hooks/useDebounce";
import { useFetch } from "@/hooks/useFetch";
import { api } from "@/lib/api";
import { cn, formatDate, formatDateTime, formatPrice } from "@/lib/utils";
import type { Transaction } from "@/types";

const FILTERS = ["all", "paid", "failed"] as const;

export default function Transactions() {
  const [searchText, setSearchText] = useState("");
  const [status, setStatus] = useState<(typeof FILTERS)[number]>("all");
  const search = useDebounce(searchText, 400);

  const { data, loading, error, refetch } = useFetch(
    () =>
      api<{ data: Transaction[] }>("/api/admin/transactions", {
        auth: true,
        query: { search: search.trim(), status: status === "all" ? "" : status },
      }),
    [search, status]
  );

  const items = data?.data ?? [];

  return (
    <>
      <PageHeader
        title="Transactions"
        description="Payments recorded from verified Stripe events. This list is read-only."
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-[1fr_auto]">
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
        <div className="flex gap-2" role="group" aria-label="Filter by payment status">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={status === f}
              onClick={() => setStatus(f)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-medium capitalize transition-colors",
                status === f
                  ? "border-primary bg-primary text-white"
                  : "border-border bg-surface hover:border-primary hover:text-primary"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl border border-border bg-primary-soft" />
          ))}
        </div>
      ) : error ? (
        <EmptyState
          title="Could not load transactions"
          description={error}
          action={<Button onClick={refetch}>Try again</Button>}
        />
      ) : items.length === 0 ? (
        <EmptyState
          title="No transactions yet"
          description="Payments appear here after a customer pays and Stripe confirms it."
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-surface">
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead className="border-b border-border bg-primary-soft/50 text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">Service</th>
                <th className="px-4 py-3 font-semibold">Appointment date</th>
                <th className="px-4 py-3 font-semibold">Amount</th>
                <th className="px-4 py-3 font-semibold">Currency</th>
                <th className="px-4 py-3 font-semibold">Stripe session</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Transaction date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((t) => (
                <tr key={t._id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar
                        name={t.customer?.name}
                        image={t.customer?.image}
                        className="h-9 w-9 text-sm"
                      />
                      <div className="min-w-0">
                        <p className="truncate font-medium">{t.customer?.name ?? "Unknown"}</p>
                        <p className="truncate text-xs text-muted">{t.customer?.email ?? "-"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{t.serviceName ?? "Service removed"}</td>
                  <td className="px-4 py-3">
                    {t.appointmentDate ? (
                      <>
                        <p>{formatDate(t.appointmentDate)}</p>
                        <p className="text-xs text-muted">{t.timeSlot}</p>
                      </>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium">{formatPrice(t.amount, t.currency)}</td>
                  <td className="px-4 py-3 uppercase text-muted">{t.currency}</td>
                  <td
                    className="px-4 py-3 font-mono text-xs text-muted"
                    title={t.stripeSessionId}
                  >
                    …{t.stripeSessionId.slice(-10)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={t.status} />
                  </td>
                  <td className="px-4 py-3 text-muted">{formatDateTime(t.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}