"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

/** Sticky in-page navigation for project pages, highlighting the section in view. */
export function SectionNav({ sections }: { sections: { id: string; label: string }[] }) {
  const [active, setActive] = useState(sections[0]?.id);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  // Keep the active tab visible on small screens. Scroll only the tab strip:
  // scrollIntoView would also scroll the page and cut off momentum scrolling.
  useEffect(() => {
    const list = listRef.current;
    const el = list?.querySelector<HTMLElement>(`[data-id="${active}"]`);
    if (!list || !el || list.scrollWidth <= list.clientWidth) return;
    const offset = el.getBoundingClientRect().left - list.getBoundingClientRect().left;
    list.scrollTo({ left: list.scrollLeft + offset - (list.clientWidth - el.offsetWidth) / 2, behavior: "smooth" });
  }, [active]);

  return (
    <nav aria-label="On this page" className="sticky top-20 z-30 border-b border-sand bg-ivory lg:top-24">
      <ul ref={listRef} className="container-site no-scrollbar flex gap-7 overflow-x-auto">
        {sections.map((s) => (
          <li key={s.id} data-id={s.id} className="shrink-0">
            <a
              href={`#${s.id}`}
              className={cn(
                "relative block py-4 text-label-md font-semibold uppercase tracking-label transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-brass after:transition-transform after:duration-500 after:ease-premium",
                active === s.id ? "text-ink after:scale-x-100" : "text-muted after:scale-x-0 hover:text-ink",
              )}
            >
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
