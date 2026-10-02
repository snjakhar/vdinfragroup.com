import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { site, whatsappLink } from "@content/site";
import { InstagramIcon, Logo, WhatsAppIcon } from "@/components/ui/icons";
import { STATUS_META, STATUS_ORDER, getAllProjects } from "@/lib/content/projects";

export function Footer() {
  const projects = getAllProjects();
  const year = new Date().getFullYear();
  return (
    <footer className="bg-night text-mist">
      <div className="container-site grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-12 lg:py-24">
        <div className="lg:col-span-4">
          <Logo tone="light" className="h-11" />
          <p className="mt-6 max-w-sm text-sm leading-relaxed">{site.description}</p>
          <address className="mt-8 flex gap-3 text-sm not-italic leading-relaxed">
            <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-brass" strokeWidth={1.5} />
            <span>
              {site.office.line1}, {site.office.line2}
              <br />
              {site.office.city}, {site.office.state} {site.office.postalCode}
            </span>
          </address>
        </div>

        <nav aria-label="Projects" className="lg:col-span-2">
          <p className="eyebrow mb-5 !text-brass">Projects</p>
          <ul className="space-y-3 text-sm">
            {STATUS_ORDER.map((s) => (
              <li key={s}>
                <Link href={`/projects/${s}`} className="transition-colors hover:text-ivory">
                  {STATUS_META[s].label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/projects" className="transition-colors hover:text-ivory">
                All projects ({projects.length})
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Company" className="lg:col-span-2">
          <p className="eyebrow mb-5 !text-brass">Company</p>
          <ul className="space-y-3 text-sm">
            {[
              ["About us", "/about"],
              ["Gallery", "/gallery"],
              ["Blog", "/blog"],
              ["Contact", "/contact"],
            ].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="transition-colors hover:text-ivory">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-4">
          <p className="eyebrow mb-5 !text-brass">Talk to us</p>
          <ul className="space-y-4 text-sm">
            <li>
              <a href={site.phoneHref} className="flex items-center gap-3 transition-colors hover:text-ivory">
                <Phone aria-hidden className="size-4 text-brass" strokeWidth={1.5} /> {site.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="flex items-center gap-3 transition-colors hover:text-ivory">
                <Mail aria-hidden className="size-4 text-brass" strokeWidth={1.5} /> {site.email}
              </a>
            </li>
            <li>
              <a href={whatsappLink()} target="_blank" rel="noopener" className="flex items-center gap-3 transition-colors hover:text-ivory">
                <WhatsAppIcon className="size-4 text-brass" /> Chat on WhatsApp
              </a>
            </li>
            <li>
              <a href={site.instagram} target="_blank" rel="noopener" className="flex items-center gap-3 transition-colors hover:text-ivory">
                <InstagramIcon className="size-4 text-brass" /> {site.instagramHandle}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ivory/10">
        <div className="container-site flex flex-col gap-4 py-8 text-xs md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <p className="max-w-xl md:text-center">
            Images are for illustration. Project details, prices and RERA numbers shown are indicative; please confirm with our sales team.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-ivory">
              Privacy policy
            </Link>
            <Link href="/terms-and-conditions" className="hover:text-ivory">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
