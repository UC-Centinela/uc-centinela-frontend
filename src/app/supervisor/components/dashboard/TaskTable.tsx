"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// import { FileText, FileSpreadsheet, Eye } from "lucide-react";
import { Eye } from "lucide-react";
import type { Task } from "@/types/task";
import type { User } from "@/types/user";
import { TaskDetailsDialog } from "./TaskDetails";

interface TaskTableProps {
  tasks: Task[];
  users: User[];
  onViewDetails: (task: Task) => void;
  onSaveChanges: (taskId: string, comment: string, newResponsibleId: number) => void
}

export function TaskTable({
  tasks: initialTasks,
  users,
  onSaveChanges
}: TaskTableProps) {
  // Estados para controlar el diálogo
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const renderStatusBadge = (state: Task["state"]) => {
    switch (state) {
      case "PENDING":
        return (
          <Badge className="bg-[#f59e0b] hover:bg-[#d97706]">Asignada</Badge>
        );
      case "IN_PROGRESS":
        return (
          <Badge className="bg-[#f59e0b] hover:bg-[#d97706]">Asignada</Badge>
        );
      case "COMPLETED":
        return (
          <Badge className="bg-[#3b82f6] hover:bg-[#2563eb]">En revisión</Badge>
        );
      case "REVIEWED":
        return (
          <Badge className="bg-[#10b981] hover:bg-[#059669]">Aprobada</Badge>
        );
      default:
        return (
          <Badge className="bg-[#6b7280] hover:bg-[#4b5563]">{state}</Badge>
        );
    }
  };

  const getUserName = (userId: number) => {
    const user = users.find((u) => {
      return String(u.id) === String(userId);
    });
    return user
      ? `${user.firstName} ${user.lastName}`
      : "Usuario no encontrado";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    return `${day}-${month}-${year}`;
  };

  const onViewDetails = (task: Task) => {
    setSelectedTask(task);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedTask(null);
  };

  // Función para obtener el responsable de la tarea
  const getTaskResponsible = (task: Task) => {
    return users.find(user => String(user.id) === String(task.creatorUserId)) || null;
  };

  const handleSaveChanges = (taskId: string, comment: string, newResponsibleId: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              comments: comment, // Actualiza el comentario
              creatorUserId: newResponsibleId, // Actualiza el responsable
            }
          : task
      )
    );
    // Actualizar selectedTask si está abierto
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask({
        ...selectedTask,
        comments: comment, // Actualiza el comentario
        creatorUserId: newResponsibleId, // Actualiza el responsable
      });
    }
    // Llamar callback externo si quieres persistir en backend
    onSaveChanges(taskId, comment, newResponsibleId);
    handleCloseDialog();
  }

  // const handleReassignResponsible = (taskId: string, newResponsibleId: number) => {
  //   setTasks((prevTasks) =>
  //     prevTasks.map((task) =>
  //       task.id === taskId
  //         ? { ...task, creatorUserId: newResponsibleId } // Actualiza el responsable
  //         : task
  //     )
  //   );

  //   // Actualizar selectedTask si está abierto
  //   if (selectedTask && selectedTask.id === taskId) {
  //     setSelectedTask({ ...selectedTask, creatorUserId: newResponsibleId });
  //   }

  //   // Llamar callback externo si quieres persistir en backend
  //   const id = Number(taskId);
  //   onReassignResponsible(id, newResponsibleId);
  // };

  // const handleAddComment = (taskId: string, comment: string) => {
  //   setTasks((prevTasks) =>
  //     prevTasks.map((task) =>
  //       task.id === taskId
  //         ? { ...task, comments: comment } // O concatena si es array
  //         : task
  //     )
  //   );

  //   // Actualizar selectedTask si está abierto
  //   if (selectedTask && selectedTask.id === taskId) {
  //     setSelectedTask({ ...selectedTask, comments: comment });
  //   }

  //   // Llamar callback externo si quieres persistir en backend
  //   const id = Number(taskId);
  //   onAddComment(id, comment);
  // };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Título</TableHead>
              <TableHead>Fecha Asignación</TableHead>
              <TableHead>Fecha Requerida</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Responsable</TableHead>
              <TableHead>Revisor</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium">{task.title}</TableCell>
                <TableCell>{formatDate(task.assignationDate)}</TableCell>
                <TableCell>{formatDate(task.requiredSendDate)}</TableCell>
                <TableCell>{renderStatusBadge(task.state)}</TableCell>
                <TableCell>{getUserName(task.creatorUserId)}</TableCell>
                <TableCell>{getUserName(task.revisorUserId)}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onViewDetails(task)}
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Diálogo de detalles de tarea */}
      <TaskDetailsDialog
        task={selectedTask}
        taskResponsible={selectedTask ? getTaskResponsible(selectedTask) : null}
        availableUsers={users}
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onSaveChanges={handleSaveChanges}
      />
    </>
  );
}