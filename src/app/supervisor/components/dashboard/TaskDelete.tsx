"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import type { Task } from "@/types/task";

interface TaskDeleteDialogProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: (taskId: string) => void;
}

export function TaskDeleteDialog({
  task,
  isOpen,
  onClose,
  onConfirmDelete,
}: TaskDeleteDialogProps) {
  if (!task) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="w-[420px] bg-white rounded-2xl shadow border border-slate-200 flex flex-col min-h-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-10 pt-12 pb-4 flex flex-col items-center">
          <Trash className="h-10 w-10 text-red-600 mb-4" />
          <DialogTitle className="text-lg font-semibold text-center">
            ¿Estás seguro que quieres eliminar esta tarea?
          </DialogTitle>
          <DialogDescription className="text-center mt-2">
            <span className="text-slate-700 font-normal">
              Al confirmar, la tarea
            </span>{" "}
            <span className="text-slate-900 font-medium underline">
              {task.title}
            </span>{" "}
            <span className="text-slate-700 font-normal">
              será eliminada permanentemente. Esta acción no se puede deshacer.
            </span>
          </DialogDescription>
        </div>
        <DialogFooter className="flex flex-col gap-2 w-full items-center justify-center">
          <Button variant="secondary" onClick={onClose} className="w-1/2">
            Cancelar
          </Button>
          <Button
            onClick={() => onConfirmDelete(task.id)}
            className="w-1/2 bg-red-600 hover:bg-red-700 text-white"
          >
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
