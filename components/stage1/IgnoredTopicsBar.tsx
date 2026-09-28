"use client";

import { ChevronDown, ChevronUp, EyeOff, RotateCcw } from "lucide-react";
import type { IgnoredTopicsBarProps } from "./stage1.types";

export function IgnoredTopicsBar({
  ignoredTopics,
  isOpen,
  onToggle,
  onUnignore,
}: IgnoredTopicsBarProps) {
  if (ignoredTopics.length === 0) return null;

  return (
    <div className="glass-panel rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-xs bg-white/80 dark:bg-slate-900/60 transition-colors">
      <button
        type="button"
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-500 dark:text-rose-400 border border-rose-200 dark:border-rose-800/40 flex items-center justify-center">
            <EyeOff className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              Ignored & Covered Topics
            </span>
            <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
              {ignoredTopics.length} excluded
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
          <span>{isOpen ? "Hide Exclusions" : "View Excluded Topics"}</span>
          {isOpen ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="p-4 pt-1 border-t border-slate-200 dark:border-slate-800/80 space-y-2 bg-slate-50 dark:bg-slate-950/40">
          <p className="text-[11px] text-slate-500 dark:text-slate-400 pb-1">
            Topics in this list are automatically excluded from all future AI
            ideations so you never get duplicates or repeat previously covered
            videos.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
            {ignoredTopics.map((item) => (
              <div
                key={item._id || item.topicTitle}
                className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800"
              >
                <div className="truncate flex-1">
                  <span className="font-medium text-slate-800 dark:text-slate-200 truncate block">
                    {item.topicTitle}
                  </span>
                  <span
                    suppressHydrationWarning
                    className="text-[10px] text-slate-400 dark:text-slate-500"
                  >
                    Excluded {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onUnignore(item.topicTitle)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#8A3FFC] dark:text-[#58E6F7] hover:text-[#E51FD1] text-[11px] font-medium transition-colors shrink-0 cursor-pointer"
                  title="Remove from exclusion list so it can appear again"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Restore</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default IgnoredTopicsBar;
