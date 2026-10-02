import fs from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";
import Link from "next/link";
import { authors } from "@content/shared/catalog";
import { MediaImg } from "@/components/ui/media-image";
import { PostCard } from "@/features/blog/post-card";
import { ProjectCard } from "@/features/projects/project-card";
import { categoryTitle, formatDate, getAllPosts, getPost, getPostComponent, getRelatedPosts } from "@/lib/content/blog";
import { getProject, type ProjectView } from "@/lib/content/projects";
import { slugify } from "@/lib/slugify";
import { JsonLd, blogPostingLd, breadcrumbLd } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getAllPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return buildMetadata({
    title: post.seo?.title ?? post.title,
    description: post.seo?.description ?? post.excerpt,
    path: `/blog/${slug}`,
    image: post.image,
    type: "article",
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
    noIndex: post.seo?.noIndex,
  });
}

/** Table of contents from the post's "## " headings. */
function headings(slug: string) {
  const source = fs.readFileSync(path.join(process.cwd(), "content/blog", `${slug}.mdx`), "utf8");
  return [...source.matchAll(/^## (.+)$/gm)].map((m) => ({ title: m[1].trim(), id: slugify(m[1].trim()) }));
}

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  const Body = await getPostComponent(slug);
  const related = await getRelatedPosts(post);
  const relatedProjects = post.relatedProjects.map(getProject).filter((p): p is ProjectView => Boolean(p));
  const author = authors[post.author as keyof typeof authors] ?? authors["editorial-team"];
  const toc = headings(slug);

  return (
    <>
      <JsonLd
        data={[
          blogPostingLd(post, author.name),
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${slug}` },
          ]),
        ]}
      />
      <article>
        <header className="pb-12 pt-36 lg:pt-48">
          <div className="container-site max-w-4xl text-center">
            <Link href={`/blog/category/${post.category}`} className="eyebrow hover:text-brass-deep">
              {categoryTitle(post.category)}
            </Link>
            <h1 className="t-h1 mt-6 text-balance">{post.title}</h1>
            <p className="t-lead mx-auto mt-6 max-w-2xl">{post.excerpt}</p>
            <p className="mt-8 text-sm text-muted">
              {author.name} · <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time> · {post.readingMinutes} min read
              {post.updatedAt && (
                <>
                  {" "}
                  · Updated <time dateTime={post.updatedAt}>{formatDate(post.updatedAt)}</time>
                </>
              )}
            </p>
          </div>
        </header>
        <div className="container-site">
          <div className="relative aspect-[16/9] overflow-hidden bg-sand">
            <MediaImg image={post.image} alt={post.image.alt ?? post.title} sizes="(min-width: 1280px) 1200px, 100vw" priority />
          </div>
        </div>
        <div className="container-site grid gap-12 py-16 lg:grid-cols-12 lg:py-24">
          {toc.length > 2 && (
            <aside className="lg:col-span-3">
              <nav aria-label="In this article" className="lg:sticky lg:top-32">
                <p className="eyebrow mb-4">In this article</p>
                <ol className="space-y-3 border-l border-sand text-sm">
                  {toc.map((h) => (
                    <li key={h.id}>
                      <a href={`#${h.id}`} className="-ml-px block border-l border-transparent pl-4 text-muted transition-colors hover:border-brass hover:text-ink">
                        {h.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </aside>
          )}
          <div className={toc.length > 2 ? "lg:col-span-8 lg:col-start-5" : "mx-auto max-w-3xl lg:col-span-12"}>
            <div className="prose-vd max-w-[44rem]">
              <Body />
            </div>
            {post.tags.length > 0 && (
              <ul className="mt-12 flex flex-wrap gap-2 border-t border-sand pt-8">
                {post.tags.map((t) => (
                  <li key={t} className="border border-sand px-3 py-1.5 text-xs text-muted">
                    {t}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-10 border border-sand bg-paper p-6 text-sm">
              <p className="font-semibold">{author.name}</p>
              <p className="mt-1 text-muted">{author.bio}</p>
            </div>
          </div>
        </div>
      </article>

      {relatedProjects.length > 0 && (
        <section className="section bg-paper">
          <div className="container-site">
            <h2 className="t-h2">Projects mentioned</h2>
            <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProjects.map((p) => (
                <ProjectCard key={p.slug} project={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="section">
          <div className="container-site">
            <h2 className="t-h2">Keep reading</h2>
            <div className="mt-12 grid gap-x-8 gap-y-14 md:grid-cols-3">
              {related.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
