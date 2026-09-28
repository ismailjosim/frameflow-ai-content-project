"use client";

import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { sound } from "@/lib/sound";
import { PresetEditForm } from "./PresetEditForm";
import { PresetInspectorHeader } from "./PresetInspectorHeader";
import { PresetViewMode } from "./PresetViewMode";
import type { Preset, PresetInspectorProps } from "./presets.types";

export function PresetInspector({
  preset,
  onDelete,
  isDeleting,
  onUpdate,
  onSetDefault,
  isSettingDefault,
}: PresetInspectorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showAdvancedPrompts, setShowAdvancedPrompts] = useState(false);

  // Form states initialized directly from preset
  const [name, setName] = useState(preset?.name || "");
  const [description, setDescription] = useState(preset?.description || "");
  const [aspectRatio, setAspectRatio] = useState(
    preset?.aspectRatio || "--ar 16:9 --v 6.1",
  );
  const [visualStyleRules, setVisualStyleRules] = useState(
    preset?.visualStyleRules || "",
  );
  const [stage1Prompt, setStage1Prompt] = useState(preset?.stage1Prompt || "");
  const [stage2Prompt, setStage2Prompt] = useState(preset?.stage2Prompt || "");
  const [stage3Prompt, setStage3Prompt] = useState(preset?.stage3Prompt || "");
  const [stage4Prompt, setStage4Prompt] = useState(preset?.stage4Prompt || "");

  // Sync state during render when preset prop changes (React recommended pattern)
  const [prevPreset, setPrevPreset] = useState(preset);
  if (preset !== prevPreset) {
    setPrevPreset(preset);
    setName(preset?.name || "");
    setDescription(preset?.description || "");
    setAspectRatio(preset?.aspectRatio || "--ar 16:9 --v 6.1");
    setVisualStyleRules(preset?.visualStyleRules || "");
    setStage1Prompt(preset?.stage1Prompt || "");
    setStage2Prompt(preset?.stage2Prompt || "");
    setStage3Prompt(preset?.stage3Prompt || "");
    setStage4Prompt(preset?.stage4Prompt || "");
    setIsEditing(false);
    setErrorMsg(null);
    setShowAdvancedPrompts(false);
  }

  if (!preset) {
    return (
      <div className="md:col-span-2 glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 text-center py-16 text-slate-400 dark:text-slate-500 text-xs bg-white/80 dark:bg-slate-900/60">
        Select a preset to view or edit its style configuration.
      </div>
    );
  }

  const handleCancel = () => {
    sound.playNotification();
    setName(preset.name || "");
    setDescription(preset.description || "");
    setAspectRatio(preset.aspectRatio || "--ar 16:9 --v 6.1");
    setVisualStyleRules(preset.visualStyleRules || "");
    setStage1Prompt(preset.stage1Prompt || "");
    setStage2Prompt(preset.stage2Prompt || "");
    setStage3Prompt(preset.stage3Prompt || "");
    setStage4Prompt(preset.stage4Prompt || "");
    setIsEditing(false);
    setErrorMsg(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !visualStyleRules.trim()) {
      const msg = "Preset name and visual style rules cannot be empty.";
      setErrorMsg(msg);
      toast.error(msg);
      return;
    }

    setSaving(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`/api/presets/${preset._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          aspectRatio: aspectRatio.trim(),
          visualStyleRules: visualStyleRules.trim(),
          stage1Prompt: stage1Prompt.trim() || undefined,
          stage2Prompt: stage2Prompt.trim() || undefined,
          stage3Prompt: stage3Prompt.trim() || undefined,
          stage4Prompt: stage4Prompt.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to update preset");
      }

      setIsEditing(false);
      if (onUpdate && data.preset) {
        onUpdate(data.preset as Preset);
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Error saving preset changes";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="md:col-span-2 glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-5 bg-white/80 dark:bg-slate-900/60 transition-colors">
      <PresetInspectorHeader
        preset={preset}
        isEditing={isEditing}
        saving={saving}
        isDeleting={isDeleting}
        isSettingDefault={isSettingDefault}
        onSetDefault={onSetDefault}
        onDelete={onDelete}
        onStartEdit={() => setIsEditing(true)}
        onCancelEdit={handleCancel}
        onSave={handleSave}
      />

      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/50 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      {isEditing ? (
        <PresetEditForm
          name={name}
          setName={setName}
          description={description}
          setDescription={setDescription}
          aspectRatio={aspectRatio}
          setAspectRatio={setAspectRatio}
          visualStyleRules={visualStyleRules}
          setVisualStyleRules={setVisualStyleRules}
          stage1Prompt={stage1Prompt}
          setStage1Prompt={setStage1Prompt}
          stage2Prompt={stage2Prompt}
          setStage2Prompt={setStage2Prompt}
          stage3Prompt={stage3Prompt}
          setStage3Prompt={setStage3Prompt}
          stage4Prompt={stage4Prompt}
          setStage4Prompt={setStage4Prompt}
          showAdvancedPrompts={showAdvancedPrompts}
          setShowAdvancedPrompts={setShowAdvancedPrompts}
          saving={saving}
          onCancel={handleCancel}
          onSubmit={handleSave}
        />
      ) : (
        <PresetViewMode
          preset={preset}
          onStartEdit={() => setIsEditing(true)}
        />
      )}
    </div>
  );
}

export default PresetInspector;
