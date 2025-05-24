import TaskIntro from "@/app/tasks/components/TaskIntro";

export default function TaskPage({ params }: { params: { task_id: string } }) {
  return <TaskIntro taskId={params.task_id} />;
}
