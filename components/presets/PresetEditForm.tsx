"use client";

import { Check, ChevronDown, ChevronUp, Loader2 } from "lucide-react";

interface PresetEditFormProps {
  name: string;
  setName: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  aspectRatio: string;
  setAspectRatio: (v: string) => void;
  visualStyleRules: string;
  setVisualStyleRules: (v: string) => void;
  stage1Prompt: string;
  setStage1Prompt: (v: string) => void;
  stage2Prompt: string;
  setStage2Prompt: (v: string) => void;
  stage3Prompt: string;
  setStage3Prompt: (v: string) => void;
  stage4Prompt: string;
  setStage4Prompt: (v: string) => void;
  showAdvancedPrompts: boolean;
  setShowAdvancedPrompts: (updater: (prev: boolean) => boolean) => void;
  saving: boolean;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function PresetEditForm({
  name,
  setName,
  description,
  setDescription,
  aspectRatio,
  setAspectRatio,
  visualStyleRules,
  setVisualStyleRules,
  stage1Prompt,
  setStage1Prompt,
  stage2Prompt,
  setStage2Prompt,
  stage3Prompt,
  setStage3Prompt,
  stage4Prompt,
  setStage4Prompt,
  showAdvancedPrompts,
  setShowAdvancedPrompts,
  saving,
  onCancel,
  onSubmit,
}: PresetEditFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4 text-xs">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="font-semibold text-slate-700 dark:text-slate-300">
            Preset Style Name:
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Preset Name"
            required
            className="w-full bg-slate-50 dark:bg-slate-900 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#8A3FFC]"
          />
        </div>

        <div className="space-y-1">
          <label className="font-semibold text-slate-700 dark:text-slate-300">
            Aspect Ratio / Engine Flags:
          </label>
          <input
            type="text"
            value={aspectRatio}
            onChange={(e) => setAspectRatio(e.target.value)}
            placeholder="--ar 16:9 --v 6.1"
            className="w-full bg-slate-50 dark:bg-slate-900 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#8A3FFC]"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="font-semibold text-slate-700 dark:text-slate-300">
          Description:
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short description of this art style..."
          className="w-full bg-slate-50 dark:bg-slate-900 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#8A3FFC]"
        />
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="font-semibold text-slate-700 dark:text-slate-300">
            Visual Art Style DNA (Style Prompt Rules):
          </label>
          <span className="text-[11px] text-slate-400">
            Injected into image generation prompts
          </span>
        </div>
        <textarea
          rows={9}
          value={visualStyleRules}
          onChange={(e) => setVisualStyleRules(e.target.value)}
          placeholder="Define the visual aesthetic, line style, characters, colors, lighting, and negative rules..."
          required
          className="w-full bg-slate-50 dark:bg-slate-950 font-mono text-[11px] leading-relaxed text-slate-900 dark:text-slate-200 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-[#8A3FFC]"
        />
      </div>

      {/* Collapsible Advanced Pipeline Prompts */}
      <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80">
        <button
          type="button"
          onClick={() => setShowAdvancedPrompts((prev) => !prev)}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#8A3FFC] dark:text-[#58E6F7] hover:underline cursor-pointer"
        >
          {showAdvancedPrompts ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
          <span>Advanced: Pipeline Stage Prompt Templates (Optional)</span>
        </button>

        {showAdvancedPrompts && (
          <div className="space-y-3 mt-3 animate-fade-in">
            <div className="space-y-1">
              <label className="font-medium text-slate-700 dark:text-slate-300">
                Stage 1 (Ideation) Prompt:
              </label>
              <textarea
                rows={4}
                value={stage1Prompt}
                onChange={(e) => setStage1Prompt(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 font-mono text-[10px] text-slate-800 dark:text-slate-300 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-[#8A3FFC]"
              />
            </div>
            <div className="space-y-1">
              <label className="font-medium text-slate-700 dark:text-slate-300">
                Stage 2 (Voiceover Narration) Prompt:
              </label>
              <textarea
                rows={4}
                value={stage2Prompt}
                onChange={(e) => setStage2Prompt(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 font-mono text-[10px] text-slate-800 dark:text-slate-300 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-[#8A3FFC]"
              />
            </div>
            <div className="space-y-1">
              <label className="font-medium text-slate-700 dark:text-slate-300">
                Stage 3 (Batch Image Prompts) Prompt:
              </label>
              <textarea
                rows={4}
                value={stage3Prompt}
                onChange={(e) => setStage3Prompt(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 font-mono text-[10px] text-slate-800 dark:text-slate-300 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-[#8A3FFC]"
              />
            </div>
            <div className="space-y-1">
              <label className="font-medium text-slate-700 dark:text-slate-300">
                Stage 4 (Viral SEO & Packaging) Prompt:
              </label>
              <textarea
                rows={4}
                value={stage4Prompt}
                onChange={(e) => setStage4Prompt(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 font-mono text-[10px] text-slate-800 dark:text-slate-300 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-[#8A3FFC]"
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800/80">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2 rounded-xl bg-linear-to-r from-[#58E6F7] via-[#8A3FFC] to-[#E51FD1] hover:brightness-110 text-white font-bold cursor-pointer shadow-md shadow-[#8A3FFC]/25 transition-all flex items-center gap-2"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              <span>Save Preset Changes</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
