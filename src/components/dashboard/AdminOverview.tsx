"use client";

import Link from "next/link";
import {
  CalendarCheck,
  CalendarClock,
  ClipboardList,
  CreditCard,
  Scissors,
  Users,
  Wallet,
} from "lucide-react";
import PageHeader from "./PageHeader";
import StatCard from "./StatCard";
import EmptyState from "@/components/ui/EmptyState";
import Button, { buttonStyles } from "@/components/ui/Button";
import { useFetch } from "@/hooks/useFetch";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import type { AdminStats } from "@/types";

export default function AdminOverview() {
  const { data, loading, error, refetch } = useFetch(() =>
    api<{ data: AdminStats }>("/api/dashboard/admin", { auth: true })
  );
  const s = data?.data;

  const revenueText =
    s && s.revenue.length > 0
      ? s.revenue.map((r) => formatPrice(r.total, r.currency)).join(" + ")
      : formatPrice(0);

  return (
    <>
      <PageHeader
        title="Admin Overview"
        description="A snapshot of your salon's customers, services, appointments and payments."
        action={
          <Link href="/dashboard/admin/services/new" className={buttonStyles()}>
            Add Service
          </Link>
        }
      />

      {error ? (
        <EmptyState
          title="Could not load the dashboard"
          description={error}
          action={<Button onClick={refetch}>Try again</Button>}
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <StatCard label="Registered Customers" value={s?.totalCustomers ?? 0} icon={Users} loading={loading} />
            <StatCard label="Active Services" value={s?.totalActiveServices ?? 0} icon={Scissors} loading={loading} />
            <StatCard label="Total Appointment Requests" value={s?.totalAppointments ?? 0} icon={ClipboardList} loading={loading} />
            <StatCard label="Pending Appointments" value={s?.pendingAppointments ?? 0} icon={CalendarClock} tone="warning" loading={loading} />
            <StatCard label="Confirmed Appointments" value={s?.confirmedAppointments ?? 0} icon={CalendarCheck} tone="success" loading={loading} />
            <StatCard label="Successful Payments" value={s?.totalSuccessfulPayments ?? 0} icon={CreditCard} tone="success" loading={loading} />
          </div>

          <div className="mt-4">
            <StatCard label="Total Revenue" value={revenueText} icon={Wallet} tone="success" loading={loading} />
          </div>
        </>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { href: "/dashboard/admin/appointments", label: "Review appointment requests" },
          { href: "/dashboard/admin/services", label: "Manage services" },
          { href: "/dashboard/admin/users", label: "Manage customers" },
          { href: "/dashboard/admin/transactions", label: "View transactions" },
        ].map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="rounded-xl border border-border bg-surface p-5 text-sm font-medium transition-colors hover:border-primary hover:text-primary"
          >
            {l.label} →
          </Link>
        ))}
      </div>
    </>
  );
}