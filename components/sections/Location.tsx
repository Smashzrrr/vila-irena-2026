import type { Dictionary } from "@/lib/dictionaries";
import { galleryImages } from "@/lib/image-manifest";
import { MapFacade } from "@/components/ui/MapFacade";
import { ParallaxMedia, type ParallaxImage } from "@/components/ui/ParallaxMedia";
import { Reveal } from "@/components/ui/Reveal";
import { SnapItem, SnapTrack } from "@/components/ui/SnapCarousel";
import { SectionHeading } from "@/components/ui/SectionHeading";

type GalleryAlt = Dictionary["gallery"]["alt"];

/** Ambient establishing frames. Decoupled from attractions on purpose — see redesign note. */
const AMBIENT_IDS = ["surroundings-01", "surroundings-02", "exterior-03"];

function resolveImages(ids: string[], alt: GalleryAlt): ParallaxImage[] {
  return ids
    .map((id) => galleryImages.find((g) => g.id === id))
    .filter((g) => g !== undefined)
    .map((g) => ({
      src: g.src,
      blurDataURL: g.blurDataURL,
      width: g.width,
      height: g.height,
      alt: alt[g.category],
    }));
}

export function Location({
  location,
  galleryAlt,
}: {
  location: Dictionary["location"];
  galleryAlt: GalleryAlt;
}) {
  const ambient = resolveImages(AMBIENT_IDS, galleryAlt);

  return (
    <section id="location" className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
      {/* Intro: text + first ambient frame */}
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <Reveal>
          <SectionHeading eyebrow={location.eyebrow} title={location.title} />
          <p className="mt-6 max-w-xl leading-relaxed text-ink-soft">{location.description}</p>
        </Reveal>
        {ambient[0] && (
          <Reveal delay={0.1} className="hidden lg:block">
            <ParallaxMedia
              image={ambient[0]}
              aspect="aspect-[4/3]"
              sizes="48vw"
              className="rounded-2xl shadow-(--shadow-card)"
            />
          </Reveal>
        )}
      </div>

      {/* Mobile: ambient photos as a swipe carousel */}
      {ambient.length > 0 && (
        <Reveal className="mt-8 lg:hidden">
          <SnapTrack label={location.title}>
            {ambient.map((img) => (
              <SnapItem key={img.src}>
                <ParallaxMedia
                  image={img}
                  aspect="aspect-[4/3]"
                  sizes="82vw"
                  className="rounded-2xl shadow-(--shadow-card)"
                />
              </SnapItem>
            ))}
          </SnapTrack>
        </Reveal>
      )}

      {/* Nearby: second ambient frame + compact attractions index */}
      <div className="mt-12 grid gap-10 lg:mt-20 lg:grid-cols-2 lg:items-center lg:gap-14">
        {ambient[1] && (
          <Reveal className="hidden lg:block">
            <ParallaxMedia
              image={ambient[1]}
              aspect="aspect-[4/3]"
              sizes="48vw"
              className="rounded-2xl shadow-(--shadow-card)"
            />
          </Reveal>
        )}
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-olive">
            {location.nearbyLabel}
          </p>
          <div className="mt-4 divide-y divide-stone/50">
            {location.attractions.map((a) => (
              <div key={a.title} className="py-4 first:pt-0 last:pb-0">
                <div className="flex items-baseline justify-between gap-3">
                  <h4 className="font-medium text-ink">{a.title}</h4>
                  <span className="shrink-0 text-sm font-medium tabular-nums text-olive">
                    {a.distance}
                  </span>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">{a.desc}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      {/* Full-width map band */}
      <Reveal className="mt-12 lg:mt-16">
        <MapFacade
          cta={location.mapCta}
          note={location.mapNote}
          title={location.mapTitle}
          aspectClassName="aspect-[4/3] sm:aspect-[16/10] lg:aspect-[21/9]"
        />
      </Reveal>
    </section>
  );
}
