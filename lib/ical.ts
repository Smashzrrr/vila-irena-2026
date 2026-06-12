/**
 * Minimal ICS parser for availability feeds (Airbnb/Booking export format):
 * all-day VEVENTs with DTSTART;VALUE=DATE / DTEND;VALUE=DATE where DTEND
 * is exclusive (the checkout day). Every event counts as blocked regardless
 * of SUMMARY ("Reserved" and "Not available" are both unbookable).
 */

export interface BlockedRange {
  /** First blocked night, "YYYY-MM-DD". */
  start: string;
  /** Exclusive end: the checkout day, "YYYY-MM-DD". */
  end: string;
}

function parseIcsDate(line: string): string | null {
  const value = line.split(":").pop()?.trim() ?? "";
  // Handles both YYYYMMDD and YYYYMMDDTHHMMSS(Z) forms.
  const match = value.match(/^(\d{4})(\d{2})(\d{2})/);
  return match ? `${match[1]}-${match[2]}-${match[3]}` : null;
}

export function parseIcs(ics: string): BlockedRange[] {
  // Unfold: per RFC 5545, lines starting with a space/tab continue the previous line.
  const unfolded: string[] = [];
  for (const raw of ics.split(/\r?\n/)) {
    if ((raw.startsWith(" ") || raw.startsWith("\t")) && unfolded.length > 0) {
      unfolded[unfolded.length - 1] += raw.slice(1);
    } else {
      unfolded.push(raw);
    }
  }

  const ranges: BlockedRange[] = [];
  let inEvent = false;
  let start: string | null = null;
  let end: string | null = null;

  for (const line of unfolded) {
    if (line.startsWith("BEGIN:VEVENT")) {
      inEvent = true;
      start = null;
      end = null;
    } else if (line.startsWith("END:VEVENT")) {
      if (inEvent && start && end && end > start) ranges.push({ start, end });
      inEvent = false;
    } else if (inEvent) {
      if (line.startsWith("DTSTART")) start = parseIcsDate(line);
      else if (line.startsWith("DTEND")) end = parseIcsDate(line);
    }
  }

  return mergeRanges(ranges);
}

/** Sort and merge overlapping or adjacent ranges. */
export function mergeRanges(ranges: BlockedRange[]): BlockedRange[] {
  const sorted = [...ranges].sort((a, b) => a.start.localeCompare(b.start));
  const merged: BlockedRange[] = [];
  for (const range of sorted) {
    const last = merged[merged.length - 1];
    if (last && range.start <= last.end) {
      if (range.end > last.end) last.end = range.end;
    } else {
      merged.push({ ...range });
    }
  }
  return merged;
}
