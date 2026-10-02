import { ProjectListing } from "@/features/projects/project-listing";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Projects in Jaipur: Apartments and Villas",
  description: "Explore VD Infra Group's ready-to-move, upcoming and completed apartment and villa projects across Jaipur.",
  path: "/projects",
});

export default function ProjectsPage() {
  return <ProjectListing status="all" />;
}
