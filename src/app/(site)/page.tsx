import Link from "next/link";
import { ArrowUpRight, Phone } from "lucide-react";
import { site } from "@content/site";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/heading";
import { MediaImg } from "@/components/ui/media-image";
import { ImageReveal, Reveal } from "@/components/motion/reveal";
import { PostCard } from "@/features/blog/post-card";
import { HeroSlider, type HeroSlide } from "@/features/home/hero-slider";
import { ProjectCard } from "@/features/projects/project-card";
import { LocationMap } from "@/features/projects/location-map";
import { getAllPosts } from "@/lib/content/blog";
import { STATUS_META, STATUS_ORDER, altFor, cardImage, getAllProjects, getFeaturedProjects, getProject, getProjectsByStatus } from "@/lib/content/projects";
import { siteImages } from "@/lib/content/site-images";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({ path: "/", image: siteImages.homeHero });

const PILLARS = [
  {
    title: "Built to outlast",
    body: "Earthquake-resistant RCC structures and branded materials throughout. We build every home as if we will live there ourselves.",
  },
  {
    title: "Finished to the last detail",
    body: "From modular kitchens and Jaguar fittings to lighting and wardrobes, our homes are handed over complete, so families can move straight in.",
  },
  {
    title: "Transparent at every step",
    body: "RERA-registered and JDA-approved projects, clear agreements and straightforward pricing, so you always know where your home stands.",
  },
  {
    title: "Designed for Jaipur",
    body: "Layouts planned for cross ventilation, deep balconies against the summer sun and materials that suit Rajasthan's climate.",
  },
];

export default async function HomePage() {
  const projects = getAllProjects();
  const featured = getFeaturedProjects().slice(0, 3);
  const posts = (await getAllPosts()).slice(0, 3);
  const visit = getProject("sky-elegant");
  // Hero: current projects with an AI front image, upcoming first (KK 176 leads).
  const heroOrder = ["krishnam-kothi-176", "sky-elegant", "krishnam-kothi-jagatpura"];
  const heroSlides: HeroSlide[] = projects
    .filter((p) => p.status !== "completed" && p.media.hero.impression)
    .sort((a, b) => (heroOrder.indexOf(a.slug) + 99) % 99 - ((heroOrder.indexOf(b.slug) + 99) % 99))
    .map((p) => ({ image: p.media.heroSquare ?? p.media.hero, alt: altFor(p, p.media.hero), title: p.title, status: p.statusLabel, href: `/projects/${p.slug}` }));
  const galleryStrip = projects.flatMap((p) => p.media.gallery.slice(0, 1).map((img) => ({ img, project: p }))).slice(0, 8);

  return (
    <>
      {/* Hero: text on ivory, image on its own panel (no text over the building) */}
      <section className="relative flex flex-col overflow-hidden bg-ivory lg:block lg:h-[100svh] lg:min-h-[640px]">
        <div className="container-site relative z-10 grid lg:h-full lg:grid-cols-12">
          <div className="flex flex-col justify-center pb-12 pt-10 sm:pt-14 lg:col-span-5 lg:pb-8 lg:pr-10 lg:pt-28">
            <p className="eyebrow hero-rise" style={{ animationDelay: "0.1s" }}>
              VD Infra Group · Jaipur
            </p>
            <h1 className="hero-slide mt-5 text-balance font-[family-name:var(--font-display)] text-[clamp(2.6rem,1.2rem+3.4vw,5rem)] font-medium leading-[1.02] tracking-[-0.015em] text-ink" style={{ animationDelay: "0.2s" }}>
              Where dreams rise <span className="text-brass-deep">as landmarks</span>
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
                  <span className="block font-[family-name:var(--font-display)] text-3xl leading-none text-ink">
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
        <div className="relative order-first mt-20 aspect-[4/3] w-full sm:aspect-[5/4] lg:order-none lg:mt-0 lg:absolute lg:bottom-0 lg:right-0 lg:top-24 lg:z-20 lg:aspect-auto lg:w-[56%]">
          <HeroSlider slides={heroSlides} />
        </div>
      </section>

      {/* Introduction + stats */}
      <section className="section">
        <div className="container-site">
          <div className="grid gap-10 lg:grid-cols-12">
            <Reveal className="lg:col-span-6">
              <SectionHeading eyebrow="About VD Infra Group" title="A Jaipur builder you can see in every street we build on" />
            </Reveal>
            <Reveal delay={0.1} className="lg:col-span-5 lg:col-start-8">
              <p className="t-lead">
                From the Krishnam Kothi luxury homes in Narayan Vihar to the Sky Crown and Sky Elegant apartments in Chordia City, we have delivered more than 50 projects across Jaipur. We plan every home around how families actually live: light, air, privacy and quality that lasts.
              </p>
              <ButtonLink href="/about" variant="text" arrow className="mt-6">
                Our story
              </ButtonLink>
            </Reveal>
          </div>
          <dl className="mt-16 grid grid-cols-2 border-t border-sand lg:mt-24 lg:grid-cols-4">
            {site.highlights.map((s, i) => (
              <Reveal
                key={s.label}
                delay={i * 0.08}
                className="border-b border-sand py-8 pr-4 even:border-l even:pl-6 lg:border-b-0 lg:border-l lg:pl-8 lg:first:border-l-0 lg:first:pl-0"
              >
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <span className="block font-[family-name:var(--font-display)] text-5xl text-ink lg:text-6xl">{s.value}</span>
                  <span className="mt-2 block text-sm text-muted">{s.label}</span>
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* Project categories */}
      <section className="section bg-paper">
        <div className="container-site">
          <SectionHeading eyebrow="Find your home" title="Explore by project status" align="center" />
          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {STATUS_ORDER.map((s, i) => {
              const cover = getProjectsByStatus(s)[0];
              return (
                <Reveal key={s} delay={i * 0.1}>
                  <Link href={`/projects/${s}`} className="group relative block aspect-[3/4] overflow-hidden bg-night text-ivory md:aspect-[3/4.4]">
                    {cover && (
                      <MediaImg
                        image={cardImage(cover)}
                        alt={altFor(cover, cover.media.hero)}
                        sizes="(min-width: 768px) 33vw, 100vw"
                        className="opacity-90 transition-transform duration-[1.4s] ease-premium group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-night/90 via-night/20 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-7 lg:p-9">
                      <p className="text-label font-semibold uppercase tracking-label text-ivory/70">
                        {String(getProjectsByStatus(s).length).padStart(2, "0")} projects
                      </p>
                      <h3 className="mt-2 font-[family-name:var(--font-display)] text-4xl">{STATUS_META[s].label}</h3>
                      <p className="mt-3 max-w-xs text-sm text-ivory/75 transition-all duration-500 ease-premium lg:translate-y-2 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
                        {STATUS_META[s].description}
                      </p>
                      <span className="mt-6 inline-flex items-center gap-2 text-label-md font-semibold uppercase tracking-label">
                        View projects <ArrowUpRight className="size-4" strokeWidth={1.5} />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured projects */}
      <section className="section">
        <div className="container-site">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <SectionHeading eyebrow="Featured projects" title="Homes worth coming home to" lead="A selection of our ready-to-move, upcoming and signature communities." />
            <ButtonLink href="/projects" variant="outline" arrow className="shrink-0">
              All {projects.length} projects
            </ButtonLink>
          </div>
          <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.1}>
                <ProjectCard project={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="section bg-night text-ivory">
        <div className="container-site grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow="Why VD Infra Group"
              title="What we promise, we build"
              lead="Four commitments behind every home we hand over."
              tone="light"
            />
            <ImageReveal className="relative mt-12 hidden aspect-[4/5] overflow-hidden lg:block">
              <MediaImg image={siteImages.construction} alt={siteImages.construction.alt ?? ""} sizes="40vw" />
            </ImageReveal>
          </div>
          <ol className="lg:col-span-6 lg:col-start-7 lg:pt-4">
            {PILLARS.map((p, i) => (
              <Reveal as="li" key={p.title} delay={i * 0.06} className="grid grid-cols-[3.5rem_1fr] gap-4 border-t border-ivory/15 py-9 lg:py-11">
                  <span className="font-[family-name:var(--font-display)] text-2xl text-brass">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-[family-name:var(--font-display)] text-3xl">{p.title}</h3>
                    <p className="mt-3 max-w-lg text-mist">{p.body}</p>
                  </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Highlight band */}
      <section className="relative overflow-hidden bg-night text-ivory">
        <div className="absolute inset-0">
          <MediaImg image={siteImages.interior} alt="" sizes="100vw" className="opacity-60" />
          <div className="absolute inset-0 bg-night/45" />
        </div>
        <div className="container-site relative py-28 text-center lg:py-44">
          <Reveal>
            <p className="eyebrow !text-ivory/80">Craftsmanship</p>
            <p className="t-h2 mx-auto mt-6 max-w-4xl text-balance">
              Every detail, from the foundation to the door handle, chosen to last a lifetime.
            </p>
            <p className="mt-8 text-sm uppercase tracking-label text-ivory/70">{site.tagline}</p>
          </Reveal>
        </div>
      </section>

      {/* Gallery strip */}
      <section className="section overflow-hidden">
        <div className="container-site flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading eyebrow="Gallery" title="Inside our homes" />
          <ButtonLink href="/gallery" variant="outline" arrow className="shrink-0">
            View gallery
          </ButtonLink>
        </div>
        <div className="no-scrollbar mt-14 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 md:snap-none md:px-10 xl:px-[max(2.5rem,calc((100vw_-_80rem)/2_+_2.5rem))]">
          {galleryStrip.map(({ img, project }, i) => (
            <Link
              key={`${img.src}-${i}`}
              href={`/projects/${project.slug}`}
              className={`group relative shrink-0 snap-start overflow-hidden bg-sand ${i % 3 === 0 ? "aspect-[4/5] w-[70vw] md:w-[28rem]" : "aspect-[4/5] w-[60vw] md:w-[22rem]"}`}
            >
              <MediaImg image={img} alt={altFor(project, img)} sizes="(min-width: 768px) 448px, 70vw" className="transition-transform duration-[1.2s] ease-premium group-hover:scale-105" />
              <span className="absolute bottom-0 left-0 bg-ivory/95 px-4 py-2 text-label font-semibold uppercase tracking-label opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                {project.title}
              </span>
            </Link>
          ))}
        </div>
      </section>


      {/* Latest blogs */}
      <section className="section">
        <div className="container-site">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <SectionHeading eyebrow="Insights" title="From the blog" lead="Guides to buying a home in Jaipur, from localities to loans." />
            <ButtonLink href="/blog" variant="outline" arrow className="shrink-0">
              All articles
            </ButtonLink>
          </div>
          <div className="mt-14 grid gap-x-8 gap-y-12 md:grid-cols-3">
            {posts.map((post, i) => (
              <Reveal key={post.slug} delay={i * 0.08}>
                <PostCard post={post} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Site visit (current project, not an office address) */}
      {visit && (
        <section className="section bg-paper">
          <div className="container-site grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionHeading eyebrow="Visit us" title={`See a finished home at ${visit.title}`} lead={`Walk through a ready-to-move apartment in ${visit.location.locality} and meet the team behind your home.`} />
              <ul className="mt-10 space-y-5 text-sm">
                <li className="flex gap-4">
                  <Phone aria-hidden className="size-5 shrink-0 text-brass-deep" strokeWidth={1.5} />
                  <a href={site.phoneHref} className="hover:text-brass-deep">
                    {site.phone}
                  </a>
                </li>
              </ul>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="#enquire" arrow>
                  Book a site visit
                </ButtonLink>
                <ButtonLink href={`/projects/${visit.slug}`} variant="outline">
                  View {visit.title}
                </ButtonLink>
              </div>
            </div>
            <div className="lg:col-span-7">
              <LocationMap lat={visit.location.lat} lng={visit.location.lng} query={`${visit.location.address}, ${visit.location.city}`} label={visit.title} />
            </div>
          </div>
        </section>
      )}
    </>
  );
}
