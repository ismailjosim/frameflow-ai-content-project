"use client";

import { KeyRound, Loader2, ShieldCheck } from "lucide-react";
import Link from "next/link";

interface EngineStatusWidgetProps {
  availableModelsCount: number;
  configuredProviders: string[];
  isAnalyzing?: boolean;
  onClose?: () => void;
}

export function EngineStatusWidget({
  availableModelsCount,
  configuredProviders,
  isAnalyzing,
  onClose,
}: EngineStatusWidgetProps) {
  return (
    <>
      <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800/80 space-y-2 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#58E6F7]" />
            Engine Status
          </span>
          {isAnalyzing ? (
            <span className="flex items-center gap-1 text-[10px] text-slate-400">
              <Loader2 className="w-3 h-3 animate-spin text-[#58E6F7]" />
              Checking
            </span>
          ) : availableModelsCount > 0 ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-[#58E6F7]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-[#58E6F7] shadow-xs animate-pulse" />
              Online
            </span>
          ) : (
            <span className="text-[10px] font-semibold text-amber-500">
              Key Missing
            </span>
          )}
        </div>

        {availableModelsCount > 0 ? (
          <div>
            <p className="text-[11px] font-medium text-slate-700 dark:text-slate-200">
              {availableModelsCount} Models Ready
            </p>
            <div className="flex flex-wrap gap-1 mt-1.5">
              {configuredProviders.map((provider) => (
                <span
                  key={provider}
                  className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-linear-to-r from-[#8A3FFC]/20 to-[#E51FD1]/20 text-purple-700 dark:text-pink-200 border border-[#E51FD1]/30"
                >
                  {provider}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <Link
            href="/settings"
            onClick={onClose}
            className="text-[11px] text-amber-600 dark:text-amber-300 hover:underline block"
          >
            Configure API Keys →
          </Link>
        )}
      </div>

      {/* API Key Vault Shortcut */}
      <Link
        href="/settings"
        onClick={onClose}
        className="flex items-center justify-between px-3 py-2 rounded-xl bg-linear-to-r from-[#8A3FFC]/15 via-[#E51FD1]/10 to-[#FF1688]/10 hover:brightness-110 border border-[#E51FD1]/25 text-xs font-semibold text-slate-800 dark:text-slate-100 transition-all hover:scale-[1.01] shadow-xs group"
      >
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-linear-to-r from-[#8A3FFC] to-[#E51FD1] flex items-center justify-center text-white shrink-0">
            <KeyRound className="w-3 h-3" />
          </div>
          <span>API Key Vault</span>
        </div>
        <span className="text-[10px] text-[#8A3FFC] dark:text-[#58E6F7] font-bold group-hover:translate-x-0.5 transition-transform">
          Configure →
        </span>
      </Link>
    </>
  );
}
