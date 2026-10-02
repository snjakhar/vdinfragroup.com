import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import { blogCategories, type BlogCategoryId } from "@content/shared/catalog";
import { blogMetaSchema, type BlogPost } from "./schema";

const BLOG_DIR = path.join(process.cwd(), "content/blog");
export const POSTS_PER_PAGE = 6;

function readingMinutes(source: string) {
  const words = source
    .replace(/^export const meta[\s\S]*?\n};?\n/m, "")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export function getPostSlugs() {
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

/** All posts, newest first. Each MDX file exports a `meta` object validated here. */
export const getAllPosts = cache(async (): Promise<BlogPost[]> => {
  const posts = await Promise.all(
    getPostSlugs().map(async (slug) => {
      const mod = await import(`@content/blog/${slug}.mdx`);
      const parsed = blogMetaSchema.safeParse(mod.meta);
      if (!parsed.success) throw new Error(`Invalid meta in content/blog/${slug}.mdx:\n${parsed.error.message}`);
      if (!(parsed.data.category in blogCategories)) {
        throw new Error(`content/blog/${slug}.mdx: unknown category "${parsed.data.category}"`);
      }
      const source = fs.readFileSync(path.join(BLOG_DIR, `${slug}.mdx`), "utf8");
      return { ...parsed.data, slug, readingMinutes: readingMinutes(source) };
    }),
  );
  return posts.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
});

export async function getPost(slug: string) {
  return (await getAllPosts()).find((p) => p.slug === slug);
}

export async function getPostComponent(slug: string) {
  const mod = await import(`@content/blog/${slug}.mdx`);
  return mod.default as React.ComponentType;
}

export async function getPostsByCategory(category: BlogCategoryId) {
  return (await getAllPosts()).filter((p) => p.category === category);
}

/** Manually chosen related posts first, then same-category posts, then the newest. */
export async function getRelatedPosts(post: BlogPost, limit = 3) {
  const all = (await getAllPosts()).filter((p) => p.slug !== post.slug);
  const manual = post.relatedPosts
    .map((s) => all.find((p) => p.slug === s))
    .filter((p): p is BlogPost => Boolean(p));
  const rest = all
    .filter((p) => !manual.includes(p))
    .sort((a, b) => Number(b.category === post.category) - Number(a.category === post.category));
  return [...manual, ...rest].slice(0, limit);
}

export function categoryTitle(id: string) {
  return blogCategories[id as BlogCategoryId]?.title ?? id;
}

export function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
