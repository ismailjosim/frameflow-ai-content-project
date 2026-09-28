import { Cpu, Lock, ShieldCheck } from "lucide-react";
import { SECTION_DIVIDER, SECURITY_FEATURES } from "./landing.data";

const ICONS = {
  lock: Lock,
  cpu: Cpu,
  shield: ShieldCheck,
} as const;

export function LandingSecurity() {
  return (
    <section id="security" className="py-20" style={SECTION_DIVIDER}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#58E6F7]">
            Zero Vendor Lock-in
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Encrypted BYOK Key Vault
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Bring your own API keys. We don&apos;t charge markup on tokens, and
            your keys never leak to the client browser.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {SECURITY_FEATURES.map((s) => {
            const Icon = ICONS[s.icon];
            return (
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
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-foreground">
                  {s.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {s.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default LandingSecurity;
