import "server-only";
import type { Locale } from "./i18n";

export type Dictionary = typeof import("@/dictionaries/en.json");

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("@/dictionaries/en.json").then((m) => m.default),
  hr: () => import("@/dictionaries/hr.json").then((m) => m.default as Dictionary),
  de: () => import("@/dictionaries/de.json").then((m) => m.default as Dictionary),
};

export function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}
