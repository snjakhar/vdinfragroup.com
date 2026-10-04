import { cn } from "@/lib/cn";

export function Tag({
  children,
  tone = "light",
  className,
}: {
  children: React.ReactNode;
  tone?: "light" | "dark" | "brass";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-[var(--radius-sm)] px-3 py-1.5 text-label font-semibold uppercase tracking-label",
        tone === "light" && "bg-ivory/95 text-ink",
        tone === "dark" && "bg-night/80 text-ivory backdrop-blur-sm",
        tone === "brass" && "bg-brass text-night",
        className,
      )}
    >
      {children}
    </span>
  );
}
