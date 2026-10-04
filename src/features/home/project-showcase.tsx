import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { RuledEyebrow } from "@/components/ui/heading";
import { MediaImg } from "@/components/ui/media-image";
import { Reveal } from "@/components/motion/reveal";
import { altFor, cardImage, type ProjectView } from "@/lib/content/projects";

/**
 * Home page project showcase: large rounded photo cards, two per row, with the
 * status in a gold tab at the top-left and the name over the photo.
 */
export function ProjectShowcase({ projects, total }: { projects: ProjectView[]; total: number }) {
  return (
    <section className="section bg-paper">
      <div className="container-site">
        <RuledEyebrow>Our projects</RuledEyebrow>
        <div className="mt-8 flex flex-col justify-between gap-8 md:flex-row md:items-start">
          <h2 className="t-h2 max-w-3xl text-balance text-ink">Landmark homes across Jaipur</h2>
          <ButtonLink href="/projects" variant="accent" arrow className="shrink-0 rounded-[var(--radius-md)]">
            Explore all {total} projects
          </ButtonLink>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:mt-16 lg:gap-8">
          {projects.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 2) * 0.1}>
              <ShowcaseCard project={p} priority={i < 2} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ShowcaseCard({ project, priority }: { project: ProjectView; priority?: boolean }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      data-touch-zoom
      className="group relative block aspect-[4/5] overflow-hidden rounded-3xl bg-night text-ivory sm:aspect-[4/3]"
    >
      <MediaImg
        image={cardImage(project)}
        alt={altFor(project, project.media.hero)}
        sizes="(min-width: 768px) 50vw, 100vw"
        priority={priority}
        className="transition-transform duration-[1.4s] ease-premium group-hover:scale-105 group-data-[touched]:scale-105 group-data-[touched]:duration-500"
      />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-night/75 to-transparent" />
      <span className="absolute left-0 top-0 bg-brass px-4 py-2 text-label font-semibold uppercase tracking-label text-night">
        {project.statusLabel}
      </span>
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 sm:p-8">
        <div className="min-w-0">
          <h3 className="font-display text-2xl font-medium tracking-tight lg:text-[1.75rem]">{project.title}</h3>
          {/* Area only (e.g. "Chordia City"): the full address lives on the project page. */}
          <p className="mt-1 text-sm text-ivory/80">{project.location.locality.split(",")[0]}</p>
        </div>
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-ivory/15 ring-1 ring-ivory/40 backdrop-blur-sm transition-colors duration-300 group-hover:bg-brass group-hover:text-night group-hover:ring-brass">
          <ArrowRight aria-hidden className="size-4" strokeWidth={1.75} />
        </span>
      </div>
    </Link>
  );
}
