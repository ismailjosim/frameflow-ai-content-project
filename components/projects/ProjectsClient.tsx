"use client";

import { Film, FolderKanban, Loader2, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { sound } from "@/lib/sound";
import { CreateProjectModal } from "./CreateProjectModal";
import { ProjectCard } from "./ProjectCard";
import type { ProjectItem } from "./projects.types";

export function ProjectsClient() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<ProjectItem | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/projects/${projectToDelete._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        sound.playNotification();
        toast.success(`Project "${projectToDelete.title}" deleted.`);
        await fetchProjects();
        setProjectToDelete(null);
      } else {
        toast.error(data.error || "Failed to delete project");
      }
    } catch {
      toast.error("Network error deleting project");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DashboardLayout pageTitle="Project Library">
      <div className="space-y-6">
        {/* Header */}
        <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 dark:bg-slate-900/60 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-linear-to-br from-[#58E6F7]/20 to-[#8A3FFC]/30 text-[#8A3FFC] dark:text-[#58E6F7] border border-[#58E6F7]/40 shrink-0">
              <FolderKanban className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Project Library
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                All your video scripts, auto-chunked image prompts, and
                packaging securely saved in your project library.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-linear-to-r from-[#58E6F7] via-[#8A3FFC] to-[#E51FD1] hover:brightness-110 text-white font-bold text-xs shadow-lg shadow-[#8A3FFC]/25 transition-all hover:scale-101 cursor-pointer w-full sm:w-auto shrink-0"
          >
            <Plus className="w-4 h-4" />
            New Video Project
          </button>
        </div>

        {/* Modal: New Project */}
        <CreateProjectModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            sound.playStepComplete();
            toast.success("New video project created!");
            fetchProjects();
          }}
        />

        {/* Shadcn AlertDialog: Confirm Delete Project */}
        <AlertDialog
          open={!!projectToDelete}
          onOpenChange={(open) => !open && setProjectToDelete(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <div className="flex items-center gap-2 mb-1">
                <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                  <Trash2 className="w-4 h-4" />
                </div>
                <AlertDialogTitle>Delete Video Project?</AlertDialogTitle>
              </div>
              <AlertDialogDescription>
                Are you sure you want to permanently delete{" "}
                <span className="font-semibold text-slate-900 dark:text-white">
                  &quot;{projectToDelete?.title}&quot;
                </span>
                ? All generated scripts, prompts, and packaging data for this
                project will be removed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setProjectToDelete(null)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/30"
              >
                {isDeleting ? "Deleting..." : "Delete Project"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Projects Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-500 dark:text-slate-400 text-xs gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#8A3FFC] dark:text-[#58E6F7]" />
            Loading your video projects...
          </div>
        ) : projects.length === 0 ? (
          <div className="glass-panel p-12 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-3 bg-white/80 dark:bg-slate-900/60">
            <Film className="w-10 h-10 text-slate-400 dark:text-slate-600 mx-auto" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              No Projects Found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Start your first video production workflow to generate full
              scripts, batch Midjourney prompts, and packaging.
            </p>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-linear-to-r from-[#58E6F7] via-[#8A3FFC] to-[#E51FD1] hover:brightness-110 text-white font-bold text-xs shadow-md shadow-[#8A3FFC]/25 mt-2 cursor-pointer"
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
                onDelete={(id) => {
                  const target = projects.find((p) => p._id === id) || proj;
                  setProjectToDelete(target);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default ProjectsClient;
