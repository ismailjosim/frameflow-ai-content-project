"use client";

import { Check, Copy, Download } from "lucide-react";
import type { Stage2MetricsBarProps } from "./stage2.types";

export function Stage2MetricsBar({
  stats,
  scriptText,
  copied,
  onCopy,
  onDownload,
}: Stage2MetricsBarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border-b border-slate-800/80 pb-3">
      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
        <div>
          <span className="text-slate-400">Lines: </span>
          <span className="font-mono font-semibold text-cyan-300">
            {stats.lines}
          </span>
        </div>
        <div>
          <span className="text-slate-400">Words: </span>
          <span className="font-mono font-semibold text-indigo-300">
            {stats.words}
          </span>
        </div>
        <div>
          <span className="text-slate-400">Lines &gt;90 chars: </span>
          <span
            className={`font-mono font-semibold ${
              stats.longLines > 0 ? "text-amber-400" : "text-emerald-400"
            }`}
          >
            {stats.longLines}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onCopy}
          disabled={!scriptText}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors disabled:opacity-40"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Copy className="w-3.5 h-3.5 text-slate-400" />
          )}
          {copied ? "Copied" : "Copy Text"}
        </button>

        <button
          onClick={onDownload}
          disabled={!scriptText}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors disabled:opacity-40"
        >
          <Download className="w-3.5 h-3.5 text-slate-400" />
          Download .txt
        </button>
      </div>
    </div>
  );
}
