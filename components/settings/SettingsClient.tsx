"use client";

import { KeyRound, Lock, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PROVIDER_GROUPS } from "@/lib/ai/models";
import { sound } from "@/lib/sound";
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
  const [keyToDelete, setKeyToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
      toast.error(`Please enter a valid API key for ${provider}.`);
      return;
    }

    setSavingProvider(provider);

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

      sound.playStepComplete();
      toast.success(
        `${provider.toUpperCase()} key securely stored in your private vault!`,
      );
      setInputKeys((prev) => ({ ...prev, [provider]: "" }));

      await fetchKeys();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error saving key");
    } finally {
      setSavingProvider(null);
    }
  };

  const handleConfirmDeleteKey = async () => {
    if (!keyToDelete) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/keys?provider=${keyToDelete}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        sound.playNotification();
        toast.success(`${keyToDelete.toUpperCase()} key removed from vault.`);
        await fetchKeys();
        setKeyToDelete(null);
      } else {
        toast.error(data.error || "Failed to delete key");
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to delete key");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DashboardLayout pageTitle="Key Vault & Security">
      <div className="space-y-6">
        {/* Header */}
        <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 bg-white/80 dark:bg-slate-900/60 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-linear-to-br from-[#58E6F7]/20 to-[#8A3FFC]/30 text-[#8A3FFC] dark:text-[#58E6F7] border border-[#58E6F7]/40 shrink-0">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                AI Provider Key Vault
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Supply your own API credentials for Gemini 3.8 Flash, Claude 3.7
                Sonnet, or OpenAI GPT-4o.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/80 p-3 rounded-xl border border-slate-200 dark:border-slate-800/80 mt-3">
            <Lock className="w-3.5 h-3.5 text-[#8A3FFC] dark:text-[#58E6F7] shrink-0" />
            <span>
              <strong>Private & Secure:</strong> Your keys are never visible to
              others and are only used when you generate content. Auto Model
              smoothly switches between your active keys if one is busy.
            </span>
          </div>
        </div>

        {/* Shadcn AlertDialog: Confirm Delete Key */}
        <AlertDialog
          open={!!keyToDelete}
          onOpenChange={(open) => !open && setKeyToDelete(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <div className="flex items-center gap-2 mb-1">
                <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                  <Trash2 className="w-4 h-4" />
                </div>
                <AlertDialogTitle>Remove API Key from Vault?</AlertDialogTitle>
              </div>
              <AlertDialogDescription>
                Are you sure you want to remove your{" "}
                <span className="font-semibold text-slate-900 dark:text-white uppercase">
                  {keyToDelete}
                </span>{" "}
                key from the encrypted vault? Generative tasks requiring this
                provider will not run until re-configured.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setKeyToDelete(null)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmDeleteKey}
                disabled={isDeleting}
                className="bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/30"
              >
                {isDeleting ? "Removing..." : "Remove Key"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

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
              onDelete={() => setKeyToDelete(p.provider)}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default SettingsClient;
