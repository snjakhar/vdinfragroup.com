import Link from "next/link";
import { STATUS_META, STATUS_ORDER, getAllProjects, getProjectsByStatus } from "@/lib/content/projects";
import type { ProjectStatus } from "@/lib/content/schema";
import { cn } from "@/lib/cn";

/** Status filter as real links (each category is its own static, indexable page). */
export function CategoryTabs({ active }: { active: ProjectStatus | "all" }) {
  const tabs = [
    { key: "all", href: "/projects", label: "All", count: getAllProjects().length },
    ...STATUS_ORDER.map((s) => ({ key: s, href: `/projects/${s}`, label: STATUS_META[s].label, count: getProjectsByStatus(s).length })),
  ];
  return (
    <nav aria-label="Project status" className="no-scrollbar -mx-5 overflow-x-auto px-5">
      <ul className="flex min-w-max gap-8 border-b border-sand">
        {tabs.map((t) => (
          <li key={t.key}>
            <Link
              href={t.href}
              aria-current={active === t.key ? "page" : undefined}
              className={cn(
                "relative block pb-4 text-[0.78rem] font-semibold uppercase tracking-[0.16em] transition-colors after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:origin-left after:bg-ink after:transition-transform after:duration-500 after:ease-premium",
                active === t.key ? "text-ink after:scale-x-100" : "text-muted after:scale-x-0 hover:text-ink",
              )}
            >
              {t.label} <span className="ml-1 text-muted tabular-nums">{t.count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
