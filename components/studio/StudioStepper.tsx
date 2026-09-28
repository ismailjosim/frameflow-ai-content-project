"use client";

import { CheckCircle2 } from "lucide-react";
import type { StageStep } from "@/types";

interface StudioStepperProps {
  stages: StageStep[];
  activeStage: number;
  onSelectStage: (stageNum: number) => void;
}

export function StudioStepper({
  stages,
  activeStage,
  onSelectStage,
}: StudioStepperProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
      {stages.map((st) => {
        const isActive = activeStage === st.num;
        return (
          <button
            type="button"
            key={st.num}
            onClick={() => st.unlocked && onSelectStage(st.num)}
            disabled={!st.unlocked}
            className={`p-2.5 sm:p-3.5 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between min-w-0 ${
              isActive
                ? "bg-linear-to-r from-[#8A3FFC]/20 via-[#E51FD1]/15 to-[#FF1688]/15 border-[#E51FD1] shadow-lg shadow-[#8A3FFC]/20 ring-1 ring-[#58E6F7]/30"
                : st.unlocked
                  ? "glass-panel border-slate-200 dark:border-slate-800 hover:border-[#8A3FFC]/50 hover:bg-slate-100 dark:hover:bg-slate-900/60 bg-white/80 dark:bg-slate-900/60 cursor-pointer"
                  : "opacity-40 border-slate-200 dark:border-slate-900/60 bg-slate-100/50 dark:bg-slate-950/50 cursor-not-allowed"
            }`}
          >
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
              <span
                className={`w-6 h-6 rounded-full font-mono text-xs font-bold shrink-0 flex items-center justify-center ${
                  isActive
                    ? "bg-frameflow-gradient text-slate-950 font-black shadow-md shadow-[#58E6F7]/40"
                    : st.done
                      ? "bg-purple-100 dark:bg-linear-to-br dark:from-[#8A3FFC]/30 dark:to-[#E51FD1]/30 text-purple-700 dark:text-[#58E6F7] border border-purple-200 dark:border-[#E51FD1]/40"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                }`}
              >
                {st.done && !isActive ? "✓" : st.num}
              </span>
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400 block tracking-wider">
                  Stage {st.num}
                </span>
                <span
                  className={`text-xs font-bold truncate block ${
                    isActive
                      ? "text-slate-900 dark:text-white"
                      : "text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {st.label}
                </span>
              </div>
            </div>

            {st.done && (
              <CheckCircle2 className="w-4 h-4 text-[#8A3FFC] dark:text-[#58E6F7] shrink-0 hidden sm:block" />
            )}
          </button>
        );
      })}
    </div>
  );
}

export default StudioStepper;
