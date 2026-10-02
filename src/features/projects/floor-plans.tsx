"use client";

import { useState } from "react";
import { Expand, FileText } from "lucide-react";
import { MediaImg } from "@/components/ui/media-image";
import type { Project } from "@/lib/content/schema";
import { cn } from "@/lib/cn";
import { Lightbox } from "./lightbox";

type Plan = Project["media"]["floorPlans"][number];

/** Floor plans as tabs. Each plan is shown whole (never cropped) and opens full screen on tap. */
export function FloorPlans({ plans, projectTitle }: { plans: Plan[]; projectTitle: string }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  const plan = plans[active];
  const alt = plan.image?.alt ?? `${projectTitle} ${plan.title} floor plan`;

  return (
    <div>
      <div role="tablist" aria-label="Floor plans" className="no-scrollbar flex gap-2 overflow-x-auto">
        {plans.map((p, i) => (
          <button
            key={p.title}
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={cn(
              "shrink-0 border px-5 py-3 text-[0.75rem] font-semibold uppercase tracking-[0.14em] transition-colors duration-300",
              i === active ? "border-ink bg-ink text-ivory" : "border-sand text-muted hover:border-ink hover:text-ink",
            )}
          >
            {p.title}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="mt-6 border border-sand bg-paper p-4 md:p-8">
        {plan.image ? (
          <button type="button" onClick={() => setZoom(true)} className="group relative block w-full" style={{ aspectRatio: `${plan.image.width} / ${plan.image.height}` }}>
            <span className="sr-only">Open {alt} full screen. </span>
            <MediaImg image={plan.image} alt={alt} sizes="(min-width: 1280px) 1200px, 100vw" className="object-contain" />
            <span className="absolute bottom-3 right-3 flex items-center gap-2 bg-ink/85 px-3 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-ivory">
              <Expand className="size-3.5" strokeWidth={1.75} /> Enlarge
            </span>
          </button>
        ) : (
          <div className="flex aspect-[16/7] flex-col items-center justify-center gap-4 p-8 text-center">
            <svg viewBox="0 0 200 140" aria-hidden className="w-40 text-sand">
              <rect x="4" y="4" width="192" height="132" fill="none" stroke="currentColor" strokeWidth="3" />
              <path d="M4 70h80M84 4v100M84 104h60M144 50v86M144 50h52M110 4v30" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
            <p className="max-w-xs text-sm text-muted">The detailed {plan.title} plan is shared on request.</p>
          </div>
        )}
        <div className="mt-6 flex flex-col gap-5 border-t border-sand pt-6 md:flex-row md:items-end md:justify-between">
          <dl className="flex flex-wrap gap-x-12 gap-y-4">
            <div>
              <dt className="eyebrow">Configuration</dt>
              <dd className="mt-1 font-[family-name:var(--font-display)] text-2xl">{plan.configuration}</dd>
            </div>
            <div>
              <dt className="eyebrow">Area</dt>
              <dd className="mt-1 font-[family-name:var(--font-display)] text-2xl">{plan.area}</dd>
            </div>
          </dl>
          <a href="#enquire" className="inline-flex items-center gap-2 text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-ink hover:text-brass-deep">
            <FileText className="size-4" strokeWidth={1.5} /> Ask about this layout
          </a>
        </div>
      </div>
      {zoom && plan.image && <Lightbox items={[{ image: plan.image, alt }]} index={0} onClose={() => setZoom(false)} />}
    </div>
  );
}
