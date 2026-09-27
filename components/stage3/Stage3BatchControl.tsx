"use client";

import { AlertCircle, Loader2, Play } from "lucide-react";
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
  error,
}: Stage3BatchControlProps) {
  return (
    <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold text-xs flex items-center justify-center border border-cyan-500/30">
              3
            </span>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Stage 3: Auto-Chunking Batch Prompts (Flux / Midjourney)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Splits timestamped lines into batches of 20, generating consistent
            hand-drawn 2D stickman prompts without hitting model token limits.
          </p>
        </div>

        <button
          onClick={onStartQueue}
          disabled={isRunning || linesCount === 0}
          className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-linear-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-medium text-xs shadow-md shadow-cyan-500/20 transition-all hover:scale-102 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0 w-full sm:w-auto"
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
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>
                {promptsExist
                  ? "Regenerate Prompts Queue"
                  : "Start Batch Queue"}
              </span>
            </>
          )}
        </button>
      </div>

      {/* Progress bar if running */}
      {isRunning && (
        <div className="space-y-1.5 pt-2">
          <div className="flex justify-between text-xs text-slate-400 font-mono">
            <span>
              Batch {currentBatch} of {totalBatches}
            </span>
            <span>{currentPercent}% Completed</span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
            <div
              className="bg-linear-to-r from-cyan-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${currentPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Timestamp Script Input Area */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between text-xs">
          <label className="font-semibold text-slate-300">
            Timestamped Script Input:
          </label>
          <span className="font-mono text-cyan-400 text-[11px]">
            {linesCount} lines detected
          </span>
        </div>

        <textarea
          value={timestampInput}
          onChange={(e) => onTimestampChange(e.target.value)}
          disabled={isRunning}
          placeholder={`Paste your exported script or timestamps here...\nExample:\n[00:00] It was forty below zero.\n[00:03] The fire had died two hours ago.\n[00:07] Inside the dark cave, thirty humans were freezing.`}
          rows={5}
          className="w-full bg-slate-950/80 text-xs font-mono text-slate-200 p-3.5 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500 leading-relaxed resize-y disabled:opacity-60"
        />
      </div>

      {error && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
          <div>
            <p className="font-semibold">Queue Error</p>
            <p className="text-rose-400/80 mt-0.5">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}
