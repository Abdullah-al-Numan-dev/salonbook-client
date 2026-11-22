import PageHeader from "@/components/dashboard/PageHeader";
import ServiceForm from "@/components/admin/ServiceForm";

export default function AddServicePage() {
  return (
    <>
      <PageHeader
        title="Add Service"
        description="Create a new service customers can book."
      />
      <ServiceForm />
    </>
  );
}