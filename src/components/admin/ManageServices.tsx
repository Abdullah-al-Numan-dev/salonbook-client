"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Pencil, Power, Search, Trash2 } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import Button, { buttonStyles } from "@/components/ui/Button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import EmptyState from "@/components/ui/EmptyState";
import StatusBadge from "@/components/ui/StatusBadge";
import { fieldClass } from "@/components/ui/FormField";
import { useDebounce } from "@/hooks/useDebounce";
import { useFetch } from "@/hooks/useFetch";
import { api, getErrorMessage } from "@/lib/api";
import { cn, formatDuration, formatPrice } from "@/lib/utils";
import type { Service } from "@/types";

const FILTERS = ["all", "active", "inactive"] as const;

export default function ManageServices() {
  const [searchText, setSearchText] = useState("");
  const [status, setStatus] = useState<(typeof FILTERS)[number]>("all");
  const search = useDebounce(searchText, 400);

  const { data, loading, error, refetch } = useFetch(
    () =>
      api<{ data: Service[] }>("/api/admin/services", {
        auth: true,
        query: { search: search.trim(), status: status === "all" ? "" : status },
      }),
    [search, status]
  );

  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<Service | null>(null);
  const [deleting, setDeleting] = useState(false);

  const services = data?.data ?? [];

  async function toggleStatus(s: Service) {
    const next = s.status === "active" ? "inactive" : "active";
    setTogglingId(s._id);
    try {
      await api(`/api/admin/services/${s._id}/status`, {
        method: "PATCH",
        auth: true,
        body: { status: next },
      });
      toast.success(next === "active" ? "Service activated" : "Service deactivated");
      refetch();
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not change the status"));
    } finally {
      setTogglingId(null);
    }
  }

  async function confirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await api(`/api/admin/services/${toDelete._id}`, { method: "DELETE", auth: true });
      toast.success("Service deleted");
      setToDelete(null);
      refetch();
    } catch (err) {
      // The server refuses when live appointments exist and explains why
      toast.error(getErrorMessage(err, "Could not delete the service"));
      setToDelete(null);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Manage Services"
        description="Add, edit, activate or remove the services customers can book."
        action={
          <Link href="/dashboard/admin/services/new" className={buttonStyles()}>
            Add Service
          </Link>
        }
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
            placeholder="Search services by name"
            aria-label="Search services by name"
            className={cn(fieldClass, "h-11 pl-10")}
          />
        </div>
        <div className="flex gap-2" role="group" aria-label="Filter by status">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={status === f}
              onClick={() => setStatus(f)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-medium capitalize transition-colors",
                status === f
                  ? "border-primary bg-primary text-slate-950"
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
          title="Could not load services"
          description={error}
          action={<Button onClick={refetch}>Try again</Button>}
        />
      ) : services.length === 0 ? (
        <EmptyState
          title="No services found"
          description="Try a different search, or add a new service."
          action={
            <Link href="/dashboard/admin/services/new" className={buttonStyles()}>
              Add Service
            </Link>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-surface">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-border bg-primary-soft/50 text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Service</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Price</th>
                <th className="px-4 py-3 font-semibold">Duration</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {services.map((s) => (
                <tr key={s._id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={s.image}
                        alt=""
                        className="h-11 w-14 rounded-md object-cover"
                      />
                      <span className="font-medium">{s.serviceName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted">{s.category}</td>
                  <td className="px-4 py-3 font-medium">{formatPrice(s.price)}</td>
                  <td className="px-4 py-3 text-muted">{formatDuration(s.duration)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={s.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        loading={togglingId === s._id}
                        onClick={() => toggleStatus(s)}
                        aria-label={`${s.status === "active" ? "Deactivate" : "Activate"} ${s.serviceName}`}
                      >
                        {togglingId !== s._id && <Power className="h-4 w-4" aria-hidden="true" />}
                        {s.status === "active" ? "Deactivate" : "Activate"}
                      </Button>
                      <Link
                        href={`/dashboard/admin/services/${s._id}/edit`}
                        className={buttonStyles({ variant: "outline", size: "sm" })}
                        aria-label={`Edit ${s.serviceName}`}
                      >
                        <Pencil className="h-4 w-4" aria-hidden="true" />
                        Edit
                      </Link>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => setToDelete(s)}
                        aria-label={`Delete ${s.serviceName}`}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={!!toDelete}
        danger
        title="Delete this service?"
        message={`"${toDelete?.serviceName ?? ""}" will be permanently removed. If you only want to hide it from customers, deactivate it instead.`}
        confirmText="Delete"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
}