"use client";

import { useCallback, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Dictionary } from "@/lib/dictionaries";
import type { GalleryImage } from "@/lib/image-manifest";
import { EASE_PREMIUM } from "@/components/ui/Reveal";

export function Lightbox({
  images,
  alt,
  labels,
  openIndex,
  onClose,
  onNavigate,
}: {
  images: GalleryImage[];
  alt: Dictionary["gallery"]["alt"];
  labels: Pick<Dictionary["gallery"], "close" | "previous" | "next" | "counter">;
  openIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  const reduce = useReducedMotion();
  const isOpen = openIndex !== null;

  const prev = useCallback(() => {
    if (openIndex === null) return;
    onNavigate((openIndex - 1 + images.length) % images.length);
  }, [openIndex, images.length, onNavigate]);

  const next = useCallback(() => {
    if (openIndex === null) return;
    onNavigate((openIndex + 1) % images.length);
  }, [openIndex, images.length, onNavigate]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose, prev, next]);

  const img = openIndex !== null ? images[openIndex] : null;

  return (
    <AnimatePresence>
      {img && openIndex !== null && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={alt[img.category]}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduce ? undefined : { opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/95 p-4"
          onClick={onClose}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label={labels.close}
            className="absolute right-4 top-4 z-10 grid size-11 place-items-center rounded-full bg-cream/10 text-cream transition-colors hover:bg-cream/20"
          >
            <X className="size-6" aria-hidden />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label={labels.previous}
            className="absolute left-2 z-10 grid size-11 place-items-center rounded-full bg-cream/10 text-cream transition-colors hover:bg-cream/20 md:left-6"
          >
            <ChevronLeft className="size-6" aria-hidden />
          </button>

          <motion.div
            key={img.id}
            initial={reduce ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, ease: EASE_PREMIUM }}
            className="relative max-h-[85vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={img.src}
              alt={alt[img.category]}
              width={img.width}
              height={img.height}
              sizes="90vw"
              className="max-h-[85vh] w-auto rounded-lg object-contain"
            />
          </motion.div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label={labels.next}
            className="absolute right-2 z-10 grid size-11 place-items-center rounded-full bg-cream/10 text-cream transition-colors hover:bg-cream/20 md:right-6"
          >
            <ChevronRight className="size-6" aria-hidden />
          </button>

          <p className="absolute bottom-5 text-sm text-cream/70">
            {labels.counter
              .replace("{current}", String(openIndex + 1))
              .replace("{total}", String(images.length))}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
