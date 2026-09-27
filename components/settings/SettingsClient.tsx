"use client";

import { AlertCircle, Check, KeyRound, Lock } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { PROVIDER_GROUPS } from "@/lib/ai/models";
import { ProviderKeyCard } from "./ProviderKeyCard";
import type { StoredKey } from "./settings.types";

export function SettingsClient() {
  const [storedKeys, setStoredKeys] = useState<Record<string, StoredKey>>({});
  const [inputKeys, setInputKeys] = useState<Record<string, string>>({
    gemini: "",
    claude: "",
    openai: "",
  });
  const [preferredModels, setPreferredModels] = useState<
    Record<string, string>
  >({
    gemini: "gemini-3.8-flash",
    claude: "claude-3-7-sonnet-20250219",
    openai: "gpt-4o-mini",
  });
  const [savingProvider, setSavingProvider] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const fetchKeys = useCallback(async () => {
    try {
      const res = await fetch("/api/keys");
      const data = await res.json();
      if (data.success && Array.isArray(data.keys)) {
        const keyMap: Record<string, StoredKey> = {};
        for (const k of data.keys) {
          keyMap[k.provider] = k;
          if (k.preferredModel) {
            setPreferredModels((prev) => ({
              ...prev,
              [k.provider]: k.preferredModel,
            }));
          }
        }
        setStoredKeys(keyMap);
      }
    } catch {
      // silently handle
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const res = await fetch("/api/keys");
        const data = await res.json();
        if (!ignore && data.success && Array.isArray(data.keys)) {
          const keyMap: Record<string, StoredKey> = {};
          for (const k of data.keys) {
            keyMap[k.provider] = k;
            if (k.preferredModel) {
              setPreferredModels((prev) => ({
                ...prev,
                [k.provider]: k.preferredModel,
              }));
            }
          }
          setStoredKeys(keyMap);
        }
      } catch {
        // silently handle
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, []);

  const saveKey = async (provider: string) => {
    const rawKey = inputKeys[provider];
    if (!rawKey?.trim()) {
      setMessage({
        text: `Please enter a valid API key for ${provider}.`,
        type: "error",
      });
      return;
    }

    setSavingProvider(provider);
    setMessage(null);

    try {
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          apiKey: rawKey.trim(),
          preferredModel: preferredModels[provider],
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to encrypt and store key");
      }

      setMessage({
        text: `${provider.toUpperCase()} key encrypted with AES-256 and stored!`,
        type: "success",
      });
      setInputKeys((prev) => ({ ...prev, [provider]: "" }));
      await fetchKeys();
    } catch (err: unknown) {
      setMessage({
        text: err instanceof Error ? err.message : "Error saving key",
        type: "error",
      });
    } finally {
      setSavingProvider(null);
    }
  };

  const deleteKey = async (provider: string) => {
    if (
      !confirm(
        `Are you sure you want to remove your ${provider} key from the vault?`,
      )
    )
      return;

    try {
      const res = await fetch(`/api/keys?provider=${provider}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ text: `${provider} key deleted.`, type: "success" });
        await fetchKeys();
      }
    } catch {
      setMessage({ text: "Failed to delete key", type: "error" });
    }
  };

  return (
    <DashboardLayout pageTitle="Key Vault & Security">
      <div className="space-y-6">
        {/* Header */}
        <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                API Key Vault & Security
              </h1>
              <p className="text-xs text-slate-400">
                Configure your LLM credentials. Keys are encrypted with{" "}
                <span className="text-cyan-400 font-semibold">AES-256-GCM</span>{" "}
                at rest in MongoDB and never sent back to the browser.
              </p>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400">
            <Lock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>
              <strong>Zero Leak Architecture:</strong> API keys are decrypted
              only in server memory for the duration of prompt generation. Auto
              Model will toggle between these keys if one hits rate limits.
            </span>
          </div>
        </div>

        {/* Status Toast */}
        {message && (
          <div
            className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
              message.type === "success"
                ? "bg-emerald-950/40 border border-emerald-800/50 text-emerald-300"
                : "bg-rose-950/40 border border-rose-800/50 text-rose-300"
            }`}
          >
            {message.type === "success" ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Provider Cards */}
        <div className="space-y-4">
          {PROVIDER_GROUPS.map((p) => (
            <ProviderKeyCard
              key={p.provider}
              providerGroup={p}
              storedKey={storedKeys[p.provider]}
              inputKey={inputKeys[p.provider]}
              preferredModel={preferredModels[p.provider]}
              isSaving={savingProvider === p.provider}
              onKeyChange={(val) =>
                setInputKeys((prev) => ({ ...prev, [p.provider]: val }))
              }
              onModelChange={(val) =>
                setPreferredModels((prev) => ({ ...prev, [p.provider]: val }))
              }
              onSave={() => saveKey(p.provider)}
              onDelete={() => deleteKey(p.provider)}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default SettingsClient;
