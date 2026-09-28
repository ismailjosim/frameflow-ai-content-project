import { SECTION_DIVIDER, STYLE_PRESETS } from "./landing.data";

export function LandingPresets() {
  return (
    <section id="presets" className="py-20" style={SECTION_DIVIDER}>
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
          {STYLE_PRESETS.map((p) => (
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
  );
}

export default LandingPresets;
