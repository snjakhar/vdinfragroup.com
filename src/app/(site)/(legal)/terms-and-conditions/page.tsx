import Content, { meta } from "@content/pages/terms-and-conditions.mdx";
import { LegalPage } from "@/features/legal-page";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({ title: meta.title, path: "/terms-and-conditions", description: `${meta.title} for vdinfragroup.com, the website of VD Infra Group, Jaipur.` });

export default function Page() {
  return <LegalPage title={meta.title} updatedAt={meta.updatedAt} Body={Content} />;
}
