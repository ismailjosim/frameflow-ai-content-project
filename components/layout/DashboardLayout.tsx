"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getProviderForModel, PROVIDER_GROUPS } from "@/lib/ai/models";
import { authClient } from "@/lib/auth-client";
import type { DashboardLayoutProps } from "./layout.types";
import { Sidebar } from "./Sidebar";
import { TopHeader } from "./TopHeader";

export function DashboardLayout({
  children,
  currentModel = "auto",
  onModelChange,
  activeProjectTitle,
  pageTitle,
}: DashboardLayoutProps) {
  const router = useRouter();
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [configuredProviders, setConfiguredProviders] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  // Client-side session guard for private dashboard
  useEffect(() => {
    if (!isSessionPending && !session?.user) {
      const currentPath =
        typeof window !== "undefined" ? window.location.pathname : "/dashboard";
      router.push(`/login?callbackUrl=${encodeURIComponent(currentPath)}`);
    }
  }, [session, isSessionPending, router]);

  useEffect(() => {
    let ignore = false;
    async function fetchActiveProviders() {
      try {
        const res = await fetch("/api/keys");
        const data = await res.json();
        if (
          !ignore &&
          data.success &&
          Array.isArray(data.configuredProviders)
        ) {
          setConfiguredProviders(data.configuredProviders);

          if (data.configuredProviders.length > 0) {
            const currentProvider = getProviderForModel(currentModel);
            const isCurrentConfigured =
              data.configuredProviders.includes(currentProvider);

            if (currentModel !== "auto" && !isCurrentConfigured) {
              const firstConfigured = PROVIDER_GROUPS.find((g) =>
                data.configuredProviders.includes(g.provider),
              );
              if (firstConfigured) {
                onModelChange?.(firstConfigured.defaultModel);
              }
            } else if (
              currentModel === "auto" &&
              data.configuredProviders.length === 1
            ) {
              const onlyProvider = data.configuredProviders[0];
              const group = PROVIDER_GROUPS.find(
                (g) => g.provider === onlyProvider,
              );
              if (group) {
                onModelChange?.(group.defaultModel);
              }
            }
          }
        }
      } catch {
        // ignore
      } finally {
        if (!ignore) {
          setIsAnalyzing(false);
        }
      }
    }
    fetchActiveProviders();
    return () => {
      ignore = true;
    };
  }, [currentModel, onModelChange]);

  const activeGroups = PROVIDER_GROUPS.filter((g) =>
    configuredProviders.includes(g.provider),
  );
  const availableModelsCount = activeGroups.reduce(
    (acc, g) => acc + g.models.length,
    0,
  );

  // Show loading state while checking session to ensure zero data leak
  if (isSessionPending) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center gap-3">
        <div className="relative w-12 h-12 rounded-2xl p-0.5 bg-frameflow-gradient animate-pulse shadow-lg shadow-purple-500/25">
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
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium animate-pulse">
          Verifying creator session...
        </p>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Redirecting to login...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex transition-colors duration-200">
      {/* Fixed Left Sidebar (Desktop) + Sliding Drawer (Mobile) */}
      <Sidebar
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        availableModelsCount={availableModelsCount}
        configuredProviders={configuredProviders}
        isAnalyzing={isAnalyzing}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 md:pl-64">
        <TopHeader
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          currentModel={currentModel}
          onModelChange={onModelChange}
          activeProjectTitle={activeProjectTitle}
          pageTitle={pageTitle}
          availableModelsCount={availableModelsCount}
          configuredProviders={configuredProviders}
          isAnalyzing={isAnalyzing}
        />

        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
