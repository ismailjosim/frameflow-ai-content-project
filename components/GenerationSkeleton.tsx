"use client";

import { Activity, BrainCircuit, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

interface GenerationSkeletonProps {
  stage: "topic" | "script" | "prompts" | "packaging";
  currentBatch?: number;
  totalBatches?: number;
}

const STAGE_MESSAGES: Record<
  GenerationSkeletonProps["stage"],
  { title: string; steps: string[] }
> = {
  topic: {
    title: "AI Viral Topic & Angle Orchestrator",
    steps: [
      "Querying live audience search demand indices...",
      "Analyzing YouTube high-retention curiosity gap patterns...",
      "Evaluating mobile thumbnail readability and click potential...",
      "Simulating visceral survival stakes & emotional hook strength...",
      "Calculating data-backed virality scores across 5 candidate angles...",
    ],
  },
  script: {
    title: "AI Master Narration Script Engine",
    steps: [
      "Establishing visceral 2nd-person immersion ('you' perspective)...",
      "Structuring high-retention pacing and emotional dilemma arcs...",
      "Translating archaeological and scientific mechanisms into plain language...",
      "Formatting narration strictly into caption-ready 90-character sentences...",
      "Polishing ElevenLabs TTS rhythm and dramatic vocal pauses...",
    ],
  },
  prompts: {
    title: "AI 2D Doodle Director & Flux Prompt Synthesizer",
    steps: [
      "Parsing timestamp markers and scene narrative cues...",
      "Enforcing strict 2D hand-drawn marker stickman aesthetic...",
      "Injecting high-contrast palette rules (#FFFFFF, #3A86FF, #E63946)...",
      "Composing wide establishing shots & dramatic punch-in zoom framing...",
      "Assembling prompt batch for Midjourney v6.1 & Flux...",
    ],
  },
  packaging: {
    title: "YouTube SEO & Viral Packaging Matrix",
    steps: [
      "Engineering curiosity-driven high-CTR title variations...",
      "Synthesizing high-contrast focal thumbnail prompt...",
      "Drafting 2-sentence hook and scientific context description...",
      "Analyzing high-volume search tags and targeted hashtags...",
      "Finalizing complete viral distribution package...",
    ],
  },
};

export default function GenerationSkeleton({
  stage,
  currentBatch,
  totalBatches,
}: GenerationSkeletonProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const stageData = STAGE_MESSAGES[stage];

  // Rotate informative steps every 2.4 seconds so user knows it's working actively
  useEffect(() => {
    const stepInterval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % stageData.steps.length);
    }, 2400);

    const timerInterval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(stepInterval);
      clearInterval(timerInterval);
    };
  }, [stageData.steps.length]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#8A3FFC]/40 bg-white/90 dark:bg-slate-950/90 p-6 shadow-xl shadow-[#8A3FFC]/10 backdrop-blur-xl transition-colors">
      {/* Top Gradient Shimmer Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 overflow-hidden bg-slate-100 dark:bg-slate-900">
        <div className="h-full w-full bg-frameflow-gradient-h animate-pulse" />
      </div>

      <div className="space-y-5">
        {/* Header with Live Status and Elapsed Timer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800/80 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-linear-to-br from-[#58E6F7]/20 to-[#8A3FFC]/30 text-[#8A3FFC] dark:text-[#58E6F7] border border-[#58E6F7]/40">
              <BrainCircuit className="w-4 h-4 animate-spin" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#E51FD1] animate-ping" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900 dark:text-white tracking-tight">
                  {stageData.title}
                </span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-linear-to-r from-purple-100 to-pink-100 dark:from-purple-950/80 dark:to-pink-950/80 text-purple-700 dark:text-pink-300 border border-purple-200 dark:border-pink-500/40 animate-pulse">
                  Live Generating
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
                <Activity className="w-3 h-3 text-[#E51FD1] animate-pulse" />
                <span className="text-slate-800 dark:text-slate-200 font-medium">
                  {stageData.steps[stepIndex]}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {totalBatches && totalBatches > 1 && (
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-linear-to-r from-[#8A3FFC]/20 to-[#E51FD1]/20 text-purple-700 dark:text-pink-300 border border-[#E51FD1]/40">
                Batch {currentBatch} of {totalBatches}
              </span>
            )}
            <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
              Elapsed: {elapsedSeconds}s
            </span>
          </div>
        </div>

        {/* Skeleton Animated Shimmering Text Lines */}
        <div className="space-y-3.5 py-2">
          {/* Skeleton Line 1 */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-pulse shrink-0" />
            <div className="h-4 rounded-md bg-linear-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 animate-pulse w-3/4" />
          </div>

          {/* Skeleton Line 2 */}
          <div className="flex items-center gap-3 pl-10">
            <div className="h-3.5 rounded-md bg-linear-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-900 dark:via-slate-800/80 dark:to-slate-900 animate-pulse w-full" />
          </div>

          {/* Skeleton Line 3 */}
          <div className="flex items-center gap-3 pl-10">
            <div className="h-3.5 rounded-md bg-linear-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-900 dark:via-slate-800/70 dark:to-slate-900 animate-pulse w-5/6" />
          </div>

          {/* Skeleton Card Block (representing structured items) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/70 space-y-2.5 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="h-3.5 w-24 rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-3.5 w-12 rounded bg-slate-200 dark:bg-slate-800" />
              </div>
              <div className="h-4 w-5/6 rounded bg-slate-200 dark:bg-slate-800/80" />
              <div className="h-3 w-full rounded bg-slate-200 dark:bg-slate-800/60" />
              <div className="h-3 w-4/5 rounded bg-slate-200 dark:bg-slate-800/60" />
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/70 space-y-2.5 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="h-3.5 w-24 rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-3.5 w-12 rounded bg-slate-200 dark:bg-slate-800" />
              </div>
              <div className="h-4 w-5/6 rounded bg-slate-200 dark:bg-slate-800/80" />
              <div className="h-3 w-full rounded bg-slate-200 dark:bg-slate-800/60" />
              <div className="h-3 w-4/5 rounded bg-slate-200 dark:bg-slate-800/60" />
            </div>
          </div>

          {/* Skeleton Line 4 */}
          <div className="flex items-center gap-3 pl-10 pt-1">
            <div className="h-3 rounded-md bg-linear-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-900 dark:via-slate-800/60 dark:to-slate-900 animate-pulse w-2/3" />
          </div>
        </div>

        {/* Micro Notice */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800/60">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#8A3FFC] dark:text-[#58E6F7]" />
            Zero freeze streaming pipeline active
          </span>
          <span className="text-slate-500 dark:text-slate-400">
            Please wait while the AI model finalizes generation...
          </span>
        </div>
      </div>
    </div>
  );
}
