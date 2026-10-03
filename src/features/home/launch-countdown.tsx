"use client";

import { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import { InstagramIcon, Logo, WhatsAppIcon } from "@/components/ui/icons";
import { MediaImg } from "@/components/ui/media-image";
import type { MediaImage } from "@/lib/content/schema";
import { track } from "@/lib/analytics/events";

type Props = {
  at: string;
  label: string;
  image: MediaImage;
  imageAlt: string;
  phone: string;
  phoneHref: string;
  whatsappHref: string;
  instagram: string;
};

const pad = (n: number) => String(n).padStart(2, "0");

const PREVIEW_KEY = "vd-preview";
function hasPreview() {
  try {
    if (new URLSearchParams(window.location.search).has("preview")) sessionStorage.setItem(PREVIEW_KEY, "1");
    return sessionStorage.getItem(PREVIEW_KEY) === "1";
  } catch {
    return new URLSearchParams(window.location.search).has("preview");
  }
}

/**
 * Full-screen "launching soon" countdown over every page. Rendered in the static
 * HTML (so the site never flashes first) and removed in the browser once the
 * launch time has passed. Owners can open any page with ?preview=1 to see the
 * real site for the rest of that browser session.
 */
export function LaunchCountdown({ at, label, image, imageAlt, phone, phoneHref, whatsappHref, instagram }: Props) {
  const target = Date.parse(at);
  const [left, setLeft] = useState<number | null>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const tick = () => {
      const ms = target - Date.now();
      if (ms <= 0 || hasPreview()) setHidden(true);
      else setLeft(ms);
    };
    const first = setTimeout(tick, 0);
    const timer = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(timer);
    };
  }, [target]);

  // Lock page scrolling while the countdown covers the site.
  useEffect(() => {
    if (hidden) return;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [hidden]);

  if (hidden) return null;

  const s = left === null ? null : Math.floor(left / 1000);
  const units = [
    { label: "Days", value: s === null ? "--" : pad(Math.floor(s / 86400)) },
    { label: "Hours", value: s === null ? "--" : pad(Math.floor((s % 86400) / 3600)) },
    { label: "Minutes", value: s === null ? "--" : pad(Math.floor((s % 3600) / 60)) },
    { label: "Seconds", value: s === null ? "--" : pad(s % 60) },
  ].filter((u, i) => i > 0 || u.value === "--" || u.value !== "00");

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="launch-title"
      data-lenis-prevent
      className="fixed inset-0 z-[90] flex flex-col overflow-y-auto bg-ivory lg:flex-row"
    >
      {/* Image: top on mobile, right half on desktop */}
      <div className="relative order-first aspect-[4/3] w-full shrink-0 sm:aspect-[16/10] lg:order-last lg:aspect-auto lg:h-full lg:w-1/2">
        <MediaImg image={image} alt={imageAlt} sizes="(min-width: 1024px) 50vw, 100vw" priority />
      </div>

      <div className="flex flex-1 flex-col justify-center px-6 py-10 sm:px-12 lg:px-16 lg:py-12 xl:px-24">
        <Logo className="h-11" />
        <p className="eyebrow mt-10 lg:mt-14">Launching {label}</p>
        <h1 id="launch-title" className="mt-4 font-display text-[clamp(2rem,1.2rem+2.4vw,3.5rem)] font-medium leading-[1.06] tracking-[-0.03em] text-ink">
          Something new is <span className="text-brass-deep">rising</span>
        </h1>
        <p className="t-lead mt-5 max-w-lg">
          Our new website is almost ready: luxury kothis, villas and apartments across Jaipur, with every project, floor plan and brochure in one place.
        </p>

        <div className="mt-9 flex gap-3 sm:gap-4" aria-live="polite" aria-atomic="true">
          {units.map((u) => (
            <div key={u.label} className="min-w-[4.5rem] border border-sand bg-paper px-3 py-4 text-center sm:min-w-[5.5rem] sm:px-4">
              <span className="block font-display text-3xl font-medium leading-none tracking-tight tabular-nums text-ink sm:text-4xl">{u.value}</span>
              <span className="mt-2 block text-label font-semibold uppercase tracking-label text-muted">{u.label}</span>
            </div>
          ))}
        </div>

        <p className="mt-10 text-sm text-muted">Can&rsquo;t wait? Talk to us today.</p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener"
            onClick={() => track("whatsapp_click", { location: "launch" })}
            className="inline-flex items-center justify-center gap-3 bg-ink px-6 py-4 text-label-md font-semibold uppercase tracking-label text-ivory transition-colors hover:bg-brass-deep"
          >
            <WhatsAppIcon className="size-4" /> WhatsApp us
          </a>
          <a
            href={phoneHref}
            onClick={() => track("call_click", { location: "launch" })}
            className="inline-flex items-center justify-center gap-3 border border-ink/80 px-6 py-[0.95rem] text-label-md font-semibold uppercase tracking-label text-ink transition-colors hover:bg-ink hover:text-ivory"
          >
            <Phone className="size-4" strokeWidth={1.5} /> {phone}
          </a>
        </div>
        <a href={instagram} target="_blank" rel="noopener" className="mt-6 inline-flex items-center gap-2 text-sm text-muted hover:text-ink">
          <InstagramIcon className="size-4" /> Follow the launch on Instagram
        </a>
      </div>
    </div>
  );
}
