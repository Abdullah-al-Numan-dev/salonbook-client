"use client";

import { useEffect } from "react";
import Link from "next/link";
import ErrorView from "@/components/ui/ErrorView";
import Button, { buttonStyles } from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorView
      title="Something went wrong"
      description="An unexpected error happened. Please try again, or go back to the home page."
      actions={
        <>
          <Button onClick={reset}>Try again</Button>
          <Link href="/" className={buttonStyles({ variant: "outline" })}>
            Back to Home
          </Link>
        </>
      }
    />
  );
}