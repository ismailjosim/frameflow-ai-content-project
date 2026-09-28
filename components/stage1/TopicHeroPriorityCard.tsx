"use client";

import {
  ArrowRight,
  Award,
  EyeOff,
  Flame,
  TrendingUp,
  Zap,
} from "lucide-react";
import type { TopicHeroPriorityCardProps } from "./stage1.types";

export function TopicHeroPriorityCard({
  topPick,
  currentTopic,
  onTopicSelected,
  onIgnoreTopic,
}: TopicHeroPriorityCardProps) {
  const isSelected = currentTopic === topPick.title;

  return (
    <div
      onClick={() => onTopicSelected(topPick)}
      className={`group cursor-pointer p-6 rounded-2xl border transition-all duration-200 relative overflow-hidden ${
        isSelected
          ? "bg-linear-to-b from-amber-50 via-amber-100/40 to-white dark:from-amber-950/60 dark:via-slate-900 dark:to-slate-950 border-amber-500 ring-2 ring-amber-400/50 shadow-xl shadow-amber-500/10 dark:shadow-2xl dark:shadow-amber-500/20"
          : "bg-linear-to-b from-amber-50/50 via-white to-slate-50 dark:from-amber-950/30 dark:via-slate-900/90 dark:to-slate-950 border-amber-300 dark:border-amber-500/60 hover:border-amber-400 hover:shadow-lg dark:hover:shadow-xl hover:shadow-amber-500/10 ring-1 ring-amber-400/30 dark:ring-amber-500/30"
      }`}
    >
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-linear-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 font-black text-xs shadow-md shadow-amber-500/30 uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
            #1 Top Viral Priority
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40">
            <TrendingUp className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            Viral Score: {topPick.viralScore || 98}/100
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 bg-white/90 dark:bg-slate-900/80 px-2 py-0.5 rounded-md border border-amber-200 dark:border-slate-800">
            {topPick.audienceDemand || "Extremely High (Mass Appeal)"}
          </span>
          <span className="text-[11px] font-mono text-amber-700 dark:text-amber-400 font-semibold">
            Formula: {topPick.formula}
          </span>
        </div>
      </div>

      {/* Title & Core Dilemma */}
      <div className="space-y-3">
        <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors leading-snug">
          {topPick.title}
        </h4>

        {topPick.conflict && (
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <strong className="text-amber-700 dark:text-amber-300 font-semibold">
              The Visceral Dilemma:{" "}
            </strong>
            {topPick.conflict}
          </p>
        )}

        {/* Data-Backed Rationale Callout */}
        {topPick.viralRationale && (
          <div className="p-3.5 rounded-xl bg-amber-100/70 dark:bg-amber-950/50 border border-amber-300/80 dark:border-amber-500/30 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300 text-[11px] uppercase tracking-wider">
              <Award className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>
                Why This Angle Has Top Priority (Online Retention Data):
              </span>
            </div>
            <p className="leading-relaxed text-[11px] text-amber-900 dark:text-amber-200/90 font-medium">
              {topPick.viralRationale}
            </p>
          </div>
        )}

        {topPick.thumbnailConcept && (
          <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/90 border border-amber-200/80 dark:border-slate-800/80 text-xs text-slate-700 dark:text-slate-300">
            <span className="font-semibold text-amber-700 dark:text-amber-400">
              Mobile Thumbnail Visual Hook:{" "}
            </span>
            {topPick.thumbnailConcept}
          </div>
        )}
      </div>

      {/* Action Bar */}
      <div className="mt-5 pt-4 border-t border-amber-200 dark:border-amber-500/20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400/90 font-medium">
          <Zap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>AI Algorithm Recommendation</span>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {onIgnoreTopic && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onIgnoreTopic(topPick);
              }}
              className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-900/90 hover:bg-rose-50 dark:hover:bg-rose-950/60 text-slate-600 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-300 border border-slate-200 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-800/50 transition-colors text-xs font-medium cursor-pointer"
              title="Never show this topic again (already created or not interested)"
            >
              <EyeOff className="w-3.5 h-3.5" />
              <span>Ignore Topic</span>
            </button>
          )}

          <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-linear-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 group-hover:scale-102 transition-all text-center">
            <span>
              {isSelected ? "✓ Angle Selected" : "Produce #1 Priority Angle"}
            </span>
            <ArrowRight className="w-4 h-4 ml-1 shrink-0" />
          </div>
        </div>
      </div>
    </div>
  );
}
