import { addDays } from "./dates";
import type { BlockedRange } from "./ical";

/**
 * Deterministic demo availability relative to today, used when
 * AIRBNB_ICAL_URL is not configured (or its fetch fails) so the
 * calendar UI always has something realistic to show.
 */
export function getMockBlockedRanges(today: string): BlockedRange[] {
  return [
    { start: addDays(today, 3), end: addDays(today, 7) },
    { start: addDays(today, 12), end: addDays(today, 14) },
    { start: addDays(today, 24), end: addDays(today, 30) },
    { start: addDays(today, 41), end: addDays(today, 46) },
    { start: addDays(today, 66), end: addDays(today, 73) },
  ];
}
