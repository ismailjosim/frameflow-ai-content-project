import type { ParsedPackaging } from "@/types";

export type { ParsedPackaging };

export interface Stage4PackagingProps {
  projectId: string;
  topicTitle: string;
  scriptSummary?: string;
  selectedModel: string;
  packagingText: string;
  parsedPackaging?: ParsedPackaging;
  onPackagingChange: (text: string, parsed: Record<string, string>) => void;
  scriptText: string;
  promptsText: string;
  timestampInput?: string;
  autoStart?: boolean;
}

export interface PackagingCardsProps {
  topicTitle: string;
  parsedPackaging: ParsedPackaging;
  copiedField: string | null;
  onCopyText: (text: string, fieldName: string) => void;
}

export interface PackagingActionsProps {
  loading: boolean;
  isZipping?: boolean;
  packagingText: string;
  onDownloadPackaging: () => void;
  onDownloadAllAssets: () => void;
}
