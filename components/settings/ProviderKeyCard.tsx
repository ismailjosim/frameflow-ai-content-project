"use client";

import { Loader2, Save, ShieldCheck, Trash2 } from "lucide-react";
import type { ProviderKeyCardProps } from "./settings.types";

export function ProviderKeyCard({
  providerGroup,
  storedKey,
  inputKey,
  preferredModel,
  isSaving,
  onKeyChange,
  onModelChange,
  onSave,
  onDelete,
}: ProviderKeyCardProps) {
  const { name, placeholder, models } = providerGroup;

  return (
    <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-slate-800 space-y-4 hover:border-slate-700/80 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="font-bold text-sm text-white">{name}</span>
          {storedKey ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/50">
              <ShieldCheck className="w-3 h-3" />
              Encrypted & Active
            </span>
          ) : (
            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-800">
              Not Configured
            </span>
          )}
        </div>

        {storedKey && (
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-slate-400">
              {storedKey.maskedKey}
            </span>
            <button
              onClick={onDelete}
              className="text-slate-400 hover:text-rose-400 p-1 rounded-lg transition-colors cursor-pointer"
              title="Delete key"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="md:col-span-2 space-y-1">
          <label className="text-[11px] font-medium text-slate-400">
            {storedKey ? "Update API Key:" : "Enter API Key:"}
          </label>
          <input
            type="password"
            value={inputKey || ""}
            onChange={(e) => onKeyChange(e.target.value)}
            placeholder={storedKey ? "••••••••••••••••••••" : placeholder}
            className="w-full bg-slate-900/90 text-xs font-mono text-slate-100 placeholder-slate-600 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-medium text-slate-400">
            Preferred Model:
          </label>
          <select
            value={preferredModel}
            onChange={(e) => onModelChange(e.target.value)}
            className="w-full bg-slate-900 text-xs text-slate-200 px-3 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            {models.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} {m.badge ? `(${m.badge})` : ""}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center justify-end pt-1">
        <button
          onClick={onSave}
          disabled={isSaving || !inputKey?.trim()}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs shadow-md shadow-cyan-600/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer w-full sm:w-auto"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Encrypting...
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" />
              {storedKey ? "Save New Key" : "Encrypt & Save Key"}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
