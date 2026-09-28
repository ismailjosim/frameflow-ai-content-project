import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";
import ThemeToggler from "@/components/theme/ThemeToggler";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to FrameFlow AI Video Studio",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-background text-foreground transition-colors duration-200">
      {/* Subtle ambient blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#8A3FFC]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#58E6F7]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top nav row */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
        <Link
          href="/"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors backdrop-blur-sm shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
        <ThemeToggler />
      </div>

      {/* Form */}
      <div className="relative z-10 w-full flex justify-center py-14 sm:py-16">
        <LoginForm />
      </div>
    </div>
  );
}
