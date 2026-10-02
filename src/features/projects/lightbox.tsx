"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import useEmblaCarousel from "embla-carousel-react";
import { Check, ChevronLeft, ChevronRight, Download, Share2, X, ZoomIn, ZoomOut } from "lucide-react";
import { imageUrl } from "@/lib/images/presets";
import type { MediaImage } from "@/lib/content/schema";
import { track } from "@/lib/analytics/events";
import { slugify } from "@/lib/slugify";
import { cn } from "@/lib/cn";

export type LightboxItem = { image: MediaImage; alt: string; caption?: string };

// The lightbox never needs more than the 1920 preset (2560 is for heroes only).
const LIGHTBOX_WIDTHS = [768, 1280, 1920];
const FULL_WIDTH = 1920;
const MAX_ZOOM = 4;
const DOUBLE_TAP_ZOOM = 2.5;

type Point = { x: number; y: number };

const fileName = (alt: string) => `${slugify(alt).slice(0, 60) || "vd-infra-group"}.jpg`;

/** Fetches the full-size image as a file (for sharing and downloading). */
async function fetchImageFile(src: string, alt: string): Promise<File> {
  const res = await fetch(imageUrl(src, FULL_WIDTH), { mode: "cors" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const blob = await res.blob();
  return new File([blob], fileName(alt), { type: blob.type || "image/jpeg" });
}

/** Full-screen gallery: swipe, arrow keys, zoom (pinch / double-tap / buttons), share and download. */
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
  const [emblaRef, embla] = useEmblaCarousel({ loop: items.length > 1, startIndex: index });
  const [current, setCurrent] = useState(index);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });
  const [notice, setNotice] = useState<string>();
  const [busy, setBusy] = useState(false);

  // Gesture bookkeeping (refs: they change on every pointer move).
  const pointers = useRef(new Map<number, Point>());
  const pinch = useRef<{ dist: number; scale: number } | null>(null);
  const lastTap = useRef(0);
  // Touch double-taps also fire a browser dblclick; only mice use onDoubleClick.
  const lastPointerType = useRef<string>("mouse");
  const fileCache = useRef(new Map<string, File>());

  const item = items[current];

  const resetZoom = useCallback(() => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    if (!embla) return;
    const onSelect = () => {
      setCurrent(embla.selectedScrollSnap());
      resetZoom();
    };
    embla.on("select", onSelect);
    return () => {
      embla.off("select", onSelect);
    };
  }, [embla, resetZoom]);

  // While zoomed, dragging pans the image instead of changing slides.
  useEffect(() => {
    embla?.reInit({ watchDrag: scale === 1 });
  }, [embla, scale]);

  // Prefetch the current image file, so Share can open the share sheet instantly
  // (iOS only allows it right after the tap).
  useEffect(() => {
    const src = item?.image.src;
    if (!src || fileCache.current.has(src)) return;
    const t = setTimeout(() => {
      fetchImageFile(src, item.alt)
        .then((f) => fileCache.current.set(src, f))
        .catch(() => {});
    }, 500);
    return () => clearTimeout(t);
  }, [item]);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(undefined), 2200);
    return () => clearTimeout(t);
  }, [notice]);

  const zoomTo = useCallback((next: number) => {
    const s = Math.min(MAX_ZOOM, Math.max(1, next));
    setScale(s);
    if (s === 1) setOffset({ x: 0, y: 0 });
  }, []);

  const prev = useCallback(() => embla?.scrollPrev(), [embla]);
  const next = useCallback(() => embla?.scrollNext(), [embla]);

  // ----- gestures on the current image -----
  const onPointerDown = (e: React.PointerEvent) => {
    lastPointerType.current = e.pointerType;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinch.current = { dist: Math.hypot(a.x - b.x, a.y - b.y), scale };
    }
    if (scale > 1) (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const prevPt = pointers.current.get(e.pointerId);
    if (!prevPt) return;
    const pt = { x: e.clientX, y: e.clientY };
    pointers.current.set(e.pointerId, pt);
    if (pointers.current.size === 2 && pinch.current) {
      const [a, b] = [...pointers.current.values()];
      zoomTo((pinch.current.scale * Math.hypot(a.x - b.x, a.y - b.y)) / pinch.current.dist);
    } else if (pointers.current.size === 1 && scale > 1) {
      setOffset((o) => ({ x: o.x + (pt.x - prevPt.x) / scale, y: o.y + (pt.y - prevPt.y) / scale }));
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
    // Double tap / double click toggles zoom.
    if (e.pointerType !== "mouse") {
      const now = Date.now();
      if (now - lastTap.current < 280) zoomTo(scale > 1 ? 1 : DOUBLE_TAP_ZOOM);
      lastTap.current = now;
    }
  };

  const onWheel = (e: React.WheelEvent) => {
    // Trackpad pinch arrives as ctrl + wheel.
    if (!e.ctrlKey) return;
    e.preventDefault();
    zoomTo(scale * (1 - e.deltaY / 200));
  };

  // ----- share and download -----
  const download = async () => {
    if (!item || busy) return;
    setBusy(true);
    track("image_download", { image: fileName(item.alt) });
    try {
      const file = fileCache.current.get(item.image.src) ?? (await fetchImageFile(item.image.src, item.alt));
      const url = URL.createObjectURL(file);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
      setNotice("Download started");
    } catch {
      // Cross-origin or offline: open the image so it can be saved manually.
      window.open(imageUrl(item.image.src, FULL_WIDTH), "_blank", "noopener");
    } finally {
      setBusy(false);
    }
  };

  const share = async () => {
    if (!item) return;
    const text = `${item.caption ?? item.alt} | VD Infra Group`;
    const url = window.location.href;
    setNotice(undefined);
    track("image_share", { image: fileName(item.alt) });
    const file = fileCache.current.get(item.image.src);
    try {
      if (file && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "VD Infra Group", text: `${text}\n${url}` });
        return;
      }
      if (navigator.share) {
        await navigator.share({ title: "VD Infra Group", text, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setNotice("Link copied");
    } catch (err) {
      if ((err as Error).name === "AbortError") return; // visitor closed the share sheet
      try {
        await navigator.clipboard.writeText(url);
        setNotice("Link copied");
      } catch {
        setNotice("Sharing is not available on this device");
      }
    }
  };

  const toolButton =
    "flex size-10 items-center justify-center rounded-full transition-colors hover:bg-ivory/10 disabled:opacity-40 disabled:hover:bg-transparent";

  return (
    <Dialog.Root open onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[80] bg-night data-[state=open]:animate-[fadeIn_.3s_ease]" />
        <Dialog.Content
          className="fixed inset-0 z-[81] flex flex-col text-ivory focus:outline-none"
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft" && scale === 1) prev();
            if (e.key === "ArrowRight" && scale === 1) next();
            if (e.key === "+" || e.key === "=") zoomTo(scale + 0.5);
            if (e.key === "-") zoomTo(scale - 0.5);
          }}
        >
          <Dialog.Title className="sr-only">Image gallery</Dialog.Title>
          <Dialog.Description className="sr-only">
            Swipe or use the arrow keys to move between images. Pinch, double-tap or use the zoom buttons to zoom.
          </Dialog.Description>

          <div className="flex items-center justify-between gap-2 px-3 py-3 sm:px-5">
            <span className="pl-1 text-sm tabular-nums text-mist">
              {String(current + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
            </span>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => zoomTo(scale - 0.75)} disabled={scale === 1} className={cn(toolButton, "hidden sm:flex")} aria-label="Zoom out">
                <ZoomOut className="size-5" strokeWidth={1.5} />
              </button>
              <button type="button" onClick={() => zoomTo(scale + 0.75)} disabled={scale >= MAX_ZOOM} className={toolButton} aria-label="Zoom in">
                <ZoomIn className="size-5" strokeWidth={1.5} />
              </button>
              <button type="button" onClick={share} className={toolButton} aria-label="Share image">
                <Share2 className="size-5" strokeWidth={1.5} />
              </button>
              <button type="button" onClick={download} disabled={busy} className={toolButton} aria-label="Download image">
                <Download className="size-5" strokeWidth={1.5} />
              </button>
              <Dialog.Close className={toolButton} aria-label="Close gallery">
                <X className="size-6" strokeWidth={1.5} />
              </Dialog.Close>
            </div>
          </div>

          <div className="relative min-h-0 flex-1">
            <div className="h-full overflow-hidden" ref={emblaRef}>
              <div className="flex h-full">
                {items.map((it, i) => {
                  const active = i === current;
                  return (
                    <div key={`${it.image.src}-${i}`} className="relative flex min-w-0 flex-[0_0_100%] items-center justify-center overflow-hidden px-2 md:px-20">
                      <div
                        className={cn("flex h-full w-full touch-none select-none items-center justify-center", active && scale > 1 ? "cursor-grab active:cursor-grabbing" : active && "cursor-zoom-in")}
                        onPointerDown={active ? onPointerDown : undefined}
                        onPointerMove={active ? onPointerMove : undefined}
                        onPointerUp={active ? onPointerUp : undefined}
                        onPointerCancel={active ? onPointerUp : undefined}
                        onDoubleClick={active ? () => lastPointerType.current === "mouse" && zoomTo(scale > 1 ? 1 : DOUBLE_TAP_ZOOM) : undefined}
                        onWheel={active ? onWheel : undefined}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imageUrl(it.image.src, 1280)}
                          srcSet={LIGHTBOX_WIDTHS.map((w) => `${imageUrl(it.image.src, w)} ${w}w`).join(", ")}
                          sizes="(min-width: 768px) calc(100vw - 160px), 100vw"
                          alt={it.alt}
                          draggable={false}
                          loading={Math.abs(i - current) <= 1 ? "eager" : "lazy"}
                          decoding="async"
                          className="max-h-full max-w-full object-contain transition-transform duration-150 ease-out will-change-transform"
                          style={active ? { transform: `scale(${scale}) translate(${offset.x}px, ${offset.y}px)` } : undefined}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {items.length > 1 && scale === 1 && (
              <>
                <button onClick={prev} aria-label="Previous image" className="absolute left-4 top-1/2 hidden -translate-y-1/2 rounded-full border border-ivory/30 p-3 transition-colors hover:bg-ivory hover:text-ink md:block">
                  <ChevronLeft className="size-5" strokeWidth={1.5} />
                </button>
                <button onClick={next} aria-label="Next image" className="absolute right-4 top-1/2 hidden -translate-y-1/2 rounded-full border border-ivory/30 p-3 transition-colors hover:bg-ivory hover:text-ink md:block">
                  <ChevronRight className="size-5" strokeWidth={1.5} />
                </button>
              </>
            )}
            {notice && (
              <p role="status" className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-ivory px-4 py-2 text-sm text-ink shadow-lg">
                <Check className="size-4 text-brass-deep" strokeWidth={2} /> {notice}
              </p>
            )}
          </div>
          <p className="min-h-16 px-5 py-5 text-center text-sm text-mist">
            {scale > 1 ? "Drag to move · double-tap to reset" : (item?.caption ?? item?.alt)}
          </p>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
