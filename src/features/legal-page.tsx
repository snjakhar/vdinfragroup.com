import { formatDate } from "@/lib/content/blog";

export function LegalPage({ title, updatedAt, Body }: { title: string; updatedAt: string; Body: React.ComponentType }) {
  return (
    <article className="pb-24 pt-36 lg:pb-32 lg:pt-48">
      <div className="container-site max-w-3xl">
        <p className="eyebrow">Legal</p>
        <h1 className="t-h1 mt-6">{title}</h1>
        <p className="mt-4 text-sm text-muted">Last updated {formatDate(updatedAt)}</p>
        <div className="prose-vd mt-12">
          <Body />
        </div>
      </div>
    </article>
  );
}
