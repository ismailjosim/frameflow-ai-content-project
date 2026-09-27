"use client";

import {
  Check,
  Copy,
  FileCheck,
  Hash,
  Image as ImageIcon,
  Tag,
} from "lucide-react";
import type { PackagingCardsProps } from "./stage4.types";

export function PackagingCards({
  topicTitle,
  parsedPackaging,
  copiedField,
  onCopyText,
}: PackagingCardsProps) {
  return (
    <div className="space-y-4">
      {/* 1. Viral Title */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-300 flex items-center gap-1.5">
            <FileCheck className="w-3.5 h-3.5 text-cyan-400" />
            1. Viral Video Title
          </span>
          <button
            onClick={() =>
              onCopyText(parsedPackaging.viralTitle || topicTitle, "title")
            }
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200"
          >
            {copiedField === "title" ? (
              <Check className="w-3 h-3 text-emerald-400" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
            {copiedField === "title" ? "Copied" : "Copy Title"}
          </button>
        </div>
        <p className="text-sm font-bold text-white bg-slate-950/60 p-3 rounded-xl border border-slate-800">
          {parsedPackaging.viralTitle || topicTitle}
        </p>
      </div>

      {/* 2. Thumbnail Prompt */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-300 flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-purple-400" />
            2. Thumbnail Prompt (Midjourney / Flux)
          </span>
          <button
            onClick={() =>
              onCopyText(parsedPackaging.thumbnailPrompt || "", "thumbnail")
            }
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200"
          >
            {copiedField === "thumbnail" ? (
              <Check className="w-3 h-3 text-emerald-400" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
            {copiedField === "thumbnail" ? "Copied" : "Copy Prompt"}
          </button>
        </div>
        <p className="text-xs font-mono text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800 leading-relaxed select-all">
          {parsedPackaging.thumbnailPrompt ||
            "Thumbnail prompt will appear here..."}
        </p>
      </div>

      {/* 3. Description */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-300">
            3. YouTube Description (Curiosity Hook + Mechanism)
          </span>
          <button
            onClick={() =>
              onCopyText(parsedPackaging.description || "", "description")
            }
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200"
          >
            {copiedField === "description" ? (
              <Check className="w-3 h-3 text-emerald-400" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
            {copiedField === "description" ? "Copied" : "Copy Description"}
          </button>
        </div>
        <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800 whitespace-pre-line leading-relaxed">
          {parsedPackaging.description || "Description will appear here..."}
        </p>
      </div>

      {/* 4. Hashtags & Tags */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-indigo-400" />
              4. Targeted Hashtags (15)
            </span>
            <button
              onClick={() =>
                onCopyText(parsedPackaging.hashtags || "", "hashtags")
              }
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200"
            >
              {copiedField === "hashtags" ? (
                <Check className="w-3 h-3 text-emerald-400" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
              {copiedField === "hashtags" ? "Copied" : "Copy"}
            </button>
          </div>
          <p className="text-xs font-mono text-cyan-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800 leading-relaxed select-all">
            {parsedPackaging.hashtags || "Hashtags will appear here..."}
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-amber-400" />
              5. SEO Tags (35 Comma-Separated)
            </span>
            <button
              onClick={() => onCopyText(parsedPackaging.seoTags || "", "tags")}
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200"
            >
              {copiedField === "tags" ? (
                <Check className="w-3 h-3 text-emerald-400" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
              {copiedField === "tags" ? "Copied" : "Copy"}
            </button>
          </div>
          <p className="text-xs font-mono text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800 leading-relaxed select-all">
            {parsedPackaging.seoTags || "Tags will appear here..."}
          </p>
        </div>
      </div>
    </div>
  );
}
