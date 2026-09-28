"use client";

import { Archive, Film, Palette, Zap } from "lucide-react";
import { FEATURE_TICKERS } from "./landing.data";

const ICONS = {
  zap: Zap,
  film: Film,
  palette: Palette,
  archive: Archive,
} as const;

export function FeatureTickers() {
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

export default FeatureTickers;
