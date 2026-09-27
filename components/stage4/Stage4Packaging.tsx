"use client";

import { AlertCircle, Loader2, Sparkles } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import GenerationSkeleton from "@/components/GenerationSkeleton";
import { PackagingActions } from "./PackagingActions";
import { PackagingCards } from "./PackagingCards";
import type { Stage4PackagingProps } from "./stage4.types";

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

  const generatePackaging = useCallback(async () => {
    if (!topicTitle) {
      setError("Please select or specify a topic in Stage 1.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate/stage4", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown generation error");
    } finally {
      setLoading(false);
    }
  }, [projectId, topicTitle, scriptSummary, selectedModel, onPackagingChange]);

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
    } catch (err) {
      console.error("Failed to generate zip bundle:", err);
      setError("Failed to create ZIP bundle. Please try again.");
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stage Header */}
      <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-linear-to-br from-[#FF1688]/20 to-[#FFC13B]/30 text-[#FFC13B] font-bold text-xs flex items-center justify-center border border-[#FFC13B]/40">
                4
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Stage 4: Viral Packaging & YouTube SEO
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              High-CTR title hooks, Midjourney/Flux thumbnail prompt,
              hook-optimized description, and targeted tags.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={generatePackaging}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-[#FF1688] via-[#FF4E63] to-[#FFC13B] hover:brightness-110 text-slate-950 font-bold text-xs shadow-lg shadow-[#FF1688]/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0 w-full sm:w-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Generating Packaging...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  {packagingText
                    ? "Regenerate Packaging"
                    : "Generate Full Packaging"}
                </>
              )}
            </button>
          </div>
        </div>

        {modelUsed && (
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span>Model used:</span>
            <span className="font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
              {modelUsed}
            </span>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            <p>{error}</p>
          </div>
        )}
      </div>

      {/* Failover Logs */}
      {logs.length > 1 && (
        <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
          <span className="text-xs font-semibold text-cyan-400">
            Packaging Orchestrator Trace:
          </span>
          {logs.map((log, i) => (
            <p key={i} className="text-slate-300">
              ↳ {log}
            </p>
          ))}
        </div>
      )}

      {/* Interactive Loading Skeleton while generating */}
      {loading && <GenerationSkeleton stage="packaging" />}

      {/* Packaging Cards & Actions */}
      {!loading && packagingText && (
        <div className="space-y-4">
          <PackagingCards
            topicTitle={topicTitle}
            parsedPackaging={parsedPackaging}
            copiedField={copiedField}
            onCopyText={copyText}
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
