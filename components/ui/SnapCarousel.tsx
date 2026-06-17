import type { ReactNode } from "react";

/**
 * Mobile-only horizontal scroll-snap track (pure CSS — no JS). Keyboard-focusable and
 * arrow-scrollable via role/tabIndex; hidden at lg where the desktop layout takes over.
 * snap-proximity (not mandatory) avoids hijacking diagonal flicks on nested tracks.
 */
export function SnapTrack({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      tabIndex={0}
      className={`flex snap-x snap-proximity gap-4 overflow-x-auto -mx-5 scroll-px-5 px-5 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] focus-visible:outline-2 focus-visible:outline-olive md:-mx-8 md:scroll-px-8 md:px-8 lg:hidden ${className ?? ""}`.trim()}
    >
      {children}
    </div>
  );
}

/** One snap stop. The next item peeks ~18vw as a "swipe sideways" cue. */
export function SnapItem({
  children,
  widthClass = "w-[82vw] sm:w-[60vw]",
}: {
  children: ReactNode;
  widthClass?: string;
}) {
  return <div className={`shrink-0 snap-start ${widthClass}`}>{children}</div>;
}
