"use client";

import {
  AlertCircle,
  Clock,
  Loader2,
  Play,
  RotateCcw,
  RotateCw,
  Sparkles,
} from "lucide-react";
import type { Stage3BatchControlProps } from "./stage3.types";

export function Stage3BatchControl({
  isRunning,
  linesCount,
  promptsExist,
  currentBatch,
  totalBatches,
  currentPercent,
  timestampInput,
  onTimestampChange,
  onStartQueue,
  onResumeQueue,
  failedBatchIndex,
  onRecalculateTimestamps,
  estimatedRuntime,
  error,
}: Stage3BatchControlProps) {
  const canResume =
    !isRunning &&
    failedBatchIndex !== null &&
    failedBatchIndex !== undefined &&
    typeof onResumeQueue === "function";

  return (
    <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 bg-white/80 dark:bg-slate-900/60 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-linear-to-br from-[#E51FD1]/20 to-[#FF1688]/30 text-[#FF1688] font-bold text-xs flex items-center justify-center border border-[#FF1688]/40">
              3
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Stage 3: Auto-Chunking Batch Prompts (Flux / Midjourney)
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Splits timestamped lines into batches of 20, generating consistent
            visual prompt styles without hitting model token limits.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {canResume && (
            <button
              type="button"
              onClick={() => onResumeQueue(failedBatchIndex)}
              disabled={isRunning}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-linear-to-r from-[#58E6F7] to-[#8A3FFC] hover:brightness-110 text-slate-950 font-bold text-xs shadow-md shadow-[#58E6F7]/20 transition-all hover:scale-102 cursor-pointer w-full sm:w-auto"
              title={`Continue prompt generation starting from batch ${failedBatchIndex + 1}`}
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>
                Resume from Batch {failedBatchIndex + 1} of {totalBatches}
              </span>
            </button>
          )}

          <button
            type="button"
            onClick={onStartQueue}
            disabled={isRunning || linesCount === 0}
            className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer shrink-0 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed ${
              canResume
                ? "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                : "bg-linear-to-r from-[#58E6F7] via-[#8A3FFC] to-[#E51FD1] hover:brightness-110 text-white shadow-[#8A3FFC]/25 hover:scale-102"
            }`}
          >
            {isRunning ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>
                  Processing Batch {currentBatch}/{totalBatches}...
                </span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>
                  {canResume
                    ? "Restart from Batch 1"
                    : promptsExist
                      ? "Regenerate Prompts Queue"
                      : "Start Batch Queue"}
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Progress bar if running */}
      {isRunning && (
        <div className="space-y-1.5 pt-2">
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span>
              Batch {currentBatch} of {totalBatches}
            </span>
            <span>{currentPercent}% Completed</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-300 dark:border-slate-800">
            <div
              className="bg-frameflow-gradient h-2 rounded-full transition-all duration-300"
              style={{ width: `${currentPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Timestamp Script Input Area */}
      <div className="space-y-2 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              Timestamped Script Input:
            </label>
            {estimatedRuntime && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-300 font-mono text-[11px]">
                <Clock className="w-3 h-3" />
                {linesCount} lines • {estimatedRuntime}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {onRecalculateTimestamps && (
              <button
                type="button"
                onClick={onRecalculateTimestamps}
                disabled={isRunning || !timestampInput?.trim()}
                className="inline-flex items-center gap-1.5 text-[11px] text-purple-700 dark:text-[#58E6F7] hover:text-purple-900 dark:hover:text-white bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/70 dark:hover:bg-purple-900/60 border border-purple-200 dark:border-purple-800/60 px-2.5 py-1 rounded-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-xs"
                title="Recalculate continuous timestamps based on realistic 135 WPM storytelling cadence"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FF7A32]" />
                <span>Re-time Pacing (135 WPM)</span>
              </button>
            )}
            {!estimatedRuntime && (
              <span className="font-mono text-[#8A3FFC] dark:text-[#58E6F7] text-[11px] font-semibold">
                {linesCount} lines detected
              </span>
            )}
          </div>
        </div>

        <textarea
          value={timestampInput}
          onChange={(e) => onTimestampChange(e.target.value)}
          disabled={isRunning}
          placeholder={`Paste your exported script or timestamps here...\nExample:\n[00:00] It was forty below zero.\n[00:03] The fire had died two hours ago.\n[00:07] Inside the dark cave, thirty humans were freezing.`}
          rows={5}
          className="w-full bg-slate-50 dark:bg-slate-950/80 text-xs font-mono text-slate-900 dark:text-slate-200 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-[#8A3FFC] leading-relaxed resize-y disabled:opacity-60"
        />
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/50 text-rose-700 dark:text-rose-300 text-xs space-y-3">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 dark:text-rose-400 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-semibold text-rose-800 dark:text-rose-200">
                Batch Generation Stopped
                {failedBatchIndex !== null && failedBatchIndex !== undefined
                  ? ` on Batch ${failedBatchIndex + 1} of ${totalBatches}`
                  : ""}
              </p>
              <p className="text-rose-600 dark:text-rose-400/80">{error}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-rose-200/70 dark:border-rose-800/40">
            {canResume ? (
              <>
                <button
                  type="button"
                  onClick={() => onResumeQueue(failedBatchIndex)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-linear-to-r from-[#58E6F7] to-[#8A3FFC] text-slate-950 font-bold text-xs shadow-sm hover:brightness-110 transition-all cursor-pointer"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>
                    Resume from Batch {failedBatchIndex + 1} of {totalBatches}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={onStartQueue}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Restart from Batch 1</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={onStartQueue}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Batch Queue</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Stage3BatchControl;
