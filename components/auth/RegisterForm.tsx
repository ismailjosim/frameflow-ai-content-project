"use client";

import { Eye, EyeOff, Loader2, Lock, Mail, Sparkles, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { authClient } from "@/lib/auth-client";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" aria-hidden="true">
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

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      await authClient.signUp.email(
        { name, email, password },
        {
          onRequest: () => setLoading(true),
          onSuccess: () => {
            setLoading(false);
            router.push(callbackUrl);
            router.refresh();
          },
          onError: (ctx) => {
            setLoading(false);
            setErrorMsg(
              ctx.error?.message ||
                "Failed to create account. Please check your information.",
            );
          },
        },
      );
    } catch {
      setLoading(false);
      setErrorMsg("An unexpected error occurred. Please try again.");
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg("");
    setGoogleLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: callbackUrl,
      });
    } catch {
      setGoogleLoading(false);
      setErrorMsg("Google sign-in failed. Please try again.");
    }
  };

  const isDisabled = loading || googleLoading;

  return (
    <div className="relative w-full max-w-md">
      {/* Ambient glow behind the card */}
      <div className="absolute -inset-4 bg-linear-to-r from-[#58E6F7]/15 via-[#8A3FFC]/15 to-[#E51FD1]/15 rounded-[40px] blur-2xl pointer-events-none" />

      <div className="relative glass-panel rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xl shadow-[#8A3FFC]/10 p-6 sm:p-8 space-y-5 bg-white/95 dark:bg-slate-950/90 backdrop-blur-2xl">
        {/* ── Brand Header ── */}
        <div className="text-center space-y-3">
          <div className="relative w-14 h-14 rounded-2xl p-0.5 bg-frameflow-gradient mx-auto shadow-xl shadow-purple-500/30">
            <div className="w-full h-full rounded-[13px] bg-slate-950 flex items-center justify-center p-1">
              <Image
                src="/apple-touch-icon.png"
                alt="FrameFlow Logo"
                width={44}
                height={44}
                className="rounded-xl object-contain"
                priority
              />
            </div>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Create <span className="text-frameflow-gradient">FrameFlow</span>{" "}
              Account
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Start generating automated 2D stickman doodle videos with AI.
            </p>
          </div>
        </div>

        {/* ── Error Alert ── */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/50 text-rose-600 dark:text-rose-300 text-xs text-center font-medium">
            {errorMsg}
          </div>
        )}

        {/* ── Google OAuth Button ── */}
        <button
          type="button"
          id="btn-google-register"
          onClick={handleGoogleLogin}
          disabled={isDisabled}
          className="group relative w-full flex items-center justify-center gap-3 py-3 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50/80 dark:hover:bg-slate-800/80 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer overflow-hidden"
        >
          {/* Shimmer on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-linear-to-r from-transparent via-white/5 to-transparent transition-opacity duration-300 pointer-events-none" />
          {googleLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-[#8A3FFC] shrink-0" />
          ) : (
            <GoogleIcon />
          )}
          <span className="relative z-10">
            {googleLoading
              ? "Redirecting to Google..."
              : "Continue with Google"}
          </span>
        </button>

        {/* ── Divider ── */}
        <div className="relative flex items-center gap-3">
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium whitespace-nowrap">
            or create account with email
          </span>
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
        </div>

        {/* ── Registration Form ── */}
        <form onSubmit={handleRegister} className="space-y-3.5 text-xs">
          {/* Name */}
          <div className="space-y-1.5">
            <label
              htmlFor="register-name"
              className="font-semibold text-slate-700 dark:text-slate-300 block"
            >
              Your Name
            </label>
            <div className="relative flex items-center">
              <User className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 pointer-events-none shrink-0" />
              <input
                id="register-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Creator"
                required
                autoComplete="name"
                className="w-full bg-slate-50 dark:bg-slate-900/60 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-[#8A3FFC]/30 focus:border-[#8A3FFC] transition-all"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label
              htmlFor="register-email"
              className="font-semibold text-slate-700 dark:text-slate-300 block"
            >
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 pointer-events-none shrink-0" />
              <input
                id="register-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="creator@frameflow.studio"
                required
                autoComplete="email"
                className="w-full bg-slate-50 dark:bg-slate-900/60 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-[#8A3FFC]/30 focus:border-[#8A3FFC] transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label
              htmlFor="register-password"
              className="font-semibold text-slate-700 dark:text-slate-300 block"
            >
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 pointer-events-none shrink-0" />
              <input
                id="register-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
                autoComplete="new-password"
                className="w-full bg-slate-50 dark:bg-slate-900/60 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-[#8A3FFC]/30 focus:border-[#8A3FFC] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300 transition-colors cursor-pointer p-0.5"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label
              htmlFor="register-confirm"
              className="font-semibold text-slate-700 dark:text-slate-300 block"
            >
              Confirm Password
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 pointer-events-none shrink-0" />
              <input
                id="register-confirm"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                required
                autoComplete="new-password"
                className="w-full bg-slate-50 dark:bg-slate-900/60 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-[#8A3FFC]/30 focus:border-[#8A3FFC] transition-all"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            id="btn-email-register"
            type="submit"
            disabled={isDisabled}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-linear-to-r from-[#58E6F7] via-[#8A3FFC] to-[#E51FD1] hover:brightness-110 text-white font-bold text-xs shadow-lg shadow-[#8A3FFC]/25 transition-all hover:scale-[1.01] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-1"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating account...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Get Started Free</span>
              </>
            )}
          </button>
        </form>

        {/* ── Footer Link ── */}
        <div className="text-center pt-1 border-t border-slate-100 dark:border-slate-800/60">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-[#8A3FFC] dark:text-[#58E6F7] hover:text-[#E51FD1] dark:hover:text-[#E51FD1] transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export function RegisterForm() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-md p-8 rounded-3xl glass-panel flex items-center justify-center border border-slate-200 dark:border-slate-800">
          <Loader2 className="w-6 h-6 animate-spin text-[#8A3FFC]" />
        </div>
      }
    >
      <RegisterFormInner />
    </Suspense>
  );
}

export default RegisterForm;
