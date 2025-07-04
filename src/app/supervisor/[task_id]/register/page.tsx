import { notFound } from "next/navigation";
import { getTasksByReviewer, validateTaskAccess } from "@/services/task";
import { getMultimediaDataByTaskId } from "@/services/multimedia";
import { getControlStrategiesByTaskId } from "@/services/controlStrategies";
import { cookies } from "next/headers";
import { getUserProfile } from "@/services/users";
import { Task } from "@/types/task";
import { MultimediaItem } from "@/types/multimedia";
import { ControlStrategy } from "@/types/controlStrategies";
import TaskRegister from "./components/TaskRegister";

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

async function getMultimediaData(taskId: string): Promise<MultimediaItem[]> {
  try {
    const multimediaData = await getMultimediaDataByTaskId(taskId);
    return multimediaData;
  } catch (error) {
    console.error("Error fetching multimedia data:", error);
    return [];
  }
}

async function getControlStrategies(taskId: string): Promise<ControlStrategy[]> {
  try {
    const controlStrategies = await getControlStrategiesByTaskId(taskId);
    return controlStrategies;
  } catch (error) {
    console.error("Error fetching control strategies:", error);
    return [];
  }
}

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ task_id: string }>;
}) {
  const { task_id } = await params;

  const hasAccess = await validateTaskAccess(task_id);
  if (!hasAccess) {
    notFound();
  }

  const [taskData, multimediaData, controlStrategies] = await Promise.all([
    getTaskData(task_id),
    getMultimediaData(task_id),
    getControlStrategies(task_id)
  ]);

  if (taskData?.state === 'PENDING') {
    notFound();
  }

  return (
    <TaskRegister
      taskData={taskData}
      multimediaData={multimediaData}
      controlStrategies={controlStrategies}
    />
  );
}