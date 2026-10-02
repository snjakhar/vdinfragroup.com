import type { MetadataRoute } from "next";
import { blogCategories } from "@content/shared/catalog";
import { getAllPosts } from "@/lib/content/blog";
import { STATUS_ORDER, getAllProjects } from "@/lib/content/projects";
import { absoluteUrl } from "@/lib/seo/metadata";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const posts = await getAllPosts();
  const staticPages = ["/", "/about", "/projects", "/gallery", "/blog", "/contact", "/privacy-policy", "/terms-and-conditions"].map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: path === "/" ? 1 : 0.7,
  }));
  return [
    ...staticPages,
    ...STATUS_ORDER.map((s) => ({ url: absoluteUrl(`/projects/${s}`), lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...getAllProjects().map((p) => ({ url: absoluteUrl(`/projects/${p.slug}`), lastModified: now, changeFrequency: "weekly" as const, priority: 0.9 })),
    ...Object.keys(blogCategories).map((c) => ({ url: absoluteUrl(`/blog/category/${c}`), lastModified: now, changeFrequency: "weekly" as const, priority: 0.5 })),
    ...posts.map((p) => ({ url: absoluteUrl(`/blog/${p.slug}`), lastModified: new Date(p.updatedAt ?? p.publishedAt), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
