import { Mail, MapPin, Phone } from "lucide-react";
import { officeAddress, site, whatsappLink } from "@content/site";
import { SectionHeading } from "@/components/ui/heading";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/icons";
import { LocationMap } from "@/features/projects/location-map";
import { JsonLd, breadcrumbLd } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Contact Us: Visit Our Jaipur Office",
  description: "Call, WhatsApp or email VD Infra Group, or visit our ready-to-move Sky Elegant apartments in Chordia City, Ajmer Road, Jaipur.",
  path: "/contact",
});

export default function ContactPage() {
  const rows = [
    { icon: Phone, label: "Call", value: site.phone, href: site.phoneHref },
    { icon: WhatsAppIcon, label: "WhatsApp", value: "Chat with sales", href: whatsappLink() },
    { icon: Mail, label: "Email", value: site.email, href: `mailto:${site.email}` },
    { icon: InstagramIcon, label: "Instagram", value: site.instagramHandle, href: site.instagram },
  ];
  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
          { "@context": "https://schema.org", "@type": "ContactPage", name: "Contact VD Infra Group", url: `${site.url}/contact` },
        ]}
      />
      <section className="pb-20 pt-36 lg:pb-28 lg:pt-48">
        <div className="container-site grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading level="h1" eyebrow="Contact" title="We would love to hear from you" lead="Call or WhatsApp us, send an enquiry below, or visit our ready-to-move Sky Elegant apartments in Chordia City." />
            <ul className="mt-12 border-t border-sand">
              {rows.map((r) => (
                <li key={r.label} className="border-b border-sand">
                  <a href={r.href} target={r.href.startsWith("http") ? "_blank" : undefined} rel="noopener" className="group flex items-center gap-5 py-5">
                    <r.icon className="size-5 text-brass" />
                    <span className="w-24 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-muted">{r.label}</span>
                    <span className="transition-colors group-hover:text-brass-deep">{r.value}</span>
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-10 space-y-4 text-sm">
              <p className="flex gap-4">
                <MapPin aria-hidden className="size-5 shrink-0 text-brass" strokeWidth={1.5} />
                <span>
                  {site.office.line1}, {site.office.line2}
                  <br />
                  {site.office.city}, {site.office.state} {site.office.postalCode}
                </span>
              </p>
            </div>
          </div>
          <div className="lg:col-span-7">
            <LocationMap query={officeAddress} label={`${site.name} office`} />
          </div>
        </div>
      </section>
    </>
  );
}
