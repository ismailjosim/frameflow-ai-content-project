"use client";

import type { PresetInspectorProps } from "./presets.types";

export function PresetInspector({ preset }: PresetInspectorProps) {
  if (!preset) {
    return (
      <div className="md:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 text-center py-16 text-slate-500 text-xs">
        Select a preset to view its style configuration.
      </div>
    );
  }

  return (
    <div className="md:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div>
          <h3 className="text-base font-bold text-white">{preset.name}</h3>
          <p className="text-xs text-slate-400">
            {preset.description || "Preset Details"}
          </p>
        </div>
        <span className="font-mono text-xs text-purple-400 bg-purple-950/60 px-3 py-1 rounded-lg border border-purple-800/50">
          {preset.aspectRatio}
        </span>
      </div>

      <div className="space-y-3 text-xs">
        <div>
          <span className="font-semibold text-slate-300 block mb-1">
            Visual Art Style DNA:
          </span>
          <pre className="p-3.5 rounded-xl bg-slate-950/80 font-mono text-[11px] text-slate-300 border border-slate-800 whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto">
            {preset.visualStyleRules}
          </pre>
        </div>

        <div>
          <span className="font-semibold text-slate-300 block mb-1">
            Pipeline Workflow:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px]">
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-cyan-400 font-bold block">Stage 1</span>
              <span className="text-slate-400">Viral Topic Ideation</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-cyan-400 font-bold block">Stage 2</span>
              <span className="text-slate-400">Voiceover &lt;90 chars</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-cyan-400 font-bold block">Stage 3</span>
              <span className="text-slate-400">Batch Image Prompts</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-cyan-400 font-bold block">Stage 4</span>
              <span className="text-slate-400">Viral SEO & Packaging</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
