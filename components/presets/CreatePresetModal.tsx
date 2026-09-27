"use client";

import { Upload } from "lucide-react";
import type React from "react";
import { useState } from "react";
import type { CreatePresetModalProps } from "./presets.types";

export function CreatePresetModal({
  isOpen,
  onClose,
  onSuccess,
}: CreatePresetModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [aspectRatio, setAspectRatio] = useState("--ar 16:9 --v 6.1");
  const [visualStyleRules, setVisualStyleRules] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setFileContent(text);
      setVisualStyleRules(text);
      if (!name) {
        setName(file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "));
      }
    };
    reader.readAsText(file);
  };

  const handleCreatePreset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !visualStyleRules.trim()) {
      setStatusMsg("Please provide a name and visual style rules.");
      return;
    }

    setSubmitting(true);
    setStatusMsg(null);

    try {
      const res = await fetch("/api/presets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || "Custom Video Style",
          aspectRatio,
          visualStyleRules: visualStyleRules.trim(),
          rawMasterFile: fileContent || undefined,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to save preset");
      }

      setName("");
      setDescription("");
      setVisualStyleRules("");
      setFileContent("");
      onSuccess();
      onClose();
    } catch (err: unknown) {
      setStatusMsg(
        err instanceof Error ? err.message : "Error creating preset",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="glass-panel max-w-2xl w-full p-6 rounded-2xl border border-slate-800 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <h3 className="text-sm font-bold text-white">
            Create / Upload Master Style Preset
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xs cursor-pointer"
          >
            ✕ Close
          </button>
        </div>

        <form onSubmit={handleCreatePreset} className="space-y-4 text-xs">
          {/* File upload shortcut */}
          <div className="p-4 rounded-xl border border-dashed border-slate-700 bg-slate-900/60 text-center space-y-2">
            <Upload className="w-6 h-6 text-purple-400 mx-auto" />
            <p className="text-slate-300 font-medium">
              Upload Master Prompt (.md or .txt)
            </p>
            <p className="text-[11px] text-slate-400">
              Drag or select a markdown style file to auto-populate prompt
              rules.
            </p>
            <input
              type="file"
              accept=".md,.txt"
              onChange={handleFileUpload}
              className="block mx-auto text-xs text-slate-400 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-purple-950 file:text-purple-300 hover:file:bg-purple-900 cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-medium text-slate-300">Style Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., 3D Pixar Animation / Stylized 2.5D"
                required
                className="w-full bg-slate-900 px-3 py-2 rounded-xl border border-slate-800 text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-medium text-slate-300">
                Aspect Ratio / Midjourney Flags:
              </label>
              <input
                type="text"
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                placeholder="--ar 16:9 --v 6.1"
                className="w-full bg-slate-900 px-3 py-2 rounded-xl border border-slate-800 text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-medium text-slate-300">Description:</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this visual theme..."
              className="w-full bg-slate-900 px-3 py-2 rounded-xl border border-slate-800 text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-medium text-slate-300">
              Visual Style & Prompt DNA Rules:
            </label>
            <textarea
              value={visualStyleRules}
              onChange={(e) => setVisualStyleRules(e.target.value)}
              rows={8}
              placeholder="Specify aesthetic, character description, lighting, color palette, camera cues, and negative rules..."
              className="w-full bg-slate-900 font-mono text-slate-200 p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-purple-500"
            />
          </div>

          {statusMsg && (
            <p className="text-purple-400 font-medium">{statusMsg}</p>
          )}

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/80">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium cursor-pointer"
            >
              {submitting ? "Saving..." : "Save Style Preset"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
