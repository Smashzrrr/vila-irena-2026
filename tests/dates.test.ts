import { describe, expect, it } from "vitest";
import {
  addDays,
  addMonths,
  compareMonthRef,
  formatMonthYear,
  monthGrid,
  nightsBetween,
  weekdayNames,
} from "@/lib/dates";

describe("addDays", () => {
  it("crosses month and year boundaries", () => {
    expect(addDays("2026-06-30", 1)).toBe("2026-07-01");
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
    expect(addDays("2026-07-01", -1)).toBe("2026-06-30");
  });

  it("handles leap February", () => {
    expect(addDays("2028-02-28", 1)).toBe("2028-02-29");
    expect(addDays("2026-02-28", 1)).toBe("2026-03-01");
  });
});

describe("monthGrid", () => {
  it("is Monday-first (June 2026 starts on Monday)", () => {
    const grid = monthGrid({ year: 2026, month: 6 });
    expect(grid[0][0]).toBe("2026-06-01");
    expect(grid[0][6]).toBe("2026-06-07");
  });

  it("pads leading blanks for months not starting on Monday", () => {
    // 1 August 2026 is a Saturday → 5 leading nulls.
    const grid = monthGrid({ year: 2026, month: 8 });
    expect(grid[0].slice(0, 5)).toEqual([null, null, null, null, null]);
    expect(grid[0][5]).toBe("2026-08-01");
  });

  it("covers leap February fully", () => {
    const grid = monthGrid({ year: 2028, month: 2 });
    const days = grid.flat().filter(Boolean);
    expect(days[0]).toBe("2028-02-01");
    expect(days[days.length - 1]).toBe("2028-02-29");
    expect(days).toHaveLength(29);
  });

  it("always emits full weeks of 7", () => {
    for (const month of [1, 2, 6, 8, 12]) {
      for (const week of monthGrid({ year: 2026, month })) {
        expect(week).toHaveLength(7);
      }
    }
  });
});

describe("addMonths / compareMonthRef", () => {
  it("wraps years", () => {
    expect(addMonths({ year: 2026, month: 12 }, 1)).toEqual({ year: 2027, month: 1 });
    expect(addMonths({ year: 2026, month: 1 }, -1)).toEqual({ year: 2025, month: 12 });
    expect(addMonths({ year: 2026, month: 6 }, 18)).toEqual({ year: 2027, month: 12 });
  });

  it("compares chronologically", () => {
    expect(compareMonthRef({ year: 2026, month: 6 }, { year: 2026, month: 7 })).toBeLessThan(0);
    expect(compareMonthRef({ year: 2027, month: 1 }, { year: 2026, month: 12 })).toBeGreaterThan(0);
    expect(compareMonthRef({ year: 2026, month: 6 }, { year: 2026, month: 6 })).toBe(0);
  });
});

describe("localization", () => {
  it("formats month names per locale", () => {
    expect(formatMonthYear({ year: 2026, month: 7 }, "en")).toMatch(/July 2026/);
    expect(formatMonthYear({ year: 2026, month: 7 }, "hr")).toMatch(/srpanj/i);
    expect(formatMonthYear({ year: 2026, month: 7 }, "de")).toMatch(/Juli 2026/);
  });

  it("returns 7 Monday-first weekday names", () => {
    const en = weekdayNames("en");
    expect(en).toHaveLength(7);
    expect(en[0]).toMatch(/Mon/);
    expect(en[6]).toMatch(/Sun/);
  });
});

describe("nightsBetween", () => {
  it("is timezone-safe across DST transitions", () => {
    // Europe DST switch late March: must still be exact day counts.
    expect(nightsBetween("2026-03-28", "2026-03-30")).toBe(2);
    expect(nightsBetween("2026-10-24", "2026-10-26")).toBe(2);
  });
});
