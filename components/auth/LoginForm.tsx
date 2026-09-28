"use client";

import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Wand2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { authClient } from "@/lib/auth-client";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function LoginFormInner() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const errorParam = searchParams.get("error");

  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(
    errorParam ? `Authentication error: ${errorParam}` : "",
  );

  const handleGoogleLogin = async () => {
    setErrorMsg("");
    setGoogleLoading(true);

    const timeout = setTimeout(() => {
      setGoogleLoading(false);
      setErrorMsg(
        "Sign-in request timed out. Please check your network and try again.",
      );
    }, 15000);

    try {
      const res = await authClient.signIn.social({
        provider: "google",
        callbackURL: callbackUrl,
      });

      if (res?.error) {
        clearTimeout(timeout);
        setGoogleLoading(false);
        setErrorMsg(
          res.error.message ||
            res.error.statusText ||
            "Google sign-in failed. Please try again.",
        );
      }
    } catch (err: unknown) {
      clearTimeout(timeout);
      setGoogleLoading(false);
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Google sign-in failed. Please try again.",
      );
    }
  };

  return (
    <div className="relative w-full max-w-md">
      {/* Ambient glow behind card */}
      <div className="absolute -inset-4 bg-linear-to-r from-[#58E6F7]/20 via-[#8A3FFC]/20 to-[#E51FD1]/20 rounded-[40px] blur-2xl pointer-events-none" />

      <div className="relative glass-panel rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xl shadow-[#8A3FFC]/10 p-6 sm:p-8 space-y-6 bg-white/95 dark:bg-slate-950/90 backdrop-blur-2xl">
        {/* ── Brand Header ── */}
        <div className="text-center space-y-3">
          <div className="relative w-16 h-16 rounded-2xl p-0.5 bg-frameflow-gradient mx-auto shadow-xl shadow-purple-500/30">
            <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center p-1.5">
              <Image
                src="/logo.png"
                alt="FrameFlow Logo"
                width={48}
                height={48}
                className="rounded-xl object-contain"
                priority
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Welcome to{" "}
              <span className="text-frameflow-gradient">FrameFlow</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
              Sign in with your Google account to access your studio and saved
              video projects.
            </p>
          </div>
        </div>

        {/* ── Error Alert ── */}
        {errorMsg && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 text-xs shadow-sm animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-semibold text-rose-800 dark:text-rose-200">
                Sign-in Error
              </p>
              <p className="leading-relaxed">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* ── Google OAuth Action ── */}
        <div className="space-y-3">
          <button
            type="button"
            id="btn-google-login"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="group relative w-full flex items-center justify-center gap-3.5 py-3.5 px-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-sm font-bold shadow-md hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer overflow-hidden"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-linear-to-r from-transparent via-purple-500/5 to-transparent transition-opacity duration-300 pointer-events-none" />
            {googleLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-[#8A3FFC] shrink-0" />
            ) : (
              <GoogleIcon />
            )}
            <span className="relative z-10">
              {googleLoading
                ? "Connecting to Google..."
                : "Continue with Google"}
            </span>
          </button>

          <p className="text-[11px] text-center text-slate-500 dark:text-slate-400">
            One click signs you in and grants instant{" "}
            <span className="font-semibold text-purple-600 dark:text-purple-400">
              Creator
            </span>{" "}
            studio access
          </p>
        </div>

        {/* ── Studio Highlights Pill Row ── */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 space-y-2">
          <div className="grid grid-cols-1 gap-2 text-[11px]">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800/60 text-slate-600 dark:text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Verified Creator role automatically assigned</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800/60 text-slate-600 dark:text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-[#58E6F7] shrink-0" />
              <span>Private and secure encrypted API key vault</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800/60 text-slate-600 dark:text-slate-300">
              <Wand2 className="w-3.5 h-3.5 text-[#E51FD1] shrink-0" />
              <span>Full 4-stage pipeline & multi-AI routing</span>
            </div>
          </div>
        </div>

        {/* ── Footer Link ── */}
        <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800/60 space-y-2">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Need a new account?{" "}
            <Link
              href="/register"
              className="font-bold text-[#8A3FFC] dark:text-[#58E6F7] hover:text-[#E51FD1] dark:hover:text-[#E51FD1] transition-colors"
            >
              Get started with Google
            </Link>
          </p>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-normal">
            By signing in, you agree to our Terms of Service & Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}

export function LoginForm() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-md p-8 rounded-3xl glass-panel flex items-center justify-center border border-slate-200 dark:border-slate-800">
          <Loader2 className="w-6 h-6 animate-spin text-[#8A3FFC]" />
        </div>
      }
    >
      <LoginFormInner />
    </Suspense>
  );
}

export default LoginForm;
