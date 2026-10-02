"use client";

import { ArrowRight, Loader2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import GenerationSkeleton from "@/components/GenerationSkeleton";
import { sound } from "@/lib/sound";
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
  const [isPaused, setIsPaused] = useState(false);
  const [currentBatch, setCurrentBatch] = useState(0);
  const [totalBatches, setTotalBatches] = useState(0);
  const [failedBatchIndex, setFailedBatchIndex] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const batchSize = 20;

  const abortControllerRef = useRef<AbortController | null>(null);
  const isPausedRef = useRef(false);
  const isStoppedRef = useRef(false);

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
    sound.playNotification();
    toast.success("Timestamps recalculated based on word cadence.");
  }, [timestampInput, scriptText, onTimestampChange]);

  const promptList = useMemo(() => {
    if (!promptsText) return [];
    return promptsText
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
  }, [promptsText]);

  const startBatchQueue = useCallback(
    async (fromBatchIndex = 0) => {
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
        toast.error(
          "Please paste your script or timestamps from Stage 2 first.",
        );
        return;
      }

      isPausedRef.current = false;
      isStoppedRef.current = false;
      setIsPaused(false);
      setIsRunning(true);
      setError(null);

      const chunks: string[][] = [];
      for (let i = 0; i < targetLines.length; i += batchSize) {
        chunks.push(targetLines.slice(i, i + batchSize));
      }

      setTotalBatches(chunks.length);
      let accumulatedPrompts =
        fromBatchIndex > 0 && promptsText ? `${promptsText.trim()}\n\n` : "";

      try {
        for (let i = fromBatchIndex; i < chunks.length; i++) {
          if (isPausedRef.current) {
            setFailedBatchIndex(i);
            setIsRunning(false);
            setIsPaused(true);
            return;
          }
          if (isStoppedRef.current) {
            setIsRunning(false);
            setIsPaused(false);
            setFailedBatchIndex(null);
            return;
          }

          setCurrentBatch(i + 1);
          const chunk = chunks[i];

          const controller = new AbortController();
          abortControllerRef.current = controller;

          const res = await fetch("/api/generate/stage3-batch", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal: controller.signal,
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
            setFailedBatchIndex(i);
            throw new Error(data.error || `Batch ${i + 1} failed`);
          }

          accumulatedPrompts += `${(data.promptsText || "").trim()}\n\n`;
          onPromptsChange(accumulatedPrompts.trim());

          if (data.logs) {
            setLogs((prev) => [...prev.slice(-4), ...data.logs]);
          }
        }
        setFailedBatchIndex(null);
        sound.playStepComplete();
        toast.success("All Midjourney image prompts generated successfully!");
      } catch (err: unknown) {
        if (
          isStoppedRef.current ||
          (err instanceof Error && err.name === "AbortError")
        ) {
          return;
        }
        if (isPausedRef.current) {
          return;
        }
        const msg =
          err instanceof Error
            ? err.message
            : "Batch queue stopped due to error";
        setError(msg);
        toast.error(msg);
      } finally {
        if (!isPausedRef.current) {
          setIsRunning(false);
        }
      }
    },
    [
      lines,
      scriptText,
      promptsText,
      projectId,
      topicTitle,
      selectedModel,
      onPromptsChange,
    ],
  );

  const handlePauseQueue = useCallback(() => {
    isPausedRef.current = true;
    setIsPaused(true);
    abortControllerRef.current?.abort();
    sound.playNotification();
    toast.info("Prompt queue paused.");
  }, []);

  const handleStopQueue = useCallback(() => {
    isStoppedRef.current = true;
    isPausedRef.current = false;
    abortControllerRef.current?.abort();
    setIsRunning(false);
    setIsPaused(false);
    setFailedBatchIndex(null);
    sound.playNotification();
    toast.info("Batch generation stopped. Existing prompts preserved.");
  }, []);

  const handleResumeQueue = useCallback(
    (fromIndex: number) => {
      isPausedRef.current = false;
      isStoppedRef.current = false;
      setIsPaused(false);
      startBatchQueue(fromIndex);
    },
    [startBatchQueue],
  );

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
    sound.playNotification();
    toast.success("Image prompts copied to clipboard!");
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
    sound.playNotification();
    toast.success("Prompts downloaded as text file!");
  };

  const currentPercent =
    totalBatches > 0 ? Math.round((currentBatch / totalBatches) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Intro & Batch Controls */}
      <Stage3BatchControl
        isRunning={isRunning}
        isPaused={isPaused}
        linesCount={lines.length}
        promptsExist={!!promptsText}
        currentBatch={currentBatch}
        totalBatches={totalBatches}
        currentPercent={currentPercent}
        timestampInput={timestampInput}
        onTimestampChange={onTimestampChange}
        onStartQueue={() => startBatchQueue(0)}
        onPauseQueue={handlePauseQueue}
        onStopQueue={handleStopQueue}
        onResumeQueue={handleResumeQueue}
        failedBatchIndex={failedBatchIndex}
        onRecalculateTimestamps={handleRecalculateTimestamps}
        estimatedRuntime={timingStats.formattedRuntime}
        error={error}
      />

      {/* Orchestrator Logs */}
      {logs.length > 0 && (
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-400 space-y-1">
          <span className="text-xs font-semibold text-[#8A3FFC] dark:text-[#58E6F7]">
            Batch Generation Log:
          </span>
          {logs.map((log, i) => (
            <p key={i} className="text-slate-700 dark:text-slate-300">
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
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          Next: Automatically transfers prompt & script context to Stage 4 for
          viral YouTube packaging.
        </p>

        <button
          onClick={onProceedToStage4}
          disabled={isRunning || !promptsText.trim()}
          className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-xs shadow-md transition-all w-full sm:w-auto shrink-0 ${
            isRunning || !promptsText.trim()
              ? "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-200 dark:border-slate-700/50 opacity-60"
              : "bg-linear-to-r from-[#E51FD1] via-[#FF1688] to-[#FF7A32] hover:brightness-110 text-white shadow-md shadow-[#FF1688]/25 hover:scale-102 cursor-pointer font-bold"
          }`}
        >
          {isRunning ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#58E6F7]" />
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
