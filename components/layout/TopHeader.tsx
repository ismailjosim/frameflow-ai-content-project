"use client";

import { Cpu, Menu, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AUTO_MODEL, PROVIDER_GROUPS } from "@/lib/ai/models";
import type { TopHeaderProps } from "./layout.types";

export function TopHeader({
  onOpenMobileSidebar,
  currentModel = "auto",
  onModelChange,
  activeProjectTitle,
  pageTitle,
  availableModelsCount,
  configuredProviders,
}: TopHeaderProps) {
  const activeGroups = PROVIDER_GROUPS.filter((g) =>
    configuredProviders.includes(g.provider),
  );
  const inactiveGroups = PROVIDER_GROUPS.filter(
    (g) => !configuredProviders.includes(g.provider),
  );

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4">
      {/* Left: Mobile Toggle, Brand Icon & Context Info */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition-colors shrink-0"
          aria-label="Open navigation sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link
          href="/"
          className="md:hidden flex items-center shrink-0"
          aria-label="FrameFlow Home"
        >
          <div className="w-7 h-7 rounded-lg p-[1.5px] bg-frameflow-gradient shrink-0 shadow-xs">
            <div className="w-full h-full rounded-[5px] bg-slate-950 flex items-center justify-center p-0.5">
              <Image
                src="/favicon-32x32.png"
                alt="FrameFlow Logo"
                width={20}
                height={20}
                className="object-contain"
              />
            </div>
          </div>
        </Link>

        <div className="min-w-0">
          {activeProjectTitle ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-[11px] font-medium text-slate-400 hidden md:inline">
                Active Project:
              </span>
              <span className="text-xs font-semibold text-white bg-linear-to-r from-[#8A3FFC]/20 via-[#E51FD1]/15 to-[#FF4E63]/15 px-2.5 sm:px-3 py-1 rounded-lg border border-[#E51FD1]/40 shadow-xs truncate max-w-28 xs:max-w-[160px] sm:max-w-xs md:max-w-md">
                {activeProjectTitle}
              </span>
            </div>
          ) : (
            <h1 className="text-xs sm:text-base font-bold text-white tracking-tight truncate">
              {pageTitle || "Dashboard"}
            </h1>
          )}
        </div>
      </div>

      {/* Right: Model Selector & Actions with Proper Spacing */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        {/* Model Availability Badge */}
        {availableModelsCount > 0 ? (
          <div
            title={`Active: ${availableModelsCount} models across ${configuredProviders.map((p) => p.toUpperCase()).join(", ")}`}
            className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-xs font-semibold shadow-xs"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span>
              {availableModelsCount} Model
              {availableModelsCount > 1 ? "s" : ""} Available
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-900/80 text-emerald-300 font-medium">
              {configuredProviders.map((p) => p.toUpperCase()).join(", ")}
            </span>
          </div>
        ) : (
          <Link
            href="/settings"
            className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-950/80 text-amber-300 border border-amber-800/60 text-xs font-medium hover:bg-amber-900/80 transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>0 Models Ready • Add Key</span>
          </Link>
        )}

        {/* Model Selector Dropdown with ample breathing space */}
        <div className="relative flex items-center">
          <div className="flex items-center gap-1.5 sm:gap-2.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs shadow-inner hover:border-slate-700 transition-colors">
            <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-pulse shrink-0" />
            <select
              aria-label="Select AI Model"
              value={currentModel}
              onChange={(e) => onModelChange?.(e.target.value)}
              className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer pr-1 w-28 xs:w-36 sm:w-48 md:w-60 truncate font-medium"
            >
              <option
                value={AUTO_MODEL.id}
                className="bg-slate-900 text-cyan-300 font-semibold"
              >
                ⚡{" "}
                {availableModelsCount > 0
                  ? `Auto Model (${availableModelsCount} Ready • ${configuredProviders.map((p) => p.toUpperCase()).join(", ")})`
                  : AUTO_MODEL.name}
              </option>

              {/* Active Configured Providers */}
              {activeGroups.map((group) => (
                <optgroup
                  key={group.provider}
                  label={`🟢 ${group.name} (${group.models.length} Models Available)`}
                  className="bg-slate-950 text-emerald-400 font-bold"
                >
                  {group.models.map((m) => (
                    <option
                      key={m.id}
                      value={m.id}
                      className="bg-slate-900 text-slate-100 font-medium"
                    >
                      ✓ {m.name} {m.badge ? `[${m.badge}]` : ""}
                    </option>
                  ))}
                </optgroup>
              ))}

              {/* Inactive / Locked Providers */}
              {inactiveGroups.map((group) => (
                <optgroup
                  key={group.provider}
                  label={`🔒 ${group.name} (${group.models.length} Locked — Key Required)`}
                  className="bg-slate-950 text-slate-500 font-normal italic"
                >
                  {group.models.map((m) => (
                    <option
                      key={m.id}
                      value={m.id}
                      disabled={true}
                      className="bg-slate-950 text-slate-500 font-normal"
                    >
                      🔒 {m.name} (Key Required in Settings)
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        </div>

        {/* API Vault Shortcut Button */}
        <Link
          href="/settings"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-linear-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all hover:scale-102 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Key Vault</span>
        </Link>
      </div>
    </header>
  );
}
