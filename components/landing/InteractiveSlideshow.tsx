"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Maximize2,
  Pause,
  Play,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { SLIDES_DATA, type SlideData } from "./slideshow.data";

const AUTO_PLAY_INTERVAL = 7000; // 7 seconds per slide

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

  const badgeColorClasses = {
    purple:
      "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    cyan: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    pink: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
    emerald:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    amber:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  };

  return (
    <section
      id="interactive-tour"
      className="relative py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full overflow-hidden"
    >
      {/* ── Section Header ── */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-[#8A3FFC] animate-pulse" />
          <span>Interactive Architectural Showcase</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
          Explore the{" "}
          <span className="text-frameflow-gradient">Engine In Action</span>
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Navigate through all 5 layers of our cinematic 3D workflow — from
          viral ideation and waveform acoustic timing to batch visual generation
          and failover routing.
        </p>
      </div>

      {/* ── Slide Navigation Tabs ── */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 mb-6">
        {SLIDES_DATA.map((item, idx) => {
          const isActive = idx === currentIdx;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => goToSlide(idx, idx > currentIdx ? 1 : -1)}
              className={`group relative text-left p-3.5 rounded-2xl transition-all duration-200 cursor-pointer overflow-hidden border ${
                isActive
                  ? "bg-white dark:bg-slate-900 border-[#8A3FFC] shadow-lg shadow-[#8A3FFC]/15 scale-[1.02]"
                  : "bg-slate-100/70 hover:bg-slate-100 dark:bg-slate-900/40 dark:hover:bg-slate-900/80 border-slate-200/80 hover:border-purple-300 dark:border-slate-800 dark:hover:border-slate-700"
              }`}
            >
              {/* Progress bar for active tab */}
              {isActive && (
                <div
                  className="absolute bottom-0 left-0 h-1 bg-linear-to-r from-[#58E6F7] via-[#8A3FFC] to-[#E51FD1] transition-all duration-75"
                  style={{ width: `${progress}%` }}
                />
              )}

              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`text-[10px] font-black tracking-wider uppercase ${
                    isActive
                      ? "text-[#8A3FFC] dark:text-[#58E6F7]"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  Step {item.stepNumber}
                </span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8A3FFC] animate-ping" />
                )}
              </div>

              <p
                className={`text-xs font-bold truncate ${
                  isActive
                    ? "text-slate-900 dark:text-white"
                    : "text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white"
                }`}
              >
                {item.title}
              </p>
            </button>
          );
        })}
      </div>

      {/* ── Main Studio Display Card ── */}
      {slide.useImageBackground ? (
        /* Full-Bleed Background Layout with Glassmorphic Overlay */
        <div className="relative rounded-3xl border border-white/15 dark:border-slate-800 bg-slate-950 overflow-hidden p-4 sm:p-6 lg:p-8 shadow-2xl shadow-purple-500/10 backdrop-blur-2xl transition-all duration-300 min-h-145 flex items-center">
          {/* Full-bleed background visual */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={`bg-${slide.id}`}
                custom={direction}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.45, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <Image
                  src={slide.imageSrc}
                  alt={slide.imageAlt}
                  fill
                  priority
                  sizes="(max-width: 1280px) 100vw, 1280px"
                  className="object-cover object-center lg:object-left"
                />
                {/* Subtle dark tint */}
                <div className="absolute inset-0 bg-slate-950/40" />
                {/* Gradient scrim for high readability over the right side */}
                <div className="absolute inset-0 bg-linear-to-t lg:bg-linear-to-r from-slate-950/20 via-slate-950/65 to-slate-950/95" />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Interactive Hotspots across the canvas */}
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
                    onClick={() => setSelectedHotspot(isSelected ? null : hIdx)}
                    className="relative flex items-center justify-center cursor-pointer"
                    aria-label={`Hotspot: ${hotspot.label}`}
                  >
                    <span className="absolute w-8 h-8 rounded-full bg-[#8A3FFC]/40 animate-ping" />
                    <span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-linear-to-tr from-[#58E6F7] to-[#8A3FFC] text-slate-950 shadow-lg shadow-purple-500/50 hover:scale-125 transition-transform duration-200">
                      <span className="w-2 h-2 rounded-full bg-white" />
                    </span>
                  </button>

                  {/* Hotspot Popover */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-64 p-3.5 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-purple-500/40 shadow-2xl shadow-black/80 z-30 pointer-events-auto text-left"
                      >
                        <div className="flex items-center justify-between pb-1.5 border-b border-white/10 mb-1.5">
                          <span className="text-[11px] font-bold text-[#58E6F7] flex items-center gap-1">
                            <Zap className="w-3 h-3 text-[#58E6F7]" />
                            {hotspot.label}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedHotspot(null);
                            }}
                            className="text-slate-400 hover:text-white"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          {hotspot.detail}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Card Content Grid */}
          <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            {/* Left Column: Open 3D Visual Viewport & Controls */}
            <div className="lg:col-span-7 flex flex-col justify-between min-h-70 lg:min-h-120">
              {/* Floating Canvas Top Bar */}
              <div className="flex items-center justify-between z-20">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/15 text-white text-[11px] font-bold shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Interactive 3D Canvas</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setIsLightboxOpen(true)}
                    className="p-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-white/15 text-white/90 hover:text-white transition-all backdrop-blur-md cursor-pointer shadow-sm"
                    title="Zoom & Inspect Visual"
                    aria-label="Zoom and inspect high-resolution visual"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                    className="p-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-white/15 text-white/90 hover:text-white transition-all backdrop-blur-md cursor-pointer shadow-sm"
                    title={
                      isAutoPlaying ? "Pause Auto-play" : "Start Auto-play"
                    }
                    aria-label={
                      isAutoPlaying ? "Pause slideshow" : "Play slideshow"
                    }
                  >
                    {isAutoPlaying ? (
                      <Pause className="w-3.5 h-3.5" />
                    ) : (
                      <Play className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Bottom Canvas Helper Pill */}
              <div className="z-20 mt-auto pt-6">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-950/70 backdrop-blur-md text-slate-300 text-[10px] font-medium border border-white/10 shadow-sm">
                  <Sparkles className="w-3 h-3 text-[#58E6F7]" />
                  <span>Tap glowing beacons to inspect architecture</span>
                </span>
              </div>
            </div>

            {/* Right Column: Frosted Glass Information & Controls Panel */}
            <div className="lg:col-span-5 relative z-10">
              <div className="p-5 sm:p-6 rounded-2xl bg-slate-950/75 dark:bg-slate-950/85 backdrop-blur-2xl border border-white/15 dark:border-white/10 shadow-2xl shadow-black/60 space-y-4 text-white">
                {/* Top Row: Stage Badge & Counter */}
                <div className="flex items-center justify-between gap-3">
                  <span
                    className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border backdrop-blur-md ${
                      badgeColorClasses[slide.badgeColor]
                    }`}
                  >
                    {slide.badge}
                  </span>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Step {slide.stepNumber} of 05
                  </span>
                </div>

                {/* Title & Subtitle */}
                <div className="space-y-2">
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
                    {slide.title}{" "}
                    <span className="text-frameflow-gradient">
                      {slide.highlightText}
                    </span>
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-[#58E6F7] tracking-wide">
                    {slide.subtitle}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-200/90 leading-relaxed pt-1">
                    {slide.description}
                  </p>
                </div>

                {/* Interactive Feature Breakdown Selector */}
                <div className="space-y-2.5">
                  <div className="flex flex-wrap gap-1.5">
                    {slide.features.map((feat, fIdx) => (
                      <button
                        key={feat.id}
                        type="button"
                        onClick={() => setActiveFeatureIdx(fIdx)}
                        className={`text-[11px] font-semibold px-3 py-1.5 rounded-xl transition-all cursor-pointer border ${
                          activeFeatureIdx === fIdx
                            ? "bg-[#8A3FFC] text-white border-[#8A3FFC] shadow-md shadow-purple-500/30"
                            : "bg-white/10 hover:bg-white/15 text-slate-200 border-white/10"
                        }`}
                      >
                        {feat.metric}
                      </button>
                    ))}
                  </div>

                  {/* Active Feature Breakdown Box */}
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
                    <div className="flex items-center gap-2 text-xs font-bold text-white mb-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{slide.features[activeFeatureIdx].title}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {slide.features[activeFeatureIdx].description}
                    </p>
                  </div>
                </div>

                {/* Stat Metrics Grid */}
                <div className="grid grid-cols-3 gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
                  {slide.stats.map((st) => (
                    <div key={st.label} className="space-y-0.5">
                      <p className="text-[10px] font-medium text-slate-400 truncate">
                        {st.label}
                      </p>
                      <p className="text-xs sm:text-sm font-black text-white">
                        {st.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Bottom Row: CTA Button & Navigation Controls */}
                <div className="flex items-center justify-between gap-4 pt-1">
                  <Link
                    href={slide.ctaHref}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-[#58E6F7] via-[#8A3FFC] to-[#E51FD1] hover:brightness-110 text-white text-xs font-bold shadow-lg shadow-purple-500/30 transition-all hover:scale-102 cursor-pointer"
                  >
                    <span>{slide.ctaText}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
                      aria-label="Previous slide"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
                      aria-label="Next slide"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Standard Split Card Layout */
        <div className="relative rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-950/90 p-4 sm:p-6 lg:p-8 shadow-2xl shadow-purple-500/5 backdrop-blur-2xl transition-colors">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            {/* ── Left Column: 3D Visual Canvas Viewport ── */}
            <div className="lg:col-span-7 flex flex-col">
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 shadow-xl group">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                  <motion.div
                    key={slide.id}
                    custom={direction}
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.45, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={slide.imageSrc}
                      alt={slide.imageAlt}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 700px"
                      className="object-cover object-center"
                    />
                    {/* Subtle edge vignette */}
                    <div className="absolute inset-0 bg-radial from-transparent via-transparent to-slate-950/60 pointer-events-none" />
                  </motion.div>
                </AnimatePresence>

                {/* Floating Canvas Top Bar */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-auto">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/10 text-white text-[11px] font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Interactive 3D Canvas</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setIsLightboxOpen(true)}
                      className="p-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-white/15 text-white/90 hover:text-white transition-all backdrop-blur-md cursor-pointer shadow-sm"
                      title="Zoom & Inspect Visual"
                      aria-label="Zoom and inspect high-resolution visual"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                      className="p-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-white/15 text-white/90 hover:text-white transition-all backdrop-blur-md cursor-pointer shadow-sm"
                      title={
                        isAutoPlaying ? "Pause Auto-play" : "Start Auto-play"
                      }
                      aria-label={
                        isAutoPlaying ? "Pause slideshow" : "Play slideshow"
                      }
                    >
                      {isAutoPlaying ? (
                        <Pause className="w-3.5 h-3.5" />
                      ) : (
                        <Play className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* ── Interactive Hotspots on the Slide Visual ── */}
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
                          onClick={() =>
                            setSelectedHotspot(isSelected ? null : hIdx)
                          }
                          className="relative flex items-center justify-center cursor-pointer"
                          aria-label={`Hotspot: ${hotspot.label}`}
                        >
                          <span className="absolute w-8 h-8 rounded-full bg-[#8A3FFC]/40 animate-ping" />
                          <span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-linear-to-tr from-[#58E6F7] to-[#8A3FFC] text-slate-950 shadow-lg shadow-purple-500/50 hover:scale-125 transition-transform duration-200">
                            <span className="w-2 h-2 rounded-full bg-white" />
                          </span>
                        </button>

                        {/* Hotspot Popover */}
                        <AnimatePresence>
                          {isSelected && (
                            <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.95 }}
                              className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-64 p-3.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-purple-500/40 shadow-2xl shadow-slate-900/20 dark:shadow-black/80 z-30 pointer-events-auto text-left"
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
                                    setSelectedHotspot(null);
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

                {/* Bottom Hotspots Helper Pill */}
                <div className="absolute bottom-3 left-3 z-20 pointer-events-none">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-950/70 backdrop-blur-sm text-slate-300 text-[10px] font-medium border border-white/10">
                    Tap glowing beacons to inspect architecture
                  </span>
                </div>
              </div>
            </div>

            {/* ── Right Column: Information & Controls Panel ── */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-5">
              {/* Top Row: Stage Badge & Counter */}
              <div className="flex items-center justify-between gap-3">
                <span
                  className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border backdrop-blur-md ${
                    badgeColorClasses[slide.badgeColor]
                  }`}
                >
                  {slide.badge}
                </span>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  Step {slide.stepNumber} of 05
                </span>
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                  {slide.title}{" "}
                  <span className="text-frameflow-gradient">
                    {slide.highlightText}
                  </span>
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-[#8A3FFC] dark:text-[#58E6F7] tracking-wide">
                  {slide.subtitle}
                </p>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
                  {slide.description}
                </p>
              </div>

              {/* Interactive Feature Breakdown Selector */}
              <div className="space-y-2.5">
                <div className="flex flex-wrap gap-1.5">
                  {slide.features.map((feat, fIdx) => (
                    <button
                      key={feat.id}
                      type="button"
                      onClick={() => setActiveFeatureIdx(fIdx)}
                      className={`text-[11px] font-semibold px-3 py-1.5 rounded-xl transition-all cursor-pointer border ${
                        activeFeatureIdx === fIdx
                          ? "bg-[#8A3FFC] text-white border-[#8A3FFC] shadow-md shadow-purple-500/20"
                          : "bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-900/60 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800"
                      }`}
                    >
                      {feat.metric}
                    </button>
                  ))}
                </div>

                {/* Active Feature Breakdown Box */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 transition-colors">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{slide.features[activeFeatureIdx].title}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    {slide.features[activeFeatureIdx].description}
                  </p>
                </div>
              </div>

              {/* Stat Metrics Grid */}
              <div className="grid grid-cols-3 gap-2.5 p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800/80">
                {slide.stats.map((st) => (
                  <div key={st.label} className="space-y-0.5">
                    <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 truncate">
                      {st.label}
                    </p>
                    <p className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                      {st.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Bottom Row: CTA Button & Navigation Controls */}
              <div className="flex items-center justify-between gap-4 pt-1">
                <Link
                  href={slide.ctaHref}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-[#58E6F7] via-[#8A3FFC] to-[#E51FD1] hover:brightness-110 text-white text-xs font-bold shadow-lg shadow-purple-500/25 transition-all hover:scale-102 cursor-pointer"
                >
                  <span>{slide.ctaText}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
                    aria-label="Previous slide"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
                    aria-label="Next slide"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── High-Resolution Lightbox Modal ── */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsLightboxOpen(false)}
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
                onClick={() => setIsLightboxOpen(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 cursor-pointer"
                aria-label="Close high-resolution inspection modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div
              className="relative w-full max-w-6xl aspect-video rounded-2xl overflow-hidden border border-white/20 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={slide.imageSrc}
                alt={slide.imageAlt}
                fill
                sizes="(max-width: 1400px) 100vw, 1400px"
                className="object-contain"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default InteractiveSlideshow;
