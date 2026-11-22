"use client";

import Link from "next/link";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import EmptyState from "@/components/ui/EmptyState";
import Button, { buttonStyles } from "@/components/ui/Button";
import ServiceCard, { ServiceCardSkeleton } from "@/components/services/ServiceCard";
import { useFetch } from "@/hooks/useFetch";
import { api } from "@/lib/api";
import type { Pagination, Service } from "@/types";

export default function FeaturedServices() {
  const { data, loading, error, refetch } = useFetch(() =>
    api<{ data: Service[]; pagination: Pagination }>("/api/services", {
      query: { limit: 8, sort: "newest" },
    })
  );

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="Our Services"
          title="Featured Salon Services"
          subtitle="Hand-picked treatments loved by our customers."
        />

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ServiceCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <EmptyState
            title="Could not load services"
            description={error}
            action={<Button onClick={refetch}>Try again</Button>}
          />
        ) : data && data.data.length > 0 ? (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {data.data.map((s) => (
                <ServiceCard key={s._id} service={s} />
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link href="/services" className={buttonStyles({ variant: "outline", size: "lg" })}>
                View All Services
              </Link>
            </div>
          </>
        ) : (
          <EmptyState title="No services available" description="Please check back soon." />
        )}
      </Container>
    </section>
  );
}