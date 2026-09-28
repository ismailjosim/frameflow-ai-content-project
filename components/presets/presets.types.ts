export interface Preset {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  userId?: string | null;
  userName?: string | null;
  userEmail?: string | null;
  userImage?: string | null;
  isDefault: boolean;
  visualStyleRules: string;
  aspectRatio: string;
  stage1Prompt: string;
  stage2Prompt: string;
  stage3Prompt: string;
  stage4Prompt: string;
  createdAt: string;
}

export interface CreatePresetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export interface PresetInspectorProps {
  preset: Preset | null;
  onDelete?: (id: string, name: string) => void;
  isDeleting?: boolean;
  onUpdate?: (updated: Preset) => void;
  onSetDefault?: (preset: Preset) => void;
  isSettingDefault?: boolean;
}
