import { describe, expect, it } from "vitest";
import {
  firstBlockedNightAfter,
  isNightBlocked,
  isRangeFree,
  isValidCheckIn,
  isValidCheckOut,
  nightsBetween,
} from "@/lib/booking-logic";
import type { BlockedRange } from "@/lib/ical";

const TODAY = "2026-06-12";
const blocked: BlockedRange[] = [
  { start: "2026-06-20", end: "2026-06-25" },
  { start: "2026-07-10", end: "2026-07-15" },
];

describe("isNightBlocked", () => {
  it("blocks nights inside a range", () => {
    expect(isNightBlocked("2026-06-20", blocked)).toBe(true);
    expect(isNightBlocked("2026-06-24", blocked)).toBe(true);
  });

  it("does not block the checkout day (exclusive end)", () => {
    expect(isNightBlocked("2026-06-25", blocked)).toBe(false);
  });
});

describe("isValidCheckIn", () => {
  it("rejects past dates", () => {
    expect(isValidCheckIn("2026-06-11", blocked, TODAY)).toBe(false);
  });

  it("accepts today and free future dates", () => {
    expect(isValidCheckIn(TODAY, blocked, TODAY)).toBe(true);
    expect(isValidCheckIn("2026-06-15", blocked, TODAY)).toBe(true);
  });

  it("rejects a blocked night", () => {
    expect(isValidCheckIn("2026-06-22", blocked, TODAY)).toBe(false);
  });

  it("accepts a blocked range's end day as new check-in (changeover day)", () => {
    expect(isValidCheckIn("2026-06-25", blocked, TODAY)).toBe(true);
  });
});

describe("firstBlockedNightAfter", () => {
  it("finds the nearest blocked range start after check-in", () => {
    expect(firstBlockedNightAfter("2026-06-15", blocked)).toBe("2026-06-20");
    expect(firstBlockedNightAfter("2026-06-25", blocked)).toBe("2026-07-10");
  });

  it("returns null when nothing is blocked ahead", () => {
    expect(firstBlockedNightAfter("2026-08-01", blocked)).toBeNull();
  });
});

describe("isValidCheckOut", () => {
  const MIN = 2;

  it("rejects checkout on or before check-in", () => {
    expect(isValidCheckOut("2026-06-15", "2026-06-15", blocked, MIN)).toBe(false);
    expect(isValidCheckOut("2026-06-15", "2026-06-14", blocked, MIN)).toBe(false);
  });

  it("enforces the minimum nights boundary exactly", () => {
    expect(isValidCheckOut("2026-06-15", "2026-06-16", blocked, MIN)).toBe(false);
    expect(isValidCheckOut("2026-06-15", "2026-06-17", blocked, MIN)).toBe(true);
  });

  it("enforces the maximum nights cap", () => {
    expect(isValidCheckOut("2026-08-01", "2026-08-31", blocked, MIN, 30)).toBe(true);
    expect(isValidCheckOut("2026-08-01", "2026-09-01", blocked, MIN, 30)).toBe(false);
  });

  it("allows checkout exactly on the next blocked range's start day", () => {
    expect(isValidCheckOut("2026-06-15", "2026-06-20", blocked, MIN)).toBe(true);
  });

  it("rejects checkout that would span a blocked range", () => {
    expect(isValidCheckOut("2026-06-15", "2026-06-21", blocked, MIN)).toBe(false);
    expect(isValidCheckOut("2026-06-15", "2026-06-27", blocked, MIN)).toBe(false);
  });
});

describe("isRangeFree", () => {
  it("accepts a stay ending exactly where a block starts", () => {
    expect(isRangeFree("2026-06-15", "2026-06-20", blocked)).toBe(true);
  });

  it("accepts a stay starting on a block's checkout day", () => {
    expect(isRangeFree("2026-06-25", "2026-06-28", blocked)).toBe(true);
  });

  it("rejects any overlap with a blocked night", () => {
    expect(isRangeFree("2026-06-18", "2026-06-21", blocked)).toBe(false);
    expect(isRangeFree("2026-06-24", "2026-06-26", blocked)).toBe(false);
    expect(isRangeFree("2026-06-12", "2026-07-20", blocked)).toBe(false);
  });
});

describe("nightsBetween", () => {
  it("counts nights between ISO dates", () => {
    expect(nightsBetween("2026-06-15", "2026-06-17")).toBe(2);
    expect(nightsBetween("2026-06-30", "2026-07-01")).toBe(1);
  });
});
