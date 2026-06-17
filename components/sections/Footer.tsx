import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { AIRBNB_LISTING_URL, OWNER_PHONE } from "@/lib/config";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";

const ANCHORS = ["about", "gallery", "amenities", "reviews", "location", "faq"] as const;

export function Footer({
  footer,
  nav,
  locale,
}: {
  footer: Dictionary["footer"];
  nav: Dictionary["nav"];
  locale: Locale;
}) {
  return (
    <footer className="bg-ink py-16 text-cream/75">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr]">
          <div>
            <p className="font-display text-3xl tracking-wide text-cream">Vila Irena</p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed">{footer.tagline}</p>
            <LanguageSwitcher current={locale} variant="light" className="mt-6" />
          </div>

          <nav aria-label={footer.exploreTitle}>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-cream/50">
              {footer.exploreTitle}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {ANCHORS.map((anchor) => (
                <li key={anchor}>
                  <a
                    href={`#${anchor}`}
                    className="text-sm transition-colors duration-200 hover:text-cream"
                  >
                    {nav[anchor]}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-cream/50">
              {footer.contactTitle}
            </h3>
            <p className="mt-4 text-sm leading-relaxed">{footer.contactNote}</p>
            <a
              href={`tel:${OWNER_PHONE.replace(/\s/g, "")}`}
              className="mt-3 block text-sm font-medium text-cream transition-colors hover:text-cream/80"
            >
              {OWNER_PHONE}
            </a>
            <a
              href={AIRBNB_LISTING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm font-medium text-cream underline underline-offset-4 transition-colors hover:text-cream/80"
            >
              {footer.airbnb} ↗
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-cream/10 pt-7 text-sm sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} Vila Irena, Bruška. {footer.rights}
          </p>
          <div className="flex items-center gap-4">
            <a
              href={`/${locale}/privacy`}
              className="underline underline-offset-4 transition-colors duration-200 hover:text-cream"
            >
              {footer.privacy}
            </a>
            <span aria-hidden className="text-cream/30">·</span>
            <p>
              {footer.creditPrefix}{" "}
              <a
                href="https://www.fraviz.com"
                target="_blank"
                rel="noopener"
                className="font-medium text-cream underline underline-offset-4 transition-colors duration-200 hover:text-cream/80"
              >
                {footer.creditName}
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
