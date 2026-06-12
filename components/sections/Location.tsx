import type { Dictionary } from "@/lib/dictionaries";
import { MapFacade } from "@/components/ui/MapFacade";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Location({ location }: { location: Dictionary["location"] }) {
  return (
    <section id="location" className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
      <Reveal>
        <SectionHeading eyebrow={location.eyebrow} title={location.title} />
        <p className="mt-6 max-w-2xl leading-relaxed text-ink-soft">{location.description}</p>
      </Reveal>

      <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-14">
        <RevealGroup className="grid content-start gap-4 sm:grid-cols-2">
          {location.attractions.map((a) => (
            <RevealItem key={a.title}>
              <div className="h-full rounded-xl border border-stone/50 bg-white p-5 shadow-(--shadow-card)">
                <h3 className="font-medium text-ink">{a.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">{a.desc}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.1}>
          <MapFacade cta={location.mapCta} note={location.mapNote} title={location.mapTitle} />
        </Reveal>
      </div>
    </section>
  );
}
