"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

/**
 * Site-wide motion: one IntersectionObserver reveals every [data-reveal]
 * element (CSS does the animation), and Lenis smooth scrolling runs on
 * desktop (fine pointer) only. Reduced-motion users get neither. On touch
 * screens, [data-touch-zoom] cards get data-touched while a finger is on them,
 * standing in for the desktop hover zoom.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (reduce || !finePointer) return;
    // Wheel uses Lenis's default lerp, which follows the wheel closely; a fixed
    // duration restarts a 1.1s tween on every tick and feels laggy. The eased
    // duration is kept for anchor jumps only. Anchor jumps already honour html
    // scroll-padding-top (header) and each target's scroll-margin-top, exactly
    // like native scrolling: no extra offset.
    const lenis = new Lenis({
      anchors: { duration: 1.1, easing: (t) => 1 - Math.pow(1 - t, 3) },
      // Clicking a link mid-scroll must not carry the momentum onto the next page.
      stopInertiaOnNavigate: true,
    });
    let frame = requestAnimationFrame(function raf(time) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    });
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia("(hover: hover)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let current: Element | null = null;
    const release = () => {
      current?.removeAttribute("data-touched");
      current = null;
    };
    const press = (e: TouchEvent) => {
      release();
      current = (e.target as Element).closest?.("[data-touch-zoom]") ?? null;
      current?.setAttribute("data-touched", "");
    };
    document.addEventListener("touchstart", press, { passive: true });
    document.addEventListener("touchend", release, { passive: true });
    document.addEventListener("touchcancel", release, { passive: true });
    return () => {
      document.removeEventListener("touchstart", press);
      document.removeEventListener("touchend", release);
      document.removeEventListener("touchcancel", release);
    };
  }, []);

  // Re-scan on every route change (the layout persists; pages do not).
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    document.querySelectorAll("[data-reveal]:not(.is-visible)").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  return children;
}
