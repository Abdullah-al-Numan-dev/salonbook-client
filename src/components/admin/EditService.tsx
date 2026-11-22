"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import PageHeader from "@/components/dashboard/PageHeader";
import ServiceForm from "./ServiceForm";
import Button, { buttonStyles } from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import PageLoader from "@/components/ui/PageLoader";
import { useFetch } from "@/hooks/useFetch";
import { api } from "@/lib/api";
import type { Service } from "@/types";

export default function EditService() {
  const { id } = useParams<{ id: string }>();

  const { data, loading, error, refetch } = useFetch(
    () => api<{ data: Service[] }>("/api/admin/services", { auth: true }),
    [id]
  );

  if (loading) return <PageLoader label="Loading service..." />;

  if (error) {
    return (
      <EmptyState
        title="Could not load the service"
        description={error}
        action={<Button onClick={refetch}>Try again</Button>}
      />
    );
  }

  const service = data?.data.find((s) => s._id === id);

  if (!service) {
    return (
      <EmptyState
        title="Service not found"
        description="It may have been deleted."
        action={
          <Link href="/dashboard/admin/services" className={buttonStyles()}>
            Back to Manage Services
          </Link>
        }
      />
    );
  }

  return (
    <>
      <PageHeader title="Edit Service" description={`Update "${service.serviceName}".`} />
      <ServiceForm service={service} />
    </>
  );
}