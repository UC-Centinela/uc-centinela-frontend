import { getTaskData, validateTaskAccess } from "@/services/task";
import { notFound, redirect } from "next/navigation";
import SendContent from "./SendContent";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function SendPage({ params }: any) {
  const task_id = params.task_id;

  const hasAccess = await validateTaskAccess(task_id);
  if (!hasAccess) {
    notFound();
  }

  const taskData = await getTaskData(task_id);
  if (taskData?.state === "REVIEWED") {
    redirect(`/tasks/${task_id}/approved`);
  } else if (taskData?.state === "IS_REJECTED") {
    redirect(`/tasks`);
  }

  return <SendContent taskId={task_id} />;
}
