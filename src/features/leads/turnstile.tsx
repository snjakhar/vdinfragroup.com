"use client";

import { useEffect, useRef } from "react";
import { site } from "@content/site";

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  remove: (id: string) => void;
  reset: (id: string) => void;
};

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

// The env var can override; dev builds skip it (localhost is not an allowed hostname).
export const TURNSTILE_SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? (process.env.NODE_ENV === "production" ? site.turnstileSiteKey : undefined);

const api = () => (window as unknown as { turnstile?: TurnstileApi }).turnstile;

/**
 * Cloudflare Turnstile widget, loaded only once the visitor starts the form. Off when no site key is set.
 * Tokens are single-use: bump `resetKey` after every submit to get a fresh one. An expired or failed
 * challenge reports an empty token.
 */
export function Turnstile({ active, resetKey, onToken }: { active: boolean; resetKey: number; onToken: (token: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string>(undefined);
  const siteKey = TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!active || !siteKey || !ref.current) return;
    const el = ref.current;
    const mount = () => {
      const ts = api();
      if (ts && !widgetId.current)
        widgetId.current = ts.render(el, {
          sitekey: siteKey,
          theme: "light",
          callback: onToken,
          "expired-callback": () => onToken(""),
          "error-callback": () => onToken(""),
        });
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
      const ts = api();
      if (widgetId.current && ts) ts.remove(widgetId.current);
      widgetId.current = undefined;
    };
  }, [active, siteKey, onToken]);

  useEffect(() => {
    const ts = api();
    if (resetKey && widgetId.current && ts) ts.reset(widgetId.current);
  }, [resetKey]);

  if (!siteKey) return null;
  return <div ref={ref} className="min-h-[65px]" />;
}
