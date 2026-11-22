"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Eye, Search, ShieldBan, ShieldCheck } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import UserDetailsDialog from "./UserDetailsDialog";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import EmptyState from "@/components/ui/EmptyState";
import StatusBadge from "@/components/ui/StatusBadge";
import { fieldClass } from "@/components/ui/FormField";
import { useDebounce } from "@/hooks/useDebounce";
import { useFetch } from "@/hooks/useFetch";
import { api, getErrorMessage } from "@/lib/api";
import { cn, formatDateTime } from "@/lib/utils";
import type { AdminUser } from "@/types";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "false", label: "Active" },
  { value: "true", label: "Blocked" },
] as const;

export default function ManageUsers() {
  const [searchText, setSearchText] = useState("");
  const [blocked, setBlocked] = useState<(typeof FILTERS)[number]["value"]>("all");
  const search = useDebounce(searchText, 400);

  const { data, loading, error, refetch } = useFetch(
    () =>
      api<{ data: AdminUser[] }>("/api/admin/users", {
        auth: true,
        query: { search: search.trim(), blocked: blocked === "all" ? "" : blocked },
      }),
    [search, blocked]
  );

  const [detailsId, setDetailsId] = useState<string | null>(null);
  const [target, setTarget] = useState<AdminUser | null>(null);
  const [working, setWorking] = useState(false);

  const users = data?.data ?? [];
  const blocking = target ? !target.isBlocked : true;

  async function confirmAction() {
    if (!target) return;
    setWorking(true);
    try {
      await api(`/api/admin/users/${target._id}/${target.isBlocked ? "unblock" : "block"}`, {
        method: "PATCH",
        auth: true,
      });
      toast.success(target.isBlocked ? "User unblocked" : "User blocked");
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not update the user"));
    } finally {
      setWorking(false);
      setTarget(null);
      refetch();
    }
  }

  return (
    <>
      <PageHeader
        title="Manage Users"
        description="View registered customers and block or unblock access."
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
            placeholder="Search by name or email"
            aria-label="Search by name or email"
            className={cn(fieldClass, "h-11 pl-10")}
          />
        </div>
        <div className="flex gap-2" role="group" aria-label="Filter by account status">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              aria-pressed={blocked === f.value}
              onClick={() => setBlocked(f.value)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                blocked === f.value
                  ? "border-primary bg-primary text-white"
                  : "border-border bg-surface hover:border-primary hover:text-primary"
              )}
            >
              {f.label}
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
          title="Could not load users"
          description={error}
          action={<Button onClick={refetch}>Try again</Button>}
        />
      ) : users.length === 0 ? (
        <EmptyState
          title="No customers found"
          description="Try a different search or filter."
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-surface">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-border bg-primary-soft/50 text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">Phone</th>
                <th className="px-4 py-3 font-semibold">Joined</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((u) => (
                <tr key={u._id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={u.name} image={u.image} />
                      <div className="min-w-0">
                        <p className="truncate font-medium">{u.name}</p>
                        <p className="truncate text-xs text-muted">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted">{u.phone || "-"}</td>
                  <td className="px-4 py-3 text-muted">
                    {u.createdAt ? formatDateTime(u.createdAt) : "-"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={u.isBlocked ? "blocked" : "active"} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDetailsId(u._id)}
                        aria-label={`View details for ${u.name}`}
                      >
                        <Eye className="h-4 w-4" aria-hidden="true" />
                        Details
                      </Button>
                      {u.isBlocked ? (
                        <Button size="sm" onClick={() => setTarget(u)}>
                          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                          Unblock
                        </Button>
                      ) : (
                        <Button variant="danger" size="sm" onClick={() => setTarget(u)}>
                          <ShieldBan className="h-4 w-4" aria-hidden="true" />
                          Block
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {detailsId && <UserDetailsDialog userId={detailsId} onClose={() => setDetailsId(null)} />}

      <ConfirmDialog
        open={!!target}
        danger={blocking}
        title={blocking ? "Block this customer?" : "Unblock this customer?"}
        message={
          blocking
            ? `${target?.name ?? "This customer"} will lose access to the platform immediately and cannot sign in until you unblock them.`
            : `${target?.name ?? "This customer"} will be able to sign in and use SalonBook again.`
        }
        confirmText={blocking ? "Block" : "Unblock"}
        loading={working}
        onConfirm={confirmAction}
        onCancel={() => setTarget(null)}
      />
    </>
  );
}