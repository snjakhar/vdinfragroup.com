/**
 * Company details used across the site (header, footer, contact, schema markup).
 * Phone, email and website are taken from VD Infra Group's flyers and brochures.
 * TO CONFIRM: WhatsApp number (assumed same as phone), Instagram URL, office address and hours.
 */
export const site = {
  name: "VD Infra Group",
  shortName: "VD Infra",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://vdinfragroup.com",
  tagline: "Where dreams rise as landmarks",
  description:
    "VD Infra Group builds luxury kothis, villas and apartments across Jaipur, from Narayan Vihar and Chordia City on Ajmer Road to Jagatpura.",

  phone: "+91 94131 33193",
  phoneHref: "tel:+919413133193",
  whatsappNumber: "919413133193",
  whatsappMessage: "Hello VD Infra Group, I would like to know more about your projects.",
  email: "vdinfragroup@gmail.com",
  instagram: "https://www.instagram.com/vdinfragroup",
  instagramHandle: "@vdinfragroup",

  // Sales office at Sky Elegant (address from the Sky Elegant brochure). TO CONFIRM.
  office: {
    line1: "Plot No. R-10/65 to R-10/67, Chordia City",
    line2: "Indraprasth Colony, Ajmer Road",
    city: "Jaipur",
    state: "Rajasthan",
    postalCode: "302006",
    country: "IN",
  },

  nav: [
    { label: "About", href: "/about" },
    { label: "Projects", href: "/projects" },
    { label: "Gallery", href: "/gallery" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
} as const;

export const officeAddress = `${site.office.line1}, ${site.office.line2}, ${site.office.city} ${site.office.postalCode}`;

export function whatsappLink(message: string = site.whatsappMessage) {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
