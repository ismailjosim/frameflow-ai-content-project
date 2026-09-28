"use client";

import { Star, Trash2, User } from "lucide-react";
import type { Preset } from "./presets.types";

interface PresetCardProps {
  preset: Preset;
  isSelected: boolean;
  isDeleting: boolean;
  onSelect: (preset: Preset) => void;
  onDeleteRequest: (id: string, name: string) => void;
}

export function PresetCard({
  preset,
  isSelected,
  isDeleting,
  onSelect,
  onDeleteRequest,
}: PresetCardProps) {
  return (
    <div
      onClick={() => onSelect(preset)}
      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
        isSelected
          ? "bg-linear-to-r from-[#8A3FFC]/15 via-[#E51FD1]/10 to-transparent border-[#E51FD1] shadow-md shadow-[#8A3FFC]/20 ring-1 ring-[#E51FD1]/50 text-slate-900 dark:text-white"
          : "glass-panel border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white/80 dark:bg-slate-900/60"
      } ${isDeleting ? "opacity-50 pointer-events-none" : ""}`}
    >
      <div className="flex items-center justify-between">
        <span className="font-bold text-xs text-slate-900 dark:text-white truncate pr-2">
          {preset.name}
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          {preset.isDefault ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-linear-to-r from-purple-100 to-pink-100 dark:from-[#8A3FFC]/25 dark:to-[#E51FD1]/25 text-purple-700 dark:text-pink-300 border border-purple-200 dark:border-[#E51FD1]/40">
              <Star className="w-2.5 h-2.5 fill-current" />
              Default
            </span>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteRequest(preset._id, preset.name);
              }}
              disabled={isDeleting}
              className="p-1 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title={`Delete preset ${preset.name}`}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
      {preset.description && (
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
          {preset.description}
        </p>
      )}
      <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-800/60 text-[10px]">
        <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400 truncate max-w-[140px]">
          <User className="w-2.5 h-2.5 text-[#8A3FFC] dark:text-[#58E6F7] shrink-0" />
          <span className="truncate">
            {preset.userName || (preset.isDefault ? "System" : "Creator")}
          </span>
        </span>
        <span className="font-mono text-[#8A3FFC] dark:text-[#58E6F7] shrink-0">
          {preset.aspectRatio}
        </span>
      </div>
    </div>
  );
}
