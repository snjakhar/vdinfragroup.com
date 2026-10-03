import Link from "next/link";
import { MediaImg } from "@/components/ui/media-image";
import { categoryTitle, formatDate } from "@/lib/content/blog";
import type { BlogPost } from "@/lib/content/schema";
import { cn } from "@/lib/cn";

export function PostCard({
  post,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  headingLevel = "h3",
  className,
}: {
  post: BlogPost;
  sizes?: string;
  headingLevel?: "h2" | "h3";
  className?: string;
}) {
  const H = headingLevel;
  return (
    <article className={cn("group", className)}>
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative aspect-[3/2] overflow-hidden bg-sand">
          <MediaImg
            image={post.image}
            alt={post.image.alt ?? post.title}
            sizes={sizes}
            className="transition-transform duration-[1.2s] ease-premium group-hover:scale-105"
          />
        </div>
        <p className="mt-5 text-label font-semibold uppercase tracking-label text-brass-deep">
          {categoryTitle(post.category)}
          <span className="text-muted"> · {post.readingMinutes} min read</span>
        </p>
        <H className="mt-2 font-[family-name:var(--font-display)] text-[1.7rem] leading-snug transition-colors duration-300 group-hover:text-brass-deep">
          {post.title}
        </H>
        <p className="mt-2 line-clamp-2 text-sm text-muted">{post.excerpt}</p>
        <p className="mt-3 text-xs text-muted">
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
        </p>
      </Link>
    </article>
  );
}
