import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "accent" | "outline" | "light" | "text";

const base =
  "group/btn inline-flex items-center justify-center gap-3 rounded-[var(--radius-sm)] text-label-md font-semibold uppercase tracking-label transition-colors duration-300 ease-premium disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-ink px-7 py-4 text-ivory hover:bg-brass hover:text-night",
  accent: "bg-brass px-7 py-4 text-night hover:bg-brass-shade",
  outline: "border border-ink/80 px-7 py-[0.95rem] text-ink hover:bg-ink hover:text-ivory",
  light: "border border-ivory/70 px-7 py-[0.95rem] text-ivory backdrop-blur-[2px] hover:bg-ivory hover:text-ink",
  text: "px-0 py-2 text-ink hover:text-brass-deep",
};

type Common = { variant?: Variant; arrow?: boolean; className?: string; children: React.ReactNode };

function Arrow() {
  return (
    <ArrowRight
      aria-hidden
      className="size-4 transition-transform duration-300 ease-premium group-hover/btn:translate-x-1"
      strokeWidth={1.5}
    />
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  arrow = false,
  className,
  children,
  ...rest
}: Common & { href: string } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  const isExternal = /^(https?:|tel:|mailto:)/.test(href);
  const classes = cn(base, variants[variant], className);
  if (isExternal) {
    return (
      <a href={href} className={classes} {...rest}>
        {children}
        {arrow && <Arrow />}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} {...rest}>
      {children}
      {arrow && <Arrow />}
    </Link>
  );
}

export function Button({
  variant = "primary",
  arrow = false,
  className,
  children,
  ...rest
}: Common & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn(base, variants[variant], className)} {...rest}>
      {children}
      {arrow && <Arrow />}
    </button>
  );
}
