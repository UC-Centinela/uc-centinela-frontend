import { Button } from "@/components/ui/button"
import { cookies } from "next/headers";
import { getUserProfile } from "@/services/users";
import { getTasksByReviewer } from "@/services/task";
import RejectedTask from "./components/RejectedTask"
import type { Task } from "@/types/task"
import { notFound } from "next/navigation";

async function getTaskData(taskId: string): Promise<Task | null> {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;

        if (!accessToken) {
            return null;
        }

        const user = await getUserProfile();
        if (!user?.data?.getUserByEmail?.id) {
            return null;
        }

        const userId = parseInt(user.data.getUserByEmail.id);

        const tasks = await getTasksByReviewer(userId);

        const task = tasks.find((t: Task) => t.id.toString() === taskId);

        return task || null;
    } catch (error) {
        console.error("Error fetching task data:", error);
        return null;
    }
}

export default async function RejectedPage({
    params
} : {
    params: Promise<{ task_id: string }>
}) {
    const { task_id } = await params 

    const taskData = await getTaskData(task_id)
    if (!taskData) {
        return notFound()
    }

    return (
        <RejectedTask 
            taskData={taskData}
        />
    )
}