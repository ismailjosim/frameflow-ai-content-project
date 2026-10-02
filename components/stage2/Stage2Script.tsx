"use client";

import { ArrowRight, Loader2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import GenerationSkeleton from "@/components/GenerationSkeleton";
import { sound } from "@/lib/sound";
import { Stage2Header } from "./Stage2Header";
import { Stage2MetricsBar } from "./Stage2MetricsBar";
import type { Stage2ScriptProps } from "./stage2.types";

export function Stage2Script({
  projectId,
  topicTitle,
  topicConflict,
  topicFormula,
  selectedModel,
  scriptText,
  isScriptComplete = false,
  onScriptCompleteChange,
  onScriptChange,
  onProceedToStage3,
  autoStart = false,
}: Stage2ScriptProps) {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [modelUsed, setModelUsed] = useState<string>("");
  const abortControllerRef = useRef<AbortController | null>(null);

  const stats = useMemo(() => {
    if (!scriptText) return { lines: 0, words: 0, longLines: 0 };
    const lines = scriptText.split("\n").filter((l) => l.trim().length > 0);
    const words = scriptText.trim().split(/\s+/).filter(Boolean).length;
    const longLines = lines.filter((l) => l.length > 90).length;
    return { lines: lines.length, words, longLines };
  }, [scriptText]);

  const generateScript = useCallback(
    async (continueExisting = false) => {
      if (!topicTitle) {
        setError("Please select or enter a topic title in Stage 1 first.");
        toast.error("Please select or enter a topic title in Stage 1 first.");
        return;
      }

      setLoading(true);
      setError(null);
      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const res = await fetch("/api/generate/stage2", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            projectId,
            topic: {
              title: topicTitle,
              conflict: topicConflict || topicTitle,
              formula: topicFormula || "Documentary",
            },
            model: selectedModel,
            continueFromScript:
              continueExisting && scriptText.trim().length > 0
                ? scriptText.trim()
                : undefined,
          }),
        });

        const data = await res.json();
        if (!data.success) {
          throw new Error(data.error || "Failed to generate script");
        }

        onScriptChange(data.scriptText || "");
        if (typeof data.isComplete === "boolean") {
          onScriptCompleteChange?.(data.isComplete);
        }
        setModelUsed(data.modelUsed || selectedModel);
        if (data.logs) setLogs(data.logs);
        sound.playStepComplete();

        if (data.isComplete) {
          toast.success(
            continueExisting
              ? "Narration script continued and reached full completion!"
              : "Voiceover narration script fully completed on first attempt!",
          );
        } else {
          const nextLine =
            (data.scriptText
              ?.split("\n")
              .filter((l: string) => l.trim().length > 0).length || 0) + 1;
          toast.info(
            `Partial script generated. Click 'Continue from Line ${nextLine}' to generate the remaining lines.`,
          );
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
        const msg =
          err instanceof Error ? err.message : "Unknown generation error";
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    },
    [
      projectId,
      topicTitle,
      topicConflict,
      topicFormula,
      selectedModel,
      scriptText,
      onScriptChange,
      onScriptCompleteChange,
    ],
  );

  useEffect(() => {
    if (autoStart && !scriptText && topicTitle && !loading) {
      const timer = setTimeout(() => {
        generateScript(false);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [autoStart, topicTitle, scriptText, loading, generateScript]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(scriptText);
    setCopied(true);
    sound.playNotification();
    toast.success("Narration script copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadScriptTxt = () => {
    const slug = topicTitle
      ? topicTitle
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "_")
          .slice(0, 30)
      : "script";
    const blob = new Blob([scriptText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slug}_script.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    sound.playNotification();
    toast.success("Script downloaded as text file!");
  };

  const handleStopScript = useCallback(() => {
    abortControllerRef.current?.abort();
    setLoading(false);
    sound.playNotification();
    toast.info("Script generation stopped. Your current script is preserved.");
  }, []);

  return (
    <div className="space-y-6">
      {/* Intro Header & Continuation Controls */}
      <Stage2Header
        topicTitle={topicTitle}
        topicConflict={topicConflict}
        topicFormula={topicFormula}
        modelUsed={modelUsed}
        scriptText={scriptText}
        statsLines={stats.lines}
        isScriptComplete={isScriptComplete}
        onToggleScriptComplete={() =>
          onScriptCompleteChange?.(!isScriptComplete)
        }
        loading={loading}
        error={error}
        onContinueScript={() => generateScript(true)}
        onGenerateScript={() => generateScript(false)}
        onStopScript={handleStopScript}
      />

      {/* Orchestrator Logs */}
      {logs.length > 1 && (
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-400 space-y-1">
          <span className="text-xs font-semibold text-[#8A3FFC] dark:text-[#58E6F7]">
            Model Orchestrator Trace:
          </span>
          {logs.map((log, i) => (
            <p key={i} className="text-slate-700 dark:text-slate-300">
              ↳ {log}
            </p>
          ))}
        </div>
      )}

      {/* Interactive Loading Skeleton while generating */}
      {loading && <GenerationSkeleton stage="script" />}

      {/* Script Editor & Metrics */}
      {!loading && (
        <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 bg-white/80 dark:bg-slate-900/60">
          <Stage2MetricsBar
            stats={stats}
            scriptText={scriptText}
            isScriptComplete={isScriptComplete}
            copied={copied}
            onCopy={copyToClipboard}
            onDownload={downloadScriptTxt}
          />

          <textarea
            value={scriptText}
            onChange={(e) => onScriptChange(e.target.value)}
            placeholder="Narrative script will appear here sentence by sentence, formatted under 90 characters per line..."
            rows={16}
            className="w-full bg-slate-50 dark:bg-slate-950/80 text-sm font-mono text-slate-900 dark:text-slate-200 p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-[#8A3FFC] leading-relaxed resize-y"
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Next: Automatically passes this script into Stage 3 to generate
              Midjourney / Flux prompts.
            </p>

            <button
              type="button"
              onClick={onProceedToStage3}
              disabled={loading || !scriptText.trim()}
              className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-xs shadow-md transition-all w-full sm:w-auto shrink-0 ${
                loading || !scriptText.trim()
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-200 dark:border-slate-700/50 opacity-60"
                  : "bg-linear-to-r from-[#8A3FFC] via-[#E51FD1] to-[#FF4E63] hover:brightness-110 text-white shadow-md shadow-[#E51FD1]/25 hover:scale-102 cursor-pointer font-bold"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#58E6F7]" />
                  <span>Generating Script...</span>
                </>
              ) : (
                <>
                  <span>
                    {scriptText.trim()
                      ? "Proceed to Stage 3 (Batch Prompts)"
                      : "Proceed to Stage 3 (Script Required)"}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Stage2Script;
