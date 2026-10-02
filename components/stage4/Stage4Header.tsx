"use client";

import {
  AlertCircle,
  Loader2,
  RotateCcw,
  Sparkles,
  Square,
} from "lucide-react";

interface Stage4HeaderProps {
  loading: boolean;
  packagingText: string;
  modelUsed: string;
  error: string | null;
  onGenerate: () => void;
  onStop?: () => void;
}

export function Stage4Header({
  loading,
  packagingText,
  modelUsed,
  error,
  onGenerate,
  onStop,
}: Stage4HeaderProps) {
  return (
    <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 bg-white/80 dark:bg-slate-900/60 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-linear-to-br from-[#FF1688]/20 to-[#FFC13B]/30 text-[#FFC13B] font-bold text-xs flex items-center justify-center border border-[#FFC13B]/40">
              4
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Stage 4: Viral Packaging & YouTube SEO
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            High-CTR title hooks, Midjourney/Flux thumbnail prompt,
            hook-optimized description, and targeted tags.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {loading && onStop && (
            <button
              type="button"
              onClick={onStop}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 font-bold text-xs shadow-xs transition-all hover:scale-102 cursor-pointer shrink-0"
              title="Stop packaging generation"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Stop</span>
            </button>
          )}

          <button
            type="button"
            onClick={onGenerate}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-[#FF1688] via-[#FF4E63] to-[#FF7A32] hover:brightness-110 text-white font-bold text-xs shadow-lg shadow-[#FF1688]/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0 w-full sm:w-auto"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Generating Packaging...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {packagingText
                    ? "Regenerate Packaging"
                    : "Generate Full Packaging"}
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {modelUsed && (
        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <span>Model used:</span>
          <span className="font-mono font-bold text-purple-700 dark:text-[#58E6F7] bg-purple-50 dark:bg-purple-950/70 px-2.5 py-1 rounded-lg border border-purple-200 dark:border-purple-800/60 shadow-xs">
            {modelUsed}
          </span>
        </div>
      )}

      {error && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/50 text-rose-700 dark:text-rose-300 text-xs">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 dark:text-rose-400 mt-0.5" />
            <div>
              <p className="font-semibold">Packaging Generation Failed</p>
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
            onClick={onGenerate}
            disabled={loading}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs transition-colors shrink-0 cursor-pointer shadow-xs disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retry Generating Packaging Kit</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default Stage4Header;
