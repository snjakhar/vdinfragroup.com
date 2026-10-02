import { Plus } from "lucide-react";

/** FAQ list using native <details>, so it works without JavaScript. */
export function FaqList({ faqs }: { faqs: { q: string; a: string }[] }) {
  return (
    <div className="border-t border-sand">
      {faqs.map((f) => (
        <details key={f.q} className="group border-b border-sand">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 font-[family-name:var(--font-display)] text-[1.45rem] leading-snug [&::-webkit-details-marker]:hidden">
            {f.q}
            <Plus aria-hidden className="size-5 shrink-0 text-brass transition-transform duration-300 group-open:rotate-45" strokeWidth={1.5} />
          </summary>
          <p className="max-w-3xl pb-6 text-muted">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
