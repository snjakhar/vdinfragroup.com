"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { MediaImg } from "@/components/ui/media-image";
import type { MediaImage } from "@/lib/content/schema";
import { cn } from "@/lib/cn";

/** `imageClassName` reframes one photo, e.g. to crop out a foreground road. */
export type HeroSlide = { image: MediaImage; alt: string; title: string; status: string; href: string; imageClassName?: string };

const INTERVAL = 6500;

/**
 * Home hero image panel: current projects crossfade slowly, with nothing on top
 * of the building except a small project label. Pauses on hover and when the
 * visitor prefers reduced motion.
 */
export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  // Only the first slide loads with the page; the rest load once it has painted.
  const [loadRest, setLoadRest] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoadRest(true), 1500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (slides.length < 2 || paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setActive((i) => (i + 1) % slides.length), INTERVAL);
    return () => clearInterval(t);
  }, [slides.length, paused]);

  const slide = slides[active];
  return (
    <div className="relative h-full w-full overflow-hidden bg-night" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {slides.map((s, i) =>
        i === 0 || loadRest ? (
          <div
            key={s.href}
            aria-hidden={i !== active}
            className={cn("absolute inset-0 transition-opacity duration-[1400ms] ease-premium", i === active ? "opacity-100" : "opacity-0")}
          >
            <MediaImg
              image={s.image}
              alt={s.alt}
              sizes="(min-width: 1024px) 58vw, 100vw"
              priority={i === 0}
              className={s.imageClassName}
            />
          </div>
        ) : null,
      )}


      {/* Soft fade so the white caption reads on any photo, without a card on top. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-night/70 to-transparent" />
      <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3 sm:inset-x-8 sm:bottom-7 sm:gap-4">
        <Link href={slide.href} className="group flex items-center gap-2.5 text-ivory sm:gap-4">
          <span>
            <span className="block text-label font-semibold uppercase tracking-label text-brass">{slide.status}</span>
            <span className="mt-0.5 block font-display text-lg font-medium leading-tight tracking-tight sm:text-2xl">{slide.title}</span>
          </span>
          <ArrowUpRight className="size-4 shrink-0 sm:size-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.5} />
        </Link>
        {slides.length > 1 && (
          <div className="flex pb-0.5 sm:pb-1.5" role="tablist" aria-label="Featured projects">
            {slides.map((s, i) => (
              <button
                key={s.href}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={`Show ${s.title}`}
                onClick={() => setActive(i)}
                // The visible dot stays small; the button itself is a 24px tap target.
                className="group/dot flex h-6 min-w-6 items-center justify-center"
              >
                <span
                  className={cn(
                    "h-1 rounded-full bg-ivory transition-all duration-500 sm:h-1.5",
                    i === active ? "w-5 sm:w-7" : "w-1 opacity-60 group-hover/dot:opacity-100 sm:w-1.5",
                  )}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
