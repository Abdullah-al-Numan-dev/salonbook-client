"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import StatusBadge from "@/components/ui/StatusBadge";
import EmptyState from "@/components/ui/EmptyState";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import PageLoader from "@/components/ui/PageLoader";

export default function PreviewPage() {
  const [open, setOpen] = useState(false);

  return (
    <Container className="space-y-10 py-12">
      <SectionHeading
        eyebrow="Preview"
        title="SalonBook UI Kit"
        subtitle="Temporary page to check the theme and components."
      />

      <div className="flex flex-wrap gap-3">
        <Button>Primary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Danger</Button>
        <Button loading>Saving</Button>
        <Button onClick={() => toast.success("Saved successfully")}>Success toast</Button>
        <Button variant="outline" onClick={() => toast.error("Something went wrong")}>
          Error toast
        </Button>
        <Button variant="danger" onClick={() => setOpen(true)}>
          Open dialog
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {["pending", "confirmed", "cancelled", "unpaid", "paid", "active", "inactive"].map((s) => (
          <StatusBadge key={s} status={s} />
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Full name" placeholder="Jane Doe" />
        <Input label="Email" type="email" error="Enter a valid email" defaultValue="oops" />
        <Select label="Category" defaultValue="">
          <option value="" disabled>
            Choose a category
          </option>
          <option>Makeup</option>
          <option>Hair Coloring</option>
        </Select>
        <Textarea label="Message" hint="Optional" rows={3} />
      </div>

      <EmptyState title="No appointments yet" description="Your requests will show up here." />
      <PageLoader />

      <ConfirmDialog
        open={open}
        danger
        title="Delete service?"
        message="This action cannot be undone."
        confirmText="Delete"
        onConfirm={() => {
          setOpen(false);
          toast.success("Deleted");
        }}
        onCancel={() => setOpen(false)}
      />
    </Container>
  );
}