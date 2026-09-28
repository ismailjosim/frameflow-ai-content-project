"use client";

import type { User } from "better-auth";
import { AnimatePresence, motion } from "framer-motion";
import {
  Archive,
  ArrowRight,
  FileCheck,
  Film,
  Layers,
  Palette,
  Play,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FEATURE_TICKERS } from "./landing.data";

// Map icon keys to lucide icons
const ICONS = {
  zap: Zap,
  film: Film,
  palette: Palette,
  archive: Archive,
} as const;

interface HeroProps {
  user: User | null | undefined;
  activePipelineTab: number;
  onTabChange: (n: number) => void;
}

function FeatureTickers() {
  return (
    <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto text-left">
      {FEATURE_TICKERS.map((f) => {
        const Icon = ICONS[f.icon];
        return (
          <div
            key={f.label}
            className="p-3.5 rounded-2xl backdrop-blur-sm transition-all hover:scale-[1.02] bg-white/70 dark:bg-slate-900/60 shadow-xs"
            style={{ background: f.glow, border: `1px solid ${f.border}` }}
          >
            <span
              className="font-bold text-xs flex items-center gap-1.5 mb-1.5"
              style={{ color: f.color }}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              {f.label}
            </span>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              {f.desc}
            </p>
          </div>
        );
      })}
    </div>
  );
}

function PipelineMockup({
  activePipelineTab,
  onTabChange,
}: Pick<HeroProps, "activePipelineTab" | "onTabChange">) {
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
          <div className="flex items-center gap-0.5 sm:gap-1 rounded-xl p-0.5 sm:p-1 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 shrink-0">
            {[
              { num: 1, label: "Topic" },
              { num: 2, label: "Script" },
              { num: 3, label: "Prompts" },
              { num: 4, label: "Packaging" },
            ].map((s) => {
              const isActive = activePipelineTab === s.num;
              return (
                <button
                  key={s.num}
                  type="button"
                  onClick={() => onTabChange(s.num)}
                  className={`relative px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-bold transition-colors cursor-pointer ${
                    isActive
                      ? "text-white"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="pipelineActiveTab"
                      className="absolute inset-0 rounded-lg bg-linear-to-r from-[#8A3FFC] to-[#E51FD1] shadow-sm shadow-[#8A3FFC]/30"
                      transition={{
                        type: "spring",
                        stiffness: 450,
                        damping: 35,
                      }}
                    />
                  )}
                  <span className="relative z-10 hidden sm:inline">Stage </span>
                  <span className="relative z-10 sm:hidden">S</span>
                  <span className="relative z-10">{s.num}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab content with AnimatePresence */}
        <div className="p-3 sm:p-6 rounded-xl sm:rounded-2xl min-h-60 sm:min-h-64 flex flex-col justify-center bg-slate-50/80 dark:bg-white/3 border border-slate-200/80 dark:border-white/5 overflow-hidden">
          <AnimatePresence mode="wait">
            {activePipelineTab === 1 && (
              <motion.div
                key="stage-1"
                initial={{ opacity: 0, y: 10, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.99 }}
                transition={{ duration: 0.32, ease: "easeOut" }}
                className="space-y-3 sm:space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Stage 1 • Algorithmic Topic Ranker
                  </span>
                  <span className="text-[11px] sm:text-xs font-mono font-bold text-[#58E6F7]">
                    Virality Confidence: 96%
                  </span>
                </div>
                <div className="p-3 sm:p-4 rounded-xl space-y-2 bg-cyan-50/70 dark:bg-[#58E6F7]/5 border border-cyan-200 dark:border-[#58E6F7]/20">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#8A3FFC]/20 text-[#8A3FFC]">
                      #1 PRIORITIZED ANGLE
                    </span>
                    <span className="text-xs text-muted-foreground">
                      The Forgotten Survival Technique
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-foreground">
                    How Ancient Humans Survived 40-Below Winters Without Fire
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Dilemma: When storm winds killed cave firepits, thirty
                    Neanderthals faced freeze death in 4 hours. How their
                    insulated snow shelters changed human anatomy forever.
                  </p>
                </div>
              </motion.div>
            )}

            {activePipelineTab === 2 && (
              <motion.div
                key="stage-2"
                initial={{ opacity: 0, y: 10, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.99 }}
                transition={{ duration: 0.32, ease: "easeOut" }}
                className="space-y-3 sm:space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Stage 2 • 90-Char Narration Script
                  </span>
                  <span className="text-[11px] sm:text-xs font-mono font-bold text-[#8A3FFC]">
                    24 Lines • 100% Under 90 Chars
                  </span>
                </div>
                <div className="p-3 sm:p-4 rounded-xl font-mono text-[11px] sm:text-xs space-y-1.5 text-foreground bg-purple-50/70 dark:bg-[#8A3FFC]/5 border border-purple-200 dark:border-[#8A3FFC]/20 overflow-x-auto">
                  <p className="text-muted-foreground">
                    [00:00] It was forty below zero.
                  </p>
                  <p>[00:02] The fire had died two hours ago.</p>
                  <p className="text-[#8A3FFC] font-semibold">
                    [00:04] Inside the dark cave, thirty humans were freezing.
                  </p>
                  <p>
                    [00:07] But one hunter reached for something unexpected.
                  </p>
                  <p>[00:10] Mammoth fat mixed with dried moss.</p>
                </div>
              </motion.div>
            )}

            {activePipelineTab === 3 && (
              <motion.div
                key="stage-3"
                initial={{ opacity: 0, y: 10, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.99 }}
                transition={{ duration: 0.32, ease: "easeOut" }}
                className="space-y-3 sm:space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Stage 3 • HomoDoodle Visual Prompts
                  </span>
                  <span className="text-[11px] sm:text-xs font-mono font-bold text-[#E51FD1]">
                    Midjourney v6.1 &amp; Flux Schnell
                  </span>
                </div>
                <div className="p-3 sm:p-4 rounded-xl font-mono text-[11px] sm:text-xs space-y-2 text-foreground bg-pink-50/70 dark:bg-[#E51FD1]/5 border border-pink-200 dark:border-[#E51FD1]/20">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#8A3FFC]/20 text-[#8A3FFC] text-[10px] font-bold flex items-center justify-center">
                      1
                    </span>
                    <span className="text-muted-foreground">
                      Prompt #1 [00:00 - 00:02]
                    </span>
                  </div>
                  <p className="text-xs text-foreground/90 leading-relaxed p-2.5 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 wrap-break-word">
                    Hand-drawn 2D doodle cartoon illustration, minimalist stick
                    figure explainer style, flat solid colors, bold black marker
                    outlines, HomoDoodle stickman in slate grey tunic shivering
                    on #D6B27A background, dot eyes, label COLD EARTH with
                    arrow, no gradients, no shadows, no 3D --ar 16:9 --v 6.1
                  </p>
                </div>
              </motion.div>
            )}

            {activePipelineTab === 4 && (
              <motion.div
                key="stage-4"
                initial={{ opacity: 0, y: 10, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.99 }}
                transition={{ duration: 0.32, ease: "easeOut" }}
                className="space-y-3 sm:space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Stage 4 • ZIP Production Bundle
                  </span>
                  <span className="text-[11px] sm:text-xs font-mono font-bold text-[#FF7A32]">
                    Export Ready: 5 Files Packed
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
                  {[
                    {
                      icon: <FileCheck className="w-5 h-5" />,
                      color: "#8A3FFC",
                      name: "script.txt",
                      sub: "Voiceover file",
                    },
                    {
                      icon: <Layers className="w-5 h-5" />,
                      color: "#E51FD1",
                      name: "prompts.txt",
                      sub: "Visual prompts",
                    },
                    {
                      icon: <Sparkles className="w-5 h-5" />,
                      color: "#58E6F7",
                      name: "packaging.txt",
                      sub: "SEO & Tags",
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
      </div>
    </div>
  );
}

export function LandingHero({
  user,
  activePipelineTab,
  onTabChange,
}: HeroProps) {
  return (
    <section className="relative overflow-hidden pt-12 sm:pt-20 pb-16 sm:pb-24">
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-175 h-100 bg-linear-to-tr from-[#58E6F7]/15 via-[#8A3FFC]/15 to-[#E51FD1]/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-3/4 left-1/4 w-80 h-80 bg-[#FF1688]/8 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-2.5 sm:px-6 lg:px-8 text-center space-y-5 sm:space-y-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 dark:bg-white/5 border border-[#E51FD1]/20 text-[11px] sm:text-xs font-semibold shadow-xs shadow-[#E51FD1]/10 max-w-full">
          <span className="w-2 h-2 rounded-full bg-[#E51FD1] animate-pulse shrink-0" />
          <span className="text-muted-foreground">
            Production-Grade AI Pipeline for Stickman Documentaries
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.12] sm:leading-[1.08] text-foreground">
          Imagine. Generate. Create.
          <br />
          <span className="text-frameflow-gradient">
            From Idea to Video, All in One Flow.
          </span>
        </h1>

        <p className="max-w-3xl mx-auto text-sm sm:text-lg text-muted-foreground leading-relaxed px-1">
          The automated 4-stage pipeline for YouTube stickman documentary
          creators. Explore virality-scored topics, craft 90-character paced
          narration, formulate batch Midjourney &amp; Flux prompts, and export a
          ready-to-edit production ZIP bundle in minutes.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-4 pt-2 w-full">
          <Link
            href={user ? "/dashboard" : "/register"}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 sm:px-8 py-3.5 rounded-2xl bg-linear-to-r from-[#58E6F7] via-[#8A3FFC] to-[#E51FD1] hover:brightness-110 text-white font-extrabold text-sm shadow-xl shadow-[#8A3FFC]/30 hover:scale-[1.02] transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>Launch Video Studio</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </Link>
          <a
            href="#pipeline"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 sm:px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200 dark:bg-white/5 dark:hover:bg-white/10 dark:text-foreground dark:border-white/10 font-semibold text-sm border transition-colors cursor-pointer"
          >
            <Play className="w-4 h-4 text-[#8A3FFC] shrink-0" />
            <span>Explore 4-Stage Workflow</span>
          </a>
        </div>

        {/* Feature Ticker Cards */}
        <FeatureTickers />
      </div>

      {/* Hero Interactive Pipeline Mockup */}
      <PipelineMockup
        activePipelineTab={activePipelineTab}
        onTabChange={onTabChange}
      />
    </section>
  );
}

export default LandingHero;
