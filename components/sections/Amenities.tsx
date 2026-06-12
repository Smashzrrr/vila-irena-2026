import {
  Baby,
  ChefHat,
  CircleParking,
  Flame,
  PawPrint,
  Snowflake,
  ToyBrick,
  Waves,
  Wifi,
} from "lucide-react";
import type { Dictionary } from "@/lib/dictionaries";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const ITEMS = [
  { key: "pool", Icon: Waves },
  { key: "bbq", Icon: Flame },
  { key: "kitchen", Icon: ChefHat },
  { key: "ac", Icon: Snowflake },
  { key: "wifi", Icon: Wifi },
  { key: "parking", Icon: CircleParking },
  { key: "pets", Icon: PawPrint },
  { key: "playground", Icon: ToyBrick },
  { key: "family", Icon: Baby },
] as const;

export function Amenities({ amenities }: { amenities: Dictionary["amenities"] }) {
  return (
    <section id="amenities" className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
      <Reveal>
        <SectionHeading eyebrow={amenities.eyebrow} title={amenities.title} align="center" />
      </Reveal>

      <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {ITEMS.map(({ key, Icon }) => {
          const item = amenities.items[key];
          return (
            <RevealItem key={key}>
              <div className="h-full rounded-2xl border border-stone/50 bg-white p-6 shadow-(--shadow-card) transition-all duration-200 ease-(--ease-premium) hover:-translate-y-1 hover:shadow-(--shadow-card-hover)">
                <span className="grid size-11 place-items-center rounded-full bg-olive-tint text-olive">
                  <Icon aria-hidden className="size-5" strokeWidth={1.8} />
                </span>
                <h3 className="mt-4 font-medium text-ink">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{item.desc}</p>
              </div>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </section>
  );
}
