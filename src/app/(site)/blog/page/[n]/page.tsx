import { notFound } from "next/navigation";
import { BlogIndex } from "@/features/blog/blog-index";
import { POSTS_PER_PAGE, getAllPosts } from "@/lib/content/blog";
import { buildMetadata } from "@/lib/seo/metadata";

export const dynamicParams = false;

export async function generateStaticParams() {
  const pages = Math.ceil((await getAllPosts()).length / POSTS_PER_PAGE);
  // Page 1 lives at /blog. A placeholder keeps the static export valid when there is only one page.
  return pages > 1 ? Array.from({ length: pages - 1 }, (_, i) => ({ n: String(i + 2) })) : [{ n: "2" }];
}

export async function generateMetadata({ params }: PageProps<"/blog/page/[n]">) {
  const { n } = await params;
  return buildMetadata({ title: `Blog, page ${n}`, path: `/blog/page/${n}`, description: "More guides and insights from VD Infra Group." });
}

export default async function BlogPaged({ params }: PageProps<"/blog/page/[n]">) {
  const { n } = await params;
  const page = Number(n);
  const posts = await getAllPosts();
  if (!Number.isInteger(page) || page < 2 || (page - 1) * POSTS_PER_PAGE >= posts.length) notFound();
  return <BlogIndex posts={posts} page={page} />;
}
