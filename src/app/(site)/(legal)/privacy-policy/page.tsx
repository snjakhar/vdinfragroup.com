import Content, { meta } from "@content/pages/privacy-policy.mdx";
import { LegalPage } from "@/features/legal-page";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({ title: meta.title, path: "/privacy-policy", description: `${meta.title} for vdinfragroup.com, the website of VD Infra Group, Jaipur.` });

export default function Page() {
  return <LegalPage title={meta.title} updatedAt={meta.updatedAt} Body={Content} />;
}
