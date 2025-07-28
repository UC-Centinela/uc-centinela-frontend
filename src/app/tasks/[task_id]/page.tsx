import TaskIntro from "@/app/tasks/components/TaskIntro";
import { notFound, redirect } from "next/navigation";
import { getTaskData, validateTaskAccess } from "@/services/task";
import { getAllTasks } from "@/services/task";

async function fetchTaskTitle(task_id: string) {
  const tasks = await getAllTasks();
  let taskTitle = "";
  for (const task of tasks) {
    if (Number(task.id) === Number(task_id)) {
      taskTitle = task.title;
    }
  }
  return taskTitle;
}

export default async function TaskPage({
  params,
}: {
  params: Promise<{ task_id: string }>;
}) {
  const { task_id } = await params;

  // Validate task access
  const hasAccess = await validateTaskAccess(task_id);
  if (!hasAccess) {
    notFound();
  }

  const taskTitle = await fetchTaskTitle(task_id);
  const taskData = await getTaskData(task_id);
  if (taskData?.state === "COMPLETED") {
    redirect(`/tasks/${task_id}/send`);
  } else if (taskData?.state === "REVIEWED") {
    redirect(`/tasks/${task_id}/approved`);
  } else if (taskData?.state === "IS_REJECTED") {
    redirect(`/tasks`);
  }
  return <TaskIntro taskId={task_id} taskTitle={taskTitle} />;
}
