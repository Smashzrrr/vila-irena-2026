"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { Star } from "lucide-react";
import type { Dictionary } from "@/lib/dictionaries";
import { heroImage } from "@/lib/image-manifest";
import { EASE_PREMIUM } from "@/components/ui/Reveal";

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_PREMIUM } },
};

/**
 * The H1 is the page's LCP element: it must never start at opacity 0
 * (that would push LCP past hydration). Transform-only entrance.
 */
const titleVariants: Variants = {
  hidden: { y: 26 },
  visible: { y: 0, transition: { duration: 0.7, ease: EASE_PREMIUM } },
};

export function Hero({ hero }: { hero: Dictionary["hero"] }) {
  const reduce = useReducedMotion();

  return (
    // 92svh, not 100: full-viewport images are excluded as LCP candidates,
    // which would anchor LCP to the H1's font swap instead of the fast hero image.
    <section id="top" className="relative flex min-h-[92svh] items-center overflow-hidden">
      <motion.div
        className="absolute inset-0"
        initial={reduce ? false : { scale: 1.06 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.4, ease: EASE_PREMIUM }}
      >
        <Image
          src={heroImage.src}
          alt={hero.title}
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          placeholder="blur"
          blurDataURL={heroImage.blurDataURL}
          className="object-cover"
        />
      </motion.div>
      {/* Two scrims: bottom anchor + a left scrim behind the left-aligned text,
          so the bright sky no longer washes out the cream type. Right side stays airy. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/40 to-ink/45"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-ink/55 via-ink/15 to-transparent"
      />

      <motion.div
        className="relative mx-auto w-full max-w-6xl px-5 pt-24 pb-28 md:px-8"
        variants={containerVariants}
        initial={reduce ? false : "hidden"}
        animate="visible"
      >
        <div className="max-w-2xl">
          <motion.p
            variants={itemVariants}
            className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-cream/85"
          >
            <span aria-hidden className="h-px w-10 bg-cream/60" />
            {hero.eyebrow}
          </motion.p>
          <motion.h1
            variants={titleVariants}
            className="mt-5 font-display text-5xl font-semibold leading-[1.05] text-cream [text-shadow:0_2px_18px_rgb(43_39_34/0.45)] sm:text-6xl lg:text-7xl"
          >
            {hero.title}
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="mt-6 max-w-xl text-lg leading-relaxed text-cream/90 [text-shadow:0_1px_10px_rgb(43_39_34/0.4)]"
          >
            {hero.subtitle}
          </motion.p>
          <motion.div variants={itemVariants} className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#booking"
              className="rounded-full bg-olive-deep px-7 py-3.5 text-[15px] font-medium text-cream shadow-(--shadow-card) transition-all duration-200 hover:-translate-y-0.5 hover:bg-olive-ink hover:shadow-(--shadow-card-hover)"
            >
              {hero.cta}
            </a>
            <a
              href="#about"
              className="rounded-full border border-cream/40 px-7 py-3.5 text-[15px] font-medium text-cream transition-all duration-200 hover:-translate-y-0.5 hover:border-cream/80 hover:bg-cream/10"
            >
              {hero.ctaSecondary}
            </a>
          </motion.div>
          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-cream/85"
          >
            <span className="flex items-center gap-1.5">
              <Star aria-hidden className="size-4 fill-amber-300 text-amber-300" />
              <strong className="font-semibold text-cream">{hero.rating}</strong>
              {hero.ratingLabel}
            </span>
            <span aria-hidden className="text-cream/40">·</span>
            <span>{hero.reviews}</span>
            <span aria-hidden className="text-cream/40">·</span>
            <span>{hero.superhost}</span>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
