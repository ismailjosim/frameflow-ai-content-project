"use client";

import { Loader2, Save } from "lucide-react";
import Image from "next/image";

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
    <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/80 dark:bg-slate-900/60 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl p-[1.5px] bg-frameflow-gradient shrink-0 shadow-md shadow-[#8A3FFC]/20">
          <div className="w-full h-full rounded-[9px] bg-slate-950 flex items-center justify-center p-0.5">
            <Image
              src="/apple-touch-icon.png"
              alt="FrameFlow"
              width={26}
              height={26}
              className="object-contain rounded-md"
            />
          </div>
        </div>
        <div>
          <input
            type="text"
            value={projectTitle}
            onChange={(e) => onTitleChange(e.target.value)}
            onBlur={onTitleBlur}
            className="bg-transparent text-sm sm:text-base font-bold text-slate-900 dark:text-white border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-[#8A3FFC] focus:outline-none transition-colors px-1 py-0.5"
            title="Click to rename project"
          />
          <p className="text-[11px] text-slate-500 dark:text-slate-400 px-1">
            <span className="text-slate-700 dark:text-slate-300 font-medium">
              From Idea to Video, All in One Flow
            </span>{" "}
            • 4-Stage Pipeline
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        {saveStatus && (
          <span className="text-xs font-mono font-bold text-purple-700 dark:text-[#58E6F7] bg-purple-50 dark:bg-linear-to-r dark:from-[#8A3FFC]/20 dark:to-[#E51FD1]/20 px-2.5 py-1 rounded-lg border border-purple-200 dark:border-[#E51FD1]/40 animate-fade-in">
            {saveStatus}
          </span>
        )}

        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium border border-slate-200 dark:border-slate-700 transition-colors disabled:opacity-50 cursor-pointer"
        >
          {isSaving ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Save className="w-3.5 h-3.5 text-[#8A3FFC] dark:text-[#58E6F7]" />
          )}
          <span>Save Progress</span>
        </button>
      </div>
    </div>
  );
}

export default StudioHeader;
