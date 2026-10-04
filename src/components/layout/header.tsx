"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowUpRight, ChevronDown, Menu, Phone, X } from "lucide-react";
import { Logo } from "@/components/ui/icons";
import { MediaImg } from "@/components/ui/media-image";
import type { MediaImage } from "@/lib/content/schema";
import { cn } from "@/lib/cn";
import { track } from "@/lib/analytics/events";

export type MenuData = {
  categories: { href: string; label: string; description: string; count: number }[];
  featured: { href: string; title: string; locality: string; status: string; image: MediaImage; alt: string }[];
  nav: { label: string; href: string }[];
  phone: string;
  phoneHref: string;
};

/** Pages that open with a full-bleed photo: the header starts transparent over it. */
function hasPhotoHero(pathname: string) {
  return (
    /^\/projects\/(?!completed$|upcoming$|ready-to-move$)[^/]+$/.test(pathname)
  );
}

export function Header({ menu }: { menu: MenuData }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus on navigation (state adjusted during render, not in an effect).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMegaOpen(false);
    setMobileOpen(false);
  }

  // Escape or a click outside the header closes the mega-menu.
  const headerRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!megaOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMegaOpen(false);
    const onPointer = (e: PointerEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) setMegaOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [megaOpen]);

  const transparent = hasPhotoHero(pathname) && !scrolled && !megaOpen;

  const openMega = () => {
    clearTimeout(closeTimer.current);
    setMegaOpen(true);
  };
  const closeMegaSoon = () => {
    closeTimer.current = setTimeout(() => setMegaOpen(false), 140);
  };

  return (
    <header
      ref={headerRef}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,color] duration-500 ease-premium",
        // Always dark, like the mobile menu and footer, so the logo shows in its own gold.
        transparent ? "bg-transparent text-ivory" : "bg-night/95 text-ivory shadow-[0_1px_0_rgba(244,246,248,0.08)]",
      )}
      onMouseLeave={closeMegaSoon}
    >
      {transparent && (
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 h-32 bg-gradient-to-b from-night/55 to-transparent" />
      )}
      <div className="container-site flex h-20 items-center justify-between gap-6 lg:h-24">
        <Link href="/" className="h-10 shrink-0 lg:h-11">
          <Logo tone="light" className="h-full" />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-9 lg:flex">
          {menu.nav.map((item) =>
            item.href === "/projects" ? (
              <div key={item.href} onMouseEnter={openMega}>
                <button
                  type="button"
                  aria-expanded={megaOpen}
                  aria-controls="mega-menu"
                  onClick={() => setMegaOpen((o) => !o)}
                  className={cn(
                    "group flex items-center gap-1.5 text-label-md font-semibold uppercase tracking-label",
                    pathname.startsWith("/projects") && "text-brass",
                  )}
                >
                  Projects
                  <ChevronDown
                    aria-hidden
                    className={cn("size-3.5 transition-transform duration-300", megaOpen && "rotate-180")}
                    strokeWidth={1.75}
                  />
                </button>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                onMouseEnter={() => setMegaOpen(false)}
                className={cn(
                  "relative text-label-md font-semibold uppercase tracking-label after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-500 after:ease-premium hover:after:scale-x-100",
                  pathname.startsWith(item.href) && "text-brass after:scale-x-100",
                )}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={menu.phoneHref}
            onClick={() => track("call_click", { location: "header" })}
            className="hidden items-center gap-2 text-sm font-medium xl:flex"
          >
            <Phone aria-hidden className="size-4" strokeWidth={1.5} />
            {menu.phone}
          </a>
          <Link
            href="#enquire"
            className={cn(
              "hidden rounded-[var(--radius-sm)] px-5 py-3 text-label-md font-semibold uppercase tracking-label transition-colors duration-300 sm:inline-flex",
              transparent ? "border border-ivory/70 hover:bg-ivory hover:text-ink" : "bg-brass text-night hover:bg-brass-shade",
            )}
          >
            Enquire now
          </Link>

          <Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}>
            <Dialog.Trigger asChild>
              <button type="button" className="-mr-2 p-2 lg:hidden" aria-label="Open menu">
                <Menu className="size-6" strokeWidth={1.5} />
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Content data-lenis-prevent className="fixed inset-0 z-[60] flex flex-col overflow-y-auto overscroll-contain bg-night text-ivory data-[state=open]:animate-[fadeIn_.35s_ease]">
                <Dialog.Title className="sr-only">Menu</Dialog.Title>
                <Dialog.Description className="sr-only">Site navigation</Dialog.Description>
                <div className="container-site sticky top-0 z-10 flex h-20 shrink-0 items-center justify-between bg-night">
                  <Logo tone="light" className="h-10" />
                  <Dialog.Close className="-mr-2 p-2" aria-label="Close menu">
                    <X className="size-6" strokeWidth={1.5} />
                  </Dialog.Close>
                </div>
                {/* Any link closes the menu, including one to the page already open
                    (the pathname reset above never fires for those). */}
                <nav
                  aria-label="Mobile"
                  className="container-site mt-6 flex flex-1 flex-col"
                  onClick={(e) => (e.target as HTMLElement).closest("a") && setMobileOpen(false)}
                >
                  <Link href="/" className="border-b border-ivory/10 py-4 font-display text-2xl font-medium tracking-tight">
                    Home
                  </Link>
                  {menu.nav.map((item) => (
                    <div key={item.href} className="border-b border-ivory/10 py-4">
                      <Link href={item.href} className="font-display text-2xl font-medium tracking-tight">
                        {item.label}
                      </Link>
                      {item.href === "/projects" && (
                        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                          {menu.categories.map((c) => (
                            <Link key={c.href} href={c.href} className="text-sm text-mist">
                              {c.label} ({c.count})
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="mt-auto flex flex-col gap-3 py-10">
                    <a href={menu.phoneHref} className="flex items-center gap-3 text-lg">
                      <Phone className="size-5 text-brass" strokeWidth={1.5} /> {menu.phone}
                    </a>
                    <Link
                      href="#enquire"
                      className="mt-4 inline-flex justify-center bg-brass px-6 text-night py-4 text-label-md font-semibold uppercase tracking-label"
                    >
                      Enquire now
                    </Link>
                  </div>
                </nav>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>

      {megaOpen && (
          <div
            id="mega-menu"
            onMouseEnter={openMega}
            className="mega-in absolute inset-x-0 top-full hidden border-t border-sand bg-ivory text-ink shadow-[0_24px_48px_-24px_rgba(14,24,35,0.25)] lg:block"
          >
            <div className="container-site grid grid-cols-12 gap-10 py-10">
              <div className="col-span-4 flex flex-col">
                <p className="eyebrow mb-4">Explore by status</p>
                {menu.categories.map((c) => (
                  <Link
                    key={c.href}
                    href={c.href}
                    className="group flex items-start justify-between gap-4 border-b border-sand py-4 last:border-0"
                  >
                    <span>
                      <span className="font-display text-xl transition-colors group-hover:text-brass-deep font-medium tracking-tight">
                        {c.label}
                      </span>
                      <span className="mt-1 block text-sm text-muted">{c.description}</span>
                    </span>
                    <span className="mt-1 text-sm text-muted tabular-nums">{String(c.count).padStart(2, "0")}</span>
                  </Link>
                ))}
                <Link href="/projects" className="mt-6 inline-flex items-center gap-2 text-label-md font-semibold uppercase tracking-label hover:text-brass-deep">
                  All projects <ArrowUpRight className="size-4" strokeWidth={1.5} />
                </Link>
              </div>
              <div className="col-span-8 grid grid-cols-2 gap-6">
                {menu.featured.map((p) => (
                  <Link key={p.href} href={p.href} className="group relative block aspect-[16/10] overflow-hidden bg-sand">
                    <MediaImg
                      image={p.image}
                      alt={p.alt}
                      sizes="400px"
                      className="transition-transform duration-[1.2s] ease-premium group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-night/80 via-night/10 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-5 text-ivory">
                      <p className="text-label font-semibold uppercase tracking-label text-ivory/80">
                        {p.status} · {p.locality}
                      </p>
                      <p className="mt-1 font-display text-xl font-medium tracking-tight">{p.title}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
    </header>
  );
}
