"use client";

import {
  Archive,
  ArrowRight,
  CheckCircle2,
  Cpu,
  FileCheck,
  Film,
  Layers,
  Lock,
  Palette,
  Play,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ThemeToggler from "@/components/theme/ThemeToggler";
import { authClient } from "@/lib/auth-client";

/* ─────────────────────────────────────────────────────────────────────────────
   Shared design tokens (applied inline so no Tailwind purge issues)
   • card:  subtle dark bg + very faint border
   • glow variants per stage color
───────────────────────────────────────────────────────────────────────────── */

export function LandingPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const [activePipelineTab, setActivePipelineTab] = useState<number>(1);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-[#E51FD1]/30 selection:text-[#58E6F7] transition-colors duration-200">
      {/* ─── Sticky Navigation ─── */}
      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-background/75 border-b border-white/5 dark:border-white/5 border-slate-900/10 transition-colors shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl p-0.5 bg-frameflow-gradient shadow-lg shadow-purple-500/25 group-hover:scale-105 transition-transform shrink-0">
              <div className="w-full h-full rounded-[10px] bg-slate-950 overflow-hidden flex items-center justify-center p-0.5">
                <Image
                  src="/apple-touch-icon.png"
                  alt="FrameFlow Logo"
                  width={40}
                  height={40}
                  className="rounded-lg object-contain"
                  priority
                />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xl tracking-tight text-frameflow-gradient">
                  FrameFlow
                </span>
                <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-md bg-[#8A3FFC]/15 dark:bg-[#8A3FFC]/20 text-[#8A3FFC] dark:text-[#c084fc] border border-[#8A3FFC]/25">
                  AI Studio
                </span>
              </div>
              <p className="text-[11px] font-medium text-muted-foreground hidden sm:block">
                Imagine. Generate. Create.
              </p>
            </div>
          </Link>

          {/* Center nav */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-muted-foreground">
            {[
              { href: "#pipeline", label: "4-Stage Pipeline" },
              { href: "#features", label: "Features" },
              { href: "#presets", label: "Style Presets" },
              { href: "#security", label: "Key Vault" },
              { href: "#faq", label: "FAQ" },
            ].map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="hover:text-foreground transition-colors hover:text-[#8A3FFC]"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Right cluster */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggler />
            {user ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-linear-to-r from-[#58E6F7] via-[#8A3FFC] to-[#E51FD1] text-white font-bold text-xs shadow-lg shadow-[#8A3FFC]/25 hover:brightness-110 transition-all hover:scale-[1.02]"
              >
                <div className="w-5 h-5 rounded-full bg-slate-950/60 text-[#58E6F7] flex items-center justify-center text-[10px] font-black">
                  {user.name?.[0]?.toUpperCase() || "U"}
                </div>
                <span>Open Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-white/5 dark:hover:bg-white/5 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-linear-to-r from-[#58E6F7] via-[#8A3FFC] to-[#E51FD1] hover:brightness-110 text-white font-bold text-xs shadow-md shadow-[#8A3FFC]/25 transition-all hover:scale-[1.02]"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Get Started</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ─── Hero Section ─── */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-16 sm:pb-24">
        {/* Ambient glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-linear-to-tr from-[#58E6F7]/15 via-[#8A3FFC]/15 to-[#E51FD1]/15 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-3/4 left-1/4 w-80 h-80 bg-[#FF1688]/8 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 sm:space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 dark:bg-white/5 bg-slate-100/80 border border-[#E51FD1]/20 text-xs font-semibold shadow-sm shadow-[#E51FD1]/10">
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
            narration, formulate batch Midjourney &amp; Flux prompts, and export
            a ready-to-edit production ZIP bundle in minutes.
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
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white/5 dark:bg-white/5 bg-slate-100/80 hover:bg-white/10 dark:hover:bg-white/10 text-foreground font-semibold text-sm border border-white/10 dark:border-white/10 border-slate-200/60 transition-colors cursor-pointer"
            >
              <Play className="w-4 h-4 text-[#8A3FFC]" />
              <span>Explore 4-Stage Workflow</span>
            </a>
          </div>

          {/* ─── Feature Ticker Cards ─── */}
          <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto text-left">
            {[
              {
                icon: <Zap className="w-3.5 h-3.5" />,
                color: "#58E6F7",
                glow: "rgba(88,230,247,0.12)",
                border: "rgba(88,230,247,0.2)",
                label: "Algorithmic Topic Scorer",
                desc: "5 retention angles analyzed with YouTube CTR virality formulas.",
              },
              {
                icon: <Film className="w-3.5 h-3.5" />,
                color: "#8A3FFC",
                glow: "rgba(138,63,252,0.12)",
                border: "rgba(138,63,252,0.2)",
                label: "<90-Char Narration",
                desc: "Paced sentences optimized for voiceover duration and retention.",
              },
              {
                icon: <Palette className="w-3.5 h-3.5" />,
                color: "#E51FD1",
                glow: "rgba(229,31,209,0.12)",
                border: "rgba(229,31,209,0.2)",
                label: "HomoDoodle Consistency",
                desc: "Flat solid colors, slate grey tunic, bold black marker lines.",
              },
              {
                icon: <Archive className="w-3.5 h-3.5" />,
                color: "#FF7A32",
                glow: "rgba(255,122,50,0.12)",
                border: "rgba(255,122,50,0.2)",
                label: "1-Click ZIP Packaging",
                desc: "Instant bundle containing scripts, prompt lists, and metadata.",
              },
            ].map((f) => (
              <div
                key={f.label}
                className="p-3.5 rounded-2xl backdrop-blur-sm transition-all hover:scale-[1.02]"
                style={{
                  background: f.glow,
                  border: `1px solid ${f.border}`,
                }}
              >
                <span
                  className="font-bold text-xs flex items-center gap-1.5 mb-1.5"
                  style={{ color: f.color }}
                >
                  {f.icon}
                  {f.label}
                </span>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Hero Interactive Pipeline Mockup ─── */}
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
                    onClick={() => setActivePipelineTab(s.num)}
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
                    <p>
                      [00:07] But one hunter reached for something unexpected.
                    </p>
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
                      Hand-drawn 2D doodle cartoon illustration, minimalist
                      stick figure explainer style, flat solid colors, bold
                      black marker outlines, HomoDoodle stickman in slate grey
                      tunic shivering on #D6B27A background, dot eyes, label
                      COLD EARTH with arrow, no gradients, no shadows, no 3D
                      --ar 16:9 --v 6.1
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
      </section>

      {/* ─── 4-Stage Deep Dive ─── */}
      <section
        id="pipeline"
        className="py-20"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#58E6F7]">
              The Core Engine
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Built Specifically for Stickman Documentaries
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              Every stage was tuned from real viral YouTube creators producing
              millions of monthly views in the stickman explainer niche.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                num: "1",
                title: "Stage 1: Algorithmic Topic Exploration",
                sub: "High CTR hooks & virality prioritization",
                body: 'Feed in a raw curiosity keyword (e.g. "teeth rotting in ice age"), and FrameFlow generates 5 distinct psychological hooks. Each is scored for virality, curiosity gap, and thumbnail explorability with a smart exclusion engine.',
                tags: [
                  "✓ Priority Ranking",
                  "✓ Thumbnail Rationale",
                  "✓ Duplicate Exclusion",
                ],
                accent: "#58E6F7",
                glow: "rgba(88,230,247,0.08)",
                border: "rgba(88,230,247,0.18)",
                hover: "rgba(88,230,247,0.14)",
              },
              {
                num: "2",
                title: "Stage 2: 90-Char Narration Scriptwriter",
                sub: "Paced for YouTube retention & zero fluff",
                body: "Produces conversational, high-tempo narration strictly formatted under 90 characters per sentence. Perfectly sized for human speech pacing (135 WPM), captions, and instant synchronization with ElevenLabs voice clones.",
                tags: [
                  "✓ Strict 90-Char Counter",
                  "✓ 135 WPM Audio Estimator",
                  "✓ Direct .txt Download",
                ],
                accent: "#8A3FFC",
                glow: "rgba(138,63,252,0.08)",
                border: "rgba(138,63,252,0.18)",
                hover: "rgba(138,63,252,0.14)",
              },
              {
                num: "3",
                title: "Stage 3: Auto-Chunking Batch Prompts",
                sub: "Midjourney & Flux prompt formulation",
                body: "Splits long scripts into automated batches of 20 scenes, preventing LLM memory dilution. Injects strict visual negative constraints (no gradients, no 3D, no photorealism) and exact hex backgrounds for scene-to-scene character consistency.",
                tags: [
                  "✓ 20-Scene Auto-Chunking",
                  "✓ 16:9 & 9:16 Ratio Support",
                  "✓ Copy All / Single Action",
                ],
                accent: "#E51FD1",
                glow: "rgba(229,31,209,0.08)",
                border: "rgba(229,31,209,0.18)",
                hover: "rgba(229,31,209,0.14)",
              },
              {
                num: "4",
                title: "Stage 4: Automated Packaging & ZIP Export",
                sub: "Production kit ready for Premiere, CapCut & YouTube",
                body: "Generates high-CTR video titles, a curiosity-driven video description, 15 targeted hashtags, and 35 SEO tags. With a single click, bundle everything into a compressed ZIP file organized with clean filenames.",
                tags: [
                  "✓ Viral Titles & SEO Tags",
                  "✓ Full .ZIP File Bundler",
                  "✓ Instant Copy Utilities",
                ],
                accent: "#FF7A32",
                glow: "rgba(255,122,50,0.08)",
                border: "rgba(255,122,50,0.18)",
                hover: "rgba(255,122,50,0.14)",
              },
            ].map((stage) => (
              <div
                key={stage.num}
                className="group p-6 rounded-3xl space-y-4 backdrop-blur-sm transition-all duration-200 hover:shadow-lg"
                style={{
                  background: stage.glow,
                  border: `1px solid ${stage.border}`,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background =
                    stage.hover;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background =
                    stage.glow;
                }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-9 h-9 rounded-xl font-black text-sm flex items-center justify-center shrink-0"
                    style={{
                      background: `${stage.accent}20`,
                      color: stage.accent,
                      border: `1px solid ${stage.accent}40`,
                    }}
                  >
                    {stage.num}
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-foreground leading-tight">
                      {stage.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">{stage.sub}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {stage.body}
                </p>
                <div className="pt-1 flex flex-wrap gap-2">
                  {stage.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-lg"
                      style={{
                        background: `${stage.accent}12`,
                        color: stage.accent,
                        border: `1px solid ${stage.accent}25`,
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Style Presets ─── */}
      <section
        id="presets"
        className="py-20"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E51FD1]">
              Creative Versatility
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Style Preset Studio
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              Maintain the strict 4-stage pipeline while easily swapping art
              styles, character rules, aspect ratios, or custom visual DNA.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                badge: "Default",
                badgeColor: "#8A3FFC",
                title: "HomoDoodle Classic",
                desc: "Hand-drawn 2D cartoon stickman in slate grey tunic, bold black marker outlines, flat solid colors, no 3D, no photorealism.",
                meta: "Aspect: 16:9 • Midjourney v6.1",
                accent: "#8A3FFC",
                glow: "rgba(138,63,252,0.08)",
                border: "rgba(138,63,252,0.2)",
              },
              {
                badge: "Style Preset",
                badgeColor: "#58E6F7",
                title: "Cyberpunk Stickman",
                desc: "Dark synthwave city backgrounds, neon cyan and magenta outlines, high-contrast futuristic stick figures with holographic HUDs.",
                meta: "Aspect: 16:9 • Flux Schnell",
                accent: "#58E6F7",
                glow: "rgba(88,230,247,0.06)",
                border: "rgba(88,230,247,0.18)",
              },
              {
                badge: "Style Preset",
                badgeColor: "#E51FD1",
                title: "Vintage Blackboard",
                desc: "Chalkboard texture, white and pastel chalk dust lines, educational math diagrams and historical classroom explainer aesthetic.",
                meta: "Aspect: 16:9 • Midjourney v6.1",
                accent: "#E51FD1",
                glow: "rgba(229,31,209,0.06)",
                border: "rgba(229,31,209,0.18)",
              },
              {
                badge: "Customizable",
                badgeColor: "#FF7A32",
                title: "Custom Style Uploader",
                desc: "Paste your custom prompt guidelines or upload markdown files. Full control to delete, rename, and manage your preset library.",
                meta: "Any Aspect Ratio • Any Model",
                accent: "#FF7A32",
                glow: "rgba(255,122,50,0.06)",
                border: "rgba(255,122,50,0.18)",
              },
            ].map((p) => (
              <div
                key={p.title}
                className="p-5 rounded-2xl space-y-3 transition-all hover:scale-[1.02] hover:shadow-lg"
                style={{
                  background: p.glow,
                  border: `1px solid ${p.border}`,
                }}
              >
                <span
                  className="text-[11px] font-bold px-2.5 py-1 rounded-full inline-block"
                  style={{
                    background: `${p.badgeColor}18`,
                    color: p.badgeColor,
                    border: `1px solid ${p.badgeColor}30`,
                  }}
                >
                  {p.badge}
                </span>
                <h4 className="text-sm font-bold text-foreground">{p.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {p.desc}
                </p>
                <span
                  className="font-mono text-[10px] block"
                  style={{ color: p.accent }}
                >
                  {p.meta}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Security / BYOK ─── */}
      <section
        id="security"
        className="py-20"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#58E6F7]">
              Zero Vendor Lock-in
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Encrypted BYOK Key Vault
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              Bring your own API keys. We don&apos;t charge markup on tokens,
              and your keys never leak to the client browser.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: <Lock className="w-5 h-5" />,
                accent: "#8A3FFC",
                title: "AES-256-GCM Encryption",
                desc: "Credentials are encrypted with authenticated AES-256-GCM at rest in MongoDB. Keys are masked in all client responses (••••••••).",
              },
              {
                icon: <Cpu className="w-5 h-5" />,
                accent: "#E51FD1",
                title: "Zero Leak Memory Lifecycle",
                desc: "Keys are decrypted solely in server memory for the exact duration of prompt generation, then immediately garbage collected.",
              },
              {
                icon: <ShieldCheck className="w-5 h-5" />,
                accent: "#58E6F7",
                title: "Multi-Model Auto Fallback",
                desc: "Supports Google Gemini 2.5 Flash, Anthropic Claude 3.7 Sonnet, and OpenAI GPT-4o. If one hits rate limits, auto-fallback kicks in.",
              },
            ].map((s) => (
              <div
                key={s.title}
                className="p-6 rounded-2xl space-y-3 transition-all hover:scale-[1.01]"
                style={{
                  background: `${s.accent}08`,
                  border: `1px solid ${s.accent}20`,
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: `${s.accent}15`,
                    color: s.accent,
                    border: `1px solid ${s.accent}30`,
                  }}
                >
                  {s.icon}
                </div>
                <h3 className="text-base font-bold text-foreground">
                  {s.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Manual vs FrameFlow ─── */}
      <section
        className="py-20"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8A3FFC]">
              Productivity Revolution
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Manual Production vs. FrameFlow
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Manual way */}
            <div
              className="p-6 sm:p-8 rounded-3xl space-y-4"
              style={{
                background: "rgba(244,63,94,0.06)",
                border: "1px solid rgba(244,63,94,0.2)",
              }}
            >
              <h3 className="text-lg font-bold text-rose-500 dark:text-rose-400">
                The Disconnected Way (4–6 Hours)
              </h3>
              <ul className="space-y-3 text-xs text-muted-foreground">
                {[
                  "Guessing topic virality on Reddit without data-driven CTR scoring.",
                  "Rewriting narration manually to trim sentences under 90 characters for TTS.",
                  "Copying and pasting 50 Midjourney prompts one by one into Discord.",
                  "Inconsistent character faces and random 3D styles ruining stickman aesthetics.",
                  "Manual folder management and zipping up assets across multiple hard drives.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold shrink-0 mt-0.5">
                      ✕
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* FrameFlow way */}
            <div
              className="p-6 sm:p-8 rounded-3xl space-y-4 shadow-xl shadow-[#8A3FFC]/10"
              style={{
                background: "rgba(138,63,252,0.07)",
                border: "1px solid rgba(138,63,252,0.25)",
              }}
            >
              <h3 className="text-lg font-bold text-frameflow-gradient">
                The FrameFlow Way (Under 3 Minutes)
              </h3>
              <ul className="space-y-3 text-xs text-foreground">
                {[
                  "Algorithmic topic ranking with virality score, conflict, and thumbnail concepts.",
                  "Strict <90-character narration scriptwriter with voiceover pacing estimation.",
                  "Batch auto-chunking (20 prompts/run) formulated for Midjourney & Flux.",
                  "Guaranteed HomoDoodle character consistency with negative constraints.",
                  "1-Click ZIP production bundle with scripts, prompts, SEO, and packaging.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section
        id="faq"
        className="py-20"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8A3FFC]">
              Got Questions?
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "What is the 90-character rule in Stage 2?",
                a: "In high-retention 2D stickman documentaries, fast-paced voiceover requires narration sentences kept strictly under 90 characters. This ensures each scene changes every 2 to 3 seconds, keeping viewer attention locked.",
              },
              {
                q: "How does the 1-Click ZIP export work?",
                a: 'When you click "Export Full Video Bundle (.zip)" in Stage 4, client-side JSZip packages your clean narration script, scene-by-scene prompt list, viral titles, description, hashtags, and JSON project metadata into a single zip file ready for your video editor.',
              },
              {
                q: "Is my API key safe?",
                a: "Yes. Keys are encrypted using military-grade AES-256-GCM with a unique initialization vector per key. The unencrypted key is never sent to the client browser and is decrypted solely in server memory during API calls.",
              },
              {
                q: "Can I customize or delete style presets?",
                a: "Absolutely. The Preset Studio allows you to create custom visual styles, change camera angles, tweak negative prompts, or delete custom presets whenever you wish.",
              },
            ].map((faq, i) => (
              <div
                key={faq.q}
                className="p-5 rounded-2xl space-y-2 transition-all hover:shadow-sm"
                style={{
                  background:
                    i % 2 === 0
                      ? "rgba(138,63,252,0.05)"
                      : "rgba(88,230,247,0.04)",
                  border:
                    i % 2 === 0
                      ? "1px solid rgba(138,63,252,0.15)"
                      : "1px solid rgba(88,230,247,0.12)",
                }}
              >
                <h4 className="text-sm font-bold text-foreground">{faq.q}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section
        className="py-20"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl p-8 sm:p-14 overflow-hidden bg-frameflow-gradient text-center space-y-6 shadow-2xl shadow-[#8A3FFC]/30">
            <div className="relative z-10 max-w-2xl mx-auto space-y-4">
              <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
                Ready to Create Your Next Viral Stickman Video?
              </h2>
              <p className="text-sm sm:text-base font-semibold text-slate-900/90 leading-relaxed">
                Join creators streamlining their storytelling workflow. From
                concept to ZIP package in 4 simple stages.
              </p>
              <div className="pt-2">
                <Link
                  href={user ? "/dashboard" : "/register"}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-slate-950 text-white hover:bg-slate-900 font-extrabold text-sm shadow-xl hover:scale-[1.03] transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#58E6F7]" />
                  <span>Launch FrameFlow Studio</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer
        className="py-12 bg-background transition-colors"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg p-[1.5px] bg-frameflow-gradient shrink-0">
              <div className="w-full h-full rounded-md bg-slate-950 flex items-center justify-center p-0.5">
                <Image
                  src="/apple-touch-icon.png"
                  alt="FrameFlow Logo"
                  width={24}
                  height={24}
                  className="rounded-xs object-contain"
                />
              </div>
            </div>
            <div>
              <p className="font-bold text-foreground">FrameFlow Studio</p>
              <p className="text-[11px] text-muted-foreground">
                Imagine. Generate. Create.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 font-medium">
            {[
              { href: "#pipeline", label: "Pipeline" },
              { href: "#features", label: "Features" },
              { href: "#presets", label: "Presets" },
              { href: "#security", label: "Security" },
            ].map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="hover:text-foreground transition-colors"
              >
                {l.label}
              </a>
            ))}
            <Link
              href="/dashboard"
              className="text-[#8A3FFC] dark:text-[#58E6F7] hover:underline font-bold"
            >
              Studio Dashboard
            </Link>
          </div>

          <div className="text-center md:text-right">
            <p className="font-semibold text-frameflow-gradient">
              From Idea to Video, All in One Flow.
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              © {new Date().getFullYear()} FrameFlow Studio. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
