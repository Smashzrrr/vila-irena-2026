"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { EASE_PREMIUM } from "@/components/ui/Reveal";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import type { BlockedRange } from "@/lib/ical";
import { CALENDAR_MONTHS_AHEAD } from "@/lib/config";
import {
  addMonths,
  compareMonthRef,
  formatMonthYear,
  monthRefFromISO,
} from "@/lib/dates";
import { CalendarMonth } from "./CalendarMonth";

export function AvailabilityCalendar({
  booking,
  locale,
  today,
  blocked,
  loading,
  checkIn,
  checkOut,
  onDayClick,
}: {
  booking: Dictionary["booking"];
  locale: Locale;
  today: string;
  blocked: BlockedRange[];
  loading: boolean;
  checkIn: string | null;
  checkOut: string | null;
  onDayClick: (date: string) => void;
}) {
  const currentMonth = monthRefFromISO(today);
  const [visibleMonth, setVisibleMonth] = useState(currentMonth);
  const [direction, setDirection] = useState(1);
  const [hoverDate, setHoverDate] = useState<string | null>(null);
  const reduce = useReducedMotion();

  const navigate = (delta: number) => {
    setDirection(delta);
    setVisibleMonth(addMonths(visibleMonth, delta));
  };

  const secondMonth = addMonths(visibleMonth, 1);
  const prevDisabled = compareMonthRef(visibleMonth, currentMonth) <= 0;
  const nextDisabled =
    compareMonthRef(secondMonth, addMonths(currentMonth, CALENDAR_MONTHS_AHEAD)) >= 0;

  if (loading) {
    return (
      <div
        className="grid min-h-72 animate-pulse gap-8 lg:grid-cols-2"
        aria-busy="true"
        aria-label={booking.loading}
      >
        {[0, 1].map((i) => (
          <div key={i} className={i === 1 ? "hidden lg:block" : undefined}>
            <div className="mx-auto h-5 w-32 rounded bg-sand-deep" />
            <div className="mt-6 grid grid-cols-7 gap-2">
              {Array.from({ length: 35 }, (_, j) => (
                <div key={j} className="aspect-square rounded-full bg-sand/80" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  const navButton =
    "grid size-9 place-items-center rounded-full border border-stone/60 text-ink-soft transition-all duration-200 hover:border-olive hover:text-olive disabled:opacity-30 disabled:hover:border-stone/60 disabled:hover:text-ink-soft";

  return (
    <div onMouseLeave={() => setHoverDate(null)}>
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          disabled={prevDisabled}
          aria-label={booking.prevMonth}
          className={navButton}
        >
          <ChevronLeft className="size-5" aria-hidden />
        </button>
        <p className="text-sm font-medium text-ink lg:hidden">
          {formatMonthYear(visibleMonth, locale)}
        </p>
        <button
          type="button"
          onClick={() => navigate(1)}
          disabled={nextDisabled}
          aria-label={booking.nextMonth}
          className={navButton}
        >
          <ChevronRight className="size-5" aria-hidden />
        </button>
      </div>

      <AnimatePresence mode="popLayout" initial={false} custom={direction}>
        <motion.div
          key={`${visibleMonth.year}-${visibleMonth.month}`}
          custom={direction}
          initial={reduce ? false : { opacity: 0, x: 24 * direction }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduce ? undefined : { opacity: 0, x: -24 * direction }}
          transition={{ duration: 0.25, ease: EASE_PREMIUM }}
          className="grid gap-8 lg:grid-cols-2"
        >
        <CalendarMonth
          monthRef={visibleMonth}
          locale={locale}
          today={today}
          blocked={blocked}
          checkIn={checkIn}
          checkOut={checkOut}
          hoverDate={hoverDate}
          showTitle="lg-only"
          onDayClick={onDayClick}
          onDayHover={setHoverDate}
        />
        <div className="hidden lg:block">
          <CalendarMonth
            monthRef={secondMonth}
            locale={locale}
            today={today}
            blocked={blocked}
            checkIn={checkIn}
            checkOut={checkOut}
            hoverDate={hoverDate}
            showTitle="always"
            onDayClick={onDayClick}
            onDayHover={setHoverDate}
          />
        </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-ink-soft">
        <span className="flex items-center gap-2">
          <span aria-hidden className="size-3.5 rounded-full border border-stone/70 bg-white" />
          {booking.legendFree}
        </span>
        <span className="flex items-center gap-2">
          <span aria-hidden className="size-3.5 rounded-full bg-sand-deep line-through" />
          {booking.legendBlocked}
        </span>
        <span className="flex items-center gap-2">
          <span aria-hidden className="size-3.5 rounded-full bg-olive" />
          {booking.legendSelected}
        </span>
      </div>
    </div>
  );
}
