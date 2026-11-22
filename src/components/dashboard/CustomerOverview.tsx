"use client";

import Link from "next/link";
import { CalendarCheck, CalendarClock, CalendarX2, ClipboardList } from "lucide-react";
import PageHeader from "./PageHeader";
import StatCard from "./StatCard";
import EmptyState from "@/components/ui/EmptyState";
import Button, { buttonStyles } from "@/components/ui/Button";
import { useAuthUser } from "@/hooks/useAuthUser";
import { useFetch } from "@/hooks/useFetch";
import { api } from "@/lib/api";
import type { CustomerStats } from "@/types";

export default function CustomerOverview() {
  const { user } = useAuthUser();
  const { data, loading, error, refetch } = useFetch(() =>
    api<{ data: CustomerStats }>("/api/dashboard/customer", { auth: true })
  );
  const stats = data?.data;

  return (
    <>
      <PageHeader
        title={`Welcome${user ? `, ${user.name.split(" ")[0]}` : ""}`}
        description="Here is a summary of your appointment requests."
        action={
          <Link href="/services" className={buttonStyles()}>
            Book a Service
          </Link>
        }
      />

      {error ? (
        <EmptyState
          title="Could not load your dashboard"
          description={error}
          action={<Button onClick={refetch}>Try again</Button>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Requests" value={stats?.totalAppointments ?? 0} icon={ClipboardList} loading={loading} />
          <StatCard label="Pending" value={stats?.pendingAppointments ?? 0} icon={CalendarClock} tone="warning" loading={loading} />
          <StatCard label="Confirmed" value={stats?.confirmedAppointments ?? 0} icon={CalendarCheck} tone="success" loading={loading} />
          <StatCard label="Cancelled" value={stats?.cancelledAppointments ?? 0} icon={CalendarX2} tone="danger" loading={loading} />
        </div>
      )}

      <div className="mt-8 rounded-xl border border-border bg-surface p-6">
        <h2 className="text-xl font-semibold">What happens next?</h2>
        <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-muted">
          <li>Send an appointment request for any service.</li>
          <li>The salon reviews it and confirms your time slot.</li>
          <li>Once confirmed, pay securely from My Appointments.</li>
        </ol>
        <Link
          href="/dashboard/customer/appointments"
          className={buttonStyles({ variant: "outline", className: "mt-5" })}
        >
          Go to My Appointments
        </Link>
      </div>
    </>
  );
}