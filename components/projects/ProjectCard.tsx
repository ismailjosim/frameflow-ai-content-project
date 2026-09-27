"use client";

import { ArrowUpRight, Clock, Trash2 } from "lucide-react";
import Link from "next/link";
import type { ProjectCardProps } from "./projects.types";

export function ProjectCard({ project, onDelete }: ProjectCardProps) {
  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 group">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-linear-to-r from-purple-950/80 to-pink-950/80 text-pink-300 border border-pink-500/30">
            Stage {project.currentStage} of 4
          </span>
          <button
            onClick={() => onDelete(project._id)}
            className="text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
            title="Delete Project"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <h3 className="text-sm font-bold text-white group-hover:text-[#58E6F7] transition-colors line-clamp-2">
          {project.title}
        </h3>

        <p className="text-[11px] font-mono text-slate-500 truncate">
          /{project.topicSlug}
        </p>
      </div>

      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 text-slate-400 text-[11px]">
          <Clock className="w-3 h-3" />
          <span suppressHydrationWarning>
            {new Date(project.updatedAt).toLocaleDateString()}
          </span>
        </div>

        <Link
          href={`/?projectId=${project._id}`}
          className="flex items-center gap-1 text-xs font-semibold text-[#58E6F7] hover:text-[#E51FD1] group-hover:translate-x-0.5 transition-all"
        >
          <span>Open Studio</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
