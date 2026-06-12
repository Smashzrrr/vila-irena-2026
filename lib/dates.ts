/**
 * Date utilities built on "YYYY-MM-DD" ISO strings.
 * Lexicographic comparison of these strings equals chronological order,
 * and all math goes through Date.UTC so local timezones can't shift days.
 */

const DAY_MS = 86_400_000;

export function toISO(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Today as an ISO date in the user's local timezone. */
export function todayISO(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function isoToUTC(iso: string): number {
  const [y, m, d] = iso.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}

export function addDays(iso: string, days: number): string {
  return toISO(new Date(isoToUTC(iso) + days * DAY_MS));
}

export function nightsBetween(checkIn: string, checkOut: string): number {
  return Math.round((isoToUTC(checkOut) - isoToUTC(checkIn)) / DAY_MS);
}

export interface MonthRef {
  year: number;
  /** 1-12 */
  month: number;
}

export function monthRefFromISO(iso: string): MonthRef {
  const [y, m] = iso.split("-").map(Number);
  return { year: y, month: m };
}

export function addMonths(ref: MonthRef, count: number): MonthRef {
  const zeroBased = ref.year * 12 + (ref.month - 1) + count;
  return { year: Math.floor(zeroBased / 12), month: (zeroBased % 12) + 1 };
}

export function compareMonthRef(a: MonthRef, b: MonthRef): number {
  return a.year * 12 + a.month - (b.year * 12 + b.month);
}

/**
 * Calendar grid for one month: weeks of 7 cells, Monday-first,
 * each cell an ISO date or null for padding.
 */
export function monthGrid(ref: MonthRef): (string | null)[][] {
  const first = new Date(Date.UTC(ref.year, ref.month - 1, 1));
  const daysInMonth = new Date(Date.UTC(ref.year, ref.month, 0)).getUTCDate();
  const leadingBlanks = (first.getUTCDay() + 6) % 7; // Monday = 0

  const cells: (string | null)[] = Array.from({ length: leadingBlanks }, () => null);
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(toISO(new Date(Date.UTC(ref.year, ref.month - 1, day))));
  }
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (string | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

export function formatMonthYear(ref: MonthRef, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(ref.year, ref.month - 1, 1)));
}

/** Monday-first localized short weekday names. */
export function weekdayNames(locale: string): string[] {
  const fmt = new Intl.DateTimeFormat(locale, { weekday: "short", timeZone: "UTC" });
  // 2024-01-01 was a Monday.
  return Array.from({ length: 7 }, (_, i) =>
    fmt.format(new Date(Date.UTC(2024, 0, 1 + i))),
  );
}

export function formatDateLong(iso: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(isoToUTC(iso)));
}

export function dayOfMonth(iso: string): number {
  return Number(iso.slice(8, 10));
}
