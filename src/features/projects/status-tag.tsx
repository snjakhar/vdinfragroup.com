import { Tag } from "@/components/ui/tag";
import { cn } from "@/lib/cn";
import type { ProjectStatus } from "@/lib/content/schema";

/**
 * Project status chip, colour-coded within the palette so buyers can spot what is
 * available at a glance: ready to move = solid brass, upcoming = dark with a brass
 * dot, completed = quiet ivory. Sits on photos, so every tone is opaque enough to read.
 */
export function StatusTag({ status, label, className }: { status: ProjectStatus; label: string; className?: string }) {
  if (status === "ready-to-move") return <Tag tone="brass" className={className}>{label}</Tag>;
  if (status === "upcoming")
    return (
      <Tag tone="dark" className={cn("ring-1 ring-inset ring-ivory/20", className)}>
        <span aria-hidden className="size-1.5 rounded-full bg-brass" />
        {label}
      </Tag>
    );
  return <Tag tone="light" className={className}>{label}</Tag>;
}
