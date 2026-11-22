import Link from "next/link";
import { Clock } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import { buttonStyles } from "@/components/ui/Button";
import { formatDuration, formatPrice } from "@/lib/utils";
import type { Service } from "@/types";

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden bg-primary-soft">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={service.image}
          alt={service.serviceName}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-accent">
          {service.category}
        </p>
        <h3 className="mt-1 text-xl font-semibold">{service.serviceName}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted">{service.description}</p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-semibold text-primary-dark">
            {formatPrice(service.price)}
          </span>
          <span className="inline-flex items-center gap-1 text-sm text-muted">
            <Clock className="h-4 w-4" aria-hidden="true" />
            {formatDuration(service.duration)}
          </span>
        </div>

        <Link
          href={`/services/${service._id}`}
          className={buttonStyles({ variant: "outline", className: "mt-5 w-full" })}
        >
          View Details
        </Link>
      </div>
    </article>
  );
}

export function ServiceCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="aspect-[4/3] animate-pulse bg-primary-soft" />
      <div className="space-y-3 p-5">
        <div className="h-3 w-24 animate-pulse rounded bg-primary-soft" />
        <div className="h-5 w-3/4 animate-pulse rounded bg-primary-soft" />
        <div className="h-4 w-full animate-pulse rounded bg-primary-soft" />
        <div className="h-10 w-full animate-pulse rounded-lg bg-primary-soft" />
      </div>
    </div>
  );
}