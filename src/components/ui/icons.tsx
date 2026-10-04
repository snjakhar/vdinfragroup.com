import { LOGO_GOLD, LogoMark } from "./logo-paths";

/** Brand marks not available in lucide. */
export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.66.15-.2.3-.76.96-.93 1.16-.17.2-.34.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.91-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.08.15.2 2.1 3.2 5.08 4.49.71.3 1.27.49 1.7.63.71.23 1.36.2 1.88.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.12-.27-.2-.57-.35zM12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.31l-.34-.2-3.57.93.95-3.48-.22-.36a9.39 9.39 0 0 1-1.44-5c0-5.2 4.23-9.43 9.44-9.43a9.37 9.37 0 0 1 6.67 2.77 9.37 9.37 0 0 1 2.76 6.67c0 5.2-4.24 9.43-9.44 9.43zm8.03-17.46A11.3 11.3 0 0 0 12.05.7C5.79.7.7 5.79.7 12.04c0 2 .52 3.95 1.52 5.67L.6 23.3l5.73-1.5a11.3 11.3 0 0 0 5.72 1.46h.01c6.25 0 11.34-5.09 11.34-11.34 0-3.03-1.18-5.88-3.32-8.02z" />
    </svg>
  );
}

export function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

/**
 * VD Infra Group logo as a horizontal lockup for the header and footer: the VD
 * monogram, then "VD INFRA" over a ruled "GROUP", as on the brand stationery.
 * `tone` is the text tone: "light" for dark backgrounds, "dark" for light ones
 * (where the gold text is darkened to stay legible).
 */
export function Logo({ className, tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  const dark = tone === "dark";
  return (
    <span className={`inline-flex items-center gap-3 ${className ?? ""}`}>
      <LogoMark className="h-full w-auto" color={LOGO_GOLD} />
      <span aria-hidden className="inline-flex flex-col gap-[0.4em] leading-none">
        <span className="text-[1.15rem] font-semibold tracking-[0.04em] lg:text-[1.3rem]">
          <span className={dark ? "text-ink" : "text-ivory"}>VD</span>{" "}
          <span className={dark ? "text-brass-deep" : "text-brass"}>INFRA</span>
        </span>
        <span className={`flex items-center gap-2 text-[0.5rem] font-semibold tracking-[0.42em] ${dark ? "text-ink" : "text-ivory"}`}>
          <span className="h-px flex-1 bg-brass" />
          <span className="-mr-[0.42em]">GROUP</span>
          <span className="h-px flex-1 bg-brass" />
        </span>
      </span>
      <span className="sr-only">VD Infra Group</span>
    </span>
  );
}
