import { Loader2 } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { PresetsClient } from "@/components/presets";

export const metadata: Metadata = {
  title: "Master Prompt & Visual Styles - FrameFlow",
  description:
    "Manage and configure visual art style presets including 2D doodle stickman, 3D Pixar animation, and 2.5D cinematic styles.",
};

export default function PresetsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center text-xs gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-[#8A3FFC]" />
          <span>Loading Visual Style Presets...</span>
        </div>
      }
    >
      <PresetsClient />
    </Suspense>
  );
}
