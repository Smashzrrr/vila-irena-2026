"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";

const MAP_EMBED_SRC =
  "https://www.google.com/maps?q=Bru%C5%A1ka,+Croatia&z=12&output=embed";

/** Consent-gated map: the Google iframe loads only after an explicit click. */
export function MapFacade({
  cta,
  note,
  title,
}: {
  cta: string;
  note: string;
  title: string;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="overflow-hidden rounded-2xl border border-stone/60 bg-sand-deep shadow-(--shadow-card)">
      <div className="relative aspect-[4/3] w-full">
        {loaded ? (
          <iframe
            src={MAP_EMBED_SRC}
            title={title}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
            <span className="grid size-14 place-items-center rounded-full bg-olive-tint text-olive">
              <MapPin aria-hidden className="size-7" />
            </span>
            <button
              type="button"
              onClick={() => setLoaded(true)}
              className="rounded-full bg-olive-deep px-6 py-3 text-sm font-medium text-cream shadow-(--shadow-card) transition-all duration-200 hover:-translate-y-0.5 hover:bg-olive-ink hover:shadow-(--shadow-card-hover)"
            >
              {cta}
            </button>
            <p className="max-w-xs text-xs text-ink-faint">{note}</p>
          </div>
        )}
      </div>
    </div>
  );
}
