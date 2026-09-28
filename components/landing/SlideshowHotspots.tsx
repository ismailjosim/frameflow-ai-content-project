"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, Zap } from "lucide-react";
import type { SlideData } from "./slideshow.data";

interface SlideshowHotspotsProps {
  slide: SlideData;
  selectedHotspot: number | null;
  onSelectHotspot: (idx: number | null) => void;
}

export function SlideshowHotspots({
  slide,
  selectedHotspot,
  onSelectHotspot,
}: SlideshowHotspotsProps) {
  return (
    <>
      <div className="absolute inset-0 pointer-events-none z-20">
        {slide.hotspots.map((hotspot, hIdx) => {
          const isSelected = selectedHotspot === hIdx;
          return (
            <div
              key={`${slide.id}-${hotspot.label}`}
              style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
              className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 group"
            >
              <button
                type="button"
                onClick={() => onSelectHotspot(isSelected ? null : hIdx)}
                className="relative flex items-center justify-center cursor-pointer"
                aria-label={`Hotspot: ${hotspot.label}`}
              >
                <span className="absolute w-8 h-8 rounded-full bg-[#8A3FFC]/40 animate-ping" />
                <span className="relative flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-linear-to-tr from-[#58E6F7] to-[#8A3FFC] text-slate-950 shadow-lg shadow-purple-500/50 hover:scale-125 transition-transform duration-200">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white" />
                </span>
              </button>

              {/* Hotspot Popover */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-56 sm:w-64 max-w-[calc(100vw-50px)] p-3 sm:p-3.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-purple-500/40 shadow-2xl shadow-slate-900/20 dark:shadow-black/80 z-30 pointer-events-auto text-left"
                  >
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 dark:border-white/10 mb-1.5">
                      <span className="text-[11px] font-bold text-[#8A3FFC] dark:text-[#58E6F7] flex items-center gap-1">
                        <Zap className="w-3 h-3 text-[#8A3FFC] dark:text-[#58E6F7]" />
                        {hotspot.label}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectHotspot(null);
                        }}
                        className="text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                      {hotspot.detail}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <div className="absolute bottom-2.5 sm:bottom-3 left-2.5 sm:left-3 z-20 pointer-events-none">
        <span className="hidden sm:inline-block px-2.5 py-1 rounded-lg bg-slate-950/70 backdrop-blur-sm text-slate-300 text-[10px] font-medium border border-white/10">
          Tap glowing beacons to inspect architecture
        </span>
      </div>
    </>
  );
}
