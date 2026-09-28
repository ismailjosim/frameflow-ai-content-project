"use client";

import { Film, FolderKanban, Globe, KeyRound, Palette, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { EngineStatusWidget } from "./EngineStatusWidget";
import type { SidebarProps } from "./layout.types";
import { SidebarUserCard } from "./SidebarUserCard";

const NAV_ITEMS = [
  {
    href: "/dashboard",
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
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white/95 dark:bg-slate-950/95 border-r border-slate-200 dark:border-slate-800/80 backdrop-blur-2xl transition-colors duration-200">
      {/* Brand Header with Official Logo */}
      <div className="p-5 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center gap-3 group"
        >
          <div className="relative w-10 h-10 rounded-xl overflow-hidden group-hover:scale-105 transition-transform duration-200 shrink-0">
            <div className="w-full h-full rounded-lg border-2 border-[#E51FD1]/10 p-1 overflow-hidden flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="FrameFlow Logo"
                width={28}
                height={28}
                className="rounded-lg object-contain"
                priority
              />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-frameflow-gradient">
                FrameFlow
              </span>
              <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-linear-to-r from-purple-950/80 to-pink-950/80 text-pink-300 border border-pink-500/30">
                Studio
              </span>
            </div>
            <p className="text-[11px] font-medium tracking-wide text-slate-500 dark:text-slate-400 leading-tight">
              Imagine. Generate. Create.
            </p>
          </div>
        </Link>

        {/* Mobile close button */}
        <button
          type="button"
          onClick={onClose}
          className="md:hidden p-2 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 block mb-2">
            Workspace
          </span>
          <nav className="space-y-1.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard" || pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs transition-all duration-150 group ${
                    isActive
                      ? "bg-linear-to-r from-[#8A3FFC]/15 via-[#E51FD1]/10 to-transparent text-slate-900 dark:text-white font-semibold border-l-2 border-[#E51FD1] shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900/70 font-medium"
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-lg transition-colors ${
                      isActive
                        ? "bg-linear-to-br from-[#58E6F7]/20 to-[#8A3FFC]/30 text-[#8A3FFC] dark:text-[#58E6F7] border border-[#58E6F7]/30"
                        : "bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 group-hover:bg-slate-200 dark:group-hover:bg-slate-800"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block leading-tight">{item.label}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal block">
                      {item.description}
                    </span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Quick Link to Landing Page */}
        <div className="pt-2">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900/60 transition-colors"
          >
            <Globe className="w-4 h-4 text-[#58E6F7]" />
            <span>Product Landing Page</span>
          </Link>
        </div>
      </div>

      {/* Bottom Model Status & User Account Widget */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800/80 space-y-3 bg-slate-50/60 dark:bg-slate-950/40">
        <EngineStatusWidget
          availableModelsCount={availableModelsCount}
          configuredProviders={configuredProviders}
          isAnalyzing={isAnalyzing}
          onClose={onClose}
        />

        <SidebarUserCard user={user} onClose={onClose} />

        <div className="pt-0.5 pb-1 text-center">
          <p className="text-[11px] font-bold text-frameflow-gradient tracking-wide">
            From Idea to Video, All in One Flow.
          </p>
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 px-1 border-t border-slate-200 dark:border-slate-900 pt-2">
          <span>FrameFlow AI v2.4</span>
          <span>Zero-Leak Security</span>
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

export default Sidebar;
