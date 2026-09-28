"use client";

import { Archive, Download, Loader2 } from "lucide-react";
import type { PackagingActionsProps } from "./stage4.types";

export function PackagingActions({
  loading,
  isZipping,
  packagingText,
  onDownloadPackaging,
  onDownloadAllAssets,
}: PackagingActionsProps) {
  const disabled = loading || !packagingText;

  return (
    <div className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white/80 dark:bg-slate-900/60 transition-colors">
      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
        All video production assets ready!
      </span>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
        <button
          type="button"
          onClick={onDownloadPackaging}
          disabled={disabled || isZipping}
          className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium border border-slate-200 dark:border-slate-700 transition-colors disabled:opacity-40 cursor-pointer w-full sm:w-auto"
        >
          <Download className="w-3.5 h-3.5 text-slate-400" />
          <span>Download Packaging .txt</span>
        </button>

        <button
          type="button"
          onClick={onDownloadAllAssets}
          disabled={disabled || isZipping}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-[#58E6F7] via-[#8A3FFC] to-[#FF7A32] hover:brightness-110 text-slate-950 text-xs font-black shadow-xl shadow-[#8A3FFC]/30 transition-all hover:scale-102 disabled:opacity-40 cursor-pointer w-full sm:w-auto"
          title="Download full project assets (script, timestamps, image prompts, packaging, metadata) as a compressed .zip file"
        >
          {isZipping ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
              <span>Packing ZIP Bundle...</span>
            </>
          ) : (
            <>
              <Archive className="w-4 h-4 text-slate-950" />
              <span>Export Full Video Bundle (.zip)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default PackagingActions;
