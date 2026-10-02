"use client";

import {
  Check,
  Copy,
  Download,
  Layers,
  Palette,
  Smartphone,
  Sparkles,
  Type,
  Upload,
} from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { sound } from "@/lib/sound";

interface ThumbnailCanvasStudioProps {
  topicTitle: string;
  thumbnailPrompt?: string;
  viralTitle?: string;
}

type BackgroundTheme = "volcanic" | "ice" | "noir" | "cosmic" | "toxic";
type CharacterPose = "shocked" | "hunter" | "shivering" | "none";
type TextPosition = "top" | "center" | "bottom-left" | "bottom-center";

export function ThumbnailCanvasStudio({
  topicTitle,
  thumbnailPrompt,
  viralTitle,
}: ThumbnailCanvasStudioProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Suggested default hook from title or prompt
  const initialHook = React.useMemo(() => {
    if (thumbnailPrompt) {
      const match = thumbnailPrompt.match(/"([^"]+)"/);
      if (match && match[1].length < 25) return match[1].toUpperCase();
    }
    const words = (viralTitle || topicTitle || "FATAL MISTAKE")
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .trim()
      .split(/\s+/);
    if (words.length >= 3) {
      return `${words[0]} ${words[1]} ${words[2]}`.toUpperCase();
    }
    return "WHY THEY DIED";
  }, [topicTitle, thumbnailPrompt, viralTitle]);

  const [customHookText, setCustomHookText] = useState<string | null>(null);
  const hookText = customHookText !== null ? customHookText : initialHook;
  const [badgeText, setBadgeText] = useState("FATAL MISTAKE");
  const [theme, setTheme] = useState<BackgroundTheme>("volcanic");
  const [pose, setPose] = useState<CharacterPose>("shocked");
  const [textColor, setTextColor] = useState<string>("#FFE600"); // High-CTR YouTube Yellow
  const [textPosition, setTextPosition] = useState<TextPosition>("bottom-left");
  const [viewMode, setViewMode] = useState<"studio" | "mobile">("studio");
  const [uploadedImage, setUploadedImage] = useState<HTMLImageElement | null>(
    null,
  );
  const [isCopied, setIsCopied] = useState(false);

  // Main canvas render function
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = 1280;
    const height = 720;
    canvas.width = width;
    canvas.height = height;

    // 1. Draw Background
    if (uploadedImage) {
      // Draw uploaded image covering canvas
      const hRatio = width / uploadedImage.width;
      const vRatio = height / uploadedImage.height;
      const ratio = Math.max(hRatio, vRatio);
      const centerShiftX = (width - uploadedImage.width * ratio) / 2;
      const centerShiftY = (height - uploadedImage.height * ratio) / 2;
      ctx.drawImage(
        uploadedImage,
        0,
        0,
        uploadedImage.width,
        uploadedImage.height,
        centerShiftX,
        centerShiftY,
        uploadedImage.width * ratio,
        uploadedImage.height * ratio,
      );
    } else {
      // Draw themed gradient
      const grad = ctx.createRadialGradient(
        width * 0.65,
        height * 0.45,
        50,
        width * 0.5,
        height * 0.5,
        width * 0.75,
      );

      if (theme === "volcanic") {
        grad.addColorStop(0, "#FF4D00");
        grad.addColorStop(0.35, "#7A0000");
        grad.addColorStop(0.7, "#240003");
        grad.addColorStop(1, "#080203");
      } else if (theme === "ice") {
        grad.addColorStop(0, "#00E5FF");
        grad.addColorStop(0.35, "#004B87");
        grad.addColorStop(0.7, "#03152B");
        grad.addColorStop(1, "#020712");
      } else if (theme === "noir") {
        grad.addColorStop(0, "#D4AF37");
        grad.addColorStop(0.35, "#4A3B12");
        grad.addColorStop(0.7, "#171512");
        grad.addColorStop(1, "#070707");
      } else if (theme === "cosmic") {
        grad.addColorStop(0, "#D946EF");
        grad.addColorStop(0.35, "#581C87");
        grad.addColorStop(0.7, "#1E0938");
        grad.addColorStop(1, "#080210");
      } else if (theme === "toxic") {
        grad.addColorStop(0, "#10B981");
        grad.addColorStop(0.35, "#064E3B");
        grad.addColorStop(0.7, "#022219");
        grad.addColorStop(1, "#010A07");
      }

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Atmospheric particles / dust
      ctx.save();
      ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
      for (let i = 0; i < 60; i++) {
        const x = (i * 137.5) % width;
        const y = (i * 229.3) % height;
        const radius = (i % 4) + 1.5;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // 2. Character Silhouette / Stickman (Only if not using full custom art or if selected)
    if (pose !== "none") {
      ctx.save();
      const charX = width * 0.72;
      const charY = height * 0.55;

      // Glow behind character
      const glowGrad = ctx.createRadialGradient(
        charX,
        charY,
        30,
        charX,
        charY,
        280,
      );
      glowGrad.addColorStop(0, "rgba(255, 255, 255, 0.3)");
      glowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = glowGrad;
      ctx.fillRect(charX - 300, charY - 300, 600, 600);

      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      if (pose === "shocked") {
        // Stickman with hands on face
        // Head
        ctx.lineWidth = 14;
        ctx.strokeStyle = "#FFFFFF";
        ctx.fillStyle = "#111827";
        ctx.beginPath();
        ctx.arc(charX, charY - 140, 75, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Wide shocked eyes
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.arc(charX - 25, charY - 150, 16, 0, Math.PI * 2);
        ctx.arc(charX + 25, charY - 150, 16, 0, Math.PI * 2);
        ctx.fill();

        // Shocked O mouth
        ctx.beginPath();
        ctx.ellipse(charX, charY - 110, 18, 26, 0, 0, Math.PI * 2);
        ctx.fill();

        // Hands grasping cheeks
        ctx.beginPath();
        ctx.moveTo(charX - 90, charY - 70);
        ctx.lineTo(charX - 60, charY - 130);
        ctx.moveTo(charX + 90, charY - 70);
        ctx.lineTo(charX + 60, charY - 130);
        ctx.stroke();

        // Body
        ctx.beginPath();
        ctx.moveTo(charX, charY - 65);
        ctx.lineTo(charX, charY + 120);
        ctx.stroke();

        // Legs
        ctx.beginPath();
        ctx.moveTo(charX, charY + 120);
        ctx.lineTo(charX - 55, charY + 230);
        ctx.moveTo(charX, charY + 120);
        ctx.lineTo(charX + 55, charY + 230);
        ctx.stroke();
      } else if (pose === "hunter") {
        // Hunter holding spear
        // Head
        ctx.lineWidth = 14;
        ctx.strokeStyle = "#FFFFFF";
        ctx.fillStyle = "#111827";
        ctx.beginPath();
        ctx.arc(charX, charY - 140, 75, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Intense eyes
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.arc(charX - 20, charY - 145, 14, 0, Math.PI * 2);
        ctx.arc(charX + 25, charY - 145, 14, 0, Math.PI * 2);
        ctx.fill();

        // Torso with fur hide cape
        ctx.beginPath();
        ctx.moveTo(charX, charY - 65);
        ctx.lineTo(charX, charY + 120);
        ctx.stroke();

        // Spear
        ctx.strokeStyle = "#D97706";
        ctx.lineWidth = 12;
        ctx.beginPath();
        ctx.moveTo(charX - 110, charY - 220);
        ctx.lineTo(charX + 60, charY + 240);
        ctx.stroke();

        // Spear Tip (Flint Stone)
        ctx.fillStyle = "#E5E7EB";
        ctx.beginPath();
        ctx.moveTo(charX - 110, charY - 220);
        ctx.lineTo(charX - 140, charY - 200);
        ctx.lineTo(charX - 130, charY - 250);
        ctx.closePath();
        ctx.fill();

        // Arms holding spear
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 14;
        ctx.beginPath();
        ctx.moveTo(charX, charY - 30);
        ctx.lineTo(charX - 70, charY - 120);
        ctx.moveTo(charX, charY - 30);
        ctx.lineTo(charX - 10, charY + 40);
        ctx.stroke();

        // Legs
        ctx.beginPath();
        ctx.moveTo(charX, charY + 120);
        ctx.lineTo(charX - 60, charY + 230);
        ctx.moveTo(charX, charY + 120);
        ctx.lineTo(charX + 70, charY + 230);
        ctx.stroke();
      } else if (pose === "shivering") {
        // Shivering in cold fur wrap
        ctx.lineWidth = 14;
        ctx.strokeStyle = "#E0F2FE";
        ctx.fillStyle = "#0C4A6E";
        ctx.beginPath();
        ctx.arc(charX, charY - 140, 75, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Shivering teeth / eyes
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.arc(charX - 22, charY - 145, 12, 0, Math.PI * 2);
        ctx.arc(charX + 22, charY - 145, 12, 0, Math.PI * 2);
        ctx.fill();

        // Fur coat bulk body
        ctx.fillStyle = "rgba(224, 242, 254, 0.2)";
        ctx.beginPath();
        ctx.ellipse(charX, charY + 30, 95, 110, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Crossed shivering arms
        ctx.beginPath();
        ctx.moveTo(charX - 60, charY - 10);
        ctx.lineTo(charX + 60, charY + 30);
        ctx.moveTo(charX + 60, charY - 10);
        ctx.lineTo(charX - 60, charY + 30);
        ctx.stroke();

        // Legs
        ctx.beginPath();
        ctx.moveTo(charX - 30, charY + 140);
        ctx.lineTo(charX - 45, charY + 230);
        ctx.moveTo(charX + 30, charY + 140);
        ctx.lineTo(charX + 45, charY + 230);
        ctx.stroke();
      }

      ctx.restore();
    }

    // 3. Cinematic Vignette (Dark edges to maximize CTR contrast)
    const vignette = ctx.createRadialGradient(
      width / 2,
      height / 2,
      width * 0.35,
      width / 2,
      height / 2,
      width * 0.65,
    );
    vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
    vignette.addColorStop(1, "rgba(0, 0, 0, 0.75)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);

    // 4. Draw Attention Badge (Top-Left)
    if (badgeText.trim()) {
      ctx.save();
      const badgeX = 60;
      const badgeY = 60;
      ctx.font = "900 28px 'Impact', 'Arial Black', sans-serif";
      const badgeMetrics = ctx.measureText(badgeText.toUpperCase());
      const badgeWidth = badgeMetrics.width + 36;
      const badgeHeight = 52;

      // Glow & Shadow
      ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
      ctx.shadowBlur = 12;
      ctx.shadowOffsetX = 4;
      ctx.shadowOffsetY = 4;

      // Background pill
      ctx.fillStyle = "#E11D48"; // Rose-600 intense
      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 10);
      ctx.fill();

      // Border
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#FFFFFF";
      ctx.stroke();

      // Text
      ctx.shadowColor = "transparent";
      ctx.fillStyle = "#FFFFFF";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(
        badgeText.toUpperCase(),
        badgeX + 18,
        badgeY + badgeHeight / 2 + 2,
      );
      ctx.restore();
    }

    // 5. Draw High-Impact Viral Hook Text
    if (hookText.trim()) {
      ctx.save();
      const textToRender = hookText.toUpperCase();
      ctx.font = "900 88px 'Impact', 'Arial Black', sans-serif";
      ctx.textAlign = "left";
      ctx.textBaseline = "bottom";

      let textX = 60;
      let textY = height - 70;

      if (textPosition === "top") {
        textY = 220;
      } else if (textPosition === "center") {
        textY = height / 2 + 40;
      } else if (textPosition === "bottom-center") {
        ctx.textAlign = "center";
        textX = width / 2;
        textY = height - 60;
      }

      // Multi-line support if text contains newline or is very long
      const words = textToRender.split(" ");
      const lines: string[] = [];
      let currentLine = "";

      for (const w of words) {
        const testLine = currentLine ? `${currentLine} ${w}` : w;
        const metrics = ctx.measureText(testLine);
        if (metrics.width > 700 && currentLine) {
          lines.push(currentLine);
          currentLine = w;
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) lines.push(currentLine);

      // Render lines from bottom up
      const lineHeight = 92;
      const startY = textY - (lines.length - 1) * lineHeight;

      lines.forEach((line, idx) => {
        const lineY = startY + idx * lineHeight;

        // Heavy dark drop shadow
        ctx.shadowColor = "#000000";
        ctx.shadowBlur = 24;
        ctx.shadowOffsetX = 8;
        ctx.shadowOffsetY = 8;

        // Heavy thick stroke outline (Essential for YouTube CTR)
        ctx.lineWidth = 22;
        ctx.lineJoin = "miter";
        ctx.miterLimit = 3;
        ctx.strokeStyle = "#000000";
        ctx.strokeText(line, textX, lineY);

        // Second inner dark stroke for depth
        ctx.lineWidth = 14;
        ctx.strokeStyle = "#0A0A0A";
        ctx.strokeText(line, textX, lineY);

        // Foreground vibrant fill
        ctx.fillStyle = textColor;
        ctx.fillText(line, textX, lineY);
      });

      ctx.restore();
    }
  }, [
    uploadedImage,
    theme,
    pose,
    badgeText,
    hookText,
    textColor,
    textPosition,
  ]);

  // Re-draw when dependencies change
  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Download high-res PNG
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    const slug = topicTitle
      ? topicTitle
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "_")
          .slice(0, 25)
      : "thumbnail";
    link.download = `thumbnail_${slug}.png`;
    link.href = dataUrl;
    link.click();
    sound.playTaskSuccess();
    toast.success("Thumbnail exported at 1280x720 PNG!");
  };

  // Copy thumbnail image to clipboard
  const handleCopyImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      canvas.toBlob(async (blob) => {
        if (!blob) throw new Error("Failed to create blob");
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        setIsCopied(true);
        sound.playNotification();
        toast.success("Thumbnail image copied to clipboard!");
        setTimeout(() => setIsCopied(false), 2000);
      });
    } catch {
      toast.error(
        "Clipboard copy not supported by your browser. Use download instead.",
      );
    }
  };

  // Image Upload Handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setUploadedImage(img);
        setPose("none"); // Disable vector stickman when custom art is uploaded
        sound.playNotification();
        toast.success("Custom background loaded into studio!");
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-5 bg-white/80 dark:bg-slate-900/60 transition-colors">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-linear-to-br from-[#FF4D00]/20 to-[#E11D48]/20 text-[#FF4D00] border border-[#FF4D00]/30">
            <Palette className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Viral 16:9 Thumbnail Studio</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-linear-to-r from-amber-500/20 to-rose-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-semibold">
                High-CTR Generator
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Instant 1280x720 canvas rendering with high-contrast font overlays
              and mobile feed simulation.
            </p>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700/60 shrink-0">
          <button
            type="button"
            onClick={() => setViewMode("studio")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              viewMode === "studio"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Studio Canvas</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("mobile")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              viewMode === "mobile"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>YouTube Mobile Feed</span>
          </button>
        </div>
      </div>

      {/* Main Preview Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Canvas / Mobile Feed */}
        <div className="lg:col-span-8 space-y-3">
          {viewMode === "studio" ? (
            <div className="relative group rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-black">
              <canvas
                ref={canvasRef}
                className="w-full h-auto aspect-video block"
              />
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-mono text-white/90">
                1280 x 720 • HD
              </div>
            </div>
          ) : (
            /* YouTube Mobile Feed Simulator */
            <div className="max-w-md mx-auto rounded-3xl p-3 bg-slate-900 border-4 border-slate-700 shadow-2xl space-y-3">
              <div className="flex items-center justify-between px-2 text-[11px] text-slate-400">
                <span>9:41</span>
                <span className="flex items-center gap-1">5G 100%</span>
              </div>

              {/* YouTube App Card */}
              <div className="bg-black rounded-2xl overflow-hidden border border-slate-800 space-y-2.5 pb-3">
                <div className="relative">
                  <canvas
                    ref={canvasRef}
                    className="w-full h-auto aspect-video block"
                  />
                  <span className="absolute bottom-2 right-2 bg-black/85 text-white font-mono text-[10px] font-bold px-1.5 py-0.5 rounded">
                    09:42
                  </span>
                </div>

                <div className="px-3 flex gap-2.5 items-start">
                  <div className="w-9 h-9 rounded-full bg-linear-to-tr from-rose-500 to-amber-500 text-white font-bold text-xs flex items-center justify-center shrink-0 border border-white/20">
                    AO
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white line-clamp-2 leading-tight">
                      {viralTitle ||
                        topicTitle ||
                        "The Lethal Survival Secret of Ancient Humans"}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Ancient Odyssey • 1.8M views • 3 days ago
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-center text-[10px] text-slate-400">
                📱 Simulated mobile YouTube feed preview. Evaluates text
                legibility on small screens.
              </p>
            </div>
          )}

          {/* Quick Action Bar Under Canvas */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#8A3FFC] hover:bg-[#7b32f0] text-white font-semibold text-xs transition-colors cursor-pointer shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download HD Thumbnail (.PNG)</span>
              </button>

              <button
                type="button"
                onClick={handleCopyImage}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium text-xs transition-colors cursor-pointer"
              >
                {isCopied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{isCopied ? "Copied" : "Copy Image"}</span>
              </button>
            </div>

            <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium text-xs cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Art / Background</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Right: Controls & Presets */}
        <div className="lg:col-span-4 space-y-4">
          {/* 1. Hook Text Control */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-[#8A3FFC]" />
              <span>High-Impact Hook Text (2-3 Words)</span>
            </label>
            <input
              type="text"
              value={hookText}
              onChange={(e) => setCustomHookText(e.target.value)}
              placeholder="e.g. FATAL MISTAKE"
              className="w-full bg-slate-50 dark:bg-slate-950/80 text-sm font-black uppercase text-slate-900 dark:text-white px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-[#8A3FFC]"
            />
          </div>

          {/* 2. Badge Text Control */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
              <span>Corner Attention Badge</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={badgeText}
                onChange={(e) => setBadgeText(e.target.value)}
                placeholder="e.g. FATAL MISTAKE"
                className="flex-1 bg-slate-50 dark:bg-slate-950/80 text-xs font-bold uppercase text-slate-900 dark:text-white px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-rose-500"
              />
              <button
                type="button"
                onClick={() => setBadgeText(badgeText ? "" : "FATAL MISTAKE")}
                className="px-2.5 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 cursor-pointer"
                title="Toggle Badge"
              >
                {badgeText ? "Clear" : "Add"}
              </button>
            </div>
          </div>

          {/* 3. Text Color & Position */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Text Color
              </label>
              <div className="flex items-center gap-1.5">
                {[
                  { name: "Yellow", color: "#FFE600" },
                  { name: "White", color: "#FFFFFF" },
                  { name: "Red", color: "#FF1E27" },
                  { name: "Cyan", color: "#00F5FF" },
                ].map((item) => (
                  <button
                    key={item.color}
                    type="button"
                    onClick={() => setTextColor(item.color)}
                    style={{ backgroundColor: item.color }}
                    className={`w-7 h-7 rounded-lg border-2 transition-all cursor-pointer ${
                      textColor === item.color
                        ? "border-slate-900 dark:border-white scale-110 shadow-xs"
                        : "border-transparent opacity-80 hover:opacity-100"
                    }`}
                    title={item.name}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Position
              </label>
              <select
                value={textPosition}
                onChange={(e) =>
                  setTextPosition(e.target.value as TextPosition)
                }
                className="w-full bg-slate-50 dark:bg-slate-950/80 text-xs text-slate-800 dark:text-slate-200 p-2 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-[#8A3FFC]"
              >
                <option value="bottom-left">Bottom-Left (Standard)</option>
                <option value="top">Top</option>
                <option value="center">Center</option>
                <option value="bottom-center">Bottom-Center</option>
              </select>
            </div>
          </div>

          {/* 4. Background Atmospheric Themes */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-600 dark:text-slate-400">
                Atmospheric Background
              </span>
              {uploadedImage && (
                <button
                  type="button"
                  onClick={() => setUploadedImage(null)}
                  className="text-[11px] text-rose-500 hover:underline cursor-pointer"
                >
                  Reset to theme
                </button>
              )}
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: "volcanic", label: "Volcanic" },
                { id: "ice", label: "Glacial Ice" },
                { id: "noir", label: "Ancient Gold" },
                { id: "cosmic", label: "Cosmic" },
                { id: "toxic", label: "Toxic Swamp" },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setTheme(t.id as BackgroundTheme);
                    setUploadedImage(null);
                  }}
                  className={`text-[11px] font-medium py-1.5 px-2 rounded-lg border transition-all cursor-pointer ${
                    theme === t.id && !uploadedImage
                      ? "bg-[#8A3FFC]/15 border-[#8A3FFC] text-[#8A3FFC] dark:text-[#58E6F7] font-bold"
                      : "bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Character Archetype / Pose */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 block">
              Character Silhouette
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: "shocked", label: "😱 Shocked Face" },
                { id: "hunter", label: "🏹 Hunter / Spear" },
                { id: "shivering", label: "🥶 Shivering Fur" },
                { id: "none", label: "🚫 Text-Only" },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPose(p.id as CharacterPose)}
                  className={`text-[11px] font-medium py-1.5 px-2 rounded-lg border text-left transition-all cursor-pointer ${
                    pose === p.id
                      ? "bg-[#8A3FFC]/15 border-[#8A3FFC] text-[#8A3FFC] dark:text-[#58E6F7] font-bold"
                      : "bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ThumbnailCanvasStudio;
