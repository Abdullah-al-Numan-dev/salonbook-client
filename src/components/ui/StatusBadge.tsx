import { cn } from "@/lib/utils";

const styles: Record<string, string> = {
  pending: "bg-warning/10 text-warning ring-warning/30",
  confirmed: "bg-success/10 text-success ring-success/30",
  cancelled: "bg-danger/10 text-danger ring-danger/30",
  unpaid: "bg-orange-400/10 text-orange-300 ring-orange-400/30",
  paid: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/30",
  failed: "bg-danger/10 text-danger ring-danger/30",
  active: "bg-success/10 text-success ring-success/30",
  inactive: "bg-slate-500/10 text-slate-300 ring-slate-500/30",
  blocked: "bg-danger/10 text-danger ring-danger/30",
  customer: "bg-primary-soft text-primary ring-primary/30",
  admin: "bg-accent/10 text-accent ring-accent/30",
};

export default function StatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ring-1 ring-inset",
        styles[status] ?? "bg-slate-500/10 text-slate-300 ring-slate-500/30",
        className
      )}
    >
      {status}
    </span>
  );
}