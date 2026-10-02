"use client";

import { useEffect, useRef } from "react";

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  remove: (id: string) => void;
};

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

/** Cloudflare Turnstile widget, loaded only once the visitor starts the form. Off when no site key is set. */
export function Turnstile({ active, onToken }: { active: boolean; onToken: (token: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!active || !siteKey || !ref.current) return;
    let widgetId: string | undefined;
    const el = ref.current;
    const mount = () => {
      const ts = (window as unknown as { turnstile?: TurnstileApi }).turnstile;
      if (ts && !widgetId) widgetId = ts.render(el, { sitekey: siteKey, theme: "light", callback: onToken });
    };
    if (!document.querySelector(`script[src="${SCRIPT_SRC}"]`)) {
      const s = document.createElement("script");
      s.src = SCRIPT_SRC;
      s.async = true;
      s.onload = mount;
      document.head.appendChild(s);
    } else {
      mount();
    }
    return () => {
      const ts = (window as unknown as { turnstile?: TurnstileApi }).turnstile;
      if (widgetId && ts) ts.remove(widgetId);
    };
  }, [active, siteKey, onToken]);

  if (!siteKey) return null;
  return <div ref={ref} className="min-h-[65px]" />;
}
