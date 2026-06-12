import { describe, expect, it } from "vitest";
import { mergeRanges, parseIcs } from "@/lib/ical";

const airbnbFeed = [
  "BEGIN:VCALENDAR",
  "PRODID:-//Airbnb Inc//Hosting Calendar 1.0//EN",
  "CALSCALE:GREGORIAN",
  "VERSION:2.0",
  "BEGIN:VEVENT",
  "DTSTAMP:20260601T120000Z",
  "DTSTART;VALUE=DATE:20260710",
  "DTEND;VALUE=DATE:20260715",
  "SUMMARY:Reserved",
  "UID:abc123@airbnb.com",
  "END:VEVENT",
  "BEGIN:VEVENT",
  "DTSTAMP:20260601T120000Z",
  "DTSTART;VALUE=DATE:20260801",
  "DTEND;VALUE=DATE:20260805",
  "SUMMARY:Airbnb (Not available)",
  "UID:def456@airbnb.com",
  "END:VEVENT",
  "END:VCALENDAR",
].join("\r\n");

describe("parseIcs", () => {
  it("parses Airbnb all-day events with exclusive DTEND", () => {
    expect(parseIcs(airbnbFeed)).toEqual([
      { start: "2026-07-10", end: "2026-07-15" },
      { start: "2026-08-01", end: "2026-08-05" },
    ]);
  });

  it("blocks events regardless of SUMMARY", () => {
    expect(parseIcs(airbnbFeed)).toHaveLength(2);
  });

  it("unfolds RFC 5545 continuation lines", () => {
    const folded = [
      "BEGIN:VCALENDAR",
      "BEGIN:VEVENT",
      "DTSTART;VALUE=DA",
      " TE:20260710",
      "DTEND;VALUE=DATE:20260712",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    expect(parseIcs(folded)).toEqual([{ start: "2026-07-10", end: "2026-07-12" }]);
  });

  it("handles datetime DTSTART forms by taking the date part", () => {
    const timed = [
      "BEGIN:VEVENT",
      "DTSTART:20260710T140000Z",
      "DTEND:20260712T100000Z",
      "END:VEVENT",
    ].join("\n");
    expect(parseIcs(timed)).toEqual([{ start: "2026-07-10", end: "2026-07-12" }]);
  });

  it("returns empty array for empty or garbage input", () => {
    expect(parseIcs("")).toEqual([]);
    expect(parseIcs("not an ics file\nat all")).toEqual([]);
  });

  it("drops events with missing or inverted dates", () => {
    const broken = [
      "BEGIN:VEVENT",
      "DTSTART;VALUE=DATE:20260715",
      "DTEND;VALUE=DATE:20260710",
      "END:VEVENT",
      "BEGIN:VEVENT",
      "DTSTART;VALUE=DATE:20260720",
      "END:VEVENT",
    ].join("\n");
    expect(parseIcs(broken)).toEqual([]);
  });

  it("merges overlapping events from the feed", () => {
    const overlapping = [
      "BEGIN:VEVENT",
      "DTSTART;VALUE=DATE:20260710",
      "DTEND;VALUE=DATE:20260714",
      "END:VEVENT",
      "BEGIN:VEVENT",
      "DTSTART;VALUE=DATE:20260712",
      "DTEND;VALUE=DATE:20260718",
      "END:VEVENT",
    ].join("\n");
    expect(parseIcs(overlapping)).toEqual([
      { start: "2026-07-10", end: "2026-07-18" },
    ]);
  });
});

describe("mergeRanges", () => {
  it("merges adjacent ranges (back-to-back bookings share a changeover day)", () => {
    expect(
      mergeRanges([
        { start: "2026-07-10", end: "2026-07-14" },
        { start: "2026-07-14", end: "2026-07-18" },
      ]),
    ).toEqual([{ start: "2026-07-10", end: "2026-07-18" }]);
  });

  it("keeps disjoint ranges separate and sorts them", () => {
    expect(
      mergeRanges([
        { start: "2026-08-01", end: "2026-08-05" },
        { start: "2026-07-10", end: "2026-07-12" },
      ]),
    ).toEqual([
      { start: "2026-07-10", end: "2026-07-12" },
      { start: "2026-08-01", end: "2026-08-05" },
    ]);
  });

  it("handles contained ranges", () => {
    expect(
      mergeRanges([
        { start: "2026-07-10", end: "2026-07-20" },
        { start: "2026-07-12", end: "2026-07-15" },
      ]),
    ).toEqual([{ start: "2026-07-10", end: "2026-07-20" }]);
  });
});
