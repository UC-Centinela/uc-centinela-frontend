import { getTaskData, validateTaskAccess } from "@/services/task";
import { notFound, redirect } from "next/navigation";
import SendContent from "./SendContent";
import { getCriticalActivitiesByTaskId } from "@/services/criticalActivities";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function SendPage({ params }: any) {
  const task_id = params.task_id;

  const hasAccess = await validateTaskAccess(task_id);
  if (!hasAccess) {
    notFound();
  }

  const taskData = await getTaskData(task_id);
  const criticalActivities = await getCriticalActivitiesByTaskId(task_id);
  if (taskData?.state === "REVIEWED") {
    redirect(`/tasks/${task_id}/approved`);
  } else if (taskData?.state === "IS_REJECTED") {
    redirect(`/tasks`);
  } else if (criticalActivities.length === 0) {
    redirect(`/tasks/${task_id}`);
  }

  return <SendContent taskId={task_id} />;
}
