/**
 * Company details used across the site (header, footer, contact, schema markup).
 * Phone/WhatsApp, founder, highlights and www domain are from the previous
 * vdinfragroup.com site; email and website also appear on the brochures.
 * The office address is intentionally not shown anywhere on the site.
 */
export const site = {
  name: "VD Infra Group",
  shortName: "VD Infra",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://vdinfragroup.com",
  tagline: "Where dreams rise as landmarks",
  description:
    "VD Infra Group builds luxury kothis, villas and apartments across Jaipur, from Narayan Vihar and Chordia City on Ajmer Road to Jagatpura.",

  phone: "+91 96100 05779",
  phoneHref: "tel:+919610005779",
  whatsappNumber: "919610005779",
  whatsappMessage: "Hello VD Infra Group, I would like to know more about your projects.",
  email: "vdinfragroup@gmail.com",
  instagram: "https://www.instagram.com/vdinfragroup",
  instagramHandle: "@vdinfragroup",

  founder: { name: "Vikash Dukiya", role: "CEO & Founder" },

  /** Cloudflare Turnstile site key (public; the secret lives only in Cloudflare Pages). */
  turnstileSiteKey: "0x4AAAAAAFMHF3YIhBJXYknM",

  /**
   * Launch countdown shown full-screen on every page until `at`, then it
   * disappears by itself. Set `enabled: false` to remove it immediately.
   * Owners can preview the real site meanwhile with  /?preview=1
   */
  launch: { enabled: true, at: "2026-10-04T17:00:00+05:30", label: "4 October 2026, 5:00 PM" },

  /** Home page highlights (company-wide figures from the previous website). */
  highlights: [
    { value: "50+", label: "Projects delivered" },
    { value: "1000+", label: "Happy families" },
    { value: "15+", label: "Years in Jaipur" },
    { value: "100%", label: "On-time delivery" },
  ],

  nav: [
    { label: "About", href: "/about" },
    { label: "Projects", href: "/projects" },
    { label: "Gallery", href: "/gallery" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
} as const;

export function whatsappLink(message: string = site.whatsappMessage) {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
