import { site } from "@content/site";
import type { ProjectView } from "@/lib/content/projects";
import type { BlogPost } from "@/lib/content/schema";
import { imageUrl, ogImageUrl } from "@/lib/images/presets";
import { absoluteUrl } from "./metadata";

type Json = Record<string, unknown>;

/** Renders schema.org JSON-LD. */
export function JsonLd({ data }: { data: Json | Json[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export function organizationLd(): Json {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "RealEstateAgent"],
    "@id": absoluteUrl("/#organization"),
    name: site.name,
    alternateName: ["VD INFRA", "VD INFRA Group", "VD Infra"],
    url: site.url,
    logo: absoluteUrl("/brand/logo.png"),
    description: site.description,
    telephone: site.phone,
    email: site.email,
    founder: { "@type": "Person", name: site.founder.name, jobTitle: site.founder.role },
    areaServed: { "@type": "City", name: "Jaipur", containedInPlace: { "@type": "State", name: "Rajasthan" } },
    sameAs: [site.instagram],
  };
}

export function websiteLd(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    name: site.name,
    url: site.url,
    publisher: { "@id": absoluteUrl("/#organization") },
    inLanguage: "en-IN",
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function projectLd(p: ProjectView): Json {
  const isVilla = p.propertyTypes.includes("villa");
  return {
    "@context": "https://schema.org",
    "@type": isVilla ? "Residence" : "ApartmentComplex",
    name: p.title,
    description: p.summary,
    url: absoluteUrl(`/projects/${p.slug}`),
    image: [ogImageUrl(p.media.hero.src), ...p.media.gallery.slice(0, 4).map((g) => imageUrl(g.src, 1280))],
    address: {
      "@type": "PostalAddress",
      streetAddress: p.location.address,
      addressLocality: p.location.city,
      addressRegion: "Rajasthan",
      addressCountry: "IN",
    },
    ...(p.location.lat !== undefined &&
      p.location.lng !== undefined && { geo: { "@type": "GeoCoordinates", latitude: p.location.lat, longitude: p.location.lng } }),
    amenityFeature: p.amenityList.map((a) => ({ "@type": "LocationFeatureSpecification", name: a.name, value: true })),
    containedInPlace: { "@type": "City", name: p.location.city },
    provider: { "@id": absoluteUrl("/#organization") },
  };
}

export function faqLd(faqs: { q: string; a: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

export function itemListLd(name: string, projects: ProjectView[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: projects.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: absoluteUrl(`/projects/${p.slug}`),
      name: p.title,
    })),
  };
}

export function blogPostingLd(post: BlogPost, authorName: string): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: ogImageUrl(post.image.src),
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: { "@type": "Organization", name: authorName },
    publisher: { "@id": absoluteUrl("/#organization") },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    articleSection: post.category,
    keywords: post.tags.join(", "),
  };
}
