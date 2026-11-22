"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ImagePlus } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import { api, getErrorMessage, uploadImage, validateImageFile } from "@/lib/api";
import { CATEGORIES } from "@/lib/constants";
import type { Service } from "@/types";

type Errors = {
  serviceName?: string;
  category?: string;
  description?: string;
  price?: string;
  duration?: string;
  image?: string;
};

export default function ServiceForm({ service }: { service?: Service }) {
  const router = useRouter();
  const isEdit = !!service;

  const [serviceName, setServiceName] = useState(service?.serviceName ?? "");
  const [category, setCategory] = useState<string>(service?.category ?? "");
  const [description, setDescription] = useState(service?.description ?? "");
  const [price, setPrice] = useState(service ? String(service.price) : "");
  const [duration, setDuration] = useState(service ? String(service.duration) : "");
  const [status, setStatus] = useState<"active" | "inactive">(service?.status ?? "active");
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [stage, setStage] = useState<"" | "uploading" | "saving">("");

  const preview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const shownImage = preview ?? service?.image ?? null;

  function validate(): Errors {
    const e: Errors = {};
    if (serviceName.trim().length < 2) e.serviceName = "Service name must be at least 2 characters";
    if (!CATEGORIES.includes(category as (typeof CATEGORIES)[number])) {
      e.category = "Choose a category";
    }
    if (description.trim().length < 10) e.description = "Description must be at least 10 characters";

    const p = Number(price);
    if (!price.trim() || !Number.isFinite(p) || p <= 0) e.price = "Price must be a positive number";

    const d = Number(duration);
    if (!duration.trim() || !Number.isInteger(d) || d <= 0) {
      e.duration = "Duration must be a positive whole number of minutes";
    }

    if (file) {
      const problem = validateImageFile(file);
      if (problem) e.image = problem;
    } else if (!isEdit) {
      e.image = "Upload a service image";
    }
    return e;
  }

  async function handleSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();

    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) {
      toast.error("Please fix the highlighted fields");
      return;
    }

    setSubmitting(true);
    try {
      let imageUrl = service?.image ?? "";

      if (file) {
        setStage("uploading");
        try {
          imageUrl = await uploadImage(file);
        } catch (err) {
          toast.error(getErrorMessage(err, "Image upload failed. Please try again"));
          setErrors((er) => ({ ...er, image: "Image upload failed. Choose the file again" }));
          return;
        }
      }

      setStage("saving");
      const body = {
        serviceName: serviceName.trim(),
        category,
        description: description.trim(),
        price: Number(price),
        duration: Number(duration),
        image: imageUrl,
        status,
      };

      if (isEdit) {
        await api(`/api/admin/services/${service._id}`, { method: "PUT", auth: true, body });
        toast.success("Service updated successfully");
      } else {
        await api("/api/admin/services", { method: "POST", auth: true, body });
        toast.success("Service created successfully");
      }
      router.push("/dashboard/admin/services");
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not save the service"));
    } finally {
      setSubmitting(false);
      setStage("");
    }
  }

  const buttonLabel = submitting
    ? stage === "uploading"
      ? "Uploading image..."
      : "Saving..."
    : isEdit
      ? "Save Changes"
      : "Create Service";

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="max-w-3xl space-y-5 rounded-xl border border-border bg-surface p-5 sm:p-6"
    >
      <Input
        label="Service name"
        placeholder="e.g. Classic Facial"
        value={serviceName}
        onChange={(e) => setServiceName(e.target.value)}
        error={errors.serviceName}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Select
          label="Service category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          error={errors.category}
        >
          <option value="" disabled>
            Choose a category
          </option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>

        <Select
          label="Service status"
          value={status}
          onChange={(e) => setStatus(e.target.value as "active" | "inactive")}
          hint="Only active services appear publicly and can be booked"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </Select>
      </div>

      <Textarea
        label="Description"
        rows={5}
        placeholder="Describe what the service includes"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        error={errors.description}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Price (USD)"
          type="number"
          inputMode="decimal"
          min="0"
          step="0.01"
          placeholder="e.g. 60"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          error={errors.price}
        />
        <Input
          label="Estimated duration (minutes)"
          type="number"
          inputMode="numeric"
          min="0"
          step="1"
          placeholder="e.g. 60"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          error={errors.duration}
        />
      </div>

      <div>
        <label htmlFor="service-image" className="mb-1.5 block text-sm font-medium">
          Service image {isEdit ? "(leave empty to keep the current one)" : ""}
        </label>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-lg border border-dashed border-border bg-primary-soft/50 sm:w-48">
            {shownImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={shownImage} alt="Service preview" className="h-full w-full object-cover" />
            ) : (
              <ImagePlus className="h-8 w-8 text-muted" aria-hidden="true" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <input
              id="service-image"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={(e) => {
                setFile(e.target.files?.[0] ?? null);
                setErrors((er) => ({ ...er, image: undefined }));
              }}
              aria-invalid={!!errors.image}
              className="w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-primary-soft file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary-dark hover:file:bg-primary/20"
            />
            <p className="mt-1.5 text-xs text-muted">JPG, PNG, WEBP or GIF, up to 5MB.</p>
            {errors.image && <p className="mt-1 text-sm text-danger">{errors.image}</p>}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 border-t border-border pt-5">
        <Button type="submit" size="lg" loading={submitting}>
          {buttonLabel}
        </Button>
        <Button
          variant="ghost"
          size="lg"
          disabled={submitting}
          onClick={() => router.push("/dashboard/admin/services")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}