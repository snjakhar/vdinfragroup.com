import { site } from "@content/site";
import { getAllPosts } from "@/lib/content/blog";
import { absoluteUrl } from "@/lib/seo/metadata";

export const dynamic = "force-static";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function GET() {
  const posts = await getAllPosts();
  const items = posts
    .map(
      (p) => `<item><title>${esc(p.title)}</title><link>${absoluteUrl(`/blog/${p.slug}`)}</link><guid>${absoluteUrl(`/blog/${p.slug}`)}</guid><pubDate>${new Date(`${p.publishedAt}T00:00:00Z`).toUTCString()}</pubDate><description>${esc(p.excerpt)}</description></item>`,
    )
    .join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${esc(site.name)} Blog</title><link>${absoluteUrl("/blog")}</link><description>Guides and insights on buying a home in Jaipur.</description><language>en-in</language>${items}</channel></rss>`;
  return new Response(xml, { headers: { "content-type": "application/rss+xml; charset=utf-8" } });
}
