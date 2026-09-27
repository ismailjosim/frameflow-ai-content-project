"use client";

import { Download } from "lucide-react";
import type { PackagingActionsProps } from "./stage4.types";

export function PackagingActions({
  loading,
  packagingText,
  onDownloadPackaging,
  onDownloadAllAssets,
}: PackagingActionsProps) {
  const disabled = loading || !packagingText;

  return (
    <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <span className="text-xs text-slate-400 font-medium">
        All video production assets ready!
      </span>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
        <button
          onClick={onDownloadPackaging}
          disabled={disabled}
          className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors disabled:opacity-40 w-full sm:w-auto"
        >
          <Download className="w-3.5 h-3.5 text-slate-400" />
          Download Packaging .txt
        </button>

        <button
          onClick={onDownloadAllAssets}
          disabled={disabled}
          className="flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 transition-all hover:scale-101 disabled:opacity-40 w-full sm:w-auto"
        >
          <Download className="w-4 h-4" />
          Export Full Video Bundle (.txt)
        </button>
      </div>
    </div>
  );
}
