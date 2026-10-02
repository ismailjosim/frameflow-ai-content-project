"use client";

interface AuthFormSkeletonProps {
  type?: "login" | "register";
}

export function AuthFormSkeleton({ type = "login" }: AuthFormSkeletonProps) {
  const isRegister = type === "register";

  return (
    <div className="relative w-full max-w-md animate-pulse">
      {/* Ambient glow behind card */}
      <div
        className={`absolute -inset-4 rounded-[40px] blur-2xl pointer-events-none ${
          isRegister
            ? "bg-linear-to-r from-[#E51FD1]/10 via-[#8A3FFC]/10 to-[#58E6F7]/10"
            : "bg-linear-to-r from-[#58E6F7]/10 via-[#8A3FFC]/10 to-[#E51FD1]/10"
        }`}
      />

      <div className="relative glass-panel rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xl p-6 sm:p-8 space-y-6 bg-white/95 dark:bg-slate-950/90 backdrop-blur-2xl">
        {/* Brand Header Skeleton */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-slate-200 dark:bg-slate-800 mx-auto" />
          <div className="space-y-2 flex flex-col items-center">
            <div className="h-6 w-48 rounded-lg bg-slate-200 dark:bg-slate-800" />
            <div className="h-3.5 w-64 rounded-md bg-slate-100 dark:bg-slate-800/60" />
            <div className="h-3.5 w-52 rounded-md bg-slate-100 dark:bg-slate-800/60" />
          </div>
        </div>

        {/* Google OAuth Action Button Skeleton */}
        <div className="space-y-3 pt-2">
          <div className="w-full h-12 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          <div className="h-3 w-40 rounded bg-slate-100 dark:bg-slate-800/60 mx-auto" />
        </div>

        {/* Feature bullets skeleton */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 space-y-2">
          <div className="h-9 w-full rounded-xl bg-slate-100 dark:bg-slate-900/60" />
          <div className="h-9 w-full rounded-xl bg-slate-100 dark:bg-slate-900/60" />
          <div className="h-9 w-full rounded-xl bg-slate-100 dark:bg-slate-900/60" />
        </div>

        {/* Footer Skeleton */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 flex flex-col items-center space-y-2">
          <div className="h-4 w-44 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-3 w-60 rounded bg-slate-100 dark:bg-slate-800/60" />
        </div>
      </div>
    </div>
  );
}

export default AuthFormSkeleton;
