"use client";

import {
  Check,
  ChevronDown,
  Cpu,
  Key,
  Lock,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AUTO_MODEL, PROVIDER_GROUPS } from "@/lib/ai/models";

interface ModelSelectorDropdownProps {
  currentModel: string;
  availableModelsCount: number;
  configuredProviders: string[];
  onModelChange?: (model: string) => void;
}

export function ModelSelectorDropdown({
  currentModel,
  availableModelsCount,
  configuredProviders,
  onModelChange,
}: ModelSelectorDropdownProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedModelInfo =
    currentModel === AUTO_MODEL.id
      ? AUTO_MODEL
      : PROVIDER_GROUPS.flatMap((g) => g.models).find(
          (m) => m.id === currentModel,
        );

  const activeGroups = PROVIDER_GROUPS.filter((g) =>
    configuredProviders.includes(g.provider),
  );
  const inactiveGroups = PROVIDER_GROUPS.filter(
    (g) => !configuredProviders.includes(g.provider),
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isDropdownOpen]);

  return (
    <div ref={dropdownRef} className="relative flex items-center">
      <button
        type="button"
        onClick={() => setIsDropdownOpen((prev) => !prev)}
        aria-expanded={isDropdownOpen}
        aria-label="Select AI Model"
        className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-slate-100 dark:bg-slate-900/90 hover:bg-slate-200/80 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs shadow-inner hover:border-[#8A3FFC]/50 transition-all cursor-pointer group"
      >
        <Cpu className="w-3.5 h-3.5 text-[#58E6F7] group-hover:rotate-12 transition-transform shrink-0" />
        <span className="font-semibold text-slate-800 dark:text-slate-200 max-w-25 xs:max-w-[140px] sm:max-w-45 md:max-w-52.5 truncate text-left">
          {currentModel === AUTO_MODEL.id
            ? availableModelsCount > 0
              ? `Auto Model (${availableModelsCount})`
              : AUTO_MODEL.name
            : selectedModelInfo?.name || currentModel}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-transform duration-200 shrink-0 ${
            isDropdownOpen ? "rotate-180 text-[#8A3FFC]" : ""
          }`}
        />
      </button>

      {/* Popover Menu */}
      {isDropdownOpen && (
        <div
          className="fixed sm:absolute left-2.5 right-2.5 sm:left-auto sm:right-0 top-16 sm:top-full mt-1.5 sm:mt-2 z-50 sm:w-96 max-h-[75vh] overflow-y-auto rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl shadow-2xl shadow-purple-500/10 dark:shadow-black/70 p-2 sm:p-2.5 space-y-2.5 text-xs animate-in fade-in zoom-in-95 duration-150"
          role="menu"
          aria-orientation="vertical"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-2 pt-1 pb-1.5 border-b border-slate-100 dark:border-slate-800/60">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
              <Sparkles className="w-3.5 h-3.5 text-[#8A3FFC]" />
              <span>AI Engine Selection</span>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-linear-to-r from-[#8A3FFC]/15 to-[#E51FD1]/15 text-[#8A3FFC] dark:text-[#58E6F7] border border-[#8A3FFC]/30">
              {availableModelsCount} Ready
            </span>
          </div>

          {/* Auto Model Option */}
          <button
            type="button"
            onClick={() => {
              onModelChange?.(AUTO_MODEL.id);
              setIsDropdownOpen(false);
            }}
            className={`w-full flex items-center justify-between gap-2 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
              currentModel === AUTO_MODEL.id
                ? "bg-linear-to-r from-purple-500/15 via-pink-500/10 to-transparent border-[#8A3FFC]/50 shadow-xs ring-1 ring-[#8A3FFC]/30"
                : "bg-slate-50/60 dark:bg-slate-900/40 border-slate-200/70 dark:border-slate-800/70 hover:bg-slate-100 dark:hover:bg-slate-800/60"
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-linear-to-br from-[#8A3FFC] to-[#E51FD1] flex items-center justify-center text-white shrink-0 shadow-xs">
                <Zap className="w-4 h-4 fill-white" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-900 dark:text-white truncate">
                    Auto Model
                  </span>
                  <span className="text-[9px] font-semibold uppercase px-1.5 py-0.2 rounded bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 shrink-0">
                    Smart
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  {availableModelsCount > 0
                    ? `Auto failover across ${configuredProviders.map((p) => p.toUpperCase()).join(", ")}`
                    : "Smart failover chain"}
                </p>
              </div>
            </div>
            {currentModel === AUTO_MODEL.id && (
              <Check className="w-4 h-4 text-[#8A3FFC] dark:text-[#58E6F7] shrink-0" />
            )}
          </button>

          {/* Active Configured Providers */}
          {activeGroups.map((group) => (
            <div key={group.provider} className="space-y-1">
              <div className="flex items-center justify-between px-2 pt-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {group.name}
                </span>
                <span className="text-[9px] font-medium text-slate-400 dark:text-slate-500">
                  {group.models.length} models
                </span>
              </div>

              <div className="space-y-0.5">
                {group.models.map((m) => {
                  const isSelected = currentModel === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        onModelChange?.(m.id);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl text-left transition-all cursor-pointer ${
                        isSelected
                          ? "bg-purple-50 dark:bg-purple-950/40 text-[#8A3FFC] dark:text-[#58E6F7] font-semibold border border-purple-200 dark:border-purple-900/60"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="truncate">{m.name}</span>
                        {m.badge && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-700/80 shrink-0 font-medium">
                            {m.badge}
                          </span>
                        )}
                      </div>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-[#8A3FFC] dark:text-[#58E6F7] shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Inactive Providers */}
          {inactiveGroups.length > 0 && (
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5">
              <div className="flex items-center justify-between px-2">
                <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  <Lock className="w-3 h-3" />
                  Locked Providers
                </span>
                <Link
                  href="/settings"
                  onClick={() => setIsDropdownOpen(false)}
                  className="text-[10px] font-semibold text-[#8A3FFC] dark:text-[#58E6F7] hover:underline flex items-center gap-0.5"
                >
                  <Key className="w-2.5 h-2.5" />
                  Add Keys
                </Link>
              </div>

              <div className="space-y-1">
                {inactiveGroups.map((group) => (
                  <div
                    key={group.provider}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200/40 dark:border-slate-800/40 flex items-center justify-between text-slate-400 dark:text-slate-500"
                  >
                    <span className="truncate">{group.name}</span>
                    <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-400">
                      {group.models.length} models
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
