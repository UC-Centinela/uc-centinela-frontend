import TaskIntro from "@/app/tasks/components/TaskIntro";
import { notFound } from 'next/navigation';
import { validateTaskAccess } from "@/services/task";
import { getAllTasks } from "@/services/task";

async function fetchTaskTitle(task_id: string) {
  const tasks = await getAllTasks();
  let taskTitle = ''
  for (const task of tasks) {
    if (Number(task.id) === Number(task_id)) {
      taskTitle = task.title;
    }
  }
  return taskTitle;
}

export default async function TaskPage({ params }: { params: Promise<{ task_id: string }> }) {
  const { task_id } = await params;
  
  // Validate task access
  const hasAccess = await validateTaskAccess(task_id);
  if (!hasAccess) {
    notFound();
  }

  const taskTitle = await fetchTaskTitle(task_id);
  return <TaskIntro taskId={task_id} taskTitle={taskTitle} />;
}
