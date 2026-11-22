"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import StatusBadge from "@/components/ui/StatusBadge";
import { useFetch } from "@/hooks/useFetch";
import { api } from "@/lib/api";
import { formatDateTime } from "@/lib/utils";
import type { AdminUserDetails } from "@/types";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border py-2.5 text-sm last:border-0">
      <dt className="shrink-0 text-muted">{label}</dt>
      <dd className="min-w-0 break-words text-right font-medium">{children}</dd>
    </div>
  );
}

export default function UserDetailsDialog({
  userId,
  onClose,
}: {
  userId: string;
  onClose: () => void;
}) {
  const { data, loading, error, refetch } = useFetch(
    () => api<{ data: AdminUserDetails }>(`/api/admin/users/${userId}`, { auth: true }),
    [userId]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const u = data?.data;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-details-title"
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-surface p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id="user-details-title" className="text-xl font-semibold">
            Customer details
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

        {loading ? (
          <div role="status" className="flex justify-center py-12">
            <Spinner className="h-8 w-8 text-primary" />
          </div>
        ) : error || !u ? (
          <div className="py-8 text-center">
            <p className="text-sm text-danger">{error || "Could not load this customer"}</p>
            <Button className="mt-4" onClick={refetch}>
              Try again
            </Button>
          </div>
        ) : (
          <>
            <div className="mt-5 flex items-center gap-3">
              <Avatar name={u.name} image={u.image} className="h-14 w-14 text-lg" />
              <div className="min-w-0">
                <p className="truncate text-lg font-semibold">{u.name}</p>
                <p className="truncate text-sm text-muted">{u.email}</p>
              </div>
            </div>

            <dl className="mt-4">
              <Row label="Account">
                <StatusBadge status={u.isBlocked ? "blocked" : "active"} />
              </Row>
              <Row label="Phone">{u.phone || "Not provided"}</Row>
              <Row label="Joined">{u.createdAt ? formatDateTime(u.createdAt) : "-"}</Row>
              <Row label="Total requests">{u.appointmentStats.total}</Row>
              <Row label="Pending">{u.appointmentStats.pending}</Row>
              <Row label="Confirmed">{u.appointmentStats.confirmed}</Row>
              <Row label="Cancelled">{u.appointmentStats.cancelled}</Row>
            </dl>
          </>
        )}
      </div>
    </div>
  );
}