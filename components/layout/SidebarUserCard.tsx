"use client";

import type { User } from "better-auth";
import { LogIn, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

interface SidebarUserCardProps {
  user: User | null | undefined;
  onClose?: () => void;
}

export function SidebarUserCard({ user, onClose }: SidebarUserCardProps) {
  return (
    <div className="pt-2 border-t border-slate-200 dark:border-slate-900">
      {user ? (
        <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 truncate">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name || "User"}
                width={24}
                height={24}
                unoptimized
                className="w-6 h-6 rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-700"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-linear-to-br from-[#58E6F7] to-[#8A3FFC] flex items-center justify-center text-slate-950 font-black text-xs shrink-0">
                {user.name?.[0]?.toUpperCase() || "U"}
              </div>
            )}
            <div className="truncate">
              <div className="flex items-center gap-1.5 truncate">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate leading-tight">
                  {user.name}
                </p>
                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 shrink-0">
                  {(user as { role?: string }).role || "creator"}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate leading-tight">
                {user.email}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={async () => {
              await authClient.signOut();
              window.location.href = "/";
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Sign Out"
            aria-label="Sign out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <Link
          href="/login"
          onClick={onClose}
          className="flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <LogIn className="w-3.5 h-3.5 text-[#58E6F7]" />
          <span>Sign In / Register</span>
        </Link>
      )}
    </div>
  );
}
