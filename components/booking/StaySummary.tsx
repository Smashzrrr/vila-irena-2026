"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CalendarDays, X } from "lucide-react";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { MIN_NIGHTS } from "@/lib/config";
import { formatDateLong, nightsBetween } from "@/lib/dates";
import { EASE_PREMIUM } from "@/components/ui/Reveal";

function nightsLabel(n: number, locale: Locale, booking: Dictionary["booking"]): string {
  const rule = new Intl.PluralRules(locale).select(n);
  const template =
    rule === "one" ? booking.nightOne : rule === "few" ? booking.nightFew : booking.nightOther;
  return template.replace("{n}", String(n));
}

export function StaySummary({
  booking,
  locale,
  checkIn,
  checkOut,
  onClear,
}: {
  booking: Dictionary["booking"];
  locale: Locale;
  checkIn: string | null;
  checkOut: string | null;
  onClear: () => void;
}) {
  const reduce = useReducedMotion();

  return (
    <div className="rounded-2xl border border-stone/50 bg-sand/50 p-5">
      {!checkIn ? (
        <p className="flex items-center gap-2.5 text-sm text-ink-soft">
          <CalendarDays aria-hidden className="size-5 shrink-0 text-olive" />
          {booking.hintCheckIn}
        </p>
      ) : (
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${checkIn}-${checkOut ?? "pending"}`}
            initial={reduce ? false : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, ease: EASE_PREMIUM }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="grid flex-1 grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
                    {booking.checkIn}
                  </p>
                  <p className="mt-1 text-sm font-medium text-ink">
                    {formatDateLong(checkIn, locale)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
                    {booking.checkOut}
                  </p>
                  <p className="mt-1 text-sm font-medium text-ink">
                    {checkOut ? formatDateLong(checkOut, locale) : "·"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClear}
                aria-label={booking.clear}
                className="grid size-8 shrink-0 place-items-center rounded-full text-ink-faint transition-colors hover:bg-sand-deep hover:text-ink"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>
            {checkOut ? (
              <p className="mt-3 inline-block rounded-full bg-olive-tint px-3 py-1 text-xs font-medium text-olive-deep">
                {nightsLabel(nightsBetween(checkIn, checkOut), locale, booking)}
              </p>
            ) : (
              <p className="mt-3 text-xs text-ink-soft">
                {booking.hintCheckOut}{" "}
                <span className="text-ink-faint">
                  {booking.minStayNote.replace("{n}", String(MIN_NIGHTS))}
                </span>
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
