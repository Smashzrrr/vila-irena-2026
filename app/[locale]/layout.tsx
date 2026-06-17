import type { Metadata } from "next";
import { Lora, Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { locales, isLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import "../globals.css";

// Lora: calm, highly readable serif with conventional letterforms (a normal "j",
// unlike Fraunces' calligraphic one) and clean Central-European diacritics (č/ć/đ/š/ž).
// Headings render at 500-600; italic 500 for the About blockquote.
const lora = Lora({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// OpenGraph expects e.g. "hr_HR", not the bare BCP-47 tag.
const ogLocale = { en: "en_US", hr: "hr_HR", de: "de_DE" } as const;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return {
    metadataBase: new URL(siteUrl),
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        hr: "/hr",
        de: "/de",
        "x-default": "/en",
      },
    },
    openGraph: {
      type: "website",
      siteName: "Vila Irena",
      title: dict.meta.title,
      description: dict.meta.description,
      url: `/${locale}`,
      images: [{ url: "/og.jpg", width: 1200, height: 630 }],
      locale: ogLocale[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocale[l]),
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
      images: ["/og.jpg"],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html lang={locale} className={`${lora.variable} ${inter.variable}`}>
      {/* Extensions (ColorZilla, Grammarly, …) inject attributes on <body> before
          React hydrates; suppress the resulting dev-only attribute mismatch warning. */}
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}

export type { Locale };
