import { Bath, BedDouble, LandPlot, PawPrint, Users, Waves } from "lucide-react";
import type { Dictionary } from "@/lib/dictionaries";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

const FACTS = [
  { key: "guests", Icon: Users },
  { key: "bedrooms", Icon: BedDouble },
  { key: "bathrooms", Icon: Bath },
  { key: "pool", Icon: Waves },
  { key: "estate", Icon: LandPlot },
  { key: "pets", Icon: PawPrint },
] as const;

export function QuickFacts({ facts }: { facts: Dictionary["facts"] }) {
  return (
    <div className="relative z-10 mx-auto -mt-14 max-w-6xl px-5 md:px-8">
      <RevealGroup className="grid grid-cols-2 gap-x-4 gap-y-6 rounded-2xl border border-stone/50 bg-white px-6 py-8 shadow-(--shadow-card) sm:grid-cols-3 lg:grid-cols-6">
        {FACTS.map(({ key, Icon }) => (
          <RevealItem key={key} className="flex flex-col items-center gap-2.5 text-center">
            <Icon aria-hidden className="size-6 text-olive" strokeWidth={1.6} />
            <span className="text-sm text-ink-soft">{facts[key]}</span>
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  );
}
