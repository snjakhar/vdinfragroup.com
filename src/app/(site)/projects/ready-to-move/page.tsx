import { ProjectListing } from "@/features/projects/project-listing";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Ready-to-Move Homes in Jaipur",
  description: "Ready-to-move apartments and villas in Jaipur with the occupancy certificate received. Visit, choose and move in.",
  path: "/projects/ready-to-move",
});

export default function Page() {
  return <ProjectListing status="ready-to-move" />;
}
