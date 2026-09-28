"use client";

import { AlertCircle, Play, RotateCcw } from "lucide-react";

interface Stage2ErrorBannerProps {
  error: string;
  hasExistingScript: boolean;
  linesCount: number;
  loading: boolean;
  onContinue: () => void;
  onRetry: () => void;
}

export function Stage2ErrorBanner({
  error,
  hasExistingScript,
  linesCount,
  loading,
  onContinue,
  onRetry,
}: Stage2ErrorBannerProps) {
  return (
    <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/50 text-rose-700 dark:text-rose-300 text-xs space-y-3">
      <div className="flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 dark:text-rose-400 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-semibold text-rose-800 dark:text-rose-200">
            Script Generation Interrupted
          </p>
          <p className="text-rose-600 dark:text-rose-400/80">{error}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-rose-200/70 dark:border-rose-800/40">
        {hasExistingScript ? (
          <>
            <button
              type="button"
              onClick={onContinue}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-linear-to-r from-[#8A3FFC] to-[#E51FD1] hover:brightness-110 text-white font-bold text-xs shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Resume Script (from Line {linesCount + 1})</span>
            </button>
            <button
              type="button"
              onClick={onRetry}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 font-semibold text-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Restart from Scratch</span>
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={onRetry}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retry Script Generation</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default Stage2ErrorBanner;
