"use client";

import type { User } from "better-auth";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import Link from "next/link";
import { FeatureTickers } from "./FeatureTickers";
import { PipelineMockup } from "./PipelineMockup";

interface HeroProps {
  user: User | null | undefined;
  activePipelineTab: number;
  onTabChange: (n: number) => void;
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
