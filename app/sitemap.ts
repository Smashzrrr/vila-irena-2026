import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = (path: string) =>
    Object.fromEntries(locales.map((l) => [l, `${siteUrl}/${l}${path}`]));

  return locales.flatMap((locale) => [
    {
      url: `${siteUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: locale === "en" ? 1 : 0.9,
      alternates: { languages: languages("") },
    },
    {
      url: `${siteUrl}/${locale}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.2,
      alternates: { languages: languages("/privacy") },
    },
  ]);
}
