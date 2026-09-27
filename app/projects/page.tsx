import { Loader2 } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { ProjectsClient } from "@/components/projects";

export const metadata: Metadata = {
  title: "Project Library - FrameFlow",
  description:
    "View and manage your video production projects, scripts, image prompt queues, and viral packaging.",
};

export default function ProjectsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-xs gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
          <span>Loading Project Library...</span>
        </div>
      }
    >
      <ProjectsClient />
    </Suspense>
  );
}
