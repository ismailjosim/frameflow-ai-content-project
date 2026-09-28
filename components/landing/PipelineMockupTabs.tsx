"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Archive, FileCheck, Film, Layers } from "lucide-react";

interface PipelineMockupTabsProps {
  activePipelineTab: number;
}

export function PipelineMockupTabs({
  activePipelineTab,
}: PipelineMockupTabsProps) {
  return (
    <div className="min-h-56 sm:min-h-64 flex flex-col justify-center text-left py-1 sm:py-2">
      <AnimatePresence mode="wait">
        {activePipelineTab === 1 && (
          <motion.div
            key="tab-1"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#58E6F7]">
                Stage 1 • High-CTR Topic Candidates
              </span>
              <span className="text-[11px] font-mono text-muted-foreground">
                Keyword: Stone Age
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
              {[
                {
                  score: "96%",
                  title: "The Fire That Never Went Out",
                  hook: "How 40 freezing Neanderthals defended coals for 300 years",
                  formula: "Curiosity Paradox",
                },
                {
                  score: "91%",
                  title: "The First Shoes Were a Death Sentence",
                  hook: "Why Stone Age hunters destroyed their feet before discovering sole arch",
                  formula: "Inverted Truth",
                },
              ].map((t) => (
                <div
                  key={t.title}
                  className="p-3 sm:p-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/60 space-y-1 sm:space-y-1.5 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-linear-to-r from-purple-100 to-pink-100 dark:from-purple-950/80 dark:to-pink-950/80 text-purple-700 dark:text-pink-300 border border-purple-200 dark:border-pink-500/30 font-semibold">
                      Score: {t.score}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {t.formula}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-foreground line-clamp-1">
                    {t.title}
                  </h4>
                  <p className="text-[11px] text-muted-foreground line-clamp-2">
                    {t.hook}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activePipelineTab === 2 && (
          <motion.div
            key="tab-2"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-2 sm:space-y-2.5 font-mono text-xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-sans uppercase tracking-wider text-[#8A3FFC]">
                Stage 2 • 90-Char Sentence Narration
              </span>
              <span className="text-[11px] text-muted-foreground font-sans">
                35 Sentences • ~3m 15s VO
              </span>
            </div>
            <div className="space-y-1.5 bg-slate-50 dark:bg-slate-900/70 p-3 sm:p-4 rounded-xl border border-slate-200 dark:border-white/10 text-[11px] sm:text-xs">
              <p className="text-slate-800 dark:text-slate-200">
                <span className="text-slate-400 select-none mr-2">01</span>
                It was forty below zero.
              </p>
              <p className="text-slate-800 dark:text-slate-200">
                <span className="text-slate-400 select-none mr-2">02</span>
                The fire had died two hours ago.
              </p>
              <p className="text-slate-800 dark:text-slate-200">
                <span className="text-slate-400 select-none mr-2">03</span>
                Inside the dark cave, thirty humans were freezing.
              </p>
              <p className="text-[#8A3FFC] font-semibold">
                <span className="text-slate-400 select-none mr-2">04</span>
                Then, one hunter noticed the glowing ash.
              </p>
            </div>
          </motion.div>
        )}

        {activePipelineTab === 3 && (
          <motion.div
            key="tab-3"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-2.5 font-mono text-xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-sans uppercase tracking-wider text-[#E51FD1]">
                Stage 3 • Midjourney &amp; Flux Batch Prompts
              </span>
              <span className="text-[11px] text-muted-foreground font-sans">
                Auto-aligned with timestamps
              </span>
            </div>
            <div className="p-3 sm:p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/70 space-y-2 text-[11px]">
              <p className="text-slate-800 dark:text-slate-300 leading-relaxed font-mono">
                <span className="text-[#58E6F7] font-bold">[00:00]</span>{" "}
                <span className="text-[#FF7A32] font-semibold">
                  [WIDE ESTABLISHING SHOT]
                </span>{" "}
                Hand-drawn 2D doodle cartoon illustration, minimalist stick
                figure explainer style, flat solid colors, bold black marker
                outlines, cave interior at blizzard dusk, protagonist shivering
                under furs, dark blue background #1D2A44 --ar 16:9 --v 6.1
              </p>
              <p className="text-slate-800 dark:text-slate-300 leading-relaxed font-mono">
                <span className="text-[#58E6F7] font-bold">[00:03]</span>{" "}
                <span className="text-[#FF7A32] font-semibold">
                  [PUNCH-IN ZOOM]
                </span>{" "}
                Hand-drawn 2D doodle cartoon, close-up of cold extinct campfire,
                grey ash flakes scattering in draft, distressed dot eyes --ar
                16:9 --v 6.1
              </p>
            </div>
          </motion.div>
        )}

        {activePipelineTab === 4 && (
          <motion.div
            key="tab-4"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-3 text-xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF7A32]">
                Stage 4 • YouTube Packaging &amp; ZIP Bundle
              </span>
              <span className="text-[11px] font-mono text-muted-foreground">
                1-Click Export Ready
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                {
                  icon: <Film className="w-5 h-5" />,
                  color: "#8A3FFC",
                  name: "01_topic.txt",
                  sub: "Angles & hook",
                },
                {
                  icon: <FileCheck className="w-5 h-5" />,
                  color: "#58E6F7",
                  name: "02_script.txt",
                  sub: "<90 char lines",
                },
                {
                  icon: <Layers className="w-5 h-5" />,
                  color: "#E51FD1",
                  name: "03_prompts.txt",
                  sub: "Batch MJ & Flux",
                },
                {
                  icon: <Archive className="w-5 h-5" />,
                  color: "#FF7A32",
                  name: "bundle.zip",
                  sub: "Full package",
                },
              ].map((f) => (
                <div
                  key={f.name}
                  className="p-2.5 sm:p-3 rounded-xl text-center transition-all hover:scale-[1.03] bg-white/80 dark:bg-slate-900/60 shadow-xs"
                  style={{
                    border: `1px solid ${f.color}35`,
                  }}
                >
                  <div
                    style={{ color: f.color }}
                    className="mx-auto mb-1 flex justify-center"
                  >
                    {f.icon}
                  </div>
                  <span className="text-xs font-bold block text-foreground truncate">
                    {f.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground truncate block">
                    {f.sub}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default PipelineMockupTabs;
