"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Container from "@/components/ui/Container";
import EmptyState from "@/components/ui/EmptyState";
import PageLoader from "@/components/ui/PageLoader";
import Button, { buttonStyles } from "@/components/ui/Button";
import BookingPanel from "./BookingPanel";
import { useFetch } from "@/hooks/useFetch";
import { api } from "@/lib/api";
import type { Service } from "@/types";

export default function ServiceDetails() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const { data, loading, error, refetch } = useFetch(
    () => api<{ data: Service }>(`/api/services/${id}`),
    [id]
  );

  if (loading) return <PageLoader label="Loading service details..." />;

  if (error || !data) {
    return (
      <Container className="py-16">
        <EmptyState
          title="Service not available"
          description={error || "We could not find this service."}
          action={
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/services" className={buttonStyles()}>
                Browse Services
              </Link>
              <Button variant="outline" onClick={refetch}>
                Try again
              </Button>
            </div>
          }
        />
      </Container>
    );
  }

  const service = data.data;

  return (
    <Container className="py-10 sm:py-14">
      <Link
        href="/services"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to services
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div>
          <div className="overflow-hidden rounded-2xl border border-border bg-primary-soft">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={service.image}
              alt={service.serviceName}
              className="aspect-[16/10] w-full object-cover"
            />
          </div>

          <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-accent">
            {service.category}
          </p>
          <h1 className="mt-1 text-3xl font-semibold sm:text-4xl">{service.serviceName}</h1>

          <h2 className="mt-8 text-xl font-semibold">About this service</h2>
          <p className="mt-2 whitespace-pre-line leading-relaxed text-muted">
            {service.description}
          </p>
        </div>

        <BookingPanel service={service} />
      </div>
    </Container>
  );
}