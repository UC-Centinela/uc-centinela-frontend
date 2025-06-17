"use client"

import { useState } from "react"
import { TaskSummaryCards } from "./dashboard/TaskSummaryCards"
import { TaskFilters } from "./dashboard/TaskFilters"
import { TaskTable } from "./dashboard/TaskTable"
import { TaskDetailsDialog } from "./dashboard/TaskDetails"
import { Header } from "./dashboard/TaskHeader"
import type { Task, TaskState, TaskStatusData, TaskFilters as TaskFiltersType } from "@/types/task"
import type { User } from "@/types/user"
import { editTask } from "../page"

interface SupervisorDashboardProps {
  initialTasks: Task[]
  users: User[]
}

export function SupervisorDashboard({ initialTasks, users }: SupervisorDashboardProps) {
  // Estados
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [currentTab, setCurrentTab] = useState("all-tasks")
  const [filters, setFilters] = useState<TaskFiltersType>({
    state: undefined,
    assignedTo: undefined,
    createdBy: undefined,
    dateRange: undefined
  })

  // Calcular el resumen de tareas
  const taskSummary: TaskStatusData[] = [
    {
      status: ["PENDING", "IN_PROGRESS"],
      label: "Asignadas",
      count: tasks.filter(task => ["PENDING", "IN_PROGRESS"].includes(task.state)).length,
      color: "#f59e0b"
    },
    {
      status: ["COMPLETED"],
      label: "En revisión",
      count: tasks.filter(task => task.state === "COMPLETED").length,
      color: "#3b82f6"
    },
    {
      status: ["REVIEWED"],
      label: "Aprobadas",
      count: tasks.filter(task => task.state === "REVIEWED").length,
      color: "#10b981"
    }
  ]

  // Handlers
  const handleViewDetails = (task: Task) => {
    setSelectedTask(task)
    setIsDetailsOpen(true)
  }

  const handleCloseDetails = () => {
    setIsDetailsOpen(false)
    setSelectedTask(null)
  }

  const handleApplyFilters = (newFilters: TaskFiltersType) => {
    let filteredTasks = [...initialTasks]

    // Filtrar por rango de fechas
    if (newFilters.dateRange) {
      if (newFilters.dateRange.start) {
        filteredTasks = filteredTasks.filter(
          task => new Date(task.assignationDate) >= newFilters.dateRange!.start
        )
      }
      if (newFilters.dateRange.end) {
        filteredTasks = filteredTasks.filter(
          task => new Date(task.assignationDate) <= newFilters.dateRange!.end
        )
      }
    }

    // Filtrar por usuario asignado
    if (newFilters.assignedTo) {
      filteredTasks = filteredTasks.filter(
        task => task.creatorUserId === newFilters.assignedTo
      )
    }

    // Filtrar por creador
    if (newFilters.createdBy) {
      filteredTasks = filteredTasks.filter(
        task => task.revisorUserId === newFilters.createdBy
      )
    }

    // Filtrar por estados
    if (newFilters.state && newFilters.state.length > 0) {
      filteredTasks = filteredTasks.filter(
        task => newFilters.state!.includes(task.state)
      )
    }

    setTasks(filteredTasks)
    setFilters(newFilters)
  }

  // const handleTaskChanges = async (taskId: Number, newResponsibleId: Number, comment: string) => {
  //   try {
  //     const formData = new FormData();
  //     formData.append("id", taskId.toString());
  //     formData.append("creatorUserId", newResponsibleId.toString());
  //     formData.append("comments", comment);
  //     const result = await editTask(formData);
  //     if (result.success && result.task) {
  //       setTasks(prev =>
  //         prev.map(task => (task.id === result.task!.id ? result.task! : task))
  //       );
  //       if (selectedTask && selectedTask.id === result.task.id) {
  //         setSelectedTask(result.task);
  //       }
  //       console.log("Tarea actualizada exitosamente:", result.task);
  //     } else {
  //       console.error("Error al actualizar tarea:", result.error);
  //     }
  //   } catch (error) {
  //     console.error("Error al actualizar tarea:", error)
  //   }
  // }

  const handleTaskChanges = async (taskId: string, comment: string, newResponsibleId: Number) => {
    try {
      const formData = new FormData();
      formData.append("id", taskId.toString());
      formData.append("creatorUserId", newResponsibleId.toString());
      formData.append("comments", comment);
      const result = await editTask(formData);
      if (result.success && result.task) {
        setTasks(prev =>
          prev.map(task => (task.id === result.task!.id ? result.task! : task))
        );
        if (selectedTask && selectedTask.id === result.task.id) {
          setSelectedTask(result.task);
        }
        console.log("Tarea actualizada exitosamente:", result.task);
      } else {
        console.error("Error al actualizar tarea:", result.error);
      }
    } catch (error) { 
      console.error("Error al actualizar tarea:", error)
    }
  }

  // const handleReassignResponsible = async (taskId: Number, newResponsibleId: Number) => {
  //   try {
  //     const formData = new FormData();
  //     formData.append("id", taskId.toString());
  //     formData.append("creatorUserId", newResponsibleId.toString());
  //     const result = await editTask(formData);
  //     if (result.success && result.task) {
  //       setTasks(prev =>
  //         prev.map(task => (task.id === result.task!.id ? result.task! : task))
  //       );
  //       if (selectedTask && selectedTask.id === result.task.id) {
  //         setSelectedTask(result.task);
  //       }
  //       console.log("Tarea reasignada exitosamente:", result.task);
  //     } else {
  //       console.error("Error al reasignar tarea:", result.error);
  //     }
  //   } catch (error) {
  //     console.error("Error al reasignar tarea:", error)
  //   }
  // }

  // const handleAddComment = async (taskId: Number, comment: string) => {
  //   try {
  //     const formData = new FormData();
  //     formData.append("id", taskId.toString());
  //     formData.append("comments", comment);
  //     const result = await editTask(formData);
  //     if (result.success && result.task) {
  //       setTasks(prev =>
  //         prev.map(task => (task.id === result.task!.id ? result.task! : task))
  //       );
  //       if (selectedTask && selectedTask.id === result.task.id) {
  //         setSelectedTask(result.task);
  //       }
  //       console.log("Comentario agregado exitosamente:", result.task);
  //     } else {
  //       console.error("Error al agregar comentario:", result.error);
  //     }

  //   } catch (error) {
  //     console.error("Error al agregar comentario:", error)
  //   }
  // }

  const handleTabChange = (value: string) => {
    setCurrentTab(value)
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
      default:
        newState = undefined;
    }
    
    handleApplyFilters({
      ...filters,
      state: newState
    });
  }

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
      />
    </div>
  )

  return (
    <div>
      <Header onTabChange={handleTabChange}>
        {dashboardContent}
      </Header>
    </div>
  )
} 