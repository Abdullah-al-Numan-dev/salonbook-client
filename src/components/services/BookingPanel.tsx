"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarCheck, Clock, Info } from "lucide-react";
import Button, { buttonStyles } from "@/components/ui/Button";
import { useAuthUser } from "@/hooks/useAuthUser";
import { formatDuration, formatPrice } from "@/lib/utils";
import type { Service } from "@/types";

export default function BookingPanel({ service }: { service: Service }) {
  const { user } = useAuthUser();
  const [open, setOpen] = useState(false);

  const isAdmin = user?.role === "admin";
  const bookable = service.status === "active";

  return (
    <aside className="rounded-2xl border border-border bg-surface p-6 shadow-sm lg:sticky lg:top-24">
      <p className="text-sm text-muted">Price</p>
      <p className="text-3xl font-semibold text-primary-dark">{formatPrice(service.price)}</p>

      <p className="mt-4 inline-flex items-center gap-2 text-sm text-muted">
        <Clock className="h-4 w-4" aria-hidden="true" />
        Estimated duration: {formatDuration(service.duration)}
      </p>

      <div className="mt-6 border-t border-border pt-6">
        {!bookable ? (
          <p className="flex items-start gap-2 text-sm text-danger">
            <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            This service is currently unavailable for booking.
          </p>
        ) : isAdmin ? (
          <p className="flex items-start gap-2 rounded-lg bg-primary-soft p-3 text-sm text-primary-dark">
            <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            Admins cannot submit appointment requests. Manage appointments from the dashboard.
          </p>
        ) : !open ? (
          <Button size="lg" className="w-full" onClick={() => setOpen(true)}>
            <CalendarCheck className="h-5 w-5" aria-hidden="true" />
            Book Appointment
          </Button>
        ) : (
          <div id="booking-form-slot" className="text-sm text-muted">
            The appointment form is added in the next commit.
          </div>
        )}
      </div>

      {isAdmin && (
        <Link
          href="/dashboard/admin/services"
          className={buttonStyles({ variant: "outline", className: "mt-4 w-full" })}
        >
          Manage Services
        </Link>
      )}
    </aside>
  );
}