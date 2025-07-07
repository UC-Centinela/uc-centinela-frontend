import TaskExecutionClientWrapper from "@/app/tasks/components/TaskExecutionClientWrapper";
import { notFound, redirect } from "next/navigation";
import {
  validateTaskAccess,
  getTasksByUser,
  getTaskData,
} from "@/services/task";
import { getMultimediaDataByTaskId } from "@/services/multimedia";
import { cookies } from "next/headers";
import { getUserProfile } from "@/services/users";
import { Task } from "@/types/task";

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

  if (taskData?.state === "COMPLETED") {
    redirect(`/tasks/${task_id}/send`);
  } else if (taskData?.state === "REVIEWED") {
    redirect(`/tasks/${task_id}/approved`);
  } else if (taskData?.state === "IS_REJECTED") {
    redirect(`/tasks`);
  }

  return (
    <TaskExecutionClientWrapper
      taskId={task_id}
      multimediaData={multimediaData}
      taskComments={taskData?.comments || null}
    />
  );
}
