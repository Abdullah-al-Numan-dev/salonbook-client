"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import StatusBadge from "@/components/ui/StatusBadge";
import PageHeader from "@/components/dashboard/PageHeader";
import { useAuthUser } from "@/hooks/useAuthUser";
import { authClient } from "@/lib/auth-client";
import { api, getErrorMessage, uploadImage, validateImageFile } from "@/lib/api";
import { validateImageUrl, validateName, validatePhone } from "@/lib/validation";
import { cn } from "@/lib/utils";

type Errors = { name?: string; phone?: string; image?: string };

export default function ProfileForm() {
  const { user } = useAuthUser();

  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [imageMode, setImageMode] = useState<"upload" | "url">("upload");
  const [imageUrl, setImageUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [stage, setStage] = useState<"" | "uploading" | "saving">("");

  const preview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  if (!user) return null; // the route guard guarantees a user, this only satisfies TypeScript

  const urlPreview = imageMode === "url" && imageUrl.trim() && !validateImageUrl(imageUrl)
    ? imageUrl.trim()
    : null;
  const shownImage = removeImage ? null : (preview ?? urlPreview ?? user.image ?? null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;

    const next: Errors = {
      name: validateName(name),
      phone: validatePhone(phone),
      image:
        imageMode === "upload"
          ? file
            ? validateImageFile(file)
            : ""
          : imageUrl.trim()
            ? validateImageUrl(imageUrl)
            : "",
    };
    setErrors(next);
    if (Object.values(next).some(Boolean)) {
      toast.error("Please fix the highlighted fields");
      return;
    }

    // Work out what actually changed
    const changes: { name?: string; phone?: string; image?: string } = {};
    if (name.trim() !== user.name) changes.name = name.trim();
    if (phone.trim() !== (user.phone ?? "")) changes.phone = phone.trim();

    const hasNewImage = (imageMode === "upload" && !!file) || (imageMode === "url" && !!imageUrl.trim());
    if (removeImage && !hasNewImage) changes.image = "";

    if (Object.keys(changes).length === 0 && !hasNewImage) {
      toast("Nothing to update", { icon: "ℹ️" });
      return;
    }

    setSubmitting(true);
    try {
      if (hasNewImage) {
        if (imageMode === "upload" && file) {
          setStage("uploading");
          try {
            changes.image = await uploadImage(file);
          } catch (err) {
            toast.error(getErrorMessage(err, "Image upload failed. Please try again"));
            setErrors((er) => ({ ...er, image: "Image upload failed. Choose the file again" }));
            return;
          }
        } else {
          changes.image = imageUrl.trim();
        }
      }

      setStage("saving");
      await api("/api/me", { method: "PUT", auth: true, body: changes });

      // Make the navbar and sidebar pick up the new data
      authClient.$store.notify("$sessionSignal");

      toast.success("Profile updated successfully");
      setFile(null);
      setImageUrl("");
      setRemoveImage(false);
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not update your profile"));
    } finally {
      setSubmitting(false);
      setStage("");
    }
  }

  const buttonLabel = submitting
    ? stage === "uploading"
      ? "Uploading image..."
      : "Saving..."
    : "Save Changes";

  return (
    <>
      <PageHeader title="My Profile" description="Update your name, photo and phone number." />

      <form
        onSubmit={handleSubmit}
        noValidate
        className="max-w-2xl space-y-6 rounded-xl border border-border bg-surface p-5 sm:p-6"
      >
        {/* Photo */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium">Profile image</span>
            <div className="inline-flex rounded-lg border border-border p-0.5 text-xs">
              {(["upload", "url"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => {
                    setImageMode(mode);
                    setErrors((er) => ({ ...er, image: undefined }));
                  }}
                  className={cn(
                    "rounded-md px-2.5 py-1 font-medium",
                    imageMode === mode ? "bg-primary text-white" : "text-muted hover:text-foreground"
                  )}
                >
                  {mode === "upload" ? "Upload" : "URL"}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Avatar name={name || user.name} image={shownImage} className="h-20 w-20 text-2xl" />
            <div className="min-w-0 flex-1">
              {imageMode === "upload" ? (
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  aria-label="Profile image file"
                  onChange={(e) => {
                    setFile(e.target.files?.[0] ?? null);
                    setRemoveImage(false);
                    setErrors((er) => ({ ...er, image: undefined }));
                  }}
                  className="w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-primary-soft file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary-dark hover:file:bg-primary/20"
                />
              ) : (
                <Input
                  aria-label="Profile image URL"
                  placeholder="https://example.com/photo.jpg"
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    setRemoveImage(false);
                  }}
                />
              )}
              <p className="mt-1.5 text-xs text-muted">JPG, PNG, WEBP or GIF, up to 5MB.</p>
              {user.image && !removeImage && (
                <button
                  type="button"
                  onClick={() => {
                    setRemoveImage(true);
                    setFile(null);
                    setImageUrl("");
                  }}
                  className="mt-1 text-sm font-medium text-danger hover:underline"
                >
                  Remove current photo
                </button>
              )}
              {errors.image && <p className="mt-1 text-sm text-danger">{errors.image}</p>}
            </div>
          </div>
        </div>

        <Input
          label="Full name"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
        />

        <Input
          label="Phone number (optional)"
          type="tel"
          autoComplete="tel"
          placeholder="+880 1700 000000"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          error={errors.phone}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="Email"
            value={user.email}
            disabled
            readOnly
            hint="Your email cannot be changed"
          />
          <div>
            <p className="mb-1.5 text-sm font-medium">Account role</p>
            <div className="flex h-[42px] items-center">
              <StatusBadge status={user.role} />
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-5">
          <Button type="submit" size="lg" loading={submitting}>
            {buttonLabel}
          </Button>
        </div>
      </form>
    </>
  );
}