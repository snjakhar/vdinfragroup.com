import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { MediaImg } from "@/components/ui/media-image";
import { Tag } from "@/components/ui/tag";
import { altFor, placeName, startingPrice, type ProjectView } from "@/lib/content/projects";
import { cn } from "@/lib/cn";

/** Configurations as a short line, e.g. "3 & 4 BHK Apartments". */
export function configSummary(p: ProjectView) {
  // "3 BHK (flats 101, 105)", "5 BHK Kothi" -> "3 BHK", "5 BHK"; then join unique numbers.
  const bhk = [...new Set(p.configurations.map((c) => c.type.match(/(\d+)\s*BHK/)?.[1]).filter(Boolean))].sort();
  return `${bhk.length ? `${bhk.join(" & ")} BHK ` : ""}${p.propertyTypeLabels.join(" & ")}`;
}

export function ProjectCard({
  project,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  priority,
  className,
}: {
  project: ProjectView;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const price = startingPrice(project);
  return (
    <Link href={`/projects/${project.slug}`} className={cn("group block", className)}>
      <div className="relative aspect-[4/5] overflow-hidden bg-sand">
        <MediaImg
          image={project.media.hero}
          alt={altFor(project, project.media.hero)}
          sizes={sizes}
          priority={priority}
          className="transition-transform duration-[1.4s] ease-premium group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-night/45 via-transparent to-transparent opacity-80 transition-opacity duration-700 group-hover:opacity-100" />
        <Tag className="absolute left-4 top-4">{project.statusLabel}</Tag>
        {project.media.hero.impression && (
          <span className="absolute bottom-3 left-4 text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-ivory/90 [text-shadow:0_1px_4px_rgba(0,0,0,.6)]">
            Artist&rsquo;s impression
          </span>
        )}
        <span className="absolute bottom-4 right-4 flex size-11 items-center justify-center rounded-full bg-ivory text-ink opacity-0 transition-all duration-500 ease-premium group-hover:opacity-100 max-lg:opacity-100">
          <ArrowUpRight className="size-5" strokeWidth={1.5} />
        </span>
      </div>
      <div className="pt-5">
        <p className="flex items-center gap-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted">
          <MapPin aria-hidden className="size-3.5 text-brass" strokeWidth={1.75} />
          {placeName(project)}
        </p>
        <h3 className="mt-2 font-[family-name:var(--font-display)] text-[1.9rem] leading-tight transition-colors duration-300 group-hover:text-brass-deep">
          {project.title}
        </h3>
        <p className="mt-1.5 text-sm text-muted">
          {configSummary(project)}
          {price && <span className="text-ink"> · {price}</span>}
        </p>
      </div>
    </Link>
  );
}
