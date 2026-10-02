import Link from "next/link";
import { ArrowUpRight, Mail, Phone } from "lucide-react";
import { site, whatsappLink } from "@content/site";
import { SectionHeading } from "@/components/ui/heading";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/icons";
import { MediaImg } from "@/components/ui/media-image";
import { altFor, cardImage, getProject } from "@/lib/content/projects";
import { JsonLd, breadcrumbLd } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Contact Us: Visit Our Jaipur Office",
  description: "Call, WhatsApp or email VD Infra Group, or visit our ready-to-move Sky Elegant apartments in Chordia City, Ajmer Road, Jaipur.",
  path: "/contact",
});

export default function ContactPage() {
  const visit = getProject("sky-elegant");
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
            <SectionHeading level="h1" eyebrow="Contact" title="We would love to hear from you" lead="Call or WhatsApp us, or send an enquiry below. We are happy to arrange a site visit to any of our current projects." />
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
          </div>
          <div className="lg:col-span-7">
            {visit && (
              <Link href={`/projects/${visit.slug}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden bg-sand">
                  <MediaImg image={cardImage(visit)} alt={altFor(visit, visit.media.hero)} sizes="(min-width: 1024px) 58vw, 100vw" className="transition-transform duration-[1.2s] ease-premium group-hover:scale-105" />
                </div>
                <div className="mt-5 flex items-start justify-between gap-6">
                  <div>
                    <p className="eyebrow">Site visits</p>
                    <p className="mt-2 font-[family-name:var(--font-display)] text-3xl">See a finished home at {visit.title}</p>
                    <p className="mt-2 text-sm text-muted">Ready-to-move apartments in {visit.location.locality}. Call or WhatsApp to book a visit.</p>
                  </div>
                  <ArrowUpRight className="mt-2 size-6 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.5} />
                </div>
              </Link>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
