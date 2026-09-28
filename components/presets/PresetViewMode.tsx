"use client";

import { Edit3 } from "lucide-react";
import type { Preset } from "./presets.types";

interface PresetViewModeProps {
  preset: Preset;
  onStartEdit: () => void;
}

export function PresetViewMode({ preset, onStartEdit }: PresetViewModeProps) {
  return (
    <div className="space-y-4 text-xs">
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Visual Art Style DNA:
          </span>
          <button
            type="button"
            onClick={onStartEdit}
            className="text-[11px] text-[#8A3FFC] dark:text-[#58E6F7] hover:underline flex items-center gap-1 cursor-pointer font-medium"
          >
            <Edit3 className="w-3 h-3" />
            Edit Style DNA
          </button>
        </div>
        <pre className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/80 font-mono text-[11px] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto selection:bg-[#8A3FFC]/30">
          {preset.visualStyleRules}
        </pre>
      </div>

      <div>
        <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
          Pipeline Workflow:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-[11px]">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-[#58E6F7]/40 transition-colors">
            <span className="text-[#8A3FFC] dark:text-[#58E6F7] font-bold block">
              Stage 1
            </span>
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              Viral Topic Ideation
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-[#8A3FFC]/40 transition-colors">
            <span className="text-[#8A3FFC] font-bold block">Stage 2</span>
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              Voiceover &lt;90 chars
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-[#E51FD1]/40 transition-colors">
            <span className="text-[#E51FD1] font-bold block">Stage 3</span>
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              Batch Image Prompts
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-[#FF7A32]/40 transition-colors">
            <span className="text-[#FF7A32] font-bold block">Stage 4</span>
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              Viral SEO & Packaging
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
