import { validateTaskAccess } from "@/services/tasks";
import { notFound } from "next/navigation";
import SendContent from "./SendContent";

interface PageProps {
  params: { task_id: string };
}

export default async function SendPage({ params }: PageProps) {
  const { task_id } = params;

  const hasAccess = await validateTaskAccess(task_id);
  if (!hasAccess) {
    notFound();
  }

  return <SendContent taskId={task_id} />;
} 