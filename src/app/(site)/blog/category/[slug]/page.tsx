import { notFound } from "next/navigation";
import { blogCategories, type BlogCategoryId } from "@content/shared/catalog";
import { BlogIndex } from "@/features/blog/blog-index";
import { getPostsByCategory } from "@/lib/content/blog";
import { JsonLd, breadcrumbLd } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(blogCategories).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/category/[slug]">) {
  const { slug } = await params;
  const c = blogCategories[slug as BlogCategoryId];
  if (!c) return {};
  return buildMetadata({ title: `${c.title}: Jaipur Home Buying Articles`, description: c.description, path: `/blog/category/${slug}` });
}

export default async function BlogCategoryPage({ params }: PageProps<"/blog/category/[slug]">) {
  const { slug } = await params;
  if (!(slug in blogCategories)) notFound();
  const id = slug as BlogCategoryId;
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: blogCategories[id].title, path: `/blog/category/${id}` },
        ])}
      />
      <BlogIndex posts={await getPostsByCategory(id)} category={id} />
    </>
  );
}
