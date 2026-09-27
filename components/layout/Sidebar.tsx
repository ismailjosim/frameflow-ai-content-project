"use client";

import {
  Film,
  FolderKanban,
  KeyRound,
  Loader2,
  Palette,
  ShieldCheck,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SidebarProps } from "./layout.types";

const NAV_ITEMS = [
  {
    href: "/",
    label: "Studio Pipeline",
    description: "4-Stage Video Creation",
    icon: Film,
  },
  {
    href: "/projects",
    label: "Project Library",
    description: "Saved Documentaries",
    icon: FolderKanban,
  },
  {
    href: "/presets",
    label: "Style Presets",
    description: "Visual Styles & Prompts",
    icon: Palette,
  },
  {
    href: "/settings",
    label: "Key Vault",
    description: "Encrypted API Keys",
    icon: KeyRound,
  },
];

export function Sidebar({
  isOpen,
  onClose,
  availableModelsCount,
  configuredProviders,
  isAnalyzing,
}: SidebarProps) {
  const pathname = usePathname();

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-950/95 border-r border-slate-800/80 backdrop-blur-2xl">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-cyan-500 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-200">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg text-white tracking-tight">
                FrameFlow
              </span>
              <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/50">
                Studio
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              AI Video Production
            </p>
          </div>
        </Link>

        {/* Mobile close button */}
        <button
          type="button"
          onClick={onClose}
          className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 block mb-2">
            Workspace
          </span>
          <nav className="space-y-1.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs transition-all duration-150 group ${
                    isActive
                      ? "bg-linear-to-r from-cyan-500/15 via-indigo-500/10 to-transparent text-cyan-300 font-semibold border-l-2 border-cyan-400 shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/70 font-medium"
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-lg transition-colors ${
                      isActive
                        ? "bg-cyan-500/20 text-cyan-300"
                        : "bg-slate-900 text-slate-400 group-hover:text-slate-200 group-hover:bg-slate-800"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block leading-tight">{item.label}</span>
                    <span className="text-[10px] text-slate-500 font-normal block">
                      {item.description}
                    </span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Model Status Widget */}
      <div className="p-4 border-t border-slate-800/80 space-y-3 bg-slate-950/40">
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              Engine Status
            </span>
            {isAnalyzing ? (
              <span className="flex items-center gap-1 text-[10px] text-slate-400">
                <Loader2 className="w-3 h-3 animate-spin text-cyan-400" />
                Checking
              </span>
            ) : availableModelsCount > 0 ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Online
              </span>
            ) : (
              <span className="text-[10px] font-semibold text-amber-400">
                Key Missing
              </span>
            )}
          </div>

          {availableModelsCount > 0 ? (
            <div>
              <p className="text-[11px] font-medium text-slate-200">
                {availableModelsCount} Models Ready
              </p>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {configuredProviders.map((provider) => (
                  <span
                    key={provider}
                    className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/50"
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
              className="text-[11px] text-amber-300 hover:text-amber-200 underline block"
            >
              Configure Gemini / API Keys →
            </Link>
          )}
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-500 px-1">
          <span>HomoDoodle AI v2.4</span>
          <span>Zero-Leak AES-256</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col fixed inset-y-0 z-40">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Mobile Drawer Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
