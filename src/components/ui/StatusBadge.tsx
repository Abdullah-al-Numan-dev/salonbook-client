import { cn } from "@/lib/utils";

const styles: Record<string, string> = {
  pending: "bg-amber-50 text-amber-800 ring-amber-200",
  confirmed: "bg-green-50 text-green-800 ring-green-200",
  cancelled: "bg-red-50 text-red-800 ring-red-200",
  unpaid: "bg-orange-50 text-orange-800 ring-orange-200",
  paid: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  failed: "bg-red-50 text-red-800 ring-red-200",
  active: "bg-green-50 text-green-800 ring-green-200",
  inactive: "bg-stone-100 text-stone-700 ring-stone-300",
  blocked: "bg-red-50 text-red-800 ring-red-200",
  customer: "bg-primary-soft text-primary-dark ring-primary/20",
  admin: "bg-violet-50 text-violet-800 ring-violet-200",
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
        styles[status] ?? "bg-stone-100 text-stone-700 ring-stone-300",
        className
      )}
    >
      {status}
    </span>
  );
}