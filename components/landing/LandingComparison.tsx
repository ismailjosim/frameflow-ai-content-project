import { CheckCircle2 } from "lucide-react";
import {
  COMPARISON_FRAMEFLOW,
  COMPARISON_MANUAL,
  SECTION_DIVIDER,
} from "./landing.data";

export function LandingComparison() {
  return (
    <section className="py-20" style={SECTION_DIVIDER}>
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
          <div className="p-6 sm:p-8 rounded-3xl space-y-4 bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-500/20 shadow-xs">
            <h3 className="text-lg font-bold text-rose-600 dark:text-rose-400">
              The Disconnected Way (4–6 Hours)
            </h3>
            <ul className="space-y-3 text-xs text-muted-foreground">
              {COMPARISON_MANUAL.map((item) => (
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
          <div className="p-6 sm:p-8 rounded-3xl space-y-4 shadow-xl shadow-[#8A3FFC]/10 bg-purple-50/70 dark:bg-[#8A3FFC]/10 border border-purple-200 dark:border-[#8A3FFC]/30">
            <h3 className="text-lg font-bold text-frameflow-gradient">
              The FrameFlow Way (Under 3 Minutes)
            </h3>
            <ul className="space-y-3 text-xs text-foreground">
              {COMPARISON_FRAMEFLOW.map((item) => (
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
  );
}

export default LandingComparison;
