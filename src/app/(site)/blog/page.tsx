import { BlogIndex } from "@/features/blog/blog-index";
import { getAllPosts } from "@/lib/content/blog";
import { JsonLd, breadcrumbLd } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Blog: Jaipur Real Estate Guides and Insights",
  description: "Home buying guides, Jaipur locality reports, RERA and home loan explainers from VD Infra Group.",
  path: "/blog",
});

export default async function BlogPage() {
  const posts = await getAllPosts();
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
        ])}
      />
      <BlogIndex posts={posts} />
    </>
  );
}
