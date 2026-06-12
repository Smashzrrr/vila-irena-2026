"use client";

import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import type { BlockedRange } from "@/lib/ical";
import { MIN_NIGHTS } from "@/lib/config";
import {
  isNightBlocked,
  isValidCheckIn,
  isValidCheckOut,
} from "@/lib/booking-logic";
import {
  formatDateLong,
  formatMonthYear,
  monthGrid,
  weekdayNames,
  type MonthRef,
} from "@/lib/dates";
import { DayCell } from "./DayCell";

export function CalendarMonth({
  monthRef,
  locale,
  today,
  blocked,
  checkIn,
  checkOut,
  hoverDate,
  showTitle,
  onDayClick,
  onDayHover,
}: {
  monthRef: MonthRef;
  locale: Locale;
  today: string;
  blocked: BlockedRange[];
  checkIn: string | null;
  checkOut: string | null;
  hoverDate: string | null;
  /** "always" | "lg-only": the mobile layout shows the title in the nav bar instead. */
  showTitle: "always" | "lg-only";
  onDayClick: (date: string) => void;
  onDayHover: (date: string | null) => void;
}) {
  const weeks = monthGrid(monthRef);
  const weekdays = weekdayNames(locale);
  const selectingCheckOut = checkIn !== null && checkOut === null;

  // Range end for the tint band: confirmed checkout, or hover preview while selecting.
  const previewEnd =
    selectingCheckOut &&
    hoverDate &&
    isValidCheckOut(checkIn, hoverDate, blocked, MIN_NIGHTS)
      ? hoverDate
      : null;
  const rangeEnd = checkOut ?? previewEnd;

  return (
    <div>
      <p
        className={`text-center text-sm font-medium text-ink ${
          showTitle === "lg-only" ? "hidden lg:block" : ""
        }`}
      >
        {formatMonthYear(monthRef, locale)}
      </p>

      <div className="mt-4 grid grid-cols-7 gap-y-1">
        {weekdays.map((name) => (
          <span
            key={name}
            aria-hidden
            className="grid h-8 place-items-center text-[11px] font-semibold uppercase tracking-wide text-ink-faint"
          >
            {name}
          </span>
        ))}

        {weeks.flat().map((date, i) => {
          if (!date) return <span key={`pad-${i}`} aria-hidden />;

          const blockedNight = isNightBlocked(date, blocked);
          const past = date < today;
          const selectable = selectingCheckOut
            ? date === checkIn ||
              isValidCheckOut(checkIn, date, blocked, MIN_NIGHTS) ||
              isValidCheckIn(date, blocked, today)
            : isValidCheckIn(date, blocked, today);

          return (
            <DayCell
              key={date}
              date={date}
              ariaLabel={formatDateLong(date, locale)}
              past={past}
              blockedNight={blockedNight}
              selectable={selectable}
              isStart={date === checkIn}
              isEnd={date === checkOut}
              inRange={
                checkIn !== null &&
                rangeEnd !== null &&
                date > checkIn &&
                date < rangeEnd
              }
              onClick={onDayClick}
              onHover={onDayHover}
            />
          );
        })}
      </div>
    </div>
  );
}
