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
            <div className="p-2.5 rounded-xl bg-linear-to-br from-[#58E6F7]/20 to-[#8A3FFC]/30 text-[#58E6F7] border border-[#58E6F7]/40 shrink-0">
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
                      ? "bg-linear-to-r from-[#8A3FFC]/20 via-[#E51FD1]/15 to-transparent border-[#E51FD1] shadow-md shadow-[#8A3FFC]/20 ring-1 ring-[#E51FD1]/50"
                      : "glass-panel border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white">
                      {p.name}
                    </span>
                    {p.isDefault && (
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-linear-to-r from-[#8A3FFC]/25 to-[#E51FD1]/25 text-pink-300 border border-[#E51FD1]/40">
                        Default
                      </span>
                    )}
                  </div>
                  {p.description && (
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                      {p.description}
                    </p>
                  )}
                  <span className="font-mono text-[10px] text-[#58E6F7] block mt-2">
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
