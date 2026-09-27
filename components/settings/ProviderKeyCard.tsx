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
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-linear-to-r from-[#8A3FFC]/25 to-[#E51FD1]/25 text-pink-300 border border-[#E51FD1]/40">
              <ShieldCheck className="w-3 h-3 text-[#58E6F7]" />
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
            className="w-full bg-slate-900/90 text-xs font-mono text-slate-100 placeholder-slate-600 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-[#8A3FFC]"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-medium text-slate-400">
            Preferred Model:
          </label>
          <select
            value={preferredModel}
            onChange={(e) => onModelChange(e.target.value)}
            className="w-full bg-slate-900 text-xs text-slate-200 px-3 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-[#8A3FFC] cursor-pointer"
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
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-linear-to-r from-[#58E6F7] via-[#8A3FFC] to-[#E51FD1] hover:brightness-110 text-white font-bold text-xs shadow-md shadow-[#8A3FFC]/25 transition-all hover:scale-101 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer w-full sm:w-auto"
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
