import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// Bump when page content meaningfully changes. A stable date is a more trustworthy
// crawl signal than new Date() on every build (which trains Googlebot to ignore it).
const LAST_MODIFIED = "2026-06-17";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = (path: string) =>
    Object.fromEntries([
      ...locales.map((l) => [l, `${siteUrl}/${l}${path}`]),
      ["x-default", `${siteUrl}/en${path}`],
    ]);

  // Only the indexable landing pages belong here; /privacy is noindex.
  return locales.map((locale) => ({
    url: `${siteUrl}/${locale}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: "monthly" as const,
    priority: locale === "en" ? 1 : 0.9,
    alternates: { languages: languages("") },
  }));
}
