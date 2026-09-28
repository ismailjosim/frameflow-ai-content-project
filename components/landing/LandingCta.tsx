import type { User } from "better-auth";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { SECTION_DIVIDER } from "./landing.data";

interface CtaProps {
  user: User | null | undefined;
}

export function LandingCta({ user }: CtaProps) {
  const ctaHref = user ? "/dashboard" : "/register";

  return (
    <section className="py-20" style={SECTION_DIVIDER}>
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
                href={ctaHref}
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
  );
}

export default LandingCta;
