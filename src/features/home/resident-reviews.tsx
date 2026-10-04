import { reviews as realReviews, type Review } from "@content/reviews";
import { RuledEyebrow } from "@/components/ui/heading";
import { Reveal } from "@/components/motion/reveal";

// Layout preview only: never rendered in production, so no invented review goes live.
const SAMPLES: Review[] = [
  {
    quote: "We moved in on time and everything was finished, from the kitchen to the wardrobes. The team answered every question we had.",
    name: "Rohit Sharma",
  },
  {
    quote: "Good construction, lots of light in every room, and the kids have space to play. Our parents love it too.",
    name: "Neha Chaudhary",
  },
  {
    quote: "Clear paperwork and honest pricing. Buying our first home felt simple and stress-free.",
    name: "Amit Agarwal",
  },
];

/** Resident reviews on navy. Hidden on the live site until real reviews are added. */
export function ResidentReviews() {
  const reviews = realReviews.length ? realReviews : process.env.NODE_ENV === "development" ? SAMPLES : [];
  if (!reviews.length) return null;
  return (
    <section className="section bg-night text-ivory">
      <div className="container-site">
        <RuledEyebrow tone="light">Resident reviews</RuledEyebrow>
        <h2 className="t-h2 mt-8 text-balance text-ivory">What our residents say</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3 lg:mt-16 lg:gap-8">
          {reviews.map((r, i) => (
            <Reveal key={`${r.name}-${i}`} delay={i * 0.08} className="flex">
              <figure className="flex w-full flex-col justify-between gap-10 rounded-2xl bg-night-soft p-8 ring-1 ring-ivory/10 lg:p-10">
                <blockquote className="text-lg leading-relaxed text-ivory/90">{r.quote}</blockquote>
                <figcaption>
                  <span className="block text-lg font-semibold">{r.name}</span>
                  {r.project && <span className="mt-1 block text-sm text-mist">{r.project}</span>}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
