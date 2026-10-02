"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { MediaImg } from "@/components/ui/media-image";
import type { MediaImage } from "@/lib/content/schema";
import { cn } from "@/lib/cn";

export type HeroSlide = { image: MediaImage; alt: string; title: string; status: string; href: string };

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
            />
          </div>
        ) : null,
      )}

      {slide.image.impression && (
        <p className="absolute left-4 top-4 bg-night/55 sm:left-auto sm:right-4 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-ivory/85 backdrop-blur-sm">
          Artist&rsquo;s impression
        </p>
      )}

      <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-4 sm:inset-x-6 sm:bottom-6">
        <Link
          href={slide.href}
          className="group flex items-center gap-3 bg-ivory/95 px-4 py-2.5 text-ink sm:gap-4 sm:px-5 sm:py-3.5 shadow-[0_10px_30px_-12px_rgba(20,23,26,0.45)] backdrop-blur-sm transition-colors hover:bg-ivory"
        >
          <span>
            <span className="block text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-brass-deep">{slide.status}</span>
            <span className="mt-0.5 block font-[family-name:var(--font-display)] text-lg leading-tight sm:text-xl">{slide.title}</span>
          </span>
          <ArrowUpRight className="size-5 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.5} />
        </Link>
        {slides.length > 1 && (
          <div className="flex gap-2 pb-3" role="tablist" aria-label="Featured projects">
            {slides.map((s, i) => (
              <button
                key={s.href}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={`Show ${s.title}`}
                onClick={() => setActive(i)}
                className={cn("h-1.5 rounded-full bg-ivory transition-all duration-500", i === active ? "w-7" : "w-1.5 opacity-60 hover:opacity-100")}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
