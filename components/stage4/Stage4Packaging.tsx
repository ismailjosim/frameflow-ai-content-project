"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import GenerationSkeleton from "@/components/GenerationSkeleton";
import { sound } from "@/lib/sound";
import { PackagingActions } from "./PackagingActions";
import { PackagingCards } from "./PackagingCards";
import { Stage4Header } from "./Stage4Header";
import type { Stage4PackagingProps } from "./stage4.types";
import { ThumbnailCanvasStudio } from "./ThumbnailCanvasStudio";

export function Stage4Packaging({
  projectId,
  topicTitle,
  scriptSummary,
  selectedModel,
  packagingText,
  parsedPackaging = {},
  onPackagingChange,
  scriptText,
  promptsText,
  timestampInput,
  autoStart = false,
}: Stage4PackagingProps) {
  const [loading, setLoading] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [modelUsed, setModelUsed] = useState<string>("");
  const abortControllerRef = useRef<AbortController | null>(null);

  const generatePackaging = useCallback(async () => {
    if (!topicTitle) {
      setError("Please select or specify a topic in Stage 1.");
      toast.error("Please select or specify a topic in Stage 1.");
      return;
    }

    setLoading(true);
    setError(null);
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const res = await fetch("/api/generate/stage4", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          projectId,
          topicTitle,
          scriptSummary: scriptSummary || topicTitle,
          model: selectedModel,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to generate packaging");
      }

      onPackagingChange(data.packagingText || "", data.parsedPackaging || {});
      setModelUsed(data.modelUsed || selectedModel);
      if (data.logs) setLogs(data.logs);
      sound.playTaskSuccess();
      toast.success("Viral YouTube SEO & Packaging generated successfully!");
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
  }, [projectId, topicTitle, scriptSummary, selectedModel, onPackagingChange]);

  const handleStopPackaging = useCallback(() => {
    abortControllerRef.current?.abort();
    setLoading(false);
    sound.playNotification();
    toast.info("Packaging generation stopped.");
  }, []);

  useEffect(() => {
    if (autoStart && !packagingText && topicTitle && !loading) {
      const timer = setTimeout(() => {
        generatePackaging();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [autoStart, topicTitle, packagingText, loading, generatePackaging]);

  const copyText = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    sound.playNotification();
    toast.success(`${fieldName} copied to clipboard!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const downloadPackagingTxt = () => {
    const slug = topicTitle
      ? topicTitle
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "_")
          .slice(0, 30)
      : "packaging";
    const blob = new Blob([packagingText], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `packaging_${slug}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    sound.playNotification();
    toast.success("Packaging metadata downloaded as text file!");
  };

  const downloadAllAssets = async () => {
    setIsZipping(true);
    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();

      const slug = topicTitle
        ? topicTitle
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "_")
            .slice(0, 35)
        : "production";

      const folderName = `video_bundle_${slug}`;
      const folder = zip.folder(folderName) || zip;

      // 1. Narration Script (Stage 2)
      if (scriptText?.trim()) {
        folder.file("01_narration_script.txt", scriptText.trim());
      }

      // 2. Chronological Timestamped Script (Stage 3 Input)
      if (timestampInput?.trim()) {
        folder.file("02_timestamped_script.txt", timestampInput.trim());
      }

      // 3. Image Prompts for Midjourney / Flux (Stage 3 Output)
      if (promptsText?.trim()) {
        folder.file("03_image_prompts.txt", promptsText.trim());
      }

      // 4. Packaging and YouTube SEO (Stage 4)
      if (packagingText?.trim()) {
        folder.file("04_youtube_packaging.txt", packagingText.trim());
      }

      // 5. Structured Metadata JSON
      const metadata = {
        projectTitle: topicTitle,
        exportedAt: new Date().toISOString(),
        packaging: parsedPackaging || {},
      };
      folder.file("metadata.json", JSON.stringify(metadata, null, 2));

      // 6. Production README
      const readme = `FRAMEFLOW STUDIO — Imagine. Generate. Create.
From Idea to Video, All in One Flow.
===================================================
Project: ${topicTitle || "Untitled Video"}
Exported: ${new Date().toLocaleString()}

FILES IN THIS BUNDLE:
- 01_narration_script.txt: Caption-ready voiceover script (one sentence per line, ready for ElevenLabs TTS).
- 02_timestamped_script.txt: Sequential scene timestamps [MM:SS] with pacing pauses.
- 03_image_prompts.txt: Complete Midjourney / Flux 2D doodle prompts with exact scene timestamps.
- 04_youtube_packaging.txt: Viral titles, thumbnail prompt, video description, SEO tags, and hashtags.
- metadata.json: Machine-readable JSON metadata for automation scripts.
`;
      folder.file("README.txt", readme);

      const blob = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: { level: 6 },
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `video_bundle_${slug}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      sound.playTaskSuccess();
      toast.success("Complete video production bundle ZIP downloaded!");
    } catch (err) {
      console.error("Failed to generate zip bundle:", err);
      setError("Failed to create ZIP bundle. Please try again.");
      toast.error("Failed to create ZIP bundle.");
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stage Header & Retry Controls */}
      <Stage4Header
        loading={loading}
        packagingText={packagingText}
        modelUsed={modelUsed}
        error={error}
        onGenerate={generatePackaging}
        onStop={handleStopPackaging}
      />

      {/* Failover Logs */}
      {logs.length > 1 && (
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-400 space-y-1">
          <span className="text-xs font-semibold text-[#8A3FFC] dark:text-[#58E6F7]">
            Packaging Orchestrator Trace:
          </span>
          {logs.map((log, i) => (
            <p key={i} className="text-slate-700 dark:text-slate-300">
              ↳ {log}
            </p>
          ))}
        </div>
      )}

      {/* Interactive Loading Skeleton while generating */}
      {loading && <GenerationSkeleton stage="packaging" />}

      {/* Interactive 16:9 Thumbnail Canvas Studio & Mobile Feed Simulator */}
      {!loading && topicTitle && (
        <ThumbnailCanvasStudio
          topicTitle={topicTitle}
          thumbnailPrompt={parsedPackaging?.thumbnailPrompt}
          viralTitle={parsedPackaging?.viralTitle}
        />
      )}

      {/* Packaging Cards & Actions */}
      {!loading && packagingText && (
        <div className="space-y-6">
          <PackagingCards
            topicTitle={topicTitle}
            parsedPackaging={parsedPackaging}
            copiedField={copiedField}
            onCopyText={copyText}
            timestampInput={timestampInput}
          />

          <PackagingActions
            loading={loading}
            isZipping={isZipping}
            packagingText={packagingText}
            onDownloadPackaging={downloadPackagingTxt}
            onDownloadAllAssets={downloadAllAssets}
          />
        </div>
      )}
    </div>
  );
}

export default Stage4Packaging;
