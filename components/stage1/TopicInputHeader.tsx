"use client";

import { AlertCircle, EyeOff, Loader2, Sparkles } from "lucide-react";
import type { TopicInputHeaderProps } from "./stage1.types";

export function TopicInputHeader({
  keyword,
  setKeyword,
  loading,
  error,
  modelUsed,
  onGenerate,
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
            <span className="text-[11px] font-mono font-bold text-purple-700 dark:text-[#58E6F7] bg-purple-50 dark:bg-linear-to-r dark:from-[#8A3FFC]/20 dark:to-[#E51FD1]/20 px-2.5 py-1 rounded-lg border border-purple-200 dark:border-[#E51FD1]/40">
              Resolved: {modelUsed}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="e.g. losing fire in winter, human teeth rotting, inventing shoes, why humans lost fur..."
            className="w-full bg-slate-50 dark:bg-slate-900/90 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-[#8A3FFC] transition-colors"
            onKeyDown={(e) => e.key === "Enter" && !loading && onGenerate()}
          />
        </div>

        <button
          type="button"
          onClick={onGenerate}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-[#58E6F7] via-[#8A3FFC] to-[#E51FD1] hover:brightness-110 text-white font-bold text-xs shadow-lg shadow-[#8A3FFC]/25 transition-all hover:scale-102 active:scale-98 disabled:opacity-50 disabled:pointer-events-none cursor-pointer shrink-0"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing Viral Data...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate & Prioritize 5 Angles</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/50 text-rose-700 dark:text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 dark:text-rose-400 mt-0.5" />
          <div>
            <p className="font-semibold">Generation Failed</p>
            <p className="text-rose-600 dark:text-rose-400/80 mt-0.5">
              {error}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Make sure you have added an active API key in the Key Vault
              Settings.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default TopicInputHeader;
