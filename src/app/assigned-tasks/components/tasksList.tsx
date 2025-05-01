import * as React from "react"
import TaskCard from "./taskCard"
import { Task } from "@/types/task"
import { cn } from "@/lib/utils"

interface TasksListProps {
    tasks: Task[]
    onViewDetails: (taskId: string) => void
}