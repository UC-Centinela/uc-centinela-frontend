import TaskIntro from "@/app/tasks/components/TaskIntro";
import { notFound } from 'next/navigation';
import { validateTaskAccess } from "@/services/tasks";

export default async function TaskPage({ params }: { params: Promise<{ task_id: string }> }) {
  const { task_id } = await params;
  
  // Validate task access
  const hasAccess = await validateTaskAccess(task_id);
  if (!hasAccess) {
    notFound();
  }
  
  return <TaskIntro taskId={task_id} />;
}
