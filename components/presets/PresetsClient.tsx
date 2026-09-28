"use client";

import { Palette, Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { sound } from "@/lib/sound";
import { CreatePresetModal } from "./CreatePresetModal";
import { PresetCard } from "./PresetCard";
import { PresetConfirmDialogs } from "./PresetConfirmDialogs";
import { PresetInspector } from "./PresetInspector";
import type { Preset } from "./presets.types";

export function PresetsClient() {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<Preset | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [presetToDelete, setPresetToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [presetToMakeDefault, setPresetToMakeDefault] = useState<Preset | null>(
    null,
  );
  const [isSettingDefault, setIsSettingDefault] = useState(false);

  const fetchPresets = useCallback(async () => {
    try {
      const res = await fetch("/api/presets");
      const data = await res.json();
      if (data.success && Array.isArray(data.presets)) {
        setPresets(data.presets);
        const defaultOne =
          data.presets.find((p: Preset) => p.isDefault) ||
          data.presets[0] ||
          null;
        setSelectedPreset((prev) => {
          if (!prev) return defaultOne;
          const stillExists = data.presets.find(
            (p: Preset) => p._id === prev._id,
          );
          return stillExists || defaultOne;
        });
      }
    } catch {
      // silently handle
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const res = await fetch("/api/presets");
        const data = await res.json();
        if (!ignore && data.success && Array.isArray(data.presets)) {
          setPresets(data.presets);
          const defaultOne =
            data.presets.find((p: Preset) => p.isDefault) ||
            data.presets[0] ||
            null;
          setSelectedPreset(defaultOne);
        }
      } catch {
        // ignore
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, []);

  const handleSelectPreset = (p: Preset) => {
    if (selectedPreset?._id === p._id) return;
    if (p.isDefault) {
      setSelectedPreset(p);
      return;
    }
    setPresetToMakeDefault(p);
  };

  const handleConfirmSetDefault = async () => {
    if (!presetToMakeDefault) return;
    setIsSettingDefault(true);
    try {
      const res = await fetch(`/api/presets/${presetToMakeDefault._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDefault: true }),
      });
      const data = await res.json();
      if (data.success) {
        sound.playStepComplete();
        toast.success(
          `"${presetToMakeDefault.name}" is now the default preset!`,
        );
        await fetchPresets();
        setSelectedPreset(presetToMakeDefault);
        setPresetToMakeDefault(null);
      } else {
        toast.error(data.error || "Failed to set default preset");
      }
    } catch {
      toast.error("Network error setting default preset");
    } finally {
      setIsSettingDefault(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!presetToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/presets/${presetToDelete.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        sound.playNotification();
        toast.success(`Preset "${presetToDelete.name}" deleted.`);
        await fetchPresets();
        if (selectedPreset?._id === presetToDelete.id) {
          const remaining = presets.filter((p) => p._id !== presetToDelete.id);
          setSelectedPreset(remaining[0] || null);
        }
        setPresetToDelete(null);
      } else {
        toast.error(data.error || "Failed to delete preset");
      }
    } catch {
      toast.error("Network error deleting preset");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdatePreset = (updated: Preset) => {
    sound.playStepComplete();
    toast.success("Style preset updated successfully!");
    setPresets((prev) =>
      prev.map((p) => (p._id === updated._id ? updated : p)),
    );
    setSelectedPreset(updated);
  };

  return (
    <DashboardLayout pageTitle="Master Prompt & Styles">
      <div className="space-y-6">
        {/* Header */}
        <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 dark:bg-slate-900/60 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-linear-to-br from-[#58E6F7]/20 to-[#8A3FFC]/30 text-[#8A3FFC] dark:text-[#58E6F7] border border-[#58E6F7]/40 shrink-0">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Master Prompt & Visual Styles
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Switch visual art styles (2D doodle, 3D Pixar, 2.5D cinematic)
                while preserving the fixed 4-stage pipeline.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-linear-to-r from-[#58E6F7] via-[#8A3FFC] to-[#E51FD1] hover:brightness-110 text-white font-bold text-xs shadow-md shadow-[#8A3FFC]/25 transition-all hover:scale-101 cursor-pointer w-full sm:w-auto shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add Master Style (.md / .txt)
          </button>
        </div>

        {/* Modal: Add Custom Style */}
        <CreatePresetModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            sound.playStepComplete();
            toast.success("New style preset added!");
            fetchPresets();
          }}
        />

        {/* Confirm Dialogs */}
        <PresetConfirmDialogs
          presetToMakeDefault={presetToMakeDefault}
          onCloseDefaultDialog={() => setPresetToMakeDefault(null)}
          onConfirmSetDefault={handleConfirmSetDefault}
          isSettingDefault={isSettingDefault}
          presetToDelete={presetToDelete}
          onCloseDeleteDialog={() => setPresetToDelete(null)}
          onConfirmDelete={handleConfirmDelete}
          isDeleting={isDeleting}
        />

        {/* Preset Browser Grid & Inspector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Preset List */}
          <div className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Available Presets ({presets.length})
            </h2>
            {presets.map((p) => (
              <PresetCard
                key={p._id}
                preset={p}
                isSelected={selectedPreset?._id === p._id}
                isDeleting={isDeleting && presetToDelete?.id === p._id}
                onSelect={handleSelectPreset}
                onDeleteRequest={(id, name) => setPresetToDelete({ id, name })}
              />
            ))}
          </div>

          {/* Preset Inspector */}
          <PresetInspector
            key={selectedPreset?._id || "empty"}
            preset={selectedPreset}
            onDelete={(id, name) => setPresetToDelete({ id, name })}
            isDeleting={
              isDeleting && presetToDelete?.id === selectedPreset?._id
            }
            onUpdate={handleUpdatePreset}
            onSetDefault={(p) => setPresetToMakeDefault(p)}
            isSettingDefault={isSettingDefault}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}

export default PresetsClient;
