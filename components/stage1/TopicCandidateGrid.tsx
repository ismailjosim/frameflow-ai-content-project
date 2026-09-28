"use client";

import { ArrowRight, EyeOff } from "lucide-react";
import type { TopicCandidateGridProps } from "./stage1.types";

export function TopicCandidateGrid({
  candidates,
  currentTopic,
  onTopicSelected,
  onIgnoreTopic,
}: TopicCandidateGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
      {candidates.map((cand, idx) => {
        const isSelected = currentTopic === cand.title;
        return (
          <div
            key={cand.id || cand.title}
            onClick={() => onTopicSelected(cand)}
            className={`group cursor-pointer p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
              isSelected
                ? "bg-linear-to-r from-[#8A3FFC]/15 via-[#E51FD1]/10 to-transparent border-[#E51FD1] shadow-md shadow-[#8A3FFC]/20 ring-1 ring-[#E51FD1]/50"
                : "glass-panel border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900/70 bg-white/80 dark:bg-slate-900/60"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    Rank #{cand.priorityRank || idx + 2}
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-linear-to-r dark:from-[#8A3FFC]/25 dark:to-[#E51FD1]/25 text-purple-700 dark:text-pink-300 border border-purple-200 dark:border-[#E51FD1]/40">
                    Score: {cand.viralScore || Math.max(80, 92 - idx * 3)}%
                  </span>
                </div>

                <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-35 font-medium">
                  {cand.formula}
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#8A3FFC] dark:group-hover:text-[#58E6F7] transition-colors leading-snug">
                {cand.title}
              </h4>

              {cand.conflict && (
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  <strong className="text-slate-800 dark:text-slate-300 font-medium">
                    Dilemma:{" "}
                  </strong>
                  {cand.conflict}
                </p>
              )}

              {cand.viralRationale && (
                <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 italic border-l-2 border-slate-300 dark:border-slate-700 pl-2">
                  {cand.viralRationale}
                </p>
              )}

              {cand.thumbnailConcept && (
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/60 text-[11px] text-slate-600 dark:text-slate-400">
                  <span className="font-semibold text-slate-800 dark:text-slate-300">
                    Thumbnail:{" "}
                  </span>
                  {cand.thumbnailConcept}
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/60 flex items-center justify-between text-xs font-medium">
              <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                {isSelected ? "✓ Currently Active" : "Alternative Option"}
              </span>

              <div className="flex items-center gap-2">
                {onIgnoreTopic && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onIgnoreTopic(cand);
                    }}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 dark:bg-slate-900 dark:hover:bg-rose-950/60 text-slate-500 hover:text-rose-600 dark:hover:text-rose-300 border border-slate-200 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-800/50 transition-colors cursor-pointer"
                    title="Ignore topic (never show again)"
                  >
                    <EyeOff className="w-3.5 h-3.5" />
                  </button>
                )}

                <div className="flex items-center gap-1 text-[#8A3FFC] dark:text-[#58E6F7] group-hover:text-[#E51FD1] font-semibold group-hover:translate-x-0.5 transition-transform">
                  <span>Select Angle</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default TopicCandidateGrid;
