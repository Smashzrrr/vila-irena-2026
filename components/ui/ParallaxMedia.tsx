"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

export interface ParallaxImage {
  src: string;
  blurDataURL: string;
  alt: string;
  width: number;
  height: number;
}

interface ParallaxMediaProps {
  image: ParallaxImage;
  sizes: string;
  /** Extra classes for the fixed-aspect frame (rounding, shadow, etc.). */
  className?: string;
  /** Vertical parallax travel in px. Kept below the 16px edge buffer so no edge is ever revealed. */
  drift?: number;
  /** Tailwind aspect class — reserves the box so there is zero CLS. */
  aspect?: string;
  /** CSS object-position for the crop focal point, e.g. "right" or "70% 60%". */
  objectPosition?: string;
  priority?: boolean;
}

/**
 * Single-image media frame with a subtle scroll-linked parallax drift.
 * Mirrors Reveal.tsx — under prefers-reduced-motion it renders a plain static frame and
 * never mounts a scroll listener (the motion hooks live in a separate inner component).
 */
export function ParallaxMedia(props: ParallaxMediaProps) {
  const reduce = useReducedMotion();
  if (reduce) return <StaticFrame {...props} />;
  return <AnimatedFrame {...props} />;
}

function frameClass(aspect: string, className?: string) {
  return `relative overflow-hidden ${aspect} ${className ?? ""}`.trim();
}

/** Inner layer is oversized (−inset-y-4 ⇒ +32px tall) so a ±drift never exposes an edge. */
const LAYER = "absolute inset-x-0 -inset-y-4";

function StaticFrame({ image, sizes, className, aspect = "aspect-[4/3]", objectPosition, priority }: ParallaxMediaProps) {
  return (
    <div className={frameClass(aspect, className)}>
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        placeholder="blur"
        blurDataURL={image.blurDataURL}
        priority={priority}
        style={objectPosition ? { objectPosition } : undefined}
        className="object-cover"
      />
    </div>
  );
}

function AnimatedFrame({
  image,
  sizes,
  className,
  drift = 12,
  aspect = "aspect-[4/3]",
  objectPosition,
  priority,
}: ParallaxMediaProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-drift, drift]);

  return (
    <div ref={ref} className={frameClass(aspect, className)}>
      <motion.div style={{ y }} className={LAYER}>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          placeholder="blur"
          blurDataURL={image.blurDataURL}
          priority={priority}
          style={objectPosition ? { objectPosition } : undefined}
          className="object-cover"
        />
      </motion.div>
    </div>
  );
}
