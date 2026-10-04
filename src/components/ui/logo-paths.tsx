/*
 * The VD monogram, redrawn as clean geometry from the brand's logo artwork
 * (vdinfragroup.png). The same path is in public/brand/*.svg; keep them in sync.
 */
export const MARK_PATH =
  "M 0 49 H 208 L 392 368 L 632 0 H 732 L 346 657 Z M 107 106 H 163 L 389 497 L 361 541 Z " +
  "M 540 360 L 651 200 H 671 A 206 206 0 0 1 671 612 H 540 Z M 610 259 H 671 A 147 147 0 0 1 671 553 H 605 V 266 Z " +
  "M 678 163 L 717 107 A 300 300 0 0 1 692 706 H 541 V 649 H 692 A 243 243 0 0 0 692 163 Z";

export const MARK_VIEWBOX = "0 0 992 706";

/** Same value as --color-brand-gold (SVG fill attributes cannot read CSS variables everywhere). */
export const LOGO_GOLD = "#cca35c";

/** The VD monogram alone. */
export function LogoMark({ className, color = LOGO_GOLD }: { className?: string; color?: string }) {
  return (
    <svg viewBox={MARK_VIEWBOX} aria-hidden className={className} fill={color} fillRule="evenodd">
      <path d={MARK_PATH} />
    </svg>
  );
}
