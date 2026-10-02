"use client";

import { usePathname } from "next/navigation";
import { Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/icons";
import { track } from "@/lib/analytics/events";

/**
 * Mobile thumb-zone actions. Project pages get a full Call · WhatsApp · Enquire
 * bar; every other page gets a floating WhatsApp button.
 */
export function MobileActions({ phoneHref, whatsappHref }: { phoneHref: string; whatsappHref: string }) {
  const pathname = usePathname();
  const projectSlug = pathname.match(/^\/projects\/(?!completed$|upcoming$|ready-to-move$)([^/]+)$/)?.[1];

  if (!projectSlug) {
    return (
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener"
        onClick={() => track("whatsapp_click", { location: "fab" })}
        aria-label="Chat on WhatsApp"
        className="fixed bottom-5 right-5 z-40 flex size-14 items-center justify-center rounded-full bg-night text-ivory shadow-[0_12px_32px_-8px_rgba(20,23,26,0.5)] lg:hidden"
      >
        <WhatsAppIcon className="size-6" />
      </a>
    );
  }

  const message = `Hello VD Infra Group, I am interested in ${projectSlug.replace(/-/g, " ").toUpperCase()}.`;
  const waProject = whatsappHref.replace(/text=[^&]*/, `text=${encodeURIComponent(message)}`);
  const cell = "flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.14em]";
  return (
    <nav
      aria-label="Quick actions"
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-ivory/10 bg-night text-ivory pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <a href={phoneHref} className={cell} onClick={() => track("call_click", { location: "project_bar", project: projectSlug })}>
        <Phone className="size-5" strokeWidth={1.5} /> Call
      </a>
      <a
        href={waProject}
        target="_blank"
        rel="noopener"
        className={`${cell} border-x border-ivory/10`}
        onClick={() => track("whatsapp_click", { location: "project_bar", project: projectSlug })}
      >
        <WhatsAppIcon className="size-5" /> WhatsApp
      </a>
      <a href="#enquire" className={`${cell} bg-brass-deep`}>
        <span aria-hidden className="text-lg leading-none">→</span> Enquire
      </a>
    </nav>
  );
}
