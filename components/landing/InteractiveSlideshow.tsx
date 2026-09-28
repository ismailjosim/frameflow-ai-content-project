"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Maximize2, Pause, Play, Sparkles } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { SlideshowHotspots } from "./SlideshowHotspots";
import { SlideshowInfoPanel } from "./SlideshowInfoPanel";
import { SlideshowLightbox } from "./SlideshowLightbox";
import { SLIDES_DATA, type SlideData } from "./slideshow.data";

const AUTO_PLAY_INTERVAL = 7000; // 7 seconds per slide

const badgeColorClasses: Record<string, string> = {
  purple:
    "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  cyan: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
  pink: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
  orange:
    "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
};

export function InteractiveSlideshow() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [direction, setDirection] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [activeFeatureIdx, setActiveFeatureIdx] = useState(0);
  const [selectedHotspot, setSelectedHotspot] = useState<number | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  const slide: SlideData = SLIDES_DATA[currentIdx];
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  const goToSlide = useCallback((newIdx: number, newDirection: number) => {
    setDirection(newDirection);
    setCurrentIdx(newIdx);
    setActiveFeatureIdx(0);
    setSelectedHotspot(null);
    setProgress(0);
  }, []);

  const handleNext = useCallback(() => {
    goToSlide((currentIdx + 1) % SLIDES_DATA.length, 1);
  }, [currentIdx, goToSlide]);

  const handlePrev = useCallback(() => {
    goToSlide((currentIdx - 1 + SLIDES_DATA.length) % SLIDES_DATA.length, -1);
  }, [currentIdx, goToSlide]);

  // Handle auto-advance and progress bar
  useEffect(() => {
    if (!isAutoPlaying || isLightboxOpen) {
      if (timerRef.current) clearInterval(timerRef.current);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      return;
    }

    const startTime = Date.now();
    const interval = 50;

    progressTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / AUTO_PLAY_INTERVAL) * 100, 100);
      setProgress(pct);
    }, interval);

    timerRef.current = setTimeout(() => {
      handleNext();
    }, AUTO_PLAY_INTERVAL);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [isAutoPlaying, isLightboxOpen, handleNext]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === " ") {
        e.preventDefault();
        setIsAutoPlaying((prev) => !prev);
      }
      if (e.key === "Escape" && isLightboxOpen) {
        setIsLightboxOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev, isLightboxOpen]);

  const slideVariants = {
    enter: (d: number) => ({
      x: d > 0 ? 40 : -40,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.45, ease: "easeOut" as const },
    },
    exit: (d: number) => ({
      x: d < 0 ? 40 : -40,
      opacity: 0,
      scale: 0.98,
      transition: { duration: 0.35, ease: "easeIn" as const },
    }),
  };

  return (
    <section className="relative py-16 sm:py-24 overflow-hidden border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/50 transition-colors">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-100 bg-[#8A3FFC]/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-linear-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 text-[#8A3FFC] dark:text-[#58E6F7] text-xs font-bold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Studio Tour</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            See the Complete{" "}
            <span className="text-frameflow-gradient">FrameFlow Engine</span> in
            Action
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Click through all 5 architectural milestones below or tap the
            beacons to inspect real-time outputs.
          </p>
        </div>

        {/* Slide Selector Pill Tabs with Progress Bars */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 px-2 no-scrollbar">
          {SLIDES_DATA.map((s, idx) => {
            const isActive = currentIdx === idx;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => goToSlide(idx, idx > currentIdx ? 1 : -1)}
                className={`relative px-3 sm:px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer overflow-hidden border ${
                  isActive
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-purple-500/50 shadow-lg shadow-purple-500/15"
                    : "bg-white/60 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                {isActive && (
                  <div
                    style={{ width: `${progress}%` }}
                    className="absolute left-0 bottom-0 h-0.5 bg-linear-to-r from-[#58E6F7] via-[#8A3FFC] to-[#E51FD1] transition-all duration-75"
                  />
                )}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="font-mono text-[10px] opacity-60">
                    0{s.stepNumber}
                  </span>
                  <span>{s.badge}</span>
                </div>
              </button>
            );
          })}

          {/* Autoplay Pause/Play Toggle Button */}
          <button
            type="button"
            onClick={() => setIsAutoPlaying((prev) => !prev)}
            className="p-2 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer shrink-0"
            title={isAutoPlaying ? "Pause Autoplay" : "Resume Autoplay"}
            aria-label={isAutoPlaying ? "Pause Autoplay" : "Resume Autoplay"}
          >
            {isAutoPlaying ? (
              <Pause className="w-3.5 h-3.5" />
            ) : (
              <Play className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Main Stage Display Card */}
        <div className="relative rounded-3xl p-4 sm:p-7 sm:pb-8 bg-white/80 dark:bg-slate-950/80 backdrop-blur-2xl border border-slate-200/90 dark:border-purple-500/20 shadow-2xl shadow-slate-900/5 dark:shadow-purple-500/5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
            {/* Left Column: Visual Canvas */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-200/80 dark:border-white/10 bg-slate-900 shadow-xl group">
                <AnimatePresence custom={direction} mode="wait">
                  <motion.div
                    key={slide.id}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="absolute inset-0 w-full h-full"
                  >
                    <Image
                      src={slide.imageSrc}
                      alt={slide.imageAlt}
                      fill
                      priority
                      unoptimized
                      className="object-cover object-top select-none"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                  </motion.div>
                </AnimatePresence>

                {/* Lightbox inspection button */}
                <button
                  type="button"
                  onClick={() => setIsLightboxOpen(true)}
                  className="absolute top-3 right-3 z-30 p-2 rounded-xl bg-slate-950/60 hover:bg-slate-950/90 backdrop-blur-md text-white border border-white/20 transition-all opacity-0 group-hover:opacity-100 hover:scale-110 cursor-pointer"
                  title="Expand to Fullscreen HD"
                  aria-label="Expand image"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>

                {/* Interactive Hotspots */}
                <SlideshowHotspots
                  slide={slide}
                  selectedHotspot={selectedHotspot}
                  onSelectHotspot={setSelectedHotspot}
                />
              </div>
            </div>

            {/* Right Column: Information & Controls Panel */}
            <SlideshowInfoPanel
              slide={slide}
              activeFeatureIdx={activeFeatureIdx}
              badgeColorClasses={badgeColorClasses}
              onSelectFeature={setActiveFeatureIdx}
              onNext={handleNext}
              onPrev={handlePrev}
            />
          </div>
        </div>
      </div>

      {/* High-Resolution Lightbox Modal */}
      <SlideshowLightbox
        isOpen={isLightboxOpen}
        slide={slide}
        onClose={() => setIsLightboxOpen(false)}
      />
    </section>
  );
}

export default InteractiveSlideshow;
