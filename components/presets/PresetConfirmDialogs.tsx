"use client";

import { Sparkles, Star, Trash2 } from "lucide-react";
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
import type { Preset } from "./presets.types";

interface PresetConfirmDialogsProps {
  presetToMakeDefault: Preset | null;
  onCloseDefaultDialog: () => void;
  onConfirmSetDefault: () => void;
  isSettingDefault: boolean;

  presetToDelete: { id: string; name: string } | null;
  onCloseDeleteDialog: () => void;
  onConfirmDelete: () => void;
  isDeleting: boolean;
}

export function PresetConfirmDialogs({
  presetToMakeDefault,
  onCloseDefaultDialog,
  onConfirmSetDefault,
  isSettingDefault,
  presetToDelete,
  onCloseDeleteDialog,
  onConfirmDelete,
  isDeleting,
}: PresetConfirmDialogsProps) {
  return (
    <>
      {/* Set as Default Confirmation */}
      <AlertDialog
        open={!!presetToMakeDefault}
        onOpenChange={(open) => !open && onCloseDefaultDialog()}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <Sparkles className="w-4 h-4" />
              </div>
              <AlertDialogTitle>Set as Default Preset?</AlertDialogTitle>
            </div>
            <AlertDialogDescription>
              Would you like to set{" "}
              <span className="font-semibold text-slate-900 dark:text-white">
                &quot;{presetToMakeDefault?.name}&quot;
              </span>{" "}
              as your default style preset? All new video generation projects
              will automatically use this visual style foundation.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Preset Description
            </span>
            <p className="font-medium text-slate-800 dark:text-slate-200">
              {presetToMakeDefault?.description || "Custom Video Style"}
            </p>
            <span className="font-mono text-[10px] text-[#8A3FFC] dark:text-[#58E6F7] block">
              {presetToMakeDefault?.aspectRatio}
            </span>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={onCloseDefaultDialog}>
              Just View Preset
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirmSetDefault}
              disabled={isSettingDefault}
            >
              <Star className="w-3.5 h-3.5 mr-1 fill-current" />
              {isSettingDefault
                ? "Setting Default..."
                : "Confirm & Set Default"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Preset Confirmation */}
      <AlertDialog
        open={!!presetToDelete}
        onOpenChange={(open) => !open && onCloseDeleteDialog()}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                <Trash2 className="w-4 h-4" />
              </div>
              <AlertDialogTitle>Delete Style Preset?</AlertDialogTitle>
            </div>
            <AlertDialogDescription>
              Are you sure you want to delete preset{" "}
              <span className="font-semibold text-slate-900 dark:text-white">
                &quot;{presetToDelete?.name}&quot;
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={onCloseDeleteDialog}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirmDelete}
              disabled={isDeleting}
              className="bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/30"
            >
              {isDeleting ? "Deleting..." : "Delete Preset"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
