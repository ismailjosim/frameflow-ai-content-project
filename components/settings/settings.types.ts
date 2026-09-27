import type { AIModel, ProviderGroup } from "@/lib/ai/models";

export type { AIModel, ProviderGroup };

export interface StoredKey {
  provider: string;
  maskedKey: string;
  preferredModel?: string;
  isActive: boolean;
  statusMessage?: string;
  updatedAt?: string;
}

export interface ProviderKeyCardProps {
  providerGroup: ProviderGroup;
  storedKey?: StoredKey;
  inputKey: string;
  preferredModel: string;
  isSaving: boolean;
  onKeyChange: (val: string) => void;
  onModelChange: (val: string) => void;
  onSave: () => void;
  onDelete: () => void;
}
