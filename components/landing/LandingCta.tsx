import type { User } from "better-auth";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import Link from "next/link";
import { SECTION_DIVIDER } from "./landing.data";

interface CtaProps {
  user: User | null | undefined;
  isPending?: boolean;
}

export function LandingCta({ user, isPending }: CtaProps) {
  const ctaHref = user ? "/dashboard" : "/register";

  return (
    <section
      className="py-14 sm:py-20 relative overflow-hidden"
      style={SECTION_DIVIDER}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative group">
          {/* Ambient layered backdrop glow */}
          <div className="absolute -inset-1 rounded-3xl sm:rounded-[2.5rem] bg-linear-to-r from-[#58E6F7]/25 via-[#8A3FFC]/30 to-[#FF7A32]/25 blur-xl sm:blur-2xl opacity-60 dark:opacity-40 group-hover:opacity-80 transition-opacity pointer-events-none" />

          {/* Gradient-bordered glass container */}
          <div className="relative rounded-3xl sm:rounded-4xl p-px bg-linear-to-r from-[#58E6F7]/40 via-[#8A3FFC]/50 to-[#FF7A32]/40 shadow-2xl shadow-purple-500/10 dark:shadow-purple-950/40">
            <div className="relative rounded-[23px] sm:rounded-[31px] px-4 py-9 sm:px-10 sm:py-14 md:px-14 md:py-16 overflow-hidden bg-white/95 dark:bg-slate-950/90 backdrop-blur-2xl border border-slate-200/60 dark:border-white/10 text-center space-y-5 sm:space-y-6">
              {/* Internal decorative radial lighting */}
              <div className="absolute -top-24 -left-24 w-60 sm:w-80 h-60 sm:h-80 rounded-full bg-[#58E6F7]/15 dark:bg-[#58E6F7]/10 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-60 sm:w-80 h-60 sm:h-80 rounded-full bg-[#E51FD1]/15 dark:bg-[#8A3FFC]/15 blur-3xl pointer-events-none" />

              <div className="relative z-10 max-w-2xl mx-auto space-y-4 sm:space-y-5">
                {/* Pill Tag */}
                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold bg-[#8A3FFC]/10 text-[#8A3FFC] dark:text-[#58E6F7] border border-[#8A3FFC]/20 shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-[#8A3FFC] dark:text-[#58E6F7] shrink-0" />
                  <span>AI-Powered Stickman Pipeline</span>
                </div>

                {/* Heading with high contrast & brand gradient highlight */}
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.18] sm:leading-[1.15]">
                  Ready to Create Your Next{" "}
                  <span className="text-frameflow-gradient block sm:inline">
                    Viral Stickman Video?
                  </span>
                </h2>

                {/* Subtitle */}
                <p className="text-xs sm:text-base font-medium text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl mx-auto px-2">
                  Join creators streamlining their storytelling workflow. From
                  concept to ZIP package in 4 simple stages.
                </p>

                {/* Action button */}
                <div className="pt-2 flex justify-center w-full">
                  {isPending ? (
                    <div className="w-full sm:w-64 h-14 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
                  ) : (
                    <Link
                      href={ctaHref}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-linear-to-r from-[#58E6F7] via-[#8A3FFC] to-[#E51FD1] hover:brightness-110 active:scale-[0.98] text-white font-extrabold text-sm sm:text-base shadow-xl shadow-[#8A3FFC]/25 hover:shadow-[#8A3FFC]/40 hover:scale-[1.02] transition-all cursor-pointer group/btn"
                    >
                      <Sparkles className="w-4 h-4 text-white shrink-0" />
                      <span>Launch FrameFlow Studio</span>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform shrink-0" />
                    </Link>
                  )}
                </div>

                {/* Micro trust indicators */}
                <div className="pt-2 sm:pt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <span className="inline-flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    No Complex Setup
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    4-Stage Guided Pipeline
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    Instant ZIP Export
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LandingCta;
