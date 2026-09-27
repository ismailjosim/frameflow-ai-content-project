"use client";

import { useEffect, useState } from "react";
import { getProviderForModel, PROVIDER_GROUPS } from "@/lib/ai/models";
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
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [configuredProviders, setConfiguredProviders] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(true);

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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
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
