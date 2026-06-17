import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { isLocale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  return {
    title: `${dict.privacy.title} · Vila Irena`,
    alternates: { canonical: `/${locale}/privacy` },
    robots: { index: false },
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const privacy = dict.privacy;

  return (
    <main className="mx-auto max-w-2xl px-5 py-20 md:px-8 md:py-24">
      <a
        href={`/${locale}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-olive transition-colors hover:text-olive-deep"
      >
        <ArrowLeft aria-hidden className="size-4" />
        {privacy.backHome}
      </a>
      <h1 className="mt-8 font-display text-4xl text-ink md:text-5xl">{privacy.title}</h1>
      <p className="mt-3 text-sm text-ink-faint">{privacy.updated}</p>

      {privacy.sections.map((section) => (
        <section key={section.h} className="mt-10">
          <h2 className="font-display text-2xl text-ink">{section.h}</h2>
          <p className="mt-3 leading-relaxed text-ink-soft">{section.p}</p>
        </section>
      ))}
    </main>
  );
}
