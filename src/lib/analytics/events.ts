/**
 * GA4 event helper. Events: generate_lead, call_click, whatsapp_click,
 * instagram_click, brochure_download. Never send personal data (name, phone, email).
 */
type Gtag = (command: "event", name: string, params?: Record<string, string | number>) => void;

export function track(name: string, params: Record<string, string | number> = {}) {
  if (typeof window === "undefined") return;
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  gtag?.("event", name, params);
}
