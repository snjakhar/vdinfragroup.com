import { ProjectListing } from "@/features/projects/project-listing";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Upcoming Projects in Jaipur",
  description: "New apartment and villa launches by VD Infra Group in Jaipur. Register early for pre-launch prices and priority allotment.",
  path: "/projects/upcoming",
});

export default function Page() {
  return <ProjectListing status="upcoming" />;
}
