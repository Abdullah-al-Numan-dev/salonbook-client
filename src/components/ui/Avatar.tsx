import { cn } from "@/lib/utils";

export default function Avatar({
  name,
  image,
  className,
}: {
  name?: string;
  image?: string | null;
  className?: string;
}) {
  const initial = name?.trim().charAt(0).toUpperCase() || "U";

  if (image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image}
        alt=""
        referrerPolicy="no-referrer"
        className={cn("h-10 w-10 shrink-0 rounded-full object-cover", className)}
      />
    );
  }
  return (
    <span
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary font-semibold text-slate-950",
        className
      )}
    >
      {initial}
    </span>
  );
}