"use client";

import { useState } from "react";
import Image from "next/image";
import type { Dictionary } from "@/lib/dictionaries";
import { galleryImages } from "@/lib/image-manifest";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Lightbox } from "./Lightbox";

export function GalleryGrid({ gallery }: { gallery: Dictionary["gallery"] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="gallery" className="bg-sand py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal>
          <SectionHeading eyebrow={gallery.eyebrow} title={gallery.title} align="center" />
        </Reveal>

        <RevealGroup className="mt-12 columns-2 gap-4 space-y-4 md:columns-3">
          {galleryImages.map((img, i) => (
            <RevealItem key={img.id} className="break-inside-avoid">
              <button
                type="button"
                onClick={() => setOpenIndex(i)}
                aria-label={`${gallery.viewPhoto}: ${gallery.alt[img.category]}`}
                className="group block w-full cursor-zoom-in overflow-hidden rounded-xl"
              >
                <Image
                  src={img.src}
                  alt={gallery.alt[img.category]}
                  width={img.width}
                  height={img.height}
                  sizes="(min-width: 768px) 33vw, 50vw"
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL={img.blurDataURL}
                  className="w-full object-cover transition-transform duration-500 ease-(--ease-premium) group-hover:scale-[1.04]"
                />
              </button>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>

      <Lightbox
        images={galleryImages}
        alt={gallery.alt}
        labels={gallery}
        openIndex={openIndex}
        onClose={() => setOpenIndex(null)}
        onNavigate={setOpenIndex}
      />
    </section>
  );
}
