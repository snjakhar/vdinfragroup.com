import { cn } from "@/lib/cn";

type Level = "h1" | "h2" | "h3";

/**
 * Section heading: optional eyebrow, the heading, optional lead paragraph.
 * Pages render exactly one `level="h1"`; sections use h2/h3 in order.
 */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  level = "h2",
  align = "left",
  tone = "dark",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  level?: Level;
  align?: "left" | "center";
  tone?: "dark" | "light";
  className?: string;
}) {
  const Tag = level;
  const size = level === "h1" ? "t-h1" : level === "h2" ? "t-h2" : "t-h3";
  return (
    <div className={cn(align === "center" && "mx-auto text-center", "max-w-3xl", className)}>
      {eyebrow && <p className={cn("eyebrow mb-5", tone === "light" && "!text-brass")}>{eyebrow}</p>}
      <Tag className={cn(size, tone === "light" ? "text-ivory" : "text-ink", "text-balance")}>{title}</Tag>
      {lead && (
        <p className={cn("t-lead mt-6 text-pretty", tone === "light" && "!text-mist", align === "center" && "mx-auto")}>
          {lead}
        </p>
      )}
    </div>
  );
}
