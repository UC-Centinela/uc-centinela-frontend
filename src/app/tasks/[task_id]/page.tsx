import TaskIntro from "@/app/tasks/components/TaskIntro";

export default async function TaskPage({ params }: { params: Promise<{ task_id: string }> }) {
  const { task_id } = await params;
  return <TaskIntro taskId={task_id} />;
}
