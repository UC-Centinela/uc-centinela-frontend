import SupervisorArtp from "./components/SupervisorArtp";
import { generateArtp, getTasksByReviewer } from "@/services/task";
import { notFound } from "next/navigation";
import type { ArtpData, Task } from "@/types/task";
import { cookies } from "next/headers";
import { getUserProfile } from "@/services/users";

async function getArtpData(taskId: string): Promise<ArtpData | null> {
    try {
        const formData = new FormData();
        formData.append("taskId", taskId);
        const artpData = await generateArtp(formData);
        return artpData;
    } catch (error) {
        console.error("Error fetching ARTP data:", error);
        return null;
    }
}

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

export default async function ArtpSupervisorPage({
    params
} : {
    params: Promise<{ task_id: string }>
}) {
    const { task_id } = await params;
    const [artpData, taskData] = await Promise.all([getArtpData(task_id), getTaskData(task_id)]);
    if (!taskData) {
        notFound();
    }
    if (!artpData) {
        notFound();
    }
    return <SupervisorArtp artpData={artpData} taskData={taskData} />
}