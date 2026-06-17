import {
  Baby,
  ChefHat,
  CircleParking,
  Flame,
  type LucideIcon,
  PawPrint,
  Snowflake,
  ToyBrick,
  Waves,
  Wifi,
} from "lucide-react";
import type { Dictionary } from "@/lib/dictionaries";
import { galleryImages } from "@/lib/image-manifest";
import { Reveal } from "@/components/ui/Reveal";
import { ParallaxMedia, type ParallaxImage } from "@/components/ui/ParallaxMedia";
import { SnapItem, SnapTrack } from "@/components/ui/SnapCarousel";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Amenities = Dictionary["amenities"];
type ItemKey = keyof Amenities["items"];
type GroupKey = keyof Amenities["groups"];
type GalleryAlt = Dictionary["gallery"]["alt"];

const ICONS: Record<ItemKey, LucideIcon> = {
  pool: Waves,
  bbq: Flame,
  kitchen: ChefHat,
  ac: Snowflake,
  wifi: Wifi,
  parking: CircleParking,
  pets: PawPrint,
  playground: ToyBrick,
  family: Baby,
};

/** Three editorial clusters replace the flat 3×3 grid. Copy stays in the dictionary. */
const GROUPS: { key: GroupKey; items: ItemKey[]; photos: string[] }[] = [
  { key: "outdoor", items: ["pool", "bbq", "playground"], photos: ["pool-01"] },
  { key: "home", items: ["kitchen", "ac", "wifi", "parking"], photos: ["interior-02"] },
  { key: "family", items: ["pets", "family"], photos: [] },
];

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

export function Amenities({
  amenities,
  galleryAlt,
}: {
  amenities: Amenities;
  galleryAlt: GalleryAlt;
}) {
  const outdoorPhoto = resolveImages(GROUPS[0].photos, galleryAlt)[0];
  const homePhoto = resolveImages(GROUPS[1].photos, galleryAlt)[0];

  return (
    <section id="amenities" className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
      <Reveal>
        <SectionHeading eyebrow={amenities.eyebrow} title={amenities.title} align="center" />
      </Reveal>

      <div className="mt-14 space-y-14 md:mt-16 md:space-y-20">
        {/* Cluster A — Water & outdoor life: photo crossfade beside three cards */}
        <Reveal>
          <ClusterHeader group={amenities.groups.outdoor} />
          {/* Mobile: horizontal swipe track */}
          <SnapTrack label={amenities.groups.outdoor.label} className="mt-6">
            {outdoorPhoto && <SnapPhoto photo={outdoorPhoto} sizes="82vw" />}
            {GROUPS[0].items.map((key) => (
              <SnapItem key={key}>
                <AmenityCard item={amenities.items[key]} Icon={ICONS[key]} />
              </SnapItem>
            ))}
          </SnapTrack>
          {/* Desktop: photo + cards */}
          <div className="mt-6 hidden lg:grid lg:grid-cols-2 lg:items-center lg:gap-5">
            {outdoorPhoto && (
              <ParallaxMedia
                image={outdoorPhoto}
                aspect="aspect-square"
                objectPosition="right"
                sizes="48vw"
                className="rounded-2xl shadow-(--shadow-card)"
              />
            )}
            <div className="flex flex-col gap-4">
              {GROUPS[0].items.map((key) => (
                <AmenityCard key={key} item={amenities.items[key]} Icon={ICONS[key]} />
              ))}
            </div>
          </div>
        </Reveal>

        {/* Cluster B — The home: spec list beside an anchor photo */}
        <Reveal>
          <ClusterHeader group={amenities.groups.home} />
          {/* Mobile: horizontal swipe track */}
          <SnapTrack label={amenities.groups.home.label} className="mt-6">
            {homePhoto && <SnapPhoto photo={homePhoto} sizes="82vw" />}
            {GROUPS[1].items.map((key) => (
              <SnapItem key={key}>
                <AmenityCard item={amenities.items[key]} Icon={ICONS[key]} />
              </SnapItem>
            ))}
          </SnapTrack>
          {/* Desktop: divided spec list + photo */}
          <div className="mt-6 hidden lg:grid lg:grid-cols-2 lg:items-stretch lg:gap-5">
            <div className="flex flex-col justify-center divide-y divide-stone/50 rounded-2xl border border-stone/50 bg-sand px-7 py-2">
              {GROUPS[1].items.map((key) => (
                <SpecRow key={key} item={amenities.items[key]} Icon={ICONS[key]} />
              ))}
            </div>
            {homePhoto && (
              <ParallaxMedia
                image={homePhoto}
                aspect=""
                sizes="48vw"
                className="h-full min-h-72 rounded-2xl shadow-(--shadow-card)"
              />
            )}
          </div>
        </Reveal>

        {/* Cluster C — For the family: two cards, no photo */}
        <Reveal>
          <ClusterHeader group={amenities.groups.family} />
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:max-w-3xl">
            {GROUPS[2].items.map((key) => (
              <AmenityCard key={key} item={amenities.items[key]} Icon={ICONS[key]} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ClusterHeader({ group }: { group: { label: string; lede: string } }) {
  return (
    <div className="max-w-2xl">
      <h3 className="font-display text-2xl font-semibold leading-tight text-ink text-balance md:text-3xl">
        {group.label}
      </h3>
      <p className="mt-2 leading-relaxed text-ink-soft text-pretty">{group.lede}</p>
    </div>
  );
}

function AmenityCard({
  item,
  Icon,
}: {
  item: { title: string; desc: string };
  Icon: LucideIcon;
}) {
  return (
    <div className="h-full rounded-2xl border border-stone/50 bg-white p-6 shadow-(--shadow-card) transition-all duration-200 ease-(--ease-premium) hover:-translate-y-1 hover:shadow-(--shadow-card-hover)">
      <span className="grid size-11 place-items-center rounded-full bg-olive-tint text-olive">
        <Icon aria-hidden className="size-5" strokeWidth={1.8} />
      </span>
      <h4 className="mt-4 font-medium text-ink">{item.title}</h4>
      <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{item.desc}</p>
    </div>
  );
}

function SpecRow({
  item,
  Icon,
}: {
  item: { title: string; desc: string };
  Icon: LucideIcon;
}) {
  return (
    <div className="flex gap-4 py-5">
      <span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-full bg-cream text-olive">
        <Icon aria-hidden className="size-5" strokeWidth={1.8} />
      </span>
      <div className="min-w-0">
        <h4 className="font-medium text-ink">{item.title}</h4>
        <p className="mt-1 text-sm leading-relaxed text-ink-soft">{item.desc}</p>
      </div>
    </div>
  );
}

function SnapPhoto({ photo, sizes }: { photo: ParallaxImage; sizes: string }) {
  return (
    <SnapItem>
      <ParallaxMedia
        image={photo}
        aspect="aspect-[4/3]"
        sizes={sizes}
        className="rounded-2xl shadow-(--shadow-card)"
      />
    </SnapItem>
  );
}
