import { BadgeCheck, CalendarCheck, CreditCard, ShieldCheck } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";

const features = [
  {
    icon: CalendarCheck,
    title: "Easy Online Booking",
    text: "Pick a service, choose a date and time slot, and send your request in under a minute.",
  },
  {
    icon: BadgeCheck,
    title: "Expert Professionals",
    text: "Experienced stylists, therapists and artists who care about every detail.",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    text: "Pay safely with Stripe once your appointment is confirmed. No surprises.",
  },
  {
    icon: ShieldCheck,
    title: "Clean and Safe",
    text: "Sanitized tools and a calm, hygienic space for every single visit.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="Why SalonBook"
          title="Why Choose Us"
          subtitle="Everything you need for a relaxing, hassle-free salon experience."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-xl border border-border bg-surface p-6 text-center"
            >
              <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-primary">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted">{text}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}