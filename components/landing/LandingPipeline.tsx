import { PIPELINE_STAGES, SECTION_DIVIDER } from "./landing.data";

export function LandingPipeline() {
  return (
    <section id="pipeline" className="py-20" style={SECTION_DIVIDER}>
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
          {PIPELINE_STAGES.map((stage) => (
            <div
              key={stage.num}
              className="group p-6 rounded-3xl space-y-4 backdrop-blur-sm transition-all duration-200 hover:shadow-lg hover:scale-[1.01] bg-white/80 dark:bg-slate-900/60"
              style={{
                border: `1px solid ${stage.border}`,
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
  );
}

export default LandingPipeline;
