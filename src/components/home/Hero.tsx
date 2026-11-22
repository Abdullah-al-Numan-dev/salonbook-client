import Link from "next/link";
import Container from "@/components/ui/Container";
import { buttonStyles } from "@/components/ui/Button";

export default function Hero() {
  return (
    <section
      className="relative isolate overflow-hidden bg-gradient-to-br from-[#4a2431] via-primary-dark to-primary bg-cover bg-center"
      style={{ backgroundImage: "linear-gradient(rgba(43,29,34,.65), rgba(43,29,34,.65)), url('/images/hero.jpg')" }}
    >
      <Container className="flex min-h-[70vh] flex-col items-start justify-center py-20 sm:py-28">
        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-[#e6c77a]">
          Premium salon care
        </p>
        <h1 className="max-w-2xl text-4xl font-semibold text-white sm:text-5xl lg:text-6xl">
          Look and feel your best, booked in minutes
        </h1>
        <p className="mt-5 max-w-xl text-base text-white/85 sm:text-lg">
          Explore haircuts, coloring, skincare, makeup and spa treatments. Request your appointment
          online and pay securely once it is confirmed.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/services" className={buttonStyles({ size: "lg", className: "bg-white !text-primary-dark hover:!bg-primary-soft" })}>
            Explore Salon Services
          </Link>
        </div>
      </Container>
    </section>
  );
}