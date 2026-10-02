"use client";

import { useCallback, useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { imageUrl } from "@/lib/images/presets";
import type { MediaImage } from "@/lib/content/schema";

export type LightboxItem = { image: MediaImage; alt: string; caption?: string };

// The lightbox never needs more than the 1920 preset (2560 is for heroes only).
const LIGHTBOX_WIDTHS = [768, 1280, 1920];

/** Full-screen gallery: swipe, arrow keys, counter and captions. */
export function Lightbox({
  items,
  index,
  onClose,
}: {
  items: LightboxItem[];
  index: number;
  onClose: () => void;
}) {
  // Mounted only while open (parents render it with key={index}), so startIndex is always right.
  const [emblaRef, embla] = useEmblaCarousel({ loop: true, startIndex: index });
  const [current, setCurrent] = useState(index);

  useEffect(() => {
    if (!embla) return;
    const onSelect = () => setCurrent(embla.selectedScrollSnap());
    embla.on("select", onSelect);
    return () => {
      embla.off("select", onSelect);
    };
  }, [embla]);

  const prev = useCallback(() => embla?.scrollPrev(), [embla]);
  const next = useCallback(() => embla?.scrollNext(), [embla]);

  const item = items[current];
  return (
    <Dialog.Root open onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[80] bg-night/97 data-[state=open]:animate-[fadeIn_.3s_ease]" />
        <Dialog.Content
          className="fixed inset-0 z-[81] flex flex-col text-ivory focus:outline-none"
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") prev();
            if (e.key === "ArrowRight") next();
          }}
        >
          <Dialog.Title className="sr-only">Image gallery</Dialog.Title>
          <Dialog.Description className="sr-only">Use the arrow keys or swipe to move between images.</Dialog.Description>
          <div className="flex items-center justify-between px-5 py-4 text-sm">
            <span className="tabular-nums text-mist">
              {String(current + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
            </span>
            <Dialog.Close className="p-2" aria-label="Close gallery">
              <X className="size-6" strokeWidth={1.5} />
            </Dialog.Close>
          </div>
          <div className="relative min-h-0 flex-1">
            <div className="h-full overflow-hidden" ref={emblaRef}>
              <div className="flex h-full">
                {items.map((it, i) => (
                  <div key={`${it.image.src}-${i}`} className="relative flex min-w-0 flex-[0_0_100%] items-center justify-center px-4 md:px-20">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageUrl(it.image.src, 1280)}
                      srcSet={LIGHTBOX_WIDTHS.map((w) => `${imageUrl(it.image.src, w)} ${w}w`).join(", ")}
                      sizes="(min-width: 768px) calc(100vw - 160px), 100vw"
                      alt={it.alt}
                      loading={Math.abs(i - current) <= 1 ? "eager" : "lazy"}
                      decoding="async"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
            <button onClick={prev} aria-label="Previous image" className="absolute left-4 top-1/2 hidden -translate-y-1/2 rounded-full border border-ivory/30 p-3 transition-colors hover:bg-ivory hover:text-ink md:block">
              <ChevronLeft className="size-5" strokeWidth={1.5} />
            </button>
            <button onClick={next} aria-label="Next image" className="absolute right-4 top-1/2 hidden -translate-y-1/2 rounded-full border border-ivory/30 p-3 transition-colors hover:bg-ivory hover:text-ink md:block">
              <ChevronRight className="size-5" strokeWidth={1.5} />
            </button>
          </div>
          <p className="min-h-16 px-5 py-5 text-center text-sm text-mist">{item?.caption ?? item?.alt}</p>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
