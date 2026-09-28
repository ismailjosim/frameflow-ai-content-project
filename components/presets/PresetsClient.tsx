"use client";

import { AlertCircle, Check, Palette, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { CreatePresetModal } from "./CreatePresetModal";
import { PresetInspector } from "./PresetInspector";
import type { Preset } from "./presets.types";

export function PresetsClient() {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<Preset | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const fetchPresets = useCallback(async () => {
    try {
      const res = await fetch("/api/presets");
      const data = await res.json();
      if (data.success && Array.isArray(data.presets)) {
        setPresets(data.presets);
        setSelectedPreset(
          (curr) => curr || (data.presets.length > 0 ? data.presets[0] : null),
        );
      }
    } catch {
      // ignore
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
          setSelectedPreset(
            (curr) =>
              curr || (data.presets.length > 0 ? data.presets[0] : null),
          );
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

  const handleDeletePreset = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete preset "${name}"?`)) {
      return;
    }
    setDeletingId(id);
    try {
      const res = await fetch(`/api/presets/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setToastMsg({ text: `Preset "${name}" deleted.`, type: "success" });
        setPresets((prev) => {
          const updated = prev.filter((p) => p._id !== id);
          if (selectedPreset?._id === id) {
            setSelectedPreset(updated.length > 0 ? updated[0] : null);
          }
          return updated;
        });
        setTimeout(() => setToastMsg(null), 3000);
      } else {
        setToastMsg({
          text: data.error || "Failed to delete preset",
          type: "error",
        });
        setTimeout(() => setToastMsg(null), 3500);
      }
    } catch {
      setToastMsg({ text: "Network error deleting preset", type: "error" });
      setTimeout(() => setToastMsg(null), 3500);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <DashboardLayout pageTitle="Style Presets">
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

        {/* Status Toast */}
        {toastMsg && (
          <div
            className={`p-3.5 rounded-xl text-xs flex items-center gap-2 animate-fade-in ${
              toastMsg.type === "success"
                ? "bg-linear-to-r from-[#8A3FFC]/15 to-[#E51FD1]/15 border border-[#E51FD1]/40 text-purple-800 dark:text-pink-200"
                : "bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/50 text-rose-700 dark:text-rose-300"
            }`}
          >
            {toastMsg.type === "success" ? (
              <Check className="w-4 h-4 text-[#8A3FFC] dark:text-[#58E6F7]" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-500" />
            )}
            <span>{toastMsg.text}</span>
          </div>
        )}

        {/* Modal: Add Custom Style */}
        <CreatePresetModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={fetchPresets}
        />

        {/* Preset Browser Grid & Inspector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Preset List */}
          <div className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Available Presets ({presets.length})
            </h2>
            {presets.map((p) => {
              const isSelected = selectedPreset?._id === p._id;
              const isDeletingThis = deletingId === p._id;
              return (
                <div
                  key={p._id}
                  onClick={() => setSelectedPreset(p)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-linear-to-r from-[#8A3FFC]/15 via-[#E51FD1]/10 to-transparent border-[#E51FD1] shadow-md shadow-[#8A3FFC]/20 ring-1 ring-[#E51FD1]/50 text-slate-900 dark:text-white"
                      : "glass-panel border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white/80 dark:bg-slate-900/60"
                  } ${isDeletingThis ? "opacity-50 pointer-events-none" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 dark:text-white truncate pr-2">
                      {p.name}
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {p.isDefault ? (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-linear-to-r from-purple-100 to-pink-100 dark:from-[#8A3FFC]/25 dark:to-[#E51FD1]/25 text-purple-700 dark:text-pink-300 border border-purple-200 dark:border-[#E51FD1]/40">
                          Default
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePreset(p._id, p.name);
                          }}
                          disabled={isDeletingThis}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title={`Delete preset ${p.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  {p.description && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {p.description}
                    </p>
                  )}
                  <span className="font-mono text-[10px] text-[#8A3FFC] dark:text-[#58E6F7] block mt-2">
                    {p.aspectRatio}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Preset Inspector */}
          <PresetInspector
            preset={selectedPreset}
            onDelete={handleDeletePreset}
            isDeleting={deletingId === selectedPreset?._id}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}

export default PresetsClient;
