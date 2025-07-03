"use client";

import { useState } from "react";
import { TaskSummaryCards } from "./dashboard/TaskSummaryCards";
import { TaskFilters } from "./dashboard/TaskFilters";
import { TaskTable } from "./dashboard/TaskTable";
import { Header } from "./dashboard/TaskHeader";
import type {
  Task,
  TaskState,
  TaskStatusData,
  TaskFilters as TaskFiltersType,
} from "@/types/task";
import type { User } from "@/types/user";
import { updateTask, deleteTask, deleteArtp } from "@/services/task";
import { getMultimediaDataByTaskId, deleteMultimedia } from "@/services/multimedia";

interface SupervisorDashboardProps {
  initialTasks: Task[];
  users: User[];
}

export function SupervisorDashboard({
  initialTasks,
  users,
}: SupervisorDashboardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [currentTab, setCurrentTab] = useState("all-tasks");
  const [filters, setFilters] = useState<TaskFiltersType>({
    state: undefined,
    assignedTo: undefined,
    createdBy: undefined,
    dateRange: undefined,
  });

  // Calcular el resumen de tareas
  const taskSummary: TaskStatusData[] = [
    {
      status: ["PENDING", "IN_PROGRESS"],
      label: "Asignadas",
      count: tasks.filter((task) =>
        ["PENDING", "IN_PROGRESS"].includes(task.state)
      ).length,
      color: "#f59e0b",
    },
    {
      status: ["COMPLETED"],
      label: "En revisión",
      count: tasks.filter((task) => task.state === "COMPLETED").length,
      color: "#3b82f6",
    },
    {
      status: ["REVIEWED"],
      label: "Aprobadas",
      count: tasks.filter((task) => task.state === "REVIEWED").length,
      color: "#10b981",
    },
    {
      status: ["IS_REJECTED"],
      label: "Rechazadas",
      count: tasks.filter((task) => task.state === "IS_REJECTED").length,
      color: "#ef4444",
    },
  ];

  // Handlers
  const handleViewDetails = (task: Task) => {
    setSelectedTask(task);
  };

  const handleApplyFilters = (newFilters: TaskFiltersType) => {
    let filteredTasks = [...initialTasks];

    // Filtrar por rango de fechas
    if (newFilters.dateRange) {
      if (newFilters.dateRange.start) {
        filteredTasks = filteredTasks.filter(
          (task) =>
            new Date(task.assignationDate) >= newFilters.dateRange!.start
        );
      }
      if (newFilters.dateRange.end) {
        filteredTasks = filteredTasks.filter(
          (task) => new Date(task.assignationDate) <= newFilters.dateRange!.end
        );
      }
    }

    // Filtrar por usuario asignado
    if (newFilters.assignedTo) {
      filteredTasks = filteredTasks.filter(
        (task) => task.creatorUserId === newFilters.assignedTo
      );
    }

    // Filtrar por creador
    if (newFilters.createdBy) {
      filteredTasks = filteredTasks.filter(
        (task) => task.revisorUserId === newFilters.createdBy
      );
    }

    // Filtrar por estados
    if (newFilters.state && newFilters.state.length > 0) {
      filteredTasks = filteredTasks.filter((task) =>
        newFilters.state!.includes(task.state)
      );
    }

    setTasks(filteredTasks);
    setFilters(newFilters);
  };

  const handleTaskChanges = async (
    taskId: string,
    data: {
      creatorUserId: number;
      revisorUserId: number;
      comments: string;
      title: string;
      instruction: string;
      state: TaskState;
      assignationDate: string;
      requiredSendDate: string;
    }
  ) => {
    try {
      const formData = new FormData();
      formData.append("id", taskId.toString());
      formData.append("creatorUserId", data.creatorUserId.toString());
      formData.append("revisorUserId", data.revisorUserId.toString());
      formData.append("comments", data.comments);
      formData.append("title", data.title);
      formData.append("instruction", data.instruction);
      formData.append("state", data.state);
      formData.append("assignationDate", data.assignationDate);
      formData.append("requiredSendDate", data.requiredSendDate);
      const result = await updateTask(formData);
      if (result?.success && result.data) {
        setTasks((prev) =>
          prev.map((task) =>
            task.id === result.data!.id ? result.data! : task
          )
        );
        if (selectedTask && selectedTask.id === result.data.id) {
          setSelectedTask(result.data);
        }
        console.log("Tarea actualizada exitosamente:", result.data);
      } else {
        console.error("Error al actualizar tarea:", result?.error);
      }
    } catch (error) {
      console.error("Error al actualizar tarea:", error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const formData = new FormData();
      const artpFormData = new FormData();
      formData.append("id", taskId.toString());
      artpFormData.append("taskId", taskId.toString());
      const multimediaData = await getMultimediaDataByTaskId(taskId);
      for (const multimedia of multimediaData) {
        await deleteMultimedia(multimedia.id.toString());
      }
      await deleteArtp(artpFormData);
      const result = await deleteTask(formData);
      if (result?.success) {
        setTasks((prev) => prev.filter((task) => task.id !== taskId));
        window.location.reload();
      } else {
        console.error("Error al eliminar tarea:", result?.error);
      }
    } catch (error) {
      console.error("Error al eliminar tarea:", error);
    }
  };

  const handleTabChange = (value: string) => {
    setCurrentTab(value);
    let newState: TaskState[] | undefined;
    switch (value) {
      case "assigned":
        newState = ["PENDING", "IN_PROGRESS"];
        break;
      case "review":
        newState = ["COMPLETED"];
        break;
      case "approved":
        newState = ["REVIEWED"];
        break;
      case "rejected":
        newState = ["IS_REJECTED"];
        break;
      default:
        newState = undefined;
    }

    handleApplyFilters({
      ...filters,
      state: newState,
    });
  };

  const dashboardContent = (
    <div className="space-y-8">
      {/* Resumen de Tareas - Solo mostrar en la vista general */}
      {currentTab === "all-tasks" && <TaskSummaryCards data={taskSummary} />}

      {/* Filtros */}
      <TaskFilters
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        filters={filters}
        setFilters={setFilters}
        availableUsers={users}
        onApplyFilters={handleApplyFilters}
      />

      {/* Tabla de Tareas */}
      <TaskTable
        tasks={tasks}
        users={users}
        onViewDetails={handleViewDetails}
        onSaveChanges={handleTaskChanges}
        onDeleteTask={handleDeleteTask}
      />
    </div>
  );

  return (
    <div>
      <Header onTabChange={handleTabChange}>
        {/* Aquí podrías agregar las tabs visuales si no están en Header */}
        {dashboardContent}
      </Header>
    </div>
  );
}
