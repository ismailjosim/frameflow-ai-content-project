"use client";

import {
  AlertCircle,
  Check,
  CheckCircle2,
  Loader2,
  Play,
  Sparkles,
  Square,
} from "lucide-react";
import { Stage2ErrorBanner } from "./Stage2ErrorBanner";

interface Stage2HeaderProps {
  topicTitle: string;
  topicConflict?: string;
  topicFormula?: string;
  modelUsed: string;
  scriptText: string;
  statsLines: number;
  isScriptComplete?: boolean;
  onToggleScriptComplete?: () => void;
  loading: boolean;
  error: string | null;
  onContinueScript: () => void;
  onGenerateScript: () => void;
  onStopScript?: () => void;
}

export function Stage2Header({
  topicTitle,
  topicConflict,
  topicFormula,
  modelUsed,
  scriptText,
  statsLines,
  isScriptComplete = false,
  onToggleScriptComplete,
  loading,
  error,
  onContinueScript,
  onGenerateScript,
  onStopScript,
}: Stage2HeaderProps) {
  return (
    <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 bg-white/80 dark:bg-slate-900/60 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-linear-to-br from-[#8A3FFC]/20 to-[#E51FD1]/30 text-[#8A3FFC] dark:text-[#58E6F7] font-bold text-xs flex items-center justify-center border border-[#8A3FFC]/40">
              2
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Stage 2: Voiceover Scriptwriter (90-Char Rule)
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Produces caption-ready narration formatted strictly one sentence per
            line, kept under 90 characters for effortless TTS and visual
            syncing.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {modelUsed && (
            <span className="text-[11px] font-mono font-bold text-purple-700 dark:text-[#58E6F7] bg-purple-50 dark:bg-purple-950/70 px-2.5 py-1 rounded-lg border border-purple-200 dark:border-purple-800/60 shadow-xs">
              Resolved: {modelUsed}
            </span>
          )}

          {/* Script Completion Status & Continuation Controls */}
          {scriptText &&
            (isScriptComplete ? (
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-semibold text-xs shadow-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Script Complete ({statsLines} lines)</span>
                </span>
                {onToggleScriptComplete && (
                  <button
                    type="button"
                    onClick={onToggleScriptComplete}
                    className="text-[11px] text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 underline decoration-dotted cursor-pointer px-1 py-1"
                    title="Click if you need to continue generating more lines"
                  >
                    + Append more
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-semibold">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Partial Script</span>
                </span>
                <button
                  type="button"
                  onClick={onContinueScript}
                  disabled={loading}
                  className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-linear-to-r from-[#58E6F7] to-[#8A3FFC] hover:brightness-110 text-slate-950 font-bold text-xs shadow-md transition-all hover:scale-102 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0"
                  title="Continue generating next sentences until script concludes"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Continue from Line {statsLines + 1}</span>
                </button>
                {onToggleScriptComplete && (
                  <button
                    type="button"
                    onClick={onToggleScriptComplete}
                    disabled={loading}
                    className="px-2.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium text-xs border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer shrink-0"
                    title="Mark script as complete if no further lines are needed"
                  >
                    <Check className="w-3.5 h-3.5 inline mr-1 text-emerald-500" />
                    Mark Complete
                  </button>
                )}
              </div>
            ))}

          {loading && onStopScript && (
            <button
              type="button"
              onClick={onStopScript}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 font-bold text-xs shadow-xs transition-all hover:scale-102 cursor-pointer shrink-0"
              title="Stop script generation and keep current script"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Stop</span>
            </button>
          )}

          <button
            type="button"
            onClick={onGenerateScript}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-[#8A3FFC] via-[#E51FD1] to-[#FF1688] hover:brightness-110 text-white font-bold text-xs shadow-md shadow-[#E51FD1]/25 transition-all hover:scale-102 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0 w-full sm:w-auto"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {scriptText ? "Regenerate Full Script" : "Generate Script"}
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Selected Topic Context Banner */}
      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 truncate">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Topic:
          </span>
          <span className="text-[#8A3FFC] dark:text-[#58E6F7] font-medium truncate">
            {topicTitle || "No topic selected"}
          </span>
        </div>
        {topicConflict && (
          <span className="text-slate-500 dark:text-slate-400 text-[11px] italic shrink-0">
            Formula: {topicFormula}
          </span>
        )}
      </div>

      {/* Meaningful Resume/Retry Error Banner */}
      {error && (
        <Stage2ErrorBanner
          error={error}
          hasExistingScript={statsLines > 0}
          linesCount={statsLines}
          loading={loading}
          onContinue={onContinueScript}
          onRetry={onGenerateScript}
        />
      )}
    </div>
  );
}

export default Stage2Header;
