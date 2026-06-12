import { parseIcs, type BlockedRange } from "./ical";
import { getMockBlockedRanges } from "./mock-availability";
import { todayISO } from "./dates";

export interface AvailabilityPayload {
  source: "ical" | "mock";
  fetchedAt: string;
  blocked: BlockedRange[];
}

/** Drop past ranges and clamp ranges that started in the past to today. */
function pruneToFuture(ranges: BlockedRange[], today: string): BlockedRange[] {
  const pruned: BlockedRange[] = [];
  for (const r of ranges) {
    if (r.end <= today) continue;
    pruned.push({ start: r.start < today ? today : r.start, end: r.end });
  }
  return pruned;
}

export async function getBlockedRanges(): Promise<AvailabilityPayload> {
  const url = process.env.AIRBNB_ICAL_URL;
  const today = todayISO();

  if (url) {
    try {
      const res = await fetch(url, {
        next: { revalidate: 3600 },
        headers: { "User-Agent": "VilaIrena/1.0 (availability sync)" },
      });
      if (!res.ok) throw new Error(`iCal fetch failed with status ${res.status}`);
      const blocked = pruneToFuture(parseIcs(await res.text()), today);
      return { source: "ical", fetchedAt: new Date().toISOString(), blocked };
    } catch (error) {
      console.error("AVAILABILITY_ICAL_ERROR", error);
      // fall through to mock so the calendar stays usable
    }
  }

  return {
    source: "mock",
    fetchedAt: new Date().toISOString(),
    blocked: getMockBlockedRanges(today),
  };
}
