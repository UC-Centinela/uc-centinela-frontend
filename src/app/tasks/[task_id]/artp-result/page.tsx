import { getAllTasks, validateTaskAccess } from "@/services/task";
import { notFound } from "next/navigation";
import ARTPResultContent from "./ARTPResultContent";
import { generateArtp } from "@/services/artp";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function ARTPResultPage({ params }: any) {
  const task_id = params.task_id;

  const artpData = await generateArtp({ taskId: Number(task_id) });
  const tasks = await getAllTasks();
  let taskTitle = "";
  for (const task of tasks) {
    if (Number(task.id) === Number(task_id)) {
      taskTitle = task.title;
    }
  }

  const hasAccess = await validateTaskAccess(task_id);
  if (!hasAccess || !artpData) {
    notFound();
  }

  return (
    <ARTPResultContent
      taskId={task_id}
      artpData={artpData}
      taskTitle={taskTitle}
    />
  );
}
