"use client";

import { Eye, EyeOff, Loader2, Lock, Mail, Sparkles, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
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
        {
          name,
          email,
          password,
        },
        {
          onRequest: () => setLoading(true),
          onSuccess: () => {
            setLoading(false);
            router.push("/");
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

  return (
    <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800 shadow-2xl space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="relative w-12 h-12 rounded-2xl p-0.5 bg-frameflow-gradient mx-auto shadow-lg shadow-purple-500/25">
          <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center p-1">
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

        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          Create <span className="text-frameflow-gradient">FrameFlow</span>{" "}
          Account
        </h1>
        <p className="text-xs text-slate-400">
          Start generating automated 2D stickman doodle videos with AI.
        </p>
      </div>

      {/* Error alert */}
      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs text-center animate-fade-in">
          {errorMsg}
        </div>
      )}

      {/* Sign Up Form */}
      <form onSubmit={handleRegister} className="space-y-4 text-xs">
        <div className="space-y-1.5">
          <label className="font-semibold text-slate-300 block">
            Your Name
          </label>
          <div className="relative flex items-center">
            <User className="w-4 h-4 text-slate-500 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex Creator"
              required
              className="w-full bg-slate-900/90 text-white placeholder-slate-500 pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-[#8A3FFC] transition-colors"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="font-semibold text-slate-300 block">
            Email Address
          </label>
          <div className="relative flex items-center">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 pointer-events-none" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="creator@frameflow.studio"
              required
              className="w-full bg-slate-900/90 text-white placeholder-slate-500 pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-[#8A3FFC] transition-colors"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="font-semibold text-slate-300 block">Password</label>
          <div className="relative flex items-center">
            <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 pointer-events-none" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              required
              className="w-full bg-slate-900/90 text-white placeholder-slate-500 pl-10 pr-10 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-[#8A3FFC] transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="font-semibold text-slate-300 block">
            Confirm Password
          </label>
          <div className="relative flex items-center">
            <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 pointer-events-none" />
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              required
              className="w-full bg-slate-900/90 text-white placeholder-slate-500 pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-[#8A3FFC] transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-linear-to-r from-[#58E6F7] via-[#8A3FFC] to-[#E51FD1] hover:brightness-110 text-white font-bold text-xs shadow-lg shadow-[#8A3FFC]/25 transition-all hover:scale-101 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Creating account...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Get Started</span>
            </>
          )}
        </button>
      </form>

      {/* Switch to Login */}
      <div className="text-center pt-2 border-t border-slate-800/80">
        <p className="text-xs text-slate-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-bold text-[#58E6F7] hover:text-[#E51FD1] transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterForm;
