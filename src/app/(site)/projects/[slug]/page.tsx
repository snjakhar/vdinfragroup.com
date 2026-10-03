import { notFound } from "next/navigation";
import Link from "next/link";
import { Download, MapPin } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/heading";
import { MediaImg } from "@/components/ui/media-image";
import { Reveal } from "@/components/motion/reveal";
import { AmenityIcon } from "@/features/projects/amenity-icon";
import { FaqList } from "@/features/projects/faq-list";
import { FloorPlans } from "@/features/projects/floor-plans";
import { LocationMap } from "@/features/projects/location-map";
import { ProjectCard, configSummary } from "@/features/projects/project-card";
import { ProjectGallery } from "@/features/projects/project-gallery";
import { SectionNav } from "@/features/projects/section-nav";
import { Specifications } from "@/features/projects/specifications";
import { StatusTag } from "@/features/projects/status-tag";
import { TrackedLink } from "@/features/leads/tracked-link";
import { STATUS_META, altFor, getAllProjects, getProject, getRelatedProjects, placeName, startingPrice } from "@/lib/content/projects";
import { MEDIA_BASE_URL } from "@/lib/images/presets";
import { JsonLd, breadcrumbLd, faqLd, projectLd } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return buildMetadata({
    title: p.seo?.title ?? `${p.title}: ${configSummary(p)} in ${placeName(p)}`,
    description: p.seo?.description ?? p.summary,
    path: `/projects/${p.slug}`,
    image: { ...p.media.hero, alt: altFor(p, p.media.hero) },
    noIndex: p.seo?.noIndex,
  });
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();

  const related = getRelatedProjects(p);
  const fromPrice = startingPrice(p);
  const completed = p.status === "completed";
  const showCarpet = p.configurations.some((c) => c.carpetArea);
  const galleryItems = [p.media.hero, ...p.media.gallery].map((image) => ({ image, alt: altFor(p, image), caption: image.caption }));
  const sections = [
    { id: "overview", label: "Overview" },
    ...(p.media.gallery.length > 0 ? [{ id: "gallery", label: "Gallery" }] : []),
    ...(p.configurations.length ? [{ id: "configurations", label: "Configurations" }] : []),
    ...(p.media.floorPlans.length ? [{ id: "floor-plans", label: "Floor plans" }] : []),
    ...(p.amenityList.length ? [{ id: "amenities", label: "Amenities" }] : []),
    ...(p.specifications.length ? [{ id: "specifications", label: "Specifications" }] : []),
    { id: "location", label: "Location" },
    ...(p.faqs.length ? [{ id: "faqs", label: "FAQs" }] : []),
    { id: "enquire", label: "Enquire" },
  ];
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Projects", path: "/projects" },
    { name: STATUS_META[p.status].label, path: `/projects/${p.status}` },
    { name: p.title, path: `/projects/${p.slug}` },
  ];

  const facts = [
    { label: "Configurations", value: configSummary(p) },
    { label: p.status === "completed" ? "Status" : "Starting price", value: p.status === "completed" ? "Completed" : fromPrice ?? "Price on request" },
    {
      label: p.status === "completed" ? "Handed over" : "Possession",
      value: p.status === "completed" ? String(p.completedYear ?? "Delivered") : p.possession ?? "On request",
    },
  ];

  return (
    <>
      <JsonLd data={[projectLd(p), breadcrumbLd(crumbs), ...(p.faqs.length ? [faqLd(p.faqs)] : [])]} />

      {/* Hero */}
      <section className="relative flex min-h-[88svh] items-end overflow-hidden bg-night text-ivory">
        <div className="hero-zoom absolute inset-0">
          <MediaImg image={p.media.hero} alt={altFor(p, p.media.hero)} sizes="100vw" priority />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-night/90 via-night/30 to-night/25" />
        {p.media.hero.impression && (
          <p className="absolute right-4 top-24 z-10 bg-night/60 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-ivory/85 backdrop-blur-sm lg:top-28">
            Artist&rsquo;s impression
          </p>
        )}
        <div className="container-site relative grid gap-10 pb-12 pt-40 lg:grid-cols-12 lg:items-end lg:pb-16">
          <div className="lg:col-span-7">
            <nav aria-label="Breadcrumb" className="hero-rise mb-6 text-xs text-ivory/70">
              <ol className="flex flex-wrap gap-2">
                {crumbs.slice(0, -1).map((c) => (
                  <li key={c.path} className="flex gap-2">
                    <Link href={c.path} className="hover:text-ivory">
                      {c.name}
                    </Link>
                    <span aria-hidden>/</span>
                  </li>
                ))}
              </ol>
            </nav>
            <StatusTag status={p.status} label={p.statusLabel} className="hero-rise" />
            <h1 className="t-display hero-slide mt-5" style={{ animationDelay: "0.1s" }}>
              {p.title}
            </h1>
            <p className="hero-rise mt-5 max-w-xl text-lg text-ivory/85" style={{ animationDelay: "0.2s" }}>
              {p.tagline}
            </p>
            <p className="hero-rise mt-4 flex items-center gap-2 text-sm text-ivory/75" style={{ animationDelay: "0.25s" }}>
              <MapPin aria-hidden className="size-4 text-brass" strokeWidth={1.5} /> {p.location.address}
            </p>
          </div>
          <dl className="hero-rise grid grid-cols-3 border-t border-ivory/25 lg:col-span-5 lg:grid-cols-1 lg:border-l lg:border-t-0 lg:pl-10" style={{ animationDelay: "0.35s" }}>
            {facts.map((f) => (
              <div key={f.label} className="py-4 pr-3 lg:py-3">
                <dt className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-ivory/60">{f.label}</dt>
                <dd className="mt-1 font-[family-name:var(--font-display)] text-lg leading-snug sm:text-2xl">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <SectionNav sections={sections} />

      {/* Overview */}
      <section id="overview" className="section scroll-mt-40">
        <div className="container-site grid gap-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <SectionHeading eyebrow="Overview" title={p.summary} level="h2" className="!max-w-none [&_h2]:!text-[clamp(1.8rem,1.4rem+1.5vw,2.75rem)]" />
            <div className="mt-8 space-y-5 text-[1.0625rem] leading-relaxed text-muted">
              {p.description.map((para) => (
                <p key={para.slice(0, 24)}>{para}</p>
              ))}
            </div>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="#enquire" arrow>
                {p.status === "upcoming" ? "Register interest" : completed ? "Enquire about similar homes" : "Book a site visit"}
              </ButtonLink>
              {p.media.brochure ? (
                <TrackedLink
                  href={`${MEDIA_BASE_URL}/${p.media.brochure}`}
                  event="brochure_download"
                  params={{ project: p.slug }}
                  className="inline-flex items-center justify-center gap-3 border border-ink/80 px-7 py-[0.95rem] text-[0.78rem] font-semibold uppercase tracking-[0.16em] transition-colors hover:bg-ink hover:text-ivory"
                >
                  <Download className="size-4" strokeWidth={1.5} /> Download brochure
                </TrackedLink>
              ) : completed ? null : (
                <ButtonLink href="#enquire" variant="outline">
                  <Download className="size-4" strokeWidth={1.5} /> Request brochure
                </ButtonLink>
              )}
            </div>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-4 lg:col-start-9">
            {p.highlights.length > 0 && (
              <>
                <h3 className="eyebrow">Highlights</h3>
                <ul className="mt-5 border-t border-sand">
                  {p.highlights.map((h) => (
                    <li key={h} className="flex gap-4 border-b border-sand py-4">
                      <span aria-hidden className="mt-3 h-px w-4 shrink-0 bg-brass" />
                      {h}
                    </li>
                  ))}
                </ul>
              </>
            )}
            {p.rera && (
              <p className="mt-6 text-xs text-muted">
                RERA registration: <span className="font-semibold text-ink">{p.rera}</span>
                <br />
                Verify on the Rajasthan RERA portal (rera.rajasthan.gov.in).
              </p>
            )}
          </Reveal>
        </div>
        {p.stats.length > 0 && (
          <div className="container-site mt-16">
            <dl className="grid grid-cols-2 border-y border-sand md:grid-cols-4">
              {p.stats.map((s, i) => (
                <div key={s.label} className={`py-7 ${i % 2 ? "border-l border-sand pl-6" : "pr-4"} md:border-l md:pl-8 md:first:border-l-0 md:first:pl-0`}>
                  <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">{s.label}</dt>
                  <dd className="mt-2 font-[family-name:var(--font-display)] text-3xl lg:text-4xl">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </section>

      {/* Gallery */}
      {p.media.gallery.length > 0 && (
        <section id="gallery" className="scroll-mt-40 pb-20 lg:pb-32">
          <div className="container-site">
            <SectionHeading eyebrow="Gallery" title="A closer look" className="mb-10" />
            <ProjectGallery items={galleryItems} />
          </div>
        </section>
      )}

      {/* Configurations */}
      {p.configurations.length > 0 && (
        <section id="configurations" className="section scroll-mt-40 bg-paper">
          <div className="container-site">
            <SectionHeading
              eyebrow="Configurations"
              title={completed ? "Homes" : "Homes and prices"}
              lead={completed ? undefined : "Prices are indicative and exclude registration and statutory charges."}
            />
            <div className="mt-12 overflow-x-auto">
              <table className="w-full min-w-[36rem] border-collapse text-left">
                <thead>
                  <tr className="border-b border-ink text-[0.68rem] uppercase tracking-[0.16em] text-muted">
                    <th scope="col" className="py-4 pr-4 font-semibold">Type</th>
                    {showCarpet && (
                      <th scope="col" className="py-4 pr-4 font-semibold">
                        {p.configurations.every((c) => !c.carpetArea || /plot/i.test(c.carpetArea)) ? "Plot" : "Carpet area"}
                      </th>
                    )}
                    <th scope="col" className="py-4 pr-4 font-semibold">Super area</th>
                    <th scope="col" className="py-4 pr-4 font-semibold">Price</th>
                    <th scope="col" className="py-4 font-semibold">Availability</th>
                  </tr>
                </thead>
                <tbody>
                  {p.configurations.map((c) => (
                    <tr key={c.type} className="border-b border-sand">
                      <th scope="row" className="py-5 pr-4 font-[family-name:var(--font-display)] text-2xl font-medium">
                        {c.type}
                      </th>
                      {showCarpet && <td className="py-5 pr-4">{c.carpetArea ?? "-"}</td>}
                      <td className="py-5 pr-4">{c.superArea ?? "-"}</td>
                      <td className="py-5 pr-4 font-semibold">{c.price}</td>
                      <td className="py-5 text-muted">{c.availability ?? "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Floor plans */}
      {p.media.floorPlans.length > 0 && (
        <section id="floor-plans" className="section scroll-mt-40">
          <div className="container-site">
            <SectionHeading eyebrow="Floor plans" title="Layouts planned for real life" className="mb-10" />
            <FloorPlans plans={p.media.floorPlans} projectTitle={p.title} />
          </div>
        </section>
      )}

      {/* Amenities */}
      {p.amenityList.length > 0 && (
        <section id="amenities" className="section scroll-mt-40 bg-night text-ivory">
          <div className="container-site">
            <SectionHeading eyebrow="Amenities" title="Everything within the gates" tone="light" />
            <ul className="mt-14 grid grid-cols-2 border-l border-t border-ivory/15 sm:grid-cols-3 lg:grid-cols-4">
              {p.amenityList.map((a) => (
                <li key={a.id} className="flex flex-col gap-5 border-b border-r border-ivory/15 p-6 lg:p-8">
                  <AmenityIcon name={a.icon} className="size-8 text-brass" />
                  <span className="text-[0.95rem]">{a.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Specifications */}
      {p.specifications.length > 0 && (
        <section id="specifications" className="section scroll-mt-40">
          <div className="container-site grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionHeading eyebrow="Specifications" title="What goes into your home" />
            </div>
            <div className="lg:col-span-7 lg:col-start-6">
              <Specifications specs={p.specifications} />
            </div>
          </div>
        </section>
      )}

      {/* Location */}
      <section id="location" className="section scroll-mt-40 bg-paper">
        <div className="container-site grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="Location" title={placeName(p)} lead={p.location.address !== placeName(p) ? p.location.address : undefined} />
            {p.location.nearby.length > 0 && (
              <ul className="mt-10 border-t border-sand">
                {p.location.nearby.map((n) => (
                  <li key={n.name} className="flex items-baseline justify-between gap-6 border-b border-sand py-4">
                    <span>{n.name}</span>
                    {n.distance && <span className="shrink-0 font-[family-name:var(--font-display)] text-xl text-brass-deep">{n.distance}</span>}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="lg:col-span-7">
            <LocationMap lat={p.location.lat} lng={p.location.lng} query={`${p.location.address}, ${p.location.city}`} label={p.title} />
          </div>
        </div>
      </section>

      {/* FAQs */}
      {p.faqs.length > 0 && (
        <section id="faqs" className="section scroll-mt-40">
          <div className="container-site grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionHeading eyebrow="FAQs" title="Common questions" />
            </div>
            <div className="lg:col-span-7 lg:col-start-6">
              <FaqList faqs={p.faqs} />
            </div>
          </div>
        </section>
      )}

      {/* Related */}
      {related.length > 0 && (
        <section className="section border-t border-sand bg-paper">
          <div className="container-site">
            <SectionHeading eyebrow="You may also like" title="More from VD Infra Group" />
            <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <ProjectCard key={r.slug} project={r} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
