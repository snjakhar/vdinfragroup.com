import { ArrowUpRight } from "lucide-react";
import { site, whatsappLink } from "@content/site";
import { SectionHeading } from "@/components/ui/heading";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/motion/reveal";
import { getAllProjects } from "@/lib/content/projects";
import { LazyEnquiryForm } from "./lazy-enquiry-form";
import { TrackedLink } from "./tracked-link";

/**
 * The single enquiry block used site-wide (rendered above the footer on every
 * page). Three options: WhatsApp, Instagram, and a short email form. On a
 * project page the form preselects that project.
 */
export function EnquiryBlock() {
  const projects = getAllProjects().map((p) => ({ slug: p.slug, title: p.title }));
  return (
    <section id="enquire" aria-labelledby="enquire-title" className="section scroll-mt-24 border-t border-sand bg-ivory">
      <div className="container-site">
        <SectionHeading
          eyebrow="Enquire"
          title={<span id="enquire-title">Let&rsquo;s find your next home</span>}
          lead="Talk to us the way you prefer. Our sales team replies during working hours."
        />
        <div className="mt-14 grid gap-6 lg:grid-cols-12">
          <div className="grid gap-6 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1">
          <Reveal className="flex">
            <TrackedLink
              href={whatsappLink()}
              event="whatsapp_click"
              className="group flex w-full min-h-44 flex-col justify-between bg-night p-8 text-ivory transition-colors duration-500 hover:bg-night-soft"
            >
              <WhatsAppIcon className="size-9 text-brass" />
              <span>
                <span className="block font-[family-name:var(--font-display)] text-3xl">WhatsApp</span>
                <span className="mt-2 flex items-center gap-2 text-sm text-mist">
                  Chat with our team now
                  <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.5} />
                </span>
              </span>
            </TrackedLink>
          </Reveal>
          <Reveal delay={0.08} className="flex">
            <TrackedLink
              href={site.instagram}
              event="instagram_click"
              className="group flex w-full min-h-44 flex-col justify-between border border-sand bg-paper p-8 transition-colors duration-500 hover:border-ink"
            >
              <InstagramIcon className="size-9 text-brass" />
              <span>
                <span className="block font-[family-name:var(--font-display)] text-3xl">Instagram</span>
                <span className="mt-2 flex items-center gap-2 text-sm text-muted">
                  Site progress and new launches, {site.instagramHandle}
                  <ArrowUpRight className="size-4 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.5} />
                </span>
              </span>
            </TrackedLink>
          </Reveal>
          </div>
          <Reveal delay={0.16} className="relative border border-sand bg-paper p-6 sm:p-10 lg:col-span-8">
            <p className="mb-6 font-[family-name:var(--font-display)] text-3xl">Send an enquiry</p>
            <LazyEnquiryForm projects={projects} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
