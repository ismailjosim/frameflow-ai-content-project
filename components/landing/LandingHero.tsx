"use client";

import type { User } from "better-auth";
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
            className="p-3.5 rounded-2xl backdrop-blur-sm transition-all hover:scale-[1.02]"
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
  return (
    <div className="max-w-5xl mx-auto mt-12 sm:mt-16 px-4">
      <div
        className="rounded-3xl p-3 sm:p-6 shadow-2xl shadow-[#8A3FFC]/15 space-y-4 backdrop-blur-xl"
        style={{
          background:
            "linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(9,13,22,0.98) 100%)",
          border: "1px solid rgba(138,63,252,0.2)",
        }}
      >
        {/* Window bar */}
        <div
          className="flex items-center justify-between pb-3"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/70" />
            <div className="w-3 h-3 rounded-full bg-amber-500/70" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
            <span className="text-xs font-mono text-muted-foreground ml-2 hidden sm:inline">
              FrameFlow Studio • Active Documentary Pipeline
            </span>
          </div>

          {/* Stage tab switcher */}
          <div
            className="flex items-center gap-1 rounded-xl p-1"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {[
              { num: 1, label: "Topic" },
              { num: 2, label: "Script" },
              { num: 3, label: "Prompts" },
              { num: 4, label: "Packaging" },
            ].map((s) => (
              <button
                key={s.num}
                type="button"
                onClick={() => onTabChange(s.num)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activePipelineTab === s.num
                    ? "bg-linear-to-r from-[#8A3FFC] to-[#E51FD1] text-white shadow-sm shadow-[#8A3FFC]/30"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Stage {s.num}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div
          className="p-4 sm:p-6 rounded-2xl min-h-64 flex flex-col justify-center"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {activePipelineTab === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Stage 1 • Algorithmic Topic Ranker
                </span>
                <span className="text-xs font-mono font-bold text-[#58E6F7]">
                  Virality Confidence: 96%
                </span>
              </div>
              <div
                className="p-4 rounded-xl space-y-2"
                style={{
                  background: "rgba(88,230,247,0.05)",
                  border: "1px solid rgba(88,230,247,0.15)",
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#8A3FFC]/20 text-[#8A3FFC]">
                    #1 PRIORITIZED ANGLE
                  </span>
                  <span className="text-xs text-muted-foreground">
                    The Forgotten Survival Technique
                  </span>
                </div>
                <h3 className="text-base font-bold text-foreground">
                  How Ancient Humans Survived 40-Below Winters Without Fire
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Dilemma: When storm winds killed cave firepits, thirty
                  Neanderthals faced freeze death in 4 hours. How their
                  insulated snow shelters changed human anatomy forever.
                </p>
              </div>
            </div>
          )}

          {activePipelineTab === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Stage 2 • 90-Char Narration Script
                </span>
                <span className="text-xs font-mono font-bold text-[#8A3FFC]">
                  24 Lines • 100% Under 90 Chars
                </span>
              </div>
              <div
                className="p-4 rounded-xl font-mono text-xs space-y-1.5 text-foreground"
                style={{
                  background: "rgba(138,63,252,0.05)",
                  border: "1px solid rgba(138,63,252,0.15)",
                }}
              >
                <p className="text-muted-foreground">
                  [00:00] It was forty below zero.
                </p>
                <p>[00:02] The fire had died two hours ago.</p>
                <p className="text-[#8A3FFC] font-semibold">
                  [00:04] Inside the dark cave, thirty humans were freezing.
                </p>
                <p>[00:07] But one hunter reached for something unexpected.</p>
                <p>[00:10] Mammoth fat mixed with dried moss.</p>
              </div>
            </div>
          )}

          {activePipelineTab === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Stage 3 • HomoDoodle Visual Prompts
                </span>
                <span className="text-xs font-mono font-bold text-[#E51FD1]">
                  Midjourney v6.1 &amp; Flux Schnell
                </span>
              </div>
              <div
                className="p-4 rounded-xl font-mono text-xs space-y-2 text-foreground"
                style={{
                  background: "rgba(229,31,209,0.05)",
                  border: "1px solid rgba(229,31,209,0.15)",
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#8A3FFC]/20 text-[#8A3FFC] text-[10px] font-bold flex items-center justify-center">
                    1
                  </span>
                  <span className="text-muted-foreground">
                    Prompt #1 [00:00 - 00:02]
                  </span>
                </div>
                <p
                  className="text-xs text-foreground/90 leading-relaxed p-2.5 rounded-lg"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  Hand-drawn 2D doodle cartoon illustration, minimalist stick
                  figure explainer style, flat solid colors, bold black marker
                  outlines, HomoDoodle stickman in slate grey tunic shivering on
                  #D6B27A background, dot eyes, label COLD EARTH with arrow, no
                  gradients, no shadows, no 3D --ar 16:9 --v 6.1
                </p>
              </div>
            </div>
          )}

          {activePipelineTab === 4 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Stage 4 • ZIP Production Bundle
                </span>
                <span className="text-xs font-mono font-bold text-[#FF7A32]">
                  Export Ready: 5 Files Packed
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
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
                    className="p-3 rounded-xl text-center transition-all hover:scale-[1.03]"
                    style={{
                      background: `${f.color}0d`,
                      border: `1px solid ${f.color}25`,
                    }}
                  >
                    <div
                      style={{ color: f.color }}
                      className="mx-auto mb-1 flex justify-center"
                    >
                      {f.icon}
                    </div>
                    <span className="text-xs font-bold block text-foreground">
                      {f.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {f.sub}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 sm:space-y-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 dark:bg-white/5 border border-[#E51FD1]/20 text-xs font-semibold shadow-sm shadow-[#E51FD1]/10">
          <span className="w-2 h-2 rounded-full bg-[#E51FD1] animate-pulse" />
          <span className="text-muted-foreground">
            Production-Grade AI Pipeline for Stickman Documentaries
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-foreground">
          Imagine. Generate. Create.
          <br />
          <span className="text-frameflow-gradient">
            From Idea to Video, All in One Flow.
          </span>
        </h1>

        <p className="max-w-3xl mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed">
          The automated 4-stage pipeline for YouTube stickman documentary
          creators. Explore virality-scored topics, craft 90-character paced
          narration, formulate batch Midjourney &amp; Flux prompts, and export a
          ready-to-edit production ZIP bundle in minutes.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2">
          <Link
            href={user ? "/dashboard" : "/register"}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-linear-to-r from-[#58E6F7] via-[#8A3FFC] to-[#E51FD1] hover:brightness-110 text-white font-extrabold text-sm shadow-xl shadow-[#8A3FFC]/30 hover:scale-[1.02] transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch Video Studio</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#pipeline"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white/5 dark:bg-white/5 hover:bg-white/10 dark:hover:bg-white/10 text-foreground font-semibold text-sm border border-white/10 dark:border-white/10 transition-colors cursor-pointer"
          >
            <Play className="w-4 h-4 text-[#8A3FFC]" />
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
