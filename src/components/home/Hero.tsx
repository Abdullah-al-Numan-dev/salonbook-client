import Link from "next/link";
import Container from "@/components/ui/Container";
import { buttonStyles } from "@/components/ui/Button";

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden border-b border-border bg-background">
      {/* Salon photography, heavily darkened so it reads as a texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-25"
        style={{ backgroundImage: "url('/images/hero.jpg')" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#050a12] via-[#050a12]/90 to-[#050a12]/30"
      />
      {/* Grid + glow: the developer-grade backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(148,163,184,.18) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,.18) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-1/4 h-[28rem] w-[28rem] rounded-full bg-primary/20 blur-[130px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-accent/10 blur-[120px]"
      />

      <Container className="relative flex min-h-[72vh] flex-col items-start justify-center py-20 sm:py-28">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary-soft/40 px-3 py-1.5 font-mono text-xs uppercase tracking-[0.18em] text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_10px_2px_var(--primary)]" />
          Book online · confirmed in minutes
        </div>

        <h1 className="max-w-3xl text-4xl font-semibold text-white sm:text-6xl lg:text-7xl">
          Look and feel your best,{" "}
          <span className="text-primary">booked in minutes.</span>
        </h1>

        <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
          Explore haircuts, coloring, skincare, makeup and spa treatments. Request your
          appointment online and pay securely once it is confirmed.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <Link href="/services" className={buttonStyles({ size: "lg" })}>
            Explore Salon Services
          </Link>
          <Link
            href="/services"
            className={buttonStyles({ variant: "outline", size: "lg" })}
          >
            View all services
          </Link>
        </div>

        <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 font-mono text-xs uppercase tracking-widest text-slate-400">
          <span>14 curated services</span>
          <span>7 categories</span>
          <span>Secure Stripe checkout</span>
        </div>
      </Container>
    </section>
  );
}
