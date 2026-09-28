"use client";

import type { User } from "better-auth";
import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ThemeToggler from "@/components/theme/ThemeToggler";
import { NAV_LINKS } from "./landing.data";

interface NavProps {
  user: User | null | undefined;
}

export function LandingNav({ user }: NavProps) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-2xl bg-background/80 border-b border-slate-200/80 dark:border-white/10 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl p-0.5 bg-frameflow-gradient shadow-lg shadow-purple-500/25 group-hover:scale-105 transition-transform shrink-0">
            <div className="w-full h-full rounded-[10px] bg-slate-950 overflow-hidden flex items-center justify-center p-0.5">
              <Image
                src="/apple-touch-icon.png"
                alt="FrameFlow Logo"
                width={40}
                height={40}
                className="rounded-lg object-contain"
                priority
              />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-xl tracking-tight text-frameflow-gradient">
                FrameFlow
              </span>
              <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-md bg-[#8A3FFC]/15 dark:bg-[#8A3FFC]/20 text-[#8A3FFC] dark:text-[#c084fc] border border-[#8A3FFC]/25">
                AI Studio
              </span>
            </div>
            <p className="text-[11px] font-medium text-muted-foreground hidden sm:block">
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
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-linear-to-r from-[#58E6F7] via-[#8A3FFC] to-[#E51FD1] text-white font-bold text-xs shadow-lg shadow-[#8A3FFC]/25 hover:brightness-110 transition-all hover:scale-[1.02]"
            >
              <div className="w-5 h-5 rounded-full bg-slate-950/60 text-[#58E6F7] flex items-center justify-center text-[10px] font-black">
                {user.name?.[0]?.toUpperCase() || "U"}
              </div>
              <span>Open Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-linear-to-r from-[#58E6F7] via-[#8A3FFC] to-[#E51FD1] hover:brightness-110 text-white font-bold text-xs shadow-md shadow-[#8A3FFC]/25 transition-all hover:scale-[1.02]"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Get Started</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
