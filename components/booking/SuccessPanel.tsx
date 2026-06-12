"use client";

import { motion, useReducedMotion } from "motion/react";
import type { Dictionary } from "@/lib/dictionaries";
import { EASE_PREMIUM } from "@/components/ui/Reveal";

export function SuccessPanel({
  success,
  onAgain,
}: {
  success: Dictionary["success"];
  onAgain: () => void;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE_PREMIUM }}
      className="flex h-full flex-col items-center justify-center rounded-2xl bg-olive-tint/60 p-8 text-center"
      role="status"
    >
      <svg viewBox="0 0 52 52" className="size-16 text-olive" aria-hidden>
        <motion.circle
          cx="26"
          cy="26"
          r="24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          initial={reduce ? undefined : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
        <motion.path
          d="M15 27.5 22.5 35 37 19"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reduce ? undefined : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.45, delay: reduce ? 0 : 0.45, ease: "easeOut" }}
        />
      </svg>
      <h3 className="mt-5 font-display text-2xl text-ink">{success.title}</h3>
      <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-ink-soft">{success.body}</p>
      <button
        type="button"
        onClick={onAgain}
        className="mt-7 rounded-full border border-olive px-6 py-2.5 text-sm font-medium text-olive-deep transition-all duration-200 hover:-translate-y-0.5 hover:bg-olive-deep hover:text-cream"
      >
        {success.again}
      </button>
    </motion.div>
  );
}
