import TaskExecutionClientWrapper from "@/app/tasks/components/TaskExecutionClientWrapper";
import { notFound } from "next/navigation";
import { validateTaskAccess, getTasksByUser } from "@/services/task";
import { getMultimediaDataByTaskId } from "@/services/multimedia";
import { cookies } from "next/headers";
import { getUserProfile } from "@/services/users";
import { Task } from "@/types/task";

async function getTaskData(taskId: string) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return null;
    }

    // Obtener perfil del usuario
    const user = await getUserProfile();
    if (!user?.data?.getUserByEmail?.id) {
      return null;
    }
    
    const userId = parseInt(user.data.getUserByEmail.id);
    console.log("Getting tasks for user:", userId);
    
    const tasks = await getTasksByUser(userId)
    console.log("All tasks received:", tasks);
    console.log("Task ID:", taskId);

    const task = tasks.find((t: Task) => t.id.toString() === taskId);
    console.log("Found task:", task);
    console.log("Task comments:", task?.comments);

    return task || null;
  } catch (error) {
    console.error("Error fetching task data:", error);
    return null;
  }
}

export default async function RiskAnalysisPage({
  params,
}: {
  params: Promise<{ task_id: string }>;
}) {
  // — Esperamos a que se resuelva la promesa “params”
  const { task_id } = await params;
  console.log("Loading risk analysis for task:", task_id);

  // Validar acceso
  const hasAccess = await validateTaskAccess(task_id);
  if (!hasAccess) {
    notFound();
  }

  const [taskData, multimediaData] = await Promise.all([
    getTaskData(task_id),
    getMultimediaDataByTaskId(task_id),
  ]);

  console.log("Task data loaded:", taskData);
  console.log("Task comments to be passed:", taskData?.comments);

  return (
    <TaskExecutionClientWrapper
      taskId={task_id}
      multimediaData={multimediaData}
      taskComments={taskData?.comments || null}
    />
  );
}
