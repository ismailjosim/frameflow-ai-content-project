"use client";

import { Film, FolderKanban, Loader2, Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { CreateProjectModal } from "./CreateProjectModal";
import { ProjectCard } from "./ProjectCard";
import type { ProjectItem } from "./projects.types";

export function ProjectsClient() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (data.success && Array.isArray(data.projects)) {
        setProjects(data.projects);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        if (!ignore && data.success && Array.isArray(data.projects)) {
          setProjects(data.projects);
        }
      } catch {
        // ignore
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, []);

  const deleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await fetch(`/api/projects/${id}`, { method: "DELETE" });
      await fetchProjects();
    } catch {
      // ignore
    }
  };

  return (
    <DashboardLayout pageTitle="Project Library">
      <div className="space-y-6">
        {/* Header */}
        <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
              <FolderKanban className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Project Library
              </h1>
              <p className="text-xs text-slate-400">
                All your video scripts, auto-chunked image prompts, and
                packaging preserved in MongoDB.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-linear-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-medium text-xs shadow-md shadow-cyan-500/20 transition-all hover:scale-101 cursor-pointer w-full sm:w-auto shrink-0"
          >
            <Plus className="w-4 h-4" />
            New Video Project
          </button>
        </div>

        {/* Modal: New Project */}
        <CreateProjectModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={fetchProjects}
        />

        {/* Projects Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400 text-xs gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
            Loading video projects from MongoDB...
          </div>
        ) : projects.length === 0 ? (
          <div className="glass-panel p-12 rounded-2xl border border-slate-800 text-center space-y-3">
            <Film className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-sm font-bold text-white">No Projects Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Start your first video production workflow to generate full
              scripts, batch Midjourney prompts, and packaging.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium mt-2 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Create First Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((proj) => (
              <ProjectCard
                key={proj._id}
                project={proj}
                onDelete={deleteProject}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default ProjectsClient;
