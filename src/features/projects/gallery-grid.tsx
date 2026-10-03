"use client";

import { useMemo, useState } from "react";
import { MediaImg } from "@/components/ui/media-image";
import { cn } from "@/lib/cn";
import { Lightbox, type LightboxItem } from "./lightbox";

export type GalleryEntry = LightboxItem & { project: string; projectSlug: string; kind: "Exteriors" | "Interiors" };

/** Gallery page grid with project and type filters; opens the shared lightbox. */
export function GalleryGrid({ entries, projects }: { entries: GalleryEntry[]; projects: { slug: string; title: string }[] }) {
  const [project, setProject] = useState("all");
  const [open, setOpen] = useState<number | null>(null);
  const shown = useMemo(() => entries.filter((e) => project === "all" || e.projectSlug === project), [entries, project]);

  return (
    <>
      <div role="group" aria-label="Filter by project" className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-2">
        {[{ slug: "all", title: "All projects" }, ...projects].map((p) => (
          <button
            key={p.slug}
            type="button"
            aria-pressed={project === p.slug}
            onClick={() => setProject(p.slug)}
            className={cn(
              "shrink-0 border px-4 py-2.5 text-label font-semibold uppercase tracking-label transition-colors duration-300",
              project === p.slug ? "border-ink bg-ink text-ivory" : "border-sand text-muted hover:border-ink hover:text-ink",
            )}
          >
            {p.title}
          </button>
        ))}
      </div>
      <ul className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>li]:mb-4">
        {shown.map((e, i) => (
          <li key={`${e.image.src}-${e.projectSlug}-${i}`} className="break-inside-avoid">
            <button type="button" onClick={() => setOpen(i)} className="group relative block w-full overflow-hidden bg-sand">
              <span className="sr-only">Open: {e.alt}. </span>
              <div className={cn("relative", i % 5 === 0 ? "aspect-[4/5]" : i % 3 === 0 ? "aspect-square" : "aspect-[3/2]")}>
                <MediaImg image={e.image} alt={e.alt} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="transition-transform duration-[1.2s] ease-premium group-hover:scale-105" />
              </div>
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-night/80 to-transparent p-4 text-left text-ivory opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <span className="block text-label font-semibold uppercase tracking-label text-ivory/70">{e.kind}</span>
                <span className="font-display text-lg font-medium tracking-tight">{e.project}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      {open !== null && <Lightbox key={open} items={shown} index={open} onClose={() => setOpen(null)} />}
    </>
  );
}
