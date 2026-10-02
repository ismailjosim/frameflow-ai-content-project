"use client";

import {
  AlertCircle,
  EyeOff,
  Loader2,
  RotateCcw,
  Sparkles,
  Square,
  X,
} from "lucide-react";
import type { TopicInputHeaderProps } from "./stage1.types";

export function TopicInputHeader({
  keyword,
  setKeyword,
  loading,
  error,
  modelUsed,
  onGenerate,
  onStop,
  ignoredCount,
  onToggleIgnoredList,
}: TopicInputHeaderProps) {
  return (
    <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 bg-white/80 dark:bg-slate-900/60 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-linear-to-br from-[#58E6F7]/20 to-[#8A3FFC]/30 text-[#8A3FFC] dark:text-[#58E6F7] font-bold text-xs flex items-center justify-center border border-[#58E6F7]/40">
              1
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Stage 1: Topic Ideation & Viral Prioritization
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generates 5 viral concepts analyzed against YouTube retention and
            CTR data, automatically highlighting the #1 prioritized angle.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {ignoredCount !== undefined &&
            ignoredCount > 0 &&
            onToggleIgnoredList && (
              <button
                type="button"
                onClick={onToggleIgnoredList}
                className="text-[11px] font-medium text-rose-600 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 px-2.5 py-1 rounded-lg border border-rose-200 dark:border-rose-800/40 transition-colors cursor-pointer flex items-center gap-1.5"
                title="Click to view or restore ignored topics"
              >
                <EyeOff className="w-3 h-3 text-rose-500 dark:text-rose-400" />
                <span>{ignoredCount} Excluded</span>
              </button>
            )}

          {modelUsed && (
            <span className="text-[11px] font-mono font-bold text-purple-700 dark:text-[#58E6F7] bg-purple-50 dark:bg-purple-950/70 px-2.5 py-1 rounded-lg border border-purple-200 dark:border-purple-800/60 shadow-xs">
              Resolved: {modelUsed}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="e.g. How ancient human invent wearing cloth, losing fire in winter..."
              className="w-full bg-slate-50 dark:bg-slate-900/90 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 pl-4 pr-10 py-3 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-[#8A3FFC] transition-colors"
              onKeyDown={(e) => e.key === "Enter" && !loading && onGenerate()}
            />
            {keyword.trim().length > 0 && (
              <button
                type="button"
                onClick={() => setKeyword("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md transition-colors"
                title="Clear topic"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {loading && onStop && (
            <button
              type="button"
              onClick={onStop}
              className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 font-bold text-xs shadow-xs transition-all hover:scale-102 cursor-pointer shrink-0"
              title="Stop topic generation"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Stop</span>
            </button>
          )}

          <button
            type="button"
            onClick={onGenerate}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-[#58E6F7] via-[#8A3FFC] to-[#E51FD1] hover:brightness-110 text-white font-bold text-xs shadow-lg shadow-[#8A3FFC]/25 transition-all hover:scale-102 active:scale-98 disabled:opacity-50 disabled:pointer-events-none cursor-pointer shrink-0 w-full sm:w-auto"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>
                  {keyword.trim()
                    ? "Analyzing Domain & CTR Data..."
                    : "Analyzing Viral Data..."}
                </span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>
                  {keyword.trim()
                    ? "Analyze & Prioritize 5 Angles"
                    : "Generate & Prioritize 5 Angles"}
                </span>
              </>
            )}
          </button>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 px-1">
          {keyword.trim() ? (
            <p className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
              Domain Target: AI will correct grammar, analyze this subject, and
              extract 5 high-CTR viral angles.
            </p>
          ) : (
            <p className="text-slate-400 dark:text-slate-500">
              Leave input empty to generate 5 fresh survival & evolutionary
              topics across ancient history.
            </p>
          )}
        </div>
      </div>

      {error && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/50 text-rose-700 dark:text-rose-300 text-xs">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 dark:text-rose-400 mt-0.5" />
            <div>
              <p className="font-semibold">Topic Generation Failed</p>
              <p className="text-rose-600 dark:text-rose-400/80 mt-0.5">
                {error}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Make sure you have an active AI key configured in settings.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onGenerate()}
            disabled={loading}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs transition-colors shrink-0 cursor-pointer shadow-xs disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retry Generating Topics</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default TopicInputHeader;
