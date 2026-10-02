"use client";

import type { User } from "better-auth";
import { LogIn, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface UserNavMenuProps {
  user: User | null | undefined;
  isPending: boolean;
  onLogout: () => void;
}

export function UserNavMenu({ user, isPending, onLogout }: UserNavMenuProps) {
  if (isPending) {
    return (
      <div className="hidden md:flex items-center gap-1.5 animate-pulse">
        <div className="h-8 w-28 rounded-xl bg-slate-200 dark:bg-slate-800" />
      </div>
    );
  }

  if (user) {
    return (
      <div className="hidden md:flex items-center gap-1.5 sm:gap-2">
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name || "User"}
              width={20}
              height={20}
              unoptimized
              className="w-5 h-5 rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-700"
            />
          ) : (
            <div className="w-5 h-5 rounded-full bg-linear-to-br from-[#58E6F7] to-[#8A3FFC] flex items-center justify-center text-slate-950 font-black text-[10px] shrink-0">
              {user.name?.[0]?.toUpperCase() || "U"}
            </div>
          )}
          <span className="font-semibold text-slate-800 dark:text-slate-200 hidden md:inline truncate max-w-24">
            {user.name}
          </span>
          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 shrink-0 hidden lg:inline">
            {(user as { role?: string }).role || "creator"}
          </span>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
          title="Sign Out"
          aria-label="Sign out"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/login"
      className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
    >
      <LogIn className="w-3.5 h-3.5 text-[#58E6F7]" />
      <span className="hidden sm:inline">Sign In</span>
    </Link>
  );
}
