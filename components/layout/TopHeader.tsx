"use client";

import { Menu, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ThemeToggler from "@/components/theme/ThemeToggler";
import { authClient } from "@/lib/auth-client";
import type { TopHeaderProps } from "./layout.types";
import { ModelSelectorDropdown } from "./ModelSelectorDropdown";
import { UserNavMenu } from "./UserNavMenu";

export function TopHeader({
  onOpenMobileSidebar,
  currentModel = "auto",
  onModelChange,
  activeProjectTitle,
  pageTitle,
  availableModelsCount,
  configuredProviders,
}: TopHeaderProps) {
  const router = useRouter();
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();
  const user = session?.user;

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          router.refresh();
        },
      },
    });
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/80 px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4 transition-colors duration-200">
      {/* Left: Mobile Toggle, Brand Icon & Context Info */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="md:hidden p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-colors shrink-0"
          aria-label="Open navigation sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link
          href="/dashboard"
          className="md:hidden flex items-center shrink-0"
          aria-label="FrameFlow Dashboard"
        >
          <div className="w-7 h-7 rounded-lg p-[1.5px] bg-frameflow-gradient shrink-0 shadow-xs">
            <div className="w-full h-full rounded-[5px] bg-slate-950 flex items-center justify-center p-0.5">
              <Image
                src="/logo.png"
                alt="FrameFlow Logo"
                width={22}
                height={22}
                className="object-contain rounded-xs"
              />
            </div>
          </div>
        </Link>

        <div className="min-w-0">
          {activeProjectTitle ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 hidden md:inline">
                Active Project:
              </span>
              <span className="text-xs font-semibold text-slate-900 dark:text-white bg-linear-to-r from-[#8A3FFC]/15 via-[#E51FD1]/10 to-[#FF4E63]/10 px-2.5 sm:px-3 py-1 rounded-lg border border-[#E51FD1]/30 shadow-xs truncate max-w-28 xs:max-w-[160px] sm:max-w-xs md:max-w-md">
                {activeProjectTitle}
              </span>
            </div>
          ) : (
            <h1 className="text-xs sm:text-base font-bold text-slate-900 dark:text-white tracking-tight truncate">
              {pageTitle || "Dashboard"}
            </h1>
          )}
        </div>
      </div>

      {/* Right: Model Selector & Actions */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        {/* Model Availability Badge */}
        {availableModelsCount > 0 ? (
          <div
            title={`Active: ${availableModelsCount} models across ${configuredProviders.map((p) => p.toUpperCase()).join(", ")}`}
            className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-linear-to-r from-[#8A3FFC]/15 via-[#E51FD1]/10 to-transparent text-purple-700 dark:text-pink-200 border border-[#E51FD1]/30 text-xs font-semibold shadow-xs"
          >
            <span className="w-2 h-2 rounded-full bg-[#E51FD1] animate-pulse shrink-0" />
            <span>
              {availableModelsCount} Model
              {availableModelsCount > 1 ? "s" : ""} Available
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-pink-200 border border-purple-300 dark:border-purple-800/60 font-medium">
              {configuredProviders.map((p) => p.toUpperCase()).join(", ")}
            </span>
          </div>
        ) : (
          <Link
            href="/settings"
            className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 text-xs font-medium hover:bg-amber-100 dark:hover:bg-amber-900/80 transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>0 Models Ready • Add Key</span>
          </Link>
        )}

        {/* Custom AI Model Selector Dropdown Popover */}
        <ModelSelectorDropdown
          currentModel={currentModel}
          availableModelsCount={availableModelsCount}
          configuredProviders={configuredProviders}
          onModelChange={onModelChange}
        />

        {/* Light & Dark Theme Toggler */}
        <ThemeToggler />

        {/* API Vault Shortcut Button */}
        <Link
          href="/settings"
          className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-linear-to-r from-[#8A3FFC] via-[#E51FD1] to-[#FF1688] hover:brightness-110 text-white text-xs font-bold shadow-md shadow-[#8A3FFC]/25 transition-all hover:scale-102 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Key Vault</span>
        </Link>

        {/* User Account / Auth Nav Menu */}
        <UserNavMenu
          user={user}
          isPending={isSessionPending}
          onLogout={handleLogout}
        />
      </div>
    </header>
  );
}

export default TopHeader;
