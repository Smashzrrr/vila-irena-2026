import type { BlockedRange } from "./ical";
import { nightsBetween } from "./dates";
import { MAX_NIGHTS } from "./config";

/**
 * Vacation-rental semantics: NIGHTS are blocked, not days.
 * A blocked range's `end` (checkout day) is a valid new check-in,
 * and a blocked range's `start` is a valid checkout for a stay ending there.
 */

export function isNightBlocked(date: string, blocked: BlockedRange[]): boolean {
  return blocked.some((r) => r.start <= date && date < r.end);
}

export function isValidCheckIn(
  date: string,
  blocked: BlockedRange[],
  today: string,
): boolean {
  return date >= today && !isNightBlocked(date, blocked);
}

/** Start of the nearest blocked range strictly after the given check-in. */
export function firstBlockedNightAfter(
  checkIn: string,
  blocked: BlockedRange[],
): string | null {
  let min: string | null = null;
  for (const r of blocked) {
    if (r.start > checkIn && (min === null || r.start < min)) min = r.start;
  }
  return min;
}

export function isValidCheckOut(
  checkIn: string,
  date: string,
  blocked: BlockedRange[],
  minNights: number,
  maxNights: number = MAX_NIGHTS,
): boolean {
  if (date <= checkIn) return false;
  const nights = nightsBetween(checkIn, date);
  if (nights < minNights || nights > maxNights) return false;
  const limit = firstBlockedNightAfter(checkIn, blocked);
  return limit === null || date <= limit;
}

/** True when every night of [checkIn, checkOut) is free. */
export function isRangeFree(
  checkIn: string,
  checkOut: string,
  blocked: BlockedRange[],
): boolean {
  return !blocked.some((r) => r.start < checkOut && checkIn < r.end);
}

export { nightsBetween };
