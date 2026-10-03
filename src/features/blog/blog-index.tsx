import Link from "next/link";
import { blogCategories, type BlogCategoryId } from "@content/shared/catalog";
import { SectionHeading } from "@/components/ui/heading";
import { MediaImg } from "@/components/ui/media-image";
import { Reveal } from "@/components/motion/reveal";
import { POSTS_PER_PAGE, categoryTitle, formatDate } from "@/lib/content/blog";
import type { BlogPost } from "@/lib/content/schema";
import { cn } from "@/lib/cn";
import { PostCard } from "./post-card";

/** Blog listing used by /blog, /blog/page/[n] and /blog/category/[slug]. */
export function BlogIndex({
  posts,
  page = 1,
  category,
}: {
  posts: BlogPost[];
  page?: number;
  category?: BlogCategoryId;
}) {
  const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
  const pagePosts = posts.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);
  const lead = category && page === 1 ? undefined : pagePosts[0];
  const showFeature = !category && page === 1 && lead;
  const rest = showFeature ? pagePosts.slice(1) : pagePosts;
  const pageHref = (n: number) => (n === 1 ? "/blog" : `/blog/page/${n}`);

  return (
    <section className="pb-24 pt-36 lg:pb-36 lg:pt-48">
      <div className="container-site">
        <SectionHeading
          level="h1"
          eyebrow={category ? "Blog category" : "Blog"}
          title={category ? blogCategories[category].title : "Insights on buying a home in Jaipur"}
          lead={category ? blogCategories[category].description : "Guides, locality reports and explainers from the VD Infra Group team."}
        />

        <nav aria-label="Blog categories" className="no-scrollbar -mx-5 mt-12 overflow-x-auto px-5">
          <ul className="flex min-w-max gap-2">
            {[{ id: "", title: "All" }, ...Object.entries(blogCategories).map(([id, c]) => ({ id, title: c.title }))].map((c) => {
              const active = (category ?? "") === c.id;
              return (
                <li key={c.id}>
                  <Link
                    href={c.id ? `/blog/category/${c.id}` : "/blog"}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "block border px-4 py-2.5 text-label font-semibold uppercase tracking-label transition-colors duration-300",
                      active ? "border-ink bg-ink text-ivory" : "border-sand text-muted hover:border-ink hover:text-ink",
                    )}
                  >
                    {c.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {showFeature && (
          <div className="mt-14">
            <Link href={`/blog/${lead.slug}`} className="group grid gap-8 border-b border-sand pb-14 lg:grid-cols-12 lg:items-center">
              <div className="relative aspect-[3/2] overflow-hidden bg-sand lg:col-span-7">
                <MediaImg image={lead.image} alt={lead.image.alt ?? lead.title} sizes="(min-width: 1024px) 58vw, 100vw" priority className="transition-transform duration-[1.2s] ease-premium group-hover:scale-105" />
              </div>
              <div className="lg:col-span-5">
                <p className="text-label font-semibold uppercase tracking-label text-brass-deep">
                  Latest · {categoryTitle(lead.category)}
                </p>
                <h2 className="t-h2 mt-4 transition-colors group-hover:text-brass-deep">{lead.title}</h2>
                <p className="t-lead mt-5">{lead.excerpt}</p>
                <p className="mt-6 text-xs text-muted">
                  <time dateTime={lead.publishedAt}>{formatDate(lead.publishedAt)}</time> · {lead.readingMinutes} min read
                </p>
              </div>
            </Link>
          </div>
        )}

        <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post, i) => (
            <Reveal key={post.slug} delay={(i % 3) * 0.08}>
              <PostCard post={post} headingLevel="h2" />
            </Reveal>
          ))}
        </div>
        {pagePosts.length === 0 && <p className="mt-14 text-muted">New articles in this category are on the way.</p>}

        {totalPages > 1 && (
          <nav aria-label="Pagination" className="mt-20 flex items-center justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <Link
                key={n}
                href={pageHref(n)}
                aria-current={n === page ? "page" : undefined}
                className={cn(
                  "flex size-11 items-center justify-center border text-sm tabular-nums transition-colors",
                  n === page ? "border-ink bg-ink text-ivory" : "border-sand hover:border-ink",
                )}
              >
                {n}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </section>
  );
}
