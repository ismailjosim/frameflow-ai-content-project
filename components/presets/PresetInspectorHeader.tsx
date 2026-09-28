"use client";

import {
  Edit3,
  Loader2,
  Save,
  Sparkles,
  Star,
  Trash2,
  User,
  X,
} from "lucide-react";
import type { Preset } from "./presets.types";

interface PresetInspectorHeaderProps {
  preset: Preset;
  isEditing: boolean;
  saving: boolean;
  isDeleting?: boolean;
  isSettingDefault?: boolean;
  onSetDefault?: (preset: Preset) => void;
  onDelete?: (id: string, name: string) => void;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSave: (e: React.FormEvent) => void;
}

export function PresetInspectorHeader({
  preset,
  isEditing,
  saving,
  isDeleting,
  isSettingDefault,
  onSetDefault,
  onDelete,
  onStartEdit,
  onCancelEdit,
  onSave,
}: PresetInspectorHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800/80 pb-4">
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {isEditing ? "Edit Style Preset" : preset.name}
          </h3>
          {preset.isDefault ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-linear-to-r from-purple-100 to-pink-100 dark:from-[#8A3FFC]/25 dark:to-[#E51FD1]/25 text-purple-700 dark:text-pink-300 border border-purple-200 dark:border-[#E51FD1]/40 shadow-xs">
              <Star className="w-3 h-3 fill-current" />
              Active Default
            </span>
          ) : null}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {isEditing
            ? "Modify this preset's visual prompt rules, parameters, and pipeline stages."
            : preset.description || "Preset Details"}
        </p>
        {!isEditing && (
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-2 flex-wrap">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 shadow-xs">
              <User className="w-3 h-3 text-[#8A3FFC] dark:text-[#58E6F7]" />
              <span>
                By{" "}
                {preset.userName ||
                  (preset.isDefault ? "System Default" : "Creator")}
              </span>
              {preset.userEmail && (
                <span className="text-slate-400 text-[10px] hidden sm:inline">
                  ({preset.userEmail})
                </span>
              )}
            </div>
            {preset.createdAt && (
              <span className="text-[11px] text-slate-400">
                • Added {new Date(preset.createdAt).toLocaleDateString()}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Header Action Buttons */}
      <div className="flex items-center gap-2 shrink-0 flex-wrap">
        {!isEditing ? (
          <>
            <span className="font-mono text-xs text-purple-700 dark:text-[#58E6F7] bg-purple-50 dark:bg-purple-950/70 px-3 py-1 rounded-lg border border-purple-200 dark:border-purple-800/60 shadow-xs">
              {preset.aspectRatio}
            </span>

            {!preset.isDefault && onSetDefault && (
              <button
                type="button"
                onClick={() => onSetDefault(preset)}
                disabled={isSettingDefault}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50 text-xs font-semibold transition-all cursor-pointer shadow-xs"
                title="Make this preset the default for all new video generations"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {isSettingDefault ? "Setting Default..." : "Set as Default"}
                </span>
              </button>
            )}

            <button
              type="button"
              onClick={onStartEdit}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors cursor-pointer border border-slate-200 dark:border-slate-700 shadow-xs"
              title="Edit preset parameters"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#8A3FFC] dark:text-[#58E6F7]" />
              <span>Edit Preset</span>
            </button>

            {!preset.isDefault && onDelete && (
              <button
                type="button"
                onClick={() => onDelete(preset._id, preset.name)}
                disabled={isDeleting}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-800/50 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
                title="Delete this style preset"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isDeleting ? "Deleting..." : "Delete"}</span>
              </button>
            )}
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={onCancelEdit}
              disabled={saving}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Cancel</span>
            </button>
            <button
              type="button"
              onClick={onSave}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-linear-to-r from-[#58E6F7] via-[#8A3FFC] to-[#E51FD1] hover:brightness-110 text-white text-xs font-bold transition-all shadow-md shadow-[#8A3FFC]/25 cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
