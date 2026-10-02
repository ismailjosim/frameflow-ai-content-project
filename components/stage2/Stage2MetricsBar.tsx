"use client";

import { Check, Copy, Download } from "lucide-react";
import type { Stage2MetricsBarProps } from "./stage2.types";

export function Stage2MetricsBar({
  stats,
  scriptText,
  isScriptComplete,
  copied,
  onCopy,
  onDownload,
}: Stage2MetricsBarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border-b border-slate-200 dark:border-slate-800/80 pb-3">
      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
        <div>
          <span className="text-slate-500 dark:text-slate-400">Lines: </span>
          <span className="font-mono font-semibold text-[#8A3FFC] dark:text-[#58E6F7]">
            {stats.lines}
          </span>
        </div>
        <div>
          <span className="text-slate-500 dark:text-slate-400">Words: </span>
          <span className="font-mono font-semibold text-pink-600 dark:text-[#E51FD1]">
            {stats.words}
          </span>
        </div>
        <div>
          <span className="text-slate-500 dark:text-slate-400">
            Lines &gt;90 chars:{" "}
          </span>
          <span
            className={`font-mono font-semibold ${
              stats.longLines > 0
                ? "text-amber-500"
                : "text-emerald-600 dark:text-[#58E6F7]"
            }`}
          >
            {stats.longLines}
          </span>
        </div>
        {scriptText && (
          <div>
            <span className="text-slate-500 dark:text-slate-400">Status: </span>
            <span
              className={`font-semibold ${
                isScriptComplete
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-amber-600 dark:text-amber-400"
              }`}
            >
              {isScriptComplete ? "Complete" : "Incomplete"}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onCopy}
          disabled={!scriptText}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium border border-slate-200 dark:border-slate-700 transition-colors disabled:opacity-40 cursor-pointer"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-emerald-500" />
          ) : (
            <Copy className="w-3.5 h-3.5 text-slate-400" />
          )}
          <span>{copied ? "Copied" : "Copy Text"}</span>
        </button>

        <button
          type="button"
          onClick={onDownload}
          disabled={!scriptText}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium border border-slate-200 dark:border-slate-700 transition-colors disabled:opacity-40 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-slate-400" />
          <span>Download .txt</span>
        </button>
      </div>
    </div>
  );
}

export default Stage2MetricsBar;
