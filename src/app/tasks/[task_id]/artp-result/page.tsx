import { validateTaskAccess } from "@/services/tasks";
import { notFound } from "next/navigation";
import ARTPResultContent from "./ARTPResultContent";

interface PageProps {
  params: { task_id: string };
}

export default async function ARTPResultPage({ params }: PageProps) {
  const { task_id } = params;

  const hasAccess = await validateTaskAccess(task_id);
  if (!hasAccess) {
    notFound();
  }

  return <ARTPResultContent taskId={task_id} />;
} 