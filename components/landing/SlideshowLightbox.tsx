"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import type { SlideData } from "./slideshow.data";

interface SlideshowLightboxProps {
  isOpen: boolean;
  slide: SlideData;
  onClose: () => void;
}

export function SlideshowLightbox({
  isOpen,
  slide,
  onClose,
}: SlideshowLightboxProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-2xl p-4 sm:p-8 flex flex-col items-center justify-center cursor-zoom-out"
        >
          <div className="w-full max-w-6xl flex items-center justify-between text-white pb-3">
            <div>
              <span className="text-xs uppercase tracking-wider text-purple-400 font-bold">
                High-Resolution Inspection
              </span>
              <h4 className="text-lg font-bold">
                {slide.title} {slide.highlightText}
              </h4>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div
            className="relative w-full max-w-6xl max-h-[82vh] aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={slide.imageSrc}
              alt={slide.imageAlt}
              fill
              unoptimized
              className="object-contain"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
