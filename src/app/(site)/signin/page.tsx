import { Suspense } from "react";
import type { Metadata } from "next";
import SignInForm from "@/components/auth/SignInForm";
import PageLoader from "@/components/ui/PageLoader";

export const metadata: Metadata = { title: "Sign In" };

export default function SignInPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <SignInForm />
    </Suspense>
  );
}