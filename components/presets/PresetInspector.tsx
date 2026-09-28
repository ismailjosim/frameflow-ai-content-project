import { Trash2 } from "lucide-react";
import type { PresetInspectorProps } from "./presets.types";

export function PresetInspector({
  preset,
  onDelete,
  isDeleting,
}: PresetInspectorProps) {
  if (!preset) {
    return (
      <div className="md:col-span-2 glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 text-center py-16 text-slate-400 dark:text-slate-500 text-xs bg-white/80 dark:bg-slate-900/60">
        Select a preset to view its style configuration.
      </div>
    );
  }

  return (
    <div className="md:col-span-2 glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 bg-white/80 dark:bg-slate-900/60 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800/80 pb-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {preset.name}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {preset.description || "Preset Details"}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="font-mono text-xs text-purple-700 dark:text-[#58E6F7] bg-purple-50 dark:bg-purple-950/70 px-3 py-1 rounded-lg border border-purple-200 dark:border-purple-800/60 shadow-xs">
            {preset.aspectRatio}
          </span>
          {!preset.isDefault && onDelete && (
            <button
              type="button"
              onClick={() => onDelete(preset._id, preset.name)}
              disabled={isDeleting}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-800/50 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
              title="Delete this style preset"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isDeleting ? "Deleting..." : "Delete Preset"}</span>
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3 text-xs">
        <div>
          <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
            Visual Art Style DNA:
          </span>
          <pre className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 font-mono text-[11px] text-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-800 whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto">
            {preset.visualStyleRules}
          </pre>
        </div>

        <div>
          <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
            Pipeline Workflow:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px]">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-[#58E6F7]/40 transition-colors">
              <span className="text-[#8A3FFC] dark:text-[#58E6F7] font-bold block">
                Stage 1
              </span>
              <span className="text-slate-500 dark:text-slate-400">
                Viral Topic Ideation
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-[#8A3FFC]/40 transition-colors">
              <span className="text-[#8A3FFC] font-bold block">Stage 2</span>
              <span className="text-slate-500 dark:text-slate-400">
                Voiceover &lt;90 chars
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-[#E51FD1]/40 transition-colors">
              <span className="text-[#E51FD1] font-bold block">Stage 3</span>
              <span className="text-slate-500 dark:text-slate-400">
                Batch Image Prompts
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-[#FF7A32]/40 transition-colors">
              <span className="text-[#FF7A32] font-bold block">Stage 4</span>
              <span className="text-slate-500 dark:text-slate-400">
                Viral SEO & Packaging
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PresetInspector;
