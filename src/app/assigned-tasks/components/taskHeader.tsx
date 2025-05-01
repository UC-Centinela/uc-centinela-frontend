import * as React from "react"
import { User, Bell } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const TasksHeader: React.FC = () => {
    return (
        <div
            className={cn(
                "flex items-center justify-between py-4",
                "border-b border-gray-200 dark:border-gray-700"
            )}
        >
            <h1
                className={cn(
                    "text-xl front-medium text-taskApp-primary",
                    "dark:text-gray-100"
                )}    
            >
                Tareas asignadas
            </h1>

            <div className="flex space-x-3">
                <Button
                    variant="ghost"
                    size="icon"
                    className="bg-gray-100 text-taskApp-primary hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                >
                    <User size={20} />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="bg-gray-100 text-taskApp-primary hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                >
                    <Bell size={20} />
                </Button>
            </div>
        </div>
    )
}

export default TasksHeader