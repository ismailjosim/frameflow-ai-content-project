"use client";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import type { SlideData } from "./slideshow.data";

interface SlideshowInfoPanelProps {
  slide: SlideData;
  activeFeatureIdx: number;
  badgeColorClasses: Record<string, string>;
  onSelectFeature: (idx: number) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function SlideshowInfoPanel({
  slide,
  activeFeatureIdx,
  badgeColorClasses,
  onSelectFeature,
  onNext,
  onPrev,
}: SlideshowInfoPanelProps) {
  return (
    <div className="lg:col-span-5 flex flex-col justify-between space-y-4 sm:space-y-5">
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
      <div className="space-y-1.5 sm:space-y-2">
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
          {slide.title}{" "}
          <span className="text-frameflow-gradient">{slide.highlightText}</span>
        </h3>
        <p className="text-xs sm:text-sm font-semibold text-[#8A3FFC] dark:text-[#58E6F7] tracking-wide">
          {slide.subtitle}
        </p>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-0.5 sm:pt-1">
          {slide.description}
        </p>
      </div>

      {/* Interactive Feature Breakdown Selector */}
      <div className="space-y-2">
        <div className="flex flex-wrap gap-1 sm:gap-1.5">
          {slide.features.map((feat, fIdx) => (
            <button
              key={feat.id}
              type="button"
              onClick={() => onSelectFeature(fIdx)}
              className={`text-[10px] sm:text-[11px] font-semibold px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl transition-all cursor-pointer border ${
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
        <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 transition-colors">
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
      <div className="grid grid-cols-3 gap-2 sm:gap-2.5 p-2.5 sm:p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800/80">
        {slide.stats.map((st) => (
          <div key={st.label} className="space-y-0.5">
            <p className="text-[9px] sm:text-[10px] font-medium text-slate-500 dark:text-slate-400 truncate">
              {st.label}
            </p>
            <p className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
              {st.value}
            </p>
          </div>
        ))}
      </div>

      {/* Bottom Row: CTA Button & Navigation Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
        <Link
          href={slide.ctaHref}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-[#58E6F7] via-[#8A3FFC] to-[#E51FD1] hover:brightness-110 text-white text-xs font-bold shadow-lg shadow-purple-500/25 transition-all hover:scale-102 cursor-pointer"
        >
          <span>{slide.ctaText}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>

        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={onPrev}
            className="p-2 sm:p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
            aria-label="Previous slide"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onNext}
            className="p-2 sm:p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
            aria-label="Next slide"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
