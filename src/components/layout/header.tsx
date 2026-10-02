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
  const tone = transparent ? "light" : "dark";

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
        transparent ? "bg-transparent text-ivory" : "bg-ivory/95 text-ink shadow-[0_1px_0_var(--color-sand)] backdrop-blur-md",
      )}
      onMouseLeave={closeMegaSoon}
    >
      {transparent && (
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 h-32 bg-gradient-to-b from-night/55 to-transparent" />
      )}
      <div className="container-site flex h-20 items-center justify-between gap-6 lg:h-24">
        <Link href="/" className="h-10 shrink-0 lg:h-11">
          <Logo tone={tone} className="h-full" />
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
                    "group flex items-center gap-1.5 text-[0.78rem] font-semibold uppercase tracking-[0.16em]",
                    pathname.startsWith("/projects") && (transparent ? "text-brass" : "text-brass-deep"),
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
                  "relative text-[0.78rem] font-semibold uppercase tracking-[0.16em] after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-500 after:ease-premium hover:after:scale-x-100",
                  pathname.startsWith(item.href) && (transparent ? "text-brass after:scale-x-100" : "text-brass-deep after:scale-x-100"),
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
              "hidden rounded-[var(--radius-sm)] px-5 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.16em] transition-colors duration-300 sm:inline-flex",
              transparent ? "border border-ivory/70 hover:bg-ivory hover:text-ink" : "bg-ink text-ivory hover:bg-brass-deep",
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
              <Dialog.Content className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-night text-ivory data-[state=open]:animate-[fadeIn_.35s_ease]">
                <Dialog.Title className="sr-only">Menu</Dialog.Title>
                <Dialog.Description className="sr-only">Site navigation</Dialog.Description>
                <div className="container-site flex h-20 items-center justify-between">
                  <Logo tone="light" className="h-10" />
                  <Dialog.Close className="-mr-2 p-2" aria-label="Close menu">
                    <X className="size-6" strokeWidth={1.5} />
                  </Dialog.Close>
                </div>
                <nav aria-label="Mobile" className="container-site mt-6 flex flex-1 flex-col">
                  <Link href="/" className="border-b border-ivory/10 py-4 font-[family-name:var(--font-display)] text-3xl">
                    Home
                  </Link>
                  {menu.nav.map((item) => (
                    <div key={item.href} className="border-b border-ivory/10 py-4">
                      <Link href={item.href} className="font-[family-name:var(--font-display)] text-3xl">
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
                      onClick={() => setMobileOpen(false)}
                      className="mt-4 inline-flex justify-center bg-brass-deep px-6 py-4 text-[0.78rem] font-semibold uppercase tracking-[0.16em]"
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
            className="mega-in absolute inset-x-0 top-full hidden border-t border-sand bg-ivory text-ink shadow-[0_24px_48px_-24px_rgba(20,23,26,0.25)] lg:block"
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
                      <span className="font-[family-name:var(--font-display)] text-2xl transition-colors group-hover:text-brass-deep">
                        {c.label}
                      </span>
                      <span className="mt-1 block text-sm text-muted">{c.description}</span>
                    </span>
                    <span className="mt-1 text-sm text-muted tabular-nums">{String(c.count).padStart(2, "0")}</span>
                  </Link>
                ))}
                <Link href="/projects" className="mt-6 inline-flex items-center gap-2 text-[0.75rem] font-semibold uppercase tracking-[0.16em] hover:text-brass-deep">
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
                      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-ivory/80">
                        {p.status} · {p.locality}
                      </p>
                      <p className="mt-1 font-[family-name:var(--font-display)] text-2xl">{p.title}</p>
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
