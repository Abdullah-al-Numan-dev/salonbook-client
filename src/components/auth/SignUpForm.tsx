"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import AuthShell from "./AuthShell";
import GoogleButton from "./GoogleButton";
import PasswordInput from "./PasswordInput";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import PageLoader from "@/components/ui/PageLoader";
import { authClient } from "@/lib/auth-client";
import { clearTokenCache, uploadImage, validateImageFile } from "@/lib/api";
import { getRoleHome } from "@/lib/roles";
import {
  validateEmail,
  validateImageUrl,
  validateName,
  validatePassword,
} from "@/lib/validation";
import { useAuthUser } from "@/hooks/useAuthUser";
import { cn } from "@/lib/utils";

type Errors = { name?: string; email?: string; password?: string; image?: string };

export default function SignUpForm() {
  const router = useRouter();
  const { user } = useAuthUser();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imageMode, setImageMode] = useState<"upload" | "url">("upload");
  const [imageUrl, setImageUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  const preview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // Already signed in? Send them to their dashboard
  useEffect(() => {
    if (user && !submitting) router.replace(getRoleHome(user.role));
  }, [user, submitting, router]);

  if (user && !submitting) return <PageLoader label="Redirecting..." />;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const next: Errors = {
      name: validateName(name),
      email: validateEmail(email),
      password: validatePassword(password),
      image:
        imageMode === "url"
          ? imageUrl.trim()
            ? validateImageUrl(imageUrl)
            : ""
          : file
            ? validateImageFile(file)
            : "",
    };
    setErrors(next);
    if (Object.values(next).some(Boolean)) {
      toast.error("Please fix the highlighted fields");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        image: imageMode === "url" && imageUrl.trim() ? imageUrl.trim() : undefined,
      });

      if (error) {
        toast.error(error.message || "Could not create your account");
        setSubmitting(false);
        return;
      }

      clearTokenCache();

      if (imageMode === "upload" && file) {
        try {
          const url = await uploadImage(file);
          const res = await authClient.updateUser({ image: url });
          if (res.error) throw new Error(res.error.message);
        } catch {
          toast.error("Account created, but the image upload failed. Add it later from your profile");
        }
      }

      toast.success("Account created successfully. Welcome to SalonBook!");
      router.replace(getRoleHome("customer")); // public sign up always creates a customer
    } catch {
      toast.error("Something went wrong. Please try again");
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join SalonBook to book your next salon visit"
      footer={
        <>
          Already have an account?{" "}
          <Link href="/signin" className="font-medium text-primary hover:underline">
            Sign In
          </Link>
        </>
      }
    >
      <GoogleButton label="Sign up with Google" />

      <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-wider text-muted">
        <span className="h-px flex-1 bg-border" />
        or
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Input
          label="Full name"
          autoComplete="name"
          placeholder="Jane Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
        />
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />
        <PasswordInput
          label="Password"
          autoComplete="new-password"
          placeholder="At least 6 characters"
          hint="Use 6 or more characters with one uppercase and one lowercase letter"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-sm font-medium">Profile image (optional)</span>
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
                    imageMode === mode ? "bg-primary text-slate-950" : "text-muted hover:text-foreground"
                  )}
                >
                  {mode === "upload" ? "Upload" : "URL"}
                </button>
              ))}
            </div>
          </div>

          {imageMode === "upload" ? (
            <div className="flex items-center gap-3">
              {preview && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="Profile preview" className="h-12 w-12 rounded-full object-cover" />
              )}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                aria-label="Profile image"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-primary-soft file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary-dark hover:file:bg-primary/20"
              />
            </div>
          ) : (
            <Input
              aria-label="Profile image URL"
              placeholder="https://example.com/photo.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          )}
          {errors.image && <p className="mt-1 text-sm text-danger">{errors.image}</p>}
        </div>

        <Button type="submit" className="w-full" size="lg" loading={submitting}>
          {submitting ? "Creating account..." : "Create Account"}
        </Button>
      </form>
    </AuthShell>
  );
}