import Link from "next/link";
import type { ReactNode } from "react";
import Container from "./Container";
import { buttonStyles } from "./Button";

export default function ErrorView({
  code,
  title,
  description,
  actions,
}: {
  code?: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      {code && (
        <p className="font-heading text-7xl font-semibold text-primary sm:text-8xl">{code}</p>
      )}
      <h1 className="mt-4 text-3xl font-semibold">{title}</h1>
      <p className="mt-2 max-w-md text-muted">{description}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {actions ?? (
          <>
            <Link href="/" className={buttonStyles()}>
              Back to Home
            </Link>
            <Link href="/services" className={buttonStyles({ variant: "outline" })}>
              Browse Services
            </Link>
          </>
        )}
      </div>
    </Container>
  );
}