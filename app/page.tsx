import { Loader2 } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { StudioClient } from "@/components/studio";

export const metadata: Metadata = {
  title: "FrameFlow Studio — Imagine. Generate. Create.",
  description:
    "From Idea to Video, All in One Flow. End-to-end 4-stage pipeline for viral YouTube stickman documentaries: algorithmic topic prioritization, 90-char narration scriptwriter, batch Flux prompts, and viral packaging.",
};

export default function StudioPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-xs gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
          <span>Initializing FrameFlow Studio...</span>
        </div>
      }
    >
      <StudioClient />
    </Suspense>
  );
}
