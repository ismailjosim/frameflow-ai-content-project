"use client";

import { AlignLeft, Check, Copy, Download, LayoutGrid } from "lucide-react";
import { useState } from "react";
import type { Stage3PromptListProps } from "./stage3.types";

export function Stage3PromptList({
  promptList,
  promptsText,
  onPromptsChange,
  copied,
  onCopyAll,
  onDownload,
}: Stage3PromptListProps) {
  const [viewMode, setViewMode] = useState<"cards" | "raw">("cards");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copySinglePrompt = (prompt: string, idx: number) => {
    navigator.clipboard.writeText(prompt);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1800);
  };

  return (
    <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 bg-white/80 dark:bg-slate-900/60 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800/80 pb-3">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="text-slate-500 dark:text-slate-400">
            Generated Prompts:{" "}
          </span>
          <span className="font-mono font-semibold text-[#8A3FFC] dark:text-[#58E6F7]">
            {promptList.length}
          </span>

          {/* Toggle view mode */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-900 rounded-lg p-0.5 border border-slate-200 dark:border-slate-800 ml-2">
            <button
              type="button"
              onClick={() => setViewMode("cards")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                viewMode === "cards"
                  ? "bg-white dark:bg-purple-950/80 text-purple-700 dark:text-pink-200 font-bold shadow-xs border border-purple-200 dark:border-purple-800/60"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              <LayoutGrid className="w-3 h-3" />
              Cards
            </button>
            <button
              type="button"
              onClick={() => setViewMode("raw")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                viewMode === "raw"
                  ? "bg-white dark:bg-purple-950/80 text-purple-700 dark:text-pink-200 font-bold shadow-xs border border-purple-200 dark:border-purple-800/60"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              <AlignLeft className="w-3 h-3" />
              Raw Text
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onCopyAll}
            disabled={!promptsText}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium border border-slate-200 dark:border-slate-700 transition-colors disabled:opacity-40 cursor-pointer"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span>{copied ? "Copied" : "Copy All"}</span>
          </button>

          <button
            type="button"
            onClick={onDownload}
            disabled={!promptsText}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium border border-slate-200 dark:border-slate-700 transition-colors disabled:opacity-40 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Download .txt</span>
          </button>
        </div>
      </div>

      {/* View Mode Content */}
      {viewMode === "raw" ? (
        <textarea
          value={promptsText}
          onChange={(e) => onPromptsChange(e.target.value)}
          placeholder="Generated Midjourney / Flux prompts will appear here..."
          rows={14}
          className="w-full bg-slate-50 dark:bg-slate-950/80 text-xs font-mono text-slate-900 dark:text-slate-200 p-4 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-[#8A3FFC] leading-relaxed resize-y"
        />
      ) : (
        <div className="space-y-3 max-h-125 overflow-y-auto pr-1">
          {promptList.length === 0 ? (
            <div className="text-center py-12 text-slate-400 dark:text-slate-500 text-xs">
              No prompts generated yet. Start the auto-chunking queue above.
            </div>
          ) : (
            promptList.map((prompt, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 transition-colors flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-linear-to-br from-[#8A3FFC]/20 to-[#E51FD1]/20 text-[#8A3FFC] dark:text-[#58E6F7] font-mono text-[10px] font-bold flex items-center justify-center border border-[#E51FD1]/30">
                      {idx + 1}
                    </span>
                    <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      Prompt #{idx + 1}
                    </span>
                  </div>
                  <p className="text-slate-800 dark:text-slate-200 font-mono text-[11px] leading-relaxed pt-1 select-all">
                    {prompt}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => copySinglePrompt(prompt, idx)}
                  className="p-1.5 rounded-lg bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800 shrink-0 cursor-pointer"
                  title="Copy this prompt"
                >
                  {copiedIndex === idx ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Stage3PromptList;
