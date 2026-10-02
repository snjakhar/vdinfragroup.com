import type { Metadata } from "next";
import { site } from "@content/site";
import { seo } from "@content/seo";
import { ogImageUrl } from "@/lib/images/presets";
import type { MediaImage } from "@/lib/content/schema";

export function absoluteUrl(path = "/") {
  return new URL(path, site.url).toString();
}

/**
 * One place that builds page metadata: title template, description,
 * canonical URL, Open Graph and Twitter tags. Empty values fall back to
 * the site defaults.
 */
export function buildMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  noIndex,
  publishedTime,
  modifiedTime,
}: {
  title?: string;
  description?: string;
  path: string;
  image?: MediaImage;
  type?: "website" | "article";
  noIndex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
}): Metadata {
  const desc = description ?? seo.defaultDescription;
  // Pages without their own image use the generated /opengraph-image from app/.
  const images = image ? [{ url: ogImageUrl(image.src), width: 1200, height: 630, alt: image.alt ?? title ?? site.name }] : undefined;
  return {
    title: title ?? { absolute: seo.defaultTitle },
    description: desc,
    alternates: { canonical: path },
    robots: noIndex ? { index: false, follow: true } : undefined,
    openGraph: {
      type,
      url: path,
      siteName: site.name,
      locale: seo.locale,
      title: title ?? seo.defaultTitle,
      description: desc,
      ...(images && { images }),
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: "summary_large_image",
      title: title ?? seo.defaultTitle,
      description: desc,
      ...(images && { images: images.map((i) => i.url) }),
    },
  };
}
