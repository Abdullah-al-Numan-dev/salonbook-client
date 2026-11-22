import Link from "next/link";
import { Scissors } from "lucide-react";
import { SALON_NAME } from "@/lib/constants";

export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2"
      aria-label={`${SALON_NAME} home`}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white">
        <Scissors className="h-5 w-5" aria-hidden="true" />
      </span>
      <span
        className={`font-heading text-xl font-semibold ${light ? "text-white" : "text-foreground"}`}
      >
        {SALON_NAME}
      </span>
    </Link>
  );
}