import { RuledEyebrow } from "@/components/ui/heading";
import { MediaImg } from "@/components/ui/media-image";
import { Reveal } from "@/components/motion/reveal";
import type { MediaImage } from "@/lib/content/schema";
import { cn } from "@/lib/cn";

// Tiles cycle light, gold, navy, gold so neighbouring figures never share a colour.
const TILE_TONES = ["bg-ivory text-ink", "bg-brass text-night", "bg-night text-ivory", "bg-brass text-night"];

/** Company figures as stacked tiles beside a large interior photo. */
export function TrustStats({ stats, image }: { stats: readonly { value: string; label: string }[]; image: MediaImage }) {
  return (
    <section className="section">
      <div className="container-site">
        <RuledEyebrow>Statistics</RuledEyebrow>
        <h2 className="t-h2 mt-8 max-w-3xl text-balance text-ink">Years of trust, 1000+ happy families.</h2>
        <div className="mt-12 grid gap-4 rounded-3xl bg-paper p-4 sm:p-5 lg:mt-16 lg:grid-cols-[1fr_22rem]">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl lg:aspect-auto">
            <MediaImg image={image} alt={image.alt ?? ""} sizes="(min-width: 1024px) 60vw, 100vw" />
          </div>
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.06} className={cn("rounded-2xl px-6 py-7 lg:py-8", TILE_TONES[i % TILE_TONES.length])}>
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <span className="block font-display text-4xl font-medium leading-none tracking-tight lg:text-5xl">{s.value}</span>
                  <span className="mt-3 block text-base">{s.label}</span>
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
