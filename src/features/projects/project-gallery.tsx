"use client";

import { useState } from "react";
import { Expand } from "lucide-react";
import { MediaImg } from "@/components/ui/media-image";
import { cn } from "@/lib/cn";
import { Lightbox, type LightboxItem } from "./lightbox";

/** Project gallery: a lead image plus a grid; any image opens the lightbox. */
export function ProjectGallery({ items }: { items: LightboxItem[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const shown = items.slice(0, 5);
  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:grid-rows-2 md:gap-4">
        {shown.map((it, i) => (
          <button
            key={`${it.image.src}-${i}`}
            type="button"
            onClick={() => setOpen(i)}
            className={cn(
              "group relative overflow-hidden bg-sand",
              i === 0 ? "col-span-2 aspect-[4/3] md:row-span-2 md:aspect-auto" : "aspect-[4/3]",
            )}
          >
            <span className="sr-only">Open image {i + 1}: {it.alt}. </span>
            <MediaImg
              image={it.image}
              alt={it.alt}
              sizes={i === 0 ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 25vw, 50vw"}
              className="transition-transform duration-[1.2s] ease-premium group-hover:scale-105"
            />
            <span className="absolute inset-0 bg-night/0 transition-colors duration-500 group-hover:bg-night/20" />
            {i === shown.length - 1 && items.length > shown.length && (
              <span className="absolute inset-0 flex items-center justify-center bg-night/55 font-display text-2xl text-ivory font-medium tracking-tight">
                +{items.length - shown.length} more
              </span>
            )}
            {i === 0 && (
              <span className="absolute bottom-4 left-4 flex items-center gap-2 bg-ivory/95 px-3 py-2 text-label font-semibold uppercase tracking-label text-ink">
                <Expand className="size-3.5" strokeWidth={1.75} /> View all {items.length} photos
              </span>
            )}
          </button>
        ))}
      </div>
      {open !== null && <Lightbox key={open} items={items} index={open} onClose={() => setOpen(null)} />}
    </>
  );
}
