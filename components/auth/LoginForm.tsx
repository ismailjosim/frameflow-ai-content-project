"use client";

import { Eye, EyeOff, Loader2, Lock, Mail, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      await authClient.signIn.email(
        { email, password },
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
              ctx.error?.message || "Invalid credentials. Please try again.",
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
          Welcome to <span className="text-frameflow-gradient">FrameFlow</span>
        </h1>
        <p className="text-xs text-slate-400">
          Sign in to access your video pipeline and saved documentaries.
        </p>
      </div>

      {/* Error alert */}
      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs text-center animate-fade-in">
          {errorMsg}
        </div>
      )}

      {/* Sign In Form */}
      <form onSubmit={handleLogin} className="space-y-4 text-xs">
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
              placeholder="••••••••••••"
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

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-linear-to-r from-[#58E6F7] via-[#8A3FFC] to-[#E51FD1] hover:brightness-110 text-white font-bold text-xs shadow-lg shadow-[#8A3FFC]/25 transition-all hover:scale-101 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Sign In to Studio</span>
            </>
          )}
        </button>
      </form>

      {/* Switch to Register */}
      <div className="text-center pt-2 border-t border-slate-800/80">
        <p className="text-xs text-slate-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-bold text-[#58E6F7] hover:text-[#E51FD1] transition-colors"
          >
            Create Creator Account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;
