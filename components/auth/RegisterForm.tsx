"use client";

import { AlertCircle, Cpu, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { AuthFormSkeleton } from "./AuthFormSkeleton";

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

function RegisterFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const errorParam = searchParams.get("error");

  const { data: session, isPending: isSessionPending } =
    authClient.useSession();

  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(
    errorParam ? `Registration error: ${errorParam}` : "",
  );

  useEffect(() => {
    if (session?.user) {
      router.replace(callbackUrl);
    }
  }, [session, callbackUrl, router]);

  if (isSessionPending) {
    return <AuthFormSkeleton type="register" />;
  }

  if (session?.user) {
    return (
      <div className="relative w-full max-w-md">
        <div className="glass-panel rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-8 space-y-4 text-center bg-white/95 dark:bg-slate-950/90 backdrop-blur-2xl">
          <Loader2 className="w-6 h-6 animate-spin text-[#8A3FFC] mx-auto" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Authenticated. Redirecting to Studio...
          </p>
        </div>
      </div>
    );
  }

  const handleGoogleLogin = async () => {
    setErrorMsg("");
    setGoogleLoading(true);

    const timeout = setTimeout(() => {
      setGoogleLoading(false);
      setErrorMsg(
        "Registration request timed out. Please check your network and try again.",
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
            "Google sign-up failed. Please try again.",
        );
      }
    } catch (err: unknown) {
      clearTimeout(timeout);
      setGoogleLoading(false);
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Google sign-up failed. Please try again.",
      );
    }
  };

  return (
    <div className="relative w-full max-w-md">
      {/* Ambient glow behind card */}
      <div className="absolute -inset-4 bg-linear-to-r from-[#E51FD1]/20 via-[#8A3FFC]/20 to-[#58E6F7]/20 rounded-[40px] blur-2xl pointer-events-none" />

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
              Join <span className="text-frameflow-gradient">FrameFlow</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
              Create viral stickman animations with an automated, AI-powered
              4-stage pipeline.
            </p>
          </div>
        </div>

        {/* ── Error Alert ── */}
        {errorMsg && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 text-xs shadow-sm animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-semibold text-rose-800 dark:text-rose-200">
                Registration Error
              </p>
              <p className="leading-relaxed">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* ── Google OAuth Action ── */}
        <div className="space-y-3">
          <button
            type="button"
            id="btn-google-register"
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
                : "Create Account with Google"}
            </span>
          </button>

          <p className="text-[11px] text-center text-slate-500 dark:text-slate-400">
            Sign up with Google to automatically activate your verified{" "}
            <span className="font-semibold text-purple-600 dark:text-purple-400">
              Creator
            </span>{" "}
            profile
          </p>
        </div>

        {/* ── Included Creator Privileges ── */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 space-y-2.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 text-center">
            What&apos;s Included In Creator Studio
          </p>
          <div className="grid grid-cols-1 gap-2 text-[11px]">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800/60 text-slate-600 dark:text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-[#8A3FFC] shrink-0" />
              <span>Full Creator access with infinite project workspace</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800/60 text-slate-600 dark:text-slate-300">
              <Cpu className="w-3.5 h-3.5 text-[#58E6F7] shrink-0" />
              <span>Multi-AI model routing (OpenAI, Claude, Gemini, Grok)</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800/60 text-slate-600 dark:text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Zero-leak client side encrypted API key security</span>
            </div>
          </div>
        </div>

        {/* ── Footer Link ── */}
        <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800/60 space-y-2">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-[#8A3FFC] dark:text-[#58E6F7] hover:text-[#E51FD1] dark:hover:text-[#E51FD1] transition-colors"
            >
              Sign in with Google
            </Link>
          </p>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-normal">
            By creating an account, you agree to our Terms of Service & Privacy
            Policy.
          </p>
        </div>
      </div>
    </div>
  );
}

export function RegisterForm() {
  return (
    <Suspense fallback={<AuthFormSkeleton type="register" />}>
      <RegisterFormInner />
    </Suspense>
  );
}

export default RegisterForm;
