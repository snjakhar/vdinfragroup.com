import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { site } from "@content/site";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { HeroSlider, type HeroSlide } from "@/features/home/hero-slider";
import { ProjectShowcase } from "@/features/home/project-showcase";
import { ResidentReviews } from "@/features/home/resident-reviews";
import { TrustStats } from "@/features/home/trust-stats";
import { STATUS_META, STATUS_ORDER, altFor, getAllProjects, getProjectsByStatus } from "@/lib/content/projects";
import { siteImages } from "@/lib/content/site-images";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({ path: "/", image: siteImages.homeHero });

export default function HomePage() {
  const projects = getAllProjects();
  // Hero: current projects with an AI front image, upcoming first (KK 176 leads).
  const heroOrder = ["krishnam-kothi-176", "sky-elegant", "krishnam-kothi-jagatpura"];
  const heroSlides: HeroSlide[] = projects
    .filter((p) => p.status !== "completed" && p.media.hero.impression)
    .sort((a, b) => (heroOrder.indexOf(a.slug) + 99) % 99 - ((heroOrder.indexOf(b.slug) + 99) % 99))
    .map((p) => ({ image: p.media.heroSquare ?? p.media.hero, alt: altFor(p, p.media.hero), title: p.title, status: p.statusLabel, href: `/projects/${p.slug}` }));
  // Showcase right after the hero: the current projects first, then the flagship completed one.
  const showcase = ["krishnam-kothi-176", "sky-elegant", "krishnam-kothi-jagatpura", "sky-crown"]
    .map((slug) => projects.find((p) => p.slug === slug))
    .filter((p) => p !== undefined);

  return (
    <>
      {/* Hero: text on ivory, image on its own panel (no text over the building) */}
      <section className="relative flex flex-col overflow-hidden bg-ivory lg:block lg:h-[100svh] lg:min-h-[640px]">
        <div className="container-site relative z-10 grid lg:h-full lg:grid-cols-12">
          <div className="flex flex-col justify-center pb-12 pt-10 sm:pt-14 lg:col-span-5 lg:pb-8 lg:pr-10 lg:pt-28">
            <p className="eyebrow hero-rise" style={{ animationDelay: "0.1s" }}>
              VD Infra Group · Jaipur
            </p>
            <h1 className="hero-slide mt-5 text-balance font-display text-[clamp(2.2rem,1rem+2.9vw,4.1rem)] font-medium leading-[1.04] tracking-[-0.03em] text-ink" style={{ animationDelay: "0.2s" }}>
              Built <span className="text-brass-deep">for life.</span>
            </h1>
            <p className="t-lead hero-rise mt-5 max-w-md" style={{ animationDelay: "0.35s" }}>
              Luxury kothis, villas and apartments across Jaipur, built with care and handed over ready to live in.
            </p>
            <div className="hero-rise mt-8 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: "0.5s" }}>
              <ButtonLink href="/projects" variant="primary" arrow>
                Explore projects
              </ButtonLink>
              <ButtonLink href="#enquire" variant="outline">
                Book a site visit
              </ButtonLink>
            </div>
            <div className="hero-rise mt-10 grid grid-cols-3 border-t border-sand lg:mt-12" style={{ animationDelay: "0.65s" }}>
              {STATUS_ORDER.map((s) => (
                <Link key={s} href={`/projects/${s}`} className="group py-5 pr-3">
                  <span className="block font-display text-2xl leading-none text-ink font-medium tracking-tight">
                    {String(getProjectsByStatus(s).length).padStart(2, "0")}
                  </span>
                  <span className="mt-2 flex items-center gap-1 text-label font-semibold uppercase tracking-[0.08em] text-muted transition-colors group-hover:text-ink sm:tracking-label">
                    {STATUS_META[s].label}
                    <ArrowUpRight aria-hidden className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.5} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
        {/* Image panel: first (under the header) on mobile, the right side of the screen on desktop.
            z-20 keeps it above the full-width text layer (z-10), whose empty right side would swallow clicks. */}
        <div className="relative order-first mt-20 h-[60svh] min-h-80 w-full sm:h-auto sm:aspect-[5/4] lg:order-none lg:mt-0 lg:absolute lg:bottom-0 lg:right-0 lg:top-24 lg:z-20 lg:aspect-auto lg:w-[56%]">
          <HeroSlider slides={heroSlides} />
        </div>
      </section>

      <ProjectShowcase projects={showcase} total={projects.length} />

      {/* Philosophy: continues the showcase's white band */}
      <section className="section bg-paper !pt-0">
        <Reveal className="container-site mx-auto max-w-4xl text-center">
          <p className="eyebrow">Our philosophy</p>
          <p className="mt-6 text-balance font-display text-[clamp(1.6rem,1.1rem+1.6vw,2.6rem)] font-medium leading-[1.2] tracking-[-0.02em] text-ink">
            A safe place for kids to grow, room for parents to breathe, and a home the whole family loves. {site.tagline}.
          </p>
          <ButtonLink href="/about" variant="primary" className="mt-10 rounded-[var(--radius-md)]">
            Know more
          </ButtonLink>
        </Reveal>
      </section>

      <TrustStats stats={site.highlights} image={siteImages.interior} />

      <ResidentReviews />
    </>
  );
}
