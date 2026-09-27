"use client";

import { ArrowRight, Loader2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import GenerationSkeleton from "@/components/GenerationSkeleton";
import { calculateTimestamps, ensureTimestampedScript } from "@/lib/timestamps";
import { Stage3BatchControl } from "./Stage3BatchControl";
import { Stage3PromptList } from "./Stage3PromptList";
import type { Stage3PromptsProps } from "./stage3.types";

export function Stage3Prompts({
  projectId,
  topicTitle,
  selectedModel,
  timestampInput,
  onTimestampChange,
  promptsText,
  onPromptsChange,
  onProceedToStage4,
  autoStart = false,
  scriptText = "",
}: Stage3PromptsProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [currentBatch, setCurrentBatch] = useState(0);
  const [totalBatches, setTotalBatches] = useState(0);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const batchSize = 20;

  // Auto-populate timestamp input with calculated continuous timestamps if empty
  useEffect(() => {
    if (!timestampInput && scriptText && scriptText.trim().length > 0) {
      onTimestampChange(ensureTimestampedScript(scriptText));
    }
  }, [scriptText, timestampInput, onTimestampChange]);

  const timingStats = useMemo(() => {
    const raw = timestampInput || scriptText || "";
    return calculateTimestamps(raw);
  }, [timestampInput, scriptText]);

  const lines = useMemo(() => {
    const raw = timestampInput || scriptText || "";
    if (!raw.trim()) return [];
    const timestamped = ensureTimestampedScript(raw);
    return timestamped
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
  }, [timestampInput, scriptText]);

  const handleRecalculateTimestamps = useCallback(() => {
    const raw = timestampInput || scriptText || "";
    if (!raw.trim()) return;
    const recalculated = calculateTimestamps(raw);
    onTimestampChange(recalculated.result);
  }, [timestampInput, scriptText, onTimestampChange]);

  const promptList = useMemo(() => {
    if (!promptsText) return [];
    return promptsText
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
  }, [promptsText]);

  const startBatchQueue = useCallback(async () => {
    const targetLines =
      lines.length > 0
        ? lines
        : scriptText
          ? scriptText
              .split("\n")
              .map((l) => l.trim())
              .filter(Boolean)
          : [];
    if (targetLines.length === 0) {
      setError("Please paste your script or timestamps from Stage 2 first.");
      return;
    }

    setIsRunning(true);
    setError(null);

    const chunks: string[][] = [];
    for (let i = 0; i < targetLines.length; i += batchSize) {
      chunks.push(targetLines.slice(i, i + batchSize));
    }

    setTotalBatches(chunks.length);
    let accumulatedPrompts = promptsText ? `${promptsText}\n\n` : "";

    try {
      for (let i = 0; i < chunks.length; i++) {
        setCurrentBatch(i + 1);
        const chunk = chunks[i];

        const res = await fetch("/api/generate/stage3-batch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectId,
            batchLines: chunk,
            topicTitle: topicTitle || "Video Production",
            batchIndex: i,
            totalBatches: chunks.length,
            model: selectedModel,
          }),
        });

        const data = await res.json();
        if (!data.success) {
          throw new Error(data.error || `Batch ${i + 1} failed`);
        }

        accumulatedPrompts += `${(data.promptsText || "").trim()}\n\n`;
        onPromptsChange(accumulatedPrompts.trim());

        if (data.logs) {
          setLogs((prev) => [...prev.slice(-4), ...data.logs]);
        }
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Batch queue stopped due to error",
      );
    } finally {
      setIsRunning(false);
    }
  }, [
    lines,
    scriptText,
    promptsText,
    projectId,
    topicTitle,
    selectedModel,
    onPromptsChange,
  ]);

  useEffect(() => {
    if (autoStart && lines.length > 0 && !promptsText && !isRunning) {
      const timer = setTimeout(() => {
        startBatchQueue();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [autoStart, lines.length, startBatchQueue, promptsText, isRunning]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(promptsText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadPromptsTxt = () => {
    const slug = topicTitle
      ? topicTitle
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "_")
          .slice(0, 30)
      : "prompts";
    const blob = new Blob([promptsText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slug}_prompts.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const currentPercent =
    totalBatches > 0 ? Math.round((currentBatch / totalBatches) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Intro & Batch Controls */}
      <Stage3BatchControl
        isRunning={isRunning}
        linesCount={lines.length}
        promptsExist={!!promptsText}
        currentBatch={currentBatch}
        totalBatches={totalBatches}
        currentPercent={currentPercent}
        timestampInput={timestampInput}
        onTimestampChange={onTimestampChange}
        onStartQueue={startBatchQueue}
        onRecalculateTimestamps={handleRecalculateTimestamps}
        estimatedRuntime={timingStats.formattedRuntime}
        error={error}
      />

      {/* Orchestrator Logs */}
      {logs.length > 0 && (
        <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
          <span className="text-xs font-semibold text-cyan-400">
            Batch Generation Log:
          </span>
          {logs.map((log, i) => (
            <p key={i} className="text-slate-300">
              ↳ {log}
            </p>
          ))}
        </div>
      )}

      {/* Interactive Loading Skeleton while generating */}
      {isRunning && (
        <GenerationSkeleton
          stage="prompts"
          currentBatch={currentBatch}
          totalBatches={totalBatches}
        />
      )}

      {/* Generated Prompts Viewer */}
      <Stage3PromptList
        promptList={promptList}
        promptsText={promptsText}
        onPromptsChange={onPromptsChange}
        copied={copied}
        onCopyAll={copyToClipboard}
        onDownload={downloadPromptsTxt}
      />

      {/* Proceed to Stage 4 Button - Strictly Disabled until prompts exist */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <p className="text-[11px] text-slate-400">
          Next: Automatically transfers prompt & script context to Stage 4 for
          viral YouTube packaging.
        </p>

        <button
          onClick={onProceedToStage4}
          disabled={isRunning || !promptsText.trim()}
          className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-xs shadow-md transition-all w-full sm:w-auto shrink-0 ${
            isRunning || !promptsText.trim()
              ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50 opacity-60"
              : "bg-linear-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-cyan-600/20 hover:scale-102 cursor-pointer"
          }`}
        >
          {isRunning ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
              <span>
                Processing Prompts (Batch {currentBatch}/{totalBatches})...
              </span>
            </>
          ) : (
            <>
              <span>
                {promptsText.trim()
                  ? "Proceed to Stage 4 (Packaging)"
                  : "Proceed to Stage 4 (Prompts Required)"}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default Stage3Prompts;
