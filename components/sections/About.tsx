import Image from "next/image";
import type { Dictionary } from "@/lib/dictionaries";
import { aboutImageIds, galleryImages } from "@/lib/image-manifest";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function About({
  about,
  galleryAlt,
}: {
  about: Dictionary["about"];
  galleryAlt: Dictionary["gallery"]["alt"];
}) {
  const images = aboutImageIds
    .map((id) => galleryImages.find((img) => img.id === id))
    .filter((img) => img !== undefined);

  return (
    <section id="about" className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
      <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <Reveal>
            <SectionHeading eyebrow={about.eyebrow} title={about.title} />
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-7 leading-relaxed text-ink-soft">{about.p1}</p>
            <p className="mt-5 leading-relaxed text-ink-soft">{about.p2}</p>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mt-8 border-l-2 border-olive pl-5 font-display text-xl italic leading-relaxed text-ink">
              {about.hostNote}
            </p>
          </Reveal>
        </div>

        <div className="relative pb-16 pr-10 lg:pb-20">
          {images[0] && (
            <Reveal>
              <Image
                src={images[0].src}
                alt={galleryAlt[images[0].category]}
                width={images[0].width}
                height={images[0].height}
                sizes="(min-width: 1024px) 45vw, 90vw"
                placeholder="blur"
                blurDataURL={images[0].blurDataURL}
                className="rounded-2xl object-cover shadow-(--shadow-card)"
              />
            </Reveal>
          )}
          {images[1] && (
            <Reveal delay={0.12} className="absolute -bottom-0 right-0 w-1/2">
              <Image
                src={images[1].src}
                alt={galleryAlt[images[1].category]}
                width={images[1].width}
                height={images[1].height}
                sizes="(min-width: 1024px) 22vw, 45vw"
                placeholder="blur"
                blurDataURL={images[1].blurDataURL}
                className="rounded-2xl border-[6px] border-cream object-cover shadow-(--shadow-card-hover)"
              />
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
