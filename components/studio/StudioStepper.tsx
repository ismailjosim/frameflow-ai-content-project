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
            key={st.num}
            onClick={() => st.unlocked && onSelectStage(st.num)}
            disabled={!st.unlocked}
            className={`p-2.5 sm:p-3.5 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between min-w-0 ${
              isActive
                ? "bg-linear-to-r from-[#8A3FFC]/25 via-[#E51FD1]/20 to-[#FF1688]/15 border-[#E51FD1] shadow-lg shadow-[#8A3FFC]/20 ring-1 ring-[#58E6F7]/30"
                : st.unlocked
                  ? "glass-panel border-slate-800 hover:border-[#8A3FFC]/50 hover:bg-slate-900/60 cursor-pointer"
                  : "opacity-40 border-slate-900/60 bg-slate-950/50 cursor-not-allowed"
            }`}
          >
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
              <span
                className={`w-6 h-6 rounded-full font-mono text-xs font-bold shrink-0 flex items-center justify-center ${
                  isActive
                    ? "bg-frameflow-gradient text-slate-950 font-black shadow-md shadow-[#58E6F7]/40"
                    : st.done
                      ? "bg-emerald-950 text-emerald-400 border border-emerald-800/50"
                      : "bg-slate-800 text-slate-400"
                }`}
              >
                {st.done && !isActive ? "✓" : st.num}
              </span>
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">
                  Stage {st.num}
                </span>
                <span
                  className={`text-xs font-bold truncate block ${
                    isActive ? "text-white" : "text-slate-300"
                  }`}
                >
                  {st.label}
                </span>
              </div>
            </div>

            {st.done && (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 hidden sm:block" />
            )}
          </button>
        );
      })}
    </div>
  );
}
