"use client";

import type { User } from "better-auth";
import { ArrowRight, Menu, Sparkles, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ThemeToggler from "@/components/theme/ThemeToggler";
import { NAV_LINKS } from "./landing.data";

interface NavProps {
  user: User | null | undefined;
}

export function LandingNav({ user }: NavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-2xl bg-background/80 border-b border-slate-200/80 dark:border-white/10 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2.5 sm:gap-3 group shrink-0"
        >
          <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-xl p-0.5 bg-frameflow-gradient shadow-lg shadow-purple-500/25 group-hover:scale-105 transition-transform shrink-0">
            <div className="w-full h-full rounded-[10px] bg-slate-950 overflow-hidden flex items-center justify-center p-0.5">
              <Image
                src="/logo.png"
                alt="FrameFlow Logo"
                width={40}
                height={40}
                className="rounded-lg object-contain"
                priority
              />
            </div>
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <span className="font-black text-lg sm:text-xl tracking-tight text-frameflow-gradient">
                FrameFlow
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-md bg-[#8A3FFC]/15 dark:bg-[#8A3FFC]/20 text-[#8A3FFC] dark:text-[#c084fc] border border-[#8A3FFC]/25">
                AI Studio
              </span>
            </div>
            <p className="text-[11px] font-medium text-muted-foreground hidden md:block">
              Imagine. Generate. Create.
            </p>
          </div>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-muted-foreground">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="hover:text-foreground transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Right cluster */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggler />

          {user ? (
            <Link
              href="/dashboard"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-linear-to-r from-[#58E6F7] via-[#8A3FFC] to-[#E51FD1] text-white font-bold text-xs shadow-lg shadow-[#8A3FFC]/25 hover:brightness-110 transition-all hover:scale-[1.02]"
            >
              <div className="w-5 h-5 rounded-full bg-slate-950/60 text-[#58E6F7] flex items-center justify-center text-[10px] font-black">
                {user.name?.[0]?.toUpperCase() || "U"}
              </div>
              <span>Open Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/login"
                className="px-3 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-linear-to-r from-[#58E6F7] via-[#8A3FFC] to-[#E51FD1] hover:brightness-110 text-white font-bold text-xs shadow-md shadow-[#8A3FFC]/25 transition-all hover:scale-[1.02]"
              >
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>Get Started</span>
              </Link>
            </div>
          )}

          {/* Mobile menu toggle button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            className="md:hidden p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200/80 dark:border-white/10 bg-background/95 backdrop-blur-2xl px-4 py-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-150 shadow-xl">
          <nav className="flex flex-col space-y-1">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-foreground/80 hover:text-foreground hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="pt-2 border-t border-slate-200/60 dark:border-white/10 flex flex-col gap-2">
            {!user && (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl text-sm font-semibold text-foreground hover:bg-slate-100 dark:hover:bg-white/5 border border-slate-200 dark:border-white/10 transition-colors"
              >
                Sign In to Account
              </Link>
            )}
            <Link
              href={user ? "/dashboard" : "/register"}
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-linear-to-r from-[#58E6F7] via-[#8A3FFC] to-[#E51FD1] text-white font-bold text-sm shadow-lg shadow-[#8A3FFC]/25"
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {user ? "Launch Studio Dashboard" : "Start Creating for Free"}
              </span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
