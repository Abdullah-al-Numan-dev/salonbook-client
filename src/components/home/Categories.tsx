"use client";

import Link from "next/link";
import {
  Brush,
  Droplets,
  Flower2,
  Hand,
  Scissors,
  Sparkles,
  Waves,
  type LucideIcon,
} from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { useFetch } from "@/hooks/useFetch";
import { api } from "@/lib/api";
import { CATEGORIES } from "@/lib/constants";
import type { CategoryCount } from "@/types";

const icons: Record<string, LucideIcon> = {
  "Haircut & Styling": Scissors,
  "Hair Coloring": Brush,
  "Hair Treatment": Droplets,
  "Facial & Skincare": Sparkles,
  Makeup: Flower2,
  "Manicure & Pedicure": Hand,
  "Spa & Massage": Waves,
};

export default function Categories() {
  const { data } = useFetch(() => api<{ data: CategoryCount[] }>("/api/services/categories"));

  // Show every category, even before the API answers, with counts when available
  const counts = new Map((data?.data ?? []).map((c) => [c.category, c.count]));

  return (
    <section className="bg-primary-soft/50 py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="Explore"
          title="Salon Service Categories"
          subtitle="Pick a category to see every service we offer in it."
        />

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {CATEGORIES.map((category) => {
            const Icon = icons[category] ?? Sparkles;
            const count = counts.get(category);
            return (
              <Link
                key={category}
                href={`/services?category=${encodeURIComponent(category)}`}
                className="group flex flex-col items-center rounded-xl border border-border bg-surface p-6 text-center transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
              >
                <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-primary transition-colors group-hover:bg-primary group-hover:text-slate-950">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <span className="font-semibold">{category}</span>
                {count !== undefined && (
                  <span className="mt-1 text-xs text-muted">
                    {count} {count === 1 ? "service" : "services"}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}