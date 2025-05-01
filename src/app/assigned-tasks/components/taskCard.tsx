import * as React from "react"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Task } from "@/types/task"

interface TaskCardProps {
    task: Task;
    onViewDetails: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onViewDetails }) => {
    return (
        <div
            className={cn(
                "task-card rounded-lg border bg-white p-4 shadow-sm",
                "dark:border-gray-700 dark:bg-gray-800"
            )}
        >
            <h3
                className={cn(
                    "text-base font-medium text-gray-800 mb-3",
                    "dark:text-gray-100"
                )}
            >
                {task.title}
            </h3>

            <div className="space-y-1 mb-3">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <span className="inline-block w-5 mr-1">□</span>
                    <span>Fecha Requerida Envío: {task.dueDate}</span>
                </div>
            </div>

            <div className="flex justifiy-end">
                <Button
                    variant="link"
                    size="sm"
                    onClick={() => onViewDetails(task.id)}
                    className="text-taskApp-redAccent gap-1"
                >
                    Ver Detalles
                    <ArrowRight size={16} />
                </Button>
            </div>
        </div>
    )
}

export default TaskCard