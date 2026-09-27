import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import RegisterForm from "@/components/auth/RegisterForm";
import ThemeToggler from "@/components/theme/ThemeToggler";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create a FrameFlow creator account",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-background text-foreground">
      {/* Top action row */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 max-w-5xl mx-auto">
        <Link
          href="/"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Studio</span>
        </Link>
        <ThemeToggler />
      </div>

      <div className="relative z-10 w-full flex justify-center py-12">
        <RegisterForm />
      </div>
    </div>
  );
}
