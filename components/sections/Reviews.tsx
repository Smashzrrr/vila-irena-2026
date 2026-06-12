import { Quote, Star } from "lucide-react";
import type { Dictionary } from "@/lib/dictionaries";
import { AIRBNB_LISTING_URL } from "@/lib/config";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Reviews({ reviews }: { reviews: Dictionary["reviews"] }) {
  return (
    <section id="reviews" className="bg-sand py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <Reveal>
            <SectionHeading eyebrow={reviews.eyebrow} title={reviews.title} />
            <div className="mt-7 flex items-center gap-3">
              <span className="font-display text-6xl leading-none text-ink">5.0</span>
              <span className="flex gap-0.5" aria-hidden>
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className="size-5 fill-amber-400 text-amber-400" />
                ))}
              </span>
            </div>
            <p className="mt-3 text-sm text-ink-soft">{reviews.summary}</p>
            <a
              href={AIRBNB_LISTING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-sm font-medium text-olive underline underline-offset-4 transition-colors hover:text-olive-deep"
            >
              Airbnb ↗
            </a>
          </Reveal>

          <div className="grid gap-5 md:grid-cols-2">
            {reviews.items.map((item, i) => (
              <Reveal key={item.name} delay={0.08 * (i + 1)}>
                <figure className="flex h-full flex-col rounded-2xl border border-stone/50 bg-white p-7 shadow-(--shadow-card)">
                  <Quote aria-hidden className="size-6 -scale-x-100 text-olive/60" />
                  <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-ink-soft">
                    {item.text}
                  </blockquote>
                  <figcaption className="mt-5 border-t border-stone/40 pt-4">
                    <span className="font-medium text-ink">{item.name}</span>
                    <span className="block text-sm text-ink-faint">
                      {item.origin} · {item.date}
                    </span>
                    <span className="mt-1 block text-xs italic text-ink-faint/80">
                      {reviews.translatedNote}
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
