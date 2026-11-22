import { Star } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";

const reviews = [
  {
    name: "Nusrat Jahan",
    service: "Balayage Highlights",
    text: "The booking was so simple and my hair came out exactly how I imagined. I will be back.",
  },
  {
    name: "Tanvir Ahmed",
    service: "Men's Haircut",
    text: "Quick confirmation, no waiting at the door and a really clean cut. Great experience.",
  },
  {
    name: "Farhana Islam",
    service: "Classic Facial",
    text: "My skin felt fresh for days. Paying online after confirmation made everything easy.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-primary-soft/50 py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="Testimonials"
          title="What Our Customers Say"
          subtitle="Real words from people who booked with SalonBook."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {reviews.map((r) => (
            <figure
              key={r.name}
              className="flex h-full flex-col rounded-xl border border-border bg-surface p-6"
            >
              <div className="flex gap-0.5 text-accent" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" aria-hidden="true" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-sm text-muted">“{r.text}”</blockquote>
              <figcaption className="mt-5 border-t border-border pt-4">
                <p className="font-semibold">{r.name}</p>
                <p className="text-xs text-muted">{r.service}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}