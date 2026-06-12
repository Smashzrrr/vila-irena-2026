import type { Dictionary } from "@/lib/dictionaries";
import { Accordion } from "@/components/ui/Accordion";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Faq({ faq }: { faq: Dictionary["faq"] }) {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-5 py-20 md:px-8 md:py-28">
      <Reveal>
        <SectionHeading eyebrow={faq.eyebrow} title={faq.title} align="center" />
      </Reveal>
      <Reveal delay={0.1} className="mt-12">
        <Accordion items={faq.items} />
      </Reveal>
    </section>
  );
}
