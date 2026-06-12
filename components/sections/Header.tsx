"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Menu, X } from "lucide-react";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { EASE_PREMIUM } from "@/components/ui/Reveal";

// Trimmed to the four highest-intent sections; the footer keeps the full set.
const NAV_ANCHORS = ["gallery", "amenities", "reviews", "location"] as const;

export function Header({
  nav,
  locale,
}: {
  nav: Dictionary["nav"];
  locale: Locale;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solid ? "bg-cream/90 shadow-(--shadow-card) backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:h-20 md:px-8">
        <a
          href="#top"
          className={`font-display text-2xl tracking-wide transition-colors duration-300 ${
            solid ? "text-ink" : "text-cream"
          }`}
        >
          Vila Irena
        </a>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main">
          {NAV_ANCHORS.map((anchor) => (
            <a
              key={anchor}
              href={`#${anchor}`}
              className={`text-sm transition-colors duration-200 ${
                solid
                  ? "text-ink-soft hover:text-ink"
                  : "text-cream/80 hover:text-cream"
              }`}
            >
              {nav[anchor]}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <LanguageSwitcher
            current={locale}
            variant={solid ? "dark" : "light"}
            className="hidden sm:flex"
          />
          <a
            href="#booking"
            className="hidden rounded-full bg-olive-deep px-5 py-2.5 text-sm font-medium text-cream shadow-(--shadow-card) transition-all duration-200 hover:-translate-y-0.5 hover:bg-olive-ink hover:shadow-(--shadow-card-hover) sm:inline-block"
          >
            {nav.cta}
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Menu"
            className={`grid size-10 place-items-center rounded-full transition-colors duration-200 lg:hidden ${
              solid ? "text-ink" : "text-cream"
            }`}
          >
            {open ? <X className="size-6" aria-hidden /> : <Menu className="size-6" aria-hidden />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            aria-label="Mobile"
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: EASE_PREMIUM }}
            className="overflow-hidden border-t border-stone/50 bg-cream/95 backdrop-blur-md lg:hidden"
          >
            <div className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-4">
              {NAV_ANCHORS.map((anchor) => (
                <a
                  key={anchor}
                  href={`#${anchor}`}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-[15px] text-ink-soft transition-colors hover:bg-sand hover:text-ink"
                >
                  {nav[anchor]}
                </a>
              ))}
              <a
                href="#booking"
                onClick={() => setOpen(false)}
                className="mt-2 rounded-full bg-olive-deep px-5 py-3 text-center text-sm font-medium text-cream"
              >
                {nav.cta}
              </a>
              <LanguageSwitcher current={locale} variant="dark" className="mt-3 justify-center sm:hidden" />
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
