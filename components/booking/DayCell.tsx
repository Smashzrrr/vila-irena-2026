"use client";

import { memo } from "react";
import { dayOfMonth } from "@/lib/dates";

export const DayCell = memo(function DayCell({
  date,
  ariaLabel,
  past,
  blockedNight,
  selectable,
  isStart,
  isEnd,
  inRange,
  onClick,
  onHover,
}: {
  date: string;
  ariaLabel: string;
  past: boolean;
  blockedNight: boolean;
  selectable: boolean;
  isStart: boolean;
  isEnd: boolean;
  inRange: boolean;
  onClick: (date: string) => void;
  onHover: (date: string | null) => void;
}) {
  let tone: string;
  if (isStart || isEnd) {
    tone = "bg-olive-deep font-medium text-cream";
  } else if (inRange) {
    tone = "bg-olive/15 text-ink";
  } else if (blockedNight) {
    tone = "text-ink-faint/55 line-through decoration-ink-faint/40";
  } else if (past || !selectable) {
    tone = "text-ink-faint/40";
  } else {
    tone = "text-ink hover:bg-olive-tint";
  }

  return (
    <button
      type="button"
      disabled={!selectable}
      aria-label={ariaLabel}
      aria-pressed={isStart || isEnd}
      onClick={() => onClick(date)}
      onMouseEnter={selectable ? () => onHover(date) : undefined}
      className={`mx-auto grid size-9 place-items-center rounded-full text-sm transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olive disabled:cursor-default md:size-10 ${tone}`}
    >
      {dayOfMonth(date)}
    </button>
  );
});
