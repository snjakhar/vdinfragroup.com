import { ProjectListing } from "@/features/projects/project-listing";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Completed Projects in Jaipur",
  description: "Communities delivered by VD Infra Group across Jaipur: apartments and villas now home to thousands of families.",
  path: "/projects/completed",
});

export default function Page() {
  return <ProjectListing status="completed" />;
}
