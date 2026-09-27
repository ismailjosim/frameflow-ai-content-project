"use client";

import { AlertCircle, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import GenerationSkeleton from "@/components/GenerationSkeleton";
import { Stage2MetricsBar } from "./Stage2MetricsBar";
import type { Stage2ScriptProps } from "./stage2.types";

export function Stage2Script({
  projectId,
  topicTitle,
  topicConflict,
  topicFormula,
  selectedModel,
  scriptText,
  onScriptChange,
  onProceedToStage3,
  autoStart = false,
}: Stage2ScriptProps) {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [modelUsed, setModelUsed] = useState<string>("");

  const stats = useMemo(() => {
    if (!scriptText) return { lines: 0, words: 0, longLines: 0 };
    const lines = scriptText.split("\n").filter((l) => l.trim().length > 0);
    const words = scriptText.trim().split(/\s+/).filter(Boolean).length;
    const longLines = lines.filter((l) => l.length > 90).length;
    return { lines: lines.length, words, longLines };
  }, [scriptText]);

  const generateScript = useCallback(async () => {
    if (!topicTitle) {
      setError("Please select or enter a topic title in Stage 1 first.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate/stage2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          topic: {
            title: topicTitle,
            conflict: topicConflict || topicTitle,
            formula: topicFormula || "Documentary",
          },
          model: selectedModel,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to generate script");
      }

      onScriptChange(data.scriptText || "");
      setModelUsed(data.modelUsed || selectedModel);
      if (data.logs) setLogs(data.logs);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown generation error");
    } finally {
      setLoading(false);
    }
  }, [
    projectId,
    topicTitle,
    topicConflict,
    topicFormula,
    selectedModel,
    onScriptChange,
  ]);

  useEffect(() => {
    if (autoStart && !scriptText && topicTitle && !loading) {
      const timer = setTimeout(() => {
        generateScript();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [autoStart, topicTitle, scriptText, loading, generateScript]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(scriptText);
    setCopied(true);
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
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold text-xs flex items-center justify-center border border-cyan-500/30">
                2
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Stage 2: Voiceover Scriptwriter (90-Char Rule)
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Produces caption-ready narration formatted strictly one sentence
              per line, kept under 90 characters for effortless TTS and visual
              syncing.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {modelUsed && (
              <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-800/40">
                Resolved: {modelUsed}
              </span>
            )}
            <button
              onClick={generateScript}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-medium text-xs shadow-md shadow-cyan-500/20 transition-all hover:scale-102 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  {scriptText ? "Regenerate Script" : "Generate Script"}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Selected Topic Context Banner */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 truncate">
            <span className="font-semibold text-slate-300">Topic:</span>
            <span className="text-cyan-300 font-medium truncate">
              {topicTitle || "No topic selected"}
            </span>
          </div>
          {topicConflict && (
            <span className="text-slate-400 text-[11px] italic shrink-0">
              Formula: {topicFormula}
            </span>
          )}
        </div>

        {error && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            <div>
              <p className="font-semibold">Script Generation Error</p>
              <p className="text-rose-400/80 mt-0.5">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* Orchestrator Logs */}
      {logs.length > 1 && (
        <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
          <span className="text-xs font-semibold text-cyan-400">
            Model Orchestrator Trace:
          </span>
          {logs.map((log, i) => (
            <p key={i} className="text-slate-300">
              ↳ {log}
            </p>
          ))}
        </div>
      )}

      {/* Interactive Loading Skeleton while generating */}
      {loading && <GenerationSkeleton stage="script" />}

      {/* Script Editor & Metrics */}
      {!loading && (
        <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-slate-800 space-y-4">
          <Stage2MetricsBar
            stats={stats}
            scriptText={scriptText}
            copied={copied}
            onCopy={copyToClipboard}
            onDownload={downloadScriptTxt}
          />

          <textarea
            value={scriptText}
            onChange={(e) => onScriptChange(e.target.value)}
            placeholder="Narrative script will appear here sentence by sentence, formatted under 90 characters per line..."
            rows={16}
            className="w-full bg-slate-950/80 text-sm font-mono text-slate-200 p-3.5 sm:p-4 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500 leading-relaxed resize-y"
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <p className="text-[11px] text-slate-400">
              Next: Automatically passes this script into Stage 3 to generate
              Midjourney / Flux prompts.
            </p>

            <button
              onClick={onProceedToStage3}
              disabled={loading || !scriptText.trim()}
              className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-xs shadow-md transition-all w-full sm:w-auto shrink-0 ${
                loading || !scriptText.trim()
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50 opacity-60"
                  : "bg-linear-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-cyan-600/20 hover:scale-102 cursor-pointer"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
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
