import Link from "next/link";
import { SectionHeading } from "@/components/ui/heading";
import { Reveal } from "@/components/motion/reveal";
import { STATUS_META, STATUS_ORDER, getAllProjects, getProjectsByStatus } from "@/lib/content/projects";
import type { ProjectStatus } from "@/lib/content/schema";
import { JsonLd, breadcrumbLd, itemListLd } from "@/lib/seo/json-ld";
import { CategoryTabs } from "./category-tabs";
import { ProjectCard } from "./project-card";

/** Shared body of /projects and the three status pages. */
export function ProjectListing({ status }: { status: ProjectStatus | "all" }) {
  const projects = status === "all" ? getAllProjects() : getProjectsByStatus(status);
  const title = status === "all" ? "Our projects" : STATUS_META[status].title;
  const lead =
    status === "all"
      ? "Apartments, villas and communities across Jaipur: ready to move, upcoming and completed."
      : STATUS_META[status].description;
  const path = status === "all" ? "/projects" : `/projects/${status}`;
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Projects", path: "/projects" },
    ...(status === "all" ? [] : [{ name: STATUS_META[status].label, path }]),
  ];

  // On "All", group projects by status so each group reads as its own section.
  const groups = status === "all" ? STATUS_ORDER.map((s) => ({ status: s, items: getProjectsByStatus(s) })) : [{ status, items: projects }];

  return (
    <>
      <JsonLd data={[breadcrumbLd(crumbs), itemListLd(title, projects)]} />
      <section className="pb-10 pt-36 lg:pt-48">
        <div className="container-site">
          <nav aria-label="Breadcrumb" className="mb-8 text-xs text-muted">
            <ol className="flex gap-2">
              {crumbs.map((c, i) => (
                <li key={c.path} className="flex gap-2">
                  {i > 0 && <span aria-hidden>/</span>}
                  {i < crumbs.length - 1 ? (
                    <Link href={c.path} className="hover:text-ink">
                      {c.name}
                    </Link>
                  ) : (
                    <span aria-current="page">{c.name}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
          <SectionHeading level="h1" eyebrow="Projects" title={title} lead={lead} />
          <div className="mt-14">
            <CategoryTabs active={status} />
          </div>
        </div>
      </section>
      <section className="pb-24 lg:pb-36">
        <div className="container-site space-y-20">
          {groups.map((g) =>
            g.items.length === 0 ? null : (
              <div key={g.status}>
                {status === "all" && (
                  <div className="mb-10 flex items-baseline justify-between gap-6 border-b border-sand pb-4">
                    <h2 className="t-h3">{STATUS_META[g.status as ProjectStatus].label}</h2>
                    <Link href={`/projects/${g.status}`} className="text-label-md font-semibold uppercase tracking-label text-muted hover:text-ink">
                      View {g.items.length}
                    </Link>
                  </div>
                )}
                <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                  {g.items.map((p, i) => {
                    // The first row is above the fold: render it immediately (no reveal) for a fast LCP.
                    const aboveFold = i < 3 && g === groups[0];
                    return aboveFold ? (
                      <ProjectCard key={p.slug} project={p} priority />
                    ) : (
                      <Reveal key={p.slug} delay={(i % 3) * 0.08}>
                        <ProjectCard project={p} />
                      </Reveal>
                    );
                  })}
                </div>
              </div>
            ),
          )}
          {projects.length === 0 && <p className="text-muted">New projects in this category will be announced soon.</p>}
        </div>
      </section>
    </>
  );
}
