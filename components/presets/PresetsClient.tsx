"use client";

import { Palette, Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { CreatePresetModal } from "./CreatePresetModal";
import { PresetInspector } from "./PresetInspector";
import type { Preset } from "./presets.types";

export function PresetsClient() {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<Preset | null>(null);

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

  return (
    <DashboardLayout pageTitle="Style Presets">
      <div className="space-y-6">
        {/* Header */}
        <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Master Prompt & Visual Styles
              </h1>
              <p className="text-xs text-slate-400">
                Switch visual art styles (2D doodle, 3D Pixar, 2.5D cinematic)
                while preserving the fixed 4-stage pipeline.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-xs shadow-md shadow-purple-600/20 transition-all cursor-pointer w-full sm:w-auto shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add Master Style (.md / .txt)
          </button>
        </div>

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
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Available Presets
            </h2>
            {presets.map((p) => {
              const isSelected = selectedPreset?._id === p._id;
              return (
                <div
                  key={p._id}
                  onClick={() => setSelectedPreset(p)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-purple-950/30 border-purple-500 shadow-md shadow-purple-500/10"
                      : "glass-panel border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white">
                      {p.name}
                    </span>
                    {p.isDefault && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/50">
                        Default
                      </span>
                    )}
                  </div>
                  {p.description && (
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                      {p.description}
                    </p>
                  )}
                  <span className="font-mono text-[10px] text-purple-400 block mt-2">
                    {p.aspectRatio}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Preset Inspector */}
          <PresetInspector preset={selectedPreset} />
        </div>
      </div>
    </DashboardLayout>
  );
}

export default PresetsClient;
