"use client";

import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n";

export function LanguageSwitcher({
  current,
  variant = "dark",
  className,
}: {
  current: Locale;
  /** "dark" = dark text on light bg, "light" = light text on dark bg */
  variant?: "dark" | "light";
  className?: string;
}) {
  const pathname = usePathname() ?? `/${current}`;
  const rest = pathname.replace(/^\/(en|hr|de)(?=\/|$)/, "");

  const base =
    variant === "dark"
      ? { active: "text-ink font-semibold", idle: "text-ink-faint hover:text-ink" }
      : { active: "text-cream font-semibold", idle: "text-cream/55 hover:text-cream" };

  return (
    <div className={`flex items-center gap-1 text-sm ${className ?? ""}`}>
      {locales.map((locale, i) => (
        <span key={locale} className="flex items-center gap-1">
          {i > 0 && (
            <span className={variant === "dark" ? "text-ink-faint/50" : "text-cream/30"}>
              /
            </span>
          )}
          <a
            href={`/${locale}${rest}`}
            onClick={(e) => {
              e.preventDefault();
              window.location.href = `/${locale}${rest}${window.location.hash}`;
            }}
            aria-current={locale === current ? "true" : undefined}
            className={`px-1 py-0.5 uppercase tracking-wide transition-colors duration-200 ${
              locale === current ? base.active : base.idle
            }`}
          >
            {locale}
          </a>
        </span>
      ))}
    </div>
  );
}
