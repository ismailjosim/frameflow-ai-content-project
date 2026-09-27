"use client";

import { Film, Loader2, Save } from "lucide-react";

interface StudioHeaderProps {
  projectTitle: string;
  onTitleChange: (val: string) => void;
  onTitleBlur: () => void;
  isSaving: boolean;
  saveStatus: string | null;
  onSave: () => void;
}

export function StudioHeader({
  projectTitle,
  onTitleChange,
  onTitleBlur,
  isSaving,
  saveStatus,
  onSave,
}: StudioHeaderProps) {
  return (
    <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center shrink-0">
          <Film className="w-5 h-5" />
        </div>
        <div>
          <input
            type="text"
            value={projectTitle}
            onChange={(e) => onTitleChange(e.target.value)}
            onBlur={onTitleBlur}
            className="bg-transparent text-sm sm:text-base font-bold text-white border-b border-transparent hover:border-slate-700 focus:border-cyan-500 focus:outline-none transition-colors px-1 py-0.5"
            title="Click to rename project"
          />
          <p className="text-[11px] text-slate-400 px-1">
            4-Stage Pipeline • Auto-Model Failover Active
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        {saveStatus && (
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-800/40 animate-fade-in">
            {saveStatus}
          </span>
        )}

        <button
          onClick={onSave}
          disabled={isSaving}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors disabled:opacity-50 cursor-pointer"
        >
          {isSaving ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Save className="w-3.5 h-3.5 text-cyan-400" />
          )}
          <span>Save Progress</span>
        </button>
      </div>
    </div>
  );
}
