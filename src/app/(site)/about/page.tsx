import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/heading";
import { MediaImg } from "@/components/ui/media-image";
import { ImageReveal, Reveal } from "@/components/motion/reveal";
import { getAllProjects } from "@/lib/content/projects";
import { siteImages } from "@/lib/content/site-images";
import { JsonLd, breadcrumbLd } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "About Us: Builders of Luxury Homes in Jaipur",
  description: "VD Infra Group builds luxury kothis, villas and apartments across Jaipur. Learn about our story, values and how we build.",
  path: "/about",
  image: siteImages.aboutHero,
});

const VALUES = [
  { title: "Integrity", body: "RERA-registered and JDA-approved projects, clear agreements and straightforward pricing." },
  { title: "Craft", body: "Considered layouts, branded fittings and interiors finished to the last detail." },
  { title: "Care", body: "Homes handed over complete, many fully furnished, so families can move straight in." },
];

const PROCESS = [
  { title: "Land and approvals", body: "Clear-title land with JDA-approved plans, and RERA registration for our apartment projects." },
  { title: "Design", body: "Layouts planned for light, ventilation and privacy, with vastu-friendly planning where possible." },
  { title: "Construction", body: "Earthquake-resistant RCC structures and branded materials from names like Jaguar, Hindware and Asian Paints." },
  { title: "Handover", body: "Homes delivered finished, from modular kitchens to wardrobes and lighting, with documentation support." },
];


export default function AboutPage() {
  const projects = getAllProjects();
  const completed = projects.filter((p) => p.status === "completed").length;
  // Neighbourhoods we have built in, with project counts (from the project files).
  const areas = Object.entries(
    projects.reduce<Record<string, number>>((acc, p) => {
      const area = p.location.locality.split(",")[0].replace(/ \(.*\)$/, "");
      if (area !== "Jaipur") acc[area] = (acc[area] ?? 0) + 1;
      return acc;
    }, {}),
  ).sort((a, b) => b[1] - a[1]);
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "About", path: "/about" }])} />
      <section className="relative flex min-h-[78svh] items-end overflow-hidden bg-night text-ivory">
        <div className="hero-zoom absolute inset-0">
          <MediaImg image={siteImages.aboutHero} alt={siteImages.aboutHero.alt ?? ""} sizes="100vw" priority />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-night/90 via-night/40 to-night/30" />
        <div className="container-site relative pb-16 pt-40 lg:pb-24">
          <p className="eyebrow hero-rise !text-ivory/80">About us</p>
          <h1 className="t-display hero-slide mt-6 max-w-4xl text-balance" style={{ animationDelay: "0.1s" }}>
            Building Jaipur&rsquo;s homes, one promise at a time
          </h1>
        </div>
      </section>

      <section className="section">
        <div className="container-site grid gap-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <SectionHeading eyebrow="Our story" title={`${completed} projects delivered across Jaipur`} />
          </Reveal>
          <Reveal delay={0.1} className="space-y-6 text-[1.0625rem] leading-relaxed text-muted lg:col-span-6 lg:col-start-7">
            <p>
              VD Infra Group is a Jaipur developer of luxury independent homes, villas and apartments. Our Krishnam Kothi homes in Narayan Vihar are known for their
              complete, fully furnished interiors, with home theaters, private lifts and open-to-sky terraces.
            </p>
            <p>
              Alongside them we have built apartment communities such as Sky Crown and Sky Elegant in Chordia City, the Parth projects in Jagatpura and villa communities
              like Sky Villa on Ajmer Road.
            </p>
            <p>We remain a Jaipur company, rooted in the city and accountable to the families who live in the homes we build.</p>
          </Reveal>
        </div>
        <div className="container-site mt-16 grid gap-4 md:grid-cols-12">
          <ImageReveal className="relative aspect-[4/3] overflow-hidden md:col-span-7">
            <MediaImg image={siteImages.about} alt={siteImages.about.alt ?? ""} sizes="(min-width: 768px) 58vw, 100vw" />
          </ImageReveal>
          <ImageReveal className="relative aspect-[4/3] overflow-hidden md:col-span-5 md:aspect-auto">
            <MediaImg image={siteImages.team} alt={siteImages.team.alt ?? ""} sizes="(min-width: 768px) 42vw, 100vw" />
          </ImageReveal>
        </div>
      </section>

      <section className="section bg-paper">
        <div className="container-site">
          <SectionHeading eyebrow="Our values" title="What guides every decision" />
          <div className="mt-14 grid gap-px bg-sand md:grid-cols-3">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.08} className="bg-paper p-8 lg:p-12">
                <span className="font-[family-name:var(--font-display)] text-xl text-brass-deep">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-6 font-[family-name:var(--font-display)] text-4xl">{v.title}</h3>
                <p className="mt-4 text-muted">{v.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-night text-ivory">
        <div className="container-site">
          <SectionHeading eyebrow="How we build" title="From land to handover" tone="light" />
          <ol className="mt-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {PROCESS.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 0.08} className="border-t border-brass pt-6">
                  <span className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-brass">Step {i + 1}</span>
                  <h3 className="mt-3 font-[family-name:var(--font-display)] text-3xl">{s.title}</h3>
                  <p className="mt-3 text-mist">{s.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="container-site grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading eyebrow="Where we build" title="Across Jaipur" />
          </div>
          <ul className="lg:col-span-7 lg:col-start-6">
            {areas.map(([area, count], i) => (
              <Reveal as="li" key={area} delay={Math.min(i, 8) * 0.04} className="grid grid-cols-[1fr_auto] items-baseline gap-6 border-t border-sand py-5 last:border-b">
                <span className="text-lg">{area}</span>
                <span className="font-[family-name:var(--font-display)] text-2xl text-brass-deep">
                  {count} {count === 1 ? "project" : "projects"}
                </span>
              </Reveal>
            ))}
          </ul>
        </div>
        <div className="container-site mt-20 flex flex-col items-start gap-6 border-t border-sand pt-12 md:flex-row md:items-center md:justify-between">
          <p className="t-h3 max-w-xl">See the homes behind the story.</p>
          <ButtonLink href="/projects" arrow>
            Explore projects
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
