import { getTaskData, validateTaskAccess } from "@/services/task";
import { notFound, redirect } from "next/navigation";
import ApprovedContent from "./ApprovedContent";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function ApprovedPage({ params }: any) {
  const task_id = (await params).task_id;
  const taskData = await getTaskData(task_id);

  const hasAccess = await validateTaskAccess(task_id);
  if (!hasAccess) {
    notFound();
  }

  if (taskData?.state === "COMPLETED") {
    redirect(`/tasks/${task_id}/send`);
  } else if (taskData?.state === "PENDING") {
    redirect(`/tasks/${task_id}`);
  } else if (taskData?.state === "IS_REJECTED") {
    redirect(`/tasks`);
  }

  return <ApprovedContent taskId={task_id} />;
}
