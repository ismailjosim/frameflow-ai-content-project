import { Loader2 } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { StudioClient } from "@/components/studio";

export const metadata: Metadata = {
  title: "Studio Pipeline — FrameFlow",
  description:
    "End-to-end 4-stage AI pipeline for viral YouTube stickman documentaries: algorithmic topic prioritization, 90-char narration scriptwriter, batch Flux prompts, and viral packaging.",
};

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center text-xs gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-[#58E6F7]" />
          <span>Initializing FrameFlow Studio...</span>
        </div>
      }
    >
      <StudioClient />
    </Suspense>
  );
}
