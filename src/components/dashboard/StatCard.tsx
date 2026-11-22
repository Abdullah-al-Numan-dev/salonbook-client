import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function StatCard({
  label,
  value,
  icon: Icon,
  loading = false,
  tone = "primary",
}: {
  label: string;
  value: number | string;
  icon: LucideIcon;
  loading?: boolean;
  tone?: "primary" | "success" | "warning" | "danger";
}) {
  const tones = {
    primary: "bg-primary-soft text-primary",
    success: "bg-green-50 text-success",
    warning: "bg-amber-50 text-warning",
    danger: "bg-red-50 text-danger",
  };

  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-surface p-5">
      <span className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-full", tones[tone])}>
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-sm text-muted">{label}</p>
        {loading ? (
          <div className="mt-1 h-7 w-12 animate-pulse rounded bg-primary-soft" />
        ) : (
          <p className="text-2xl font-semibold">{value}</p>
        )}
      </div>
    </div>
  );
}