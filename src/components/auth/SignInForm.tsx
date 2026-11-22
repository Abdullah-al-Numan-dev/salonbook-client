"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import AuthShell from "./AuthShell";
import GoogleButton from "./GoogleButton";
import PasswordInput from "./PasswordInput";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import PageLoader from "@/components/ui/PageLoader";
import { authClient } from "@/lib/auth-client";
import { clearTokenCache } from "@/lib/api";
import { getRoleHome, safeRedirect } from "@/lib/roles";
import { validateEmail } from "@/lib/validation";
import { useAuthUser } from "@/hooks/useAuthUser";

type Errors = { email?: string; password?: string };

export default function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = safeRedirect(searchParams.get("redirect"));
  const { user } = useAuthUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  // Already signed in? Send them on
  useEffect(() => {
    if (user && !submitting && !user.isBlocked) {
      router.replace(redirectTo ?? getRoleHome(user.role));
    }
  }, [user, submitting, redirectTo, router]);

  if (user && !submitting && !user.isBlocked) return <PageLoader label="Redirecting..." />;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const next: Errors = {
      email: validateEmail(email),
      password: password ? "" : "Enter your password",
    };
    setErrors(next);
    if (Object.values(next).some(Boolean)) {
      toast.error("Please fix the highlighted fields");
      return;
    }

    setSubmitting(true);
    try {
      const { data, error } = await authClient.signIn.email({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error || !data) {
        toast.error(error?.message || "Invalid email or password");
        setSubmitting(false);
        return;
      }

      // Blocked users never get into the platform
      if (data.user.isBlocked) {
        await authClient.signOut();
        clearTokenCache();
        toast.error("Your account has been blocked. Please contact support");
        setSubmitting(false);
        return;
      }

      clearTokenCache();
      toast.success("Signed in successfully");
      const role = data.user.role === "admin" ? "admin" : "customer";
      router.replace(redirectTo ?? getRoleHome(role));
    } catch {
      toast.error("Something went wrong. Please try again");
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to manage your appointments"
      footer={
        <>
          New to SalonBook?{" "}
          <Link href="/signup" className="font-medium text-primary hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <GoogleButton label="Continue with Google" />

      <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-wider text-muted">
        <span className="h-px flex-1 bg-border" />
        or
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
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
          autoComplete="current-password"
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />
        <Button type="submit" className="w-full" size="lg" loading={submitting}>
          {submitting ? "Signing in..." : "Sign In"}
        </Button>
      </form>
    </AuthShell>
  );
}