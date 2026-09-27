"use client";

import type React from "react";
import { useState } from "react";
import type { CreateProjectModalProps } from "./projects.types";

export function CreateProjectModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateProjectModalProps) {
  const [newTitle, setNewTitle] = useState("");
  const [creating, setCreating] = useState(false);

  if (!isOpen) return null;

  const createProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setCreating(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setNewTitle("");
        onSuccess();
        onClose();
      }
    } catch {
      // ignore
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="glass-panel max-w-md w-full p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <h3 className="text-sm font-bold text-white">
            Create New Video Project
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 text-xs cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={createProject} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-medium text-slate-300">
              Project Title / Working Topic:
            </label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g., How Ancient Humans Survived Without Fire"
              required
              className="w-full bg-slate-900 px-3.5 py-2.5 rounded-xl border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creating}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium cursor-pointer"
            >
              {creating ? "Creating..." : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
