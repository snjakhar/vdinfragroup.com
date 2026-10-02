import { SectionHeading } from "@/components/ui/heading";
import { GalleryGrid, type GalleryEntry } from "@/features/projects/gallery-grid";
import { altFor, getAllProjects } from "@/lib/content/projects";
import { JsonLd, breadcrumbLd } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";
import { absoluteUrl } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Gallery: Apartments and Villas in Jaipur",
  description: "Photos of VD Infra Group apartments, villas, interiors and amenities across Jaipur.",
  path: "/gallery",
});

const INTERIOR = /room|bedroom|kitchen|bath|dining|lounge|living/i;

export default function GalleryPage() {
  const projects = getAllProjects();
  const entries: GalleryEntry[] = projects.flatMap((p) =>
    [p.media.hero, ...p.media.gallery].map((image) => {
      const alt = altFor(p, image);
      return { image, alt, caption: `${p.title}, ${p.location.locality}`, project: p.title, projectSlug: p.slug, kind: INTERIOR.test(alt) ? "Interiors" : "Exteriors" };
    }),
  );
  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Gallery", path: "/gallery" },
          ]),
          { "@context": "https://schema.org", "@type": "ImageGallery", name: "VD Infra Group project gallery", url: absoluteUrl("/gallery") },
        ]}
      />
      <section className="pb-24 pt-36 lg:pb-36 lg:pt-48">
        <div className="container-site">
          <SectionHeading level="h1" eyebrow="Gallery" title="Our homes, in pictures" lead={`${entries.length} photos from ${projects.length} projects across Jaipur.`} />
          <div className="mt-14">
            <GalleryGrid entries={entries} projects={projects.map((p) => ({ slug: p.slug, title: p.title }))} />
          </div>
        </div>
      </section>
    </>
  );
}
