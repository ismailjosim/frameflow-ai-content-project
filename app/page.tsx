import type { Metadata } from "next";
import { LandingPage } from "@/components/landing/LandingPage";

export const metadata: Metadata = {
  title: "FrameFlow — Imagine. Generate. Create. | AI Video Studio",
  description:
    "From Idea to Video, All in One Flow. End-to-end 4-stage pipeline for viral YouTube stickman documentaries: algorithmic topic exploration, 90-char narration scriptwriter, batch visual prompts, and 1-click ZIP export.",
};

export default function HomePage() {
  return <LandingPage />;
}
