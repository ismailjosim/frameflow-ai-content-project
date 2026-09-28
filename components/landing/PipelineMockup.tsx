"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { PipelineMockupTabs } from "./PipelineMockupTabs";

interface PipelineMockupProps {
  activePipelineTab: number;
  onTabChange: (n: number) => void;
}

export function PipelineMockup({
  activePipelineTab,
  onTabChange,
}: PipelineMockupProps) {
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance through pipeline steps every 3.8s using framer-motion
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      onTabChange(activePipelineTab === 4 ? 1 : activePipelineTab + 1);
    }, 3800);

    return () => clearInterval(timer);
  }, [activePipelineTab, isPaused, onTabChange]);

  return (
    <div
      className="max-w-5xl mx-auto mt-10 sm:mt-16 px-2 sm:px-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <div className="rounded-2xl sm:rounded-3xl p-2.5 sm:p-6 shadow-2xl shadow-[#8A3FFC]/15 space-y-3 sm:space-y-4 backdrop-blur-xl bg-white/95 dark:bg-slate-950/95 border border-slate-200 dark:border-purple-500/20 overflow-hidden">
        {/* Window bar */}
        <div className="flex items-center justify-between gap-1 pb-2 sm:pb-3 border-b border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-rose-500/70" />
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-500/70" />
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-500/70" />
            <span className="text-xs font-mono text-muted-foreground ml-2 hidden sm:inline items-center gap-1.5">
              <span>FrameFlow Studio • Active Documentary Pipeline</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
            </span>
          </div>

          {/* Stage tab switcher with framer-motion sliding pill */}
          <div className="flex items-center gap-0.5 sm:gap-1 bg-slate-100 dark:bg-slate-900/80 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-[10px] sm:text-xs font-semibold overflow-x-auto max-w-full">
            {[
              { n: 1, label: "1. Topic" },
              { n: 2, label: "2. Script" },
              { n: 3, label: "3. Prompts" },
              { n: 4, label: "4. Packaging" },
            ].map(({ n, label }) => {
              const isActive = activePipelineTab === n;
              return (
                <button
                  type="button"
                  key={n}
                  onClick={() => onTabChange(n)}
                  className={`relative px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg transition-colors cursor-pointer shrink-0 ${
                    isActive
                      ? "text-white font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="heroTabPill"
                      className="absolute inset-0 bg-linear-to-r from-[#58E6F7] via-[#8A3FFC] to-[#E51FD1] rounded-lg shadow-sm"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10">{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab content mock views */}
        <PipelineMockupTabs activePipelineTab={activePipelineTab} />
      </div>
    </div>
  );
}

export default PipelineMockup;
