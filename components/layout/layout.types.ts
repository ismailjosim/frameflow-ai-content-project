import type { ReactNode } from "react";

export interface DashboardLayoutProps {
  children: ReactNode;
  currentModel?: string;
  onModelChange?: (model: string) => void;
  activeProjectTitle?: string;
  pageTitle?: string;
}

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  availableModelsCount: number;
  configuredProviders: string[];
  isAnalyzing: boolean;
}

export interface TopHeaderProps {
  onOpenMobileSidebar: () => void;
  currentModel?: string;
  onModelChange?: (model: string) => void;
  activeProjectTitle?: string;
  pageTitle?: string;
  availableModelsCount: number;
  configuredProviders: string[];
  isAnalyzing: boolean;
}
