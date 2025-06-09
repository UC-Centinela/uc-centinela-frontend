import { validateTaskAccess } from "@/services/task";
import { notFound } from "next/navigation";
import ApprovedContent from "./ApprovedContent";

interface PageProps {
  params: { task_id: string };
}

export default async function ApprovedPage({ params }: PageProps) {
  const { task_id } = params;

  const hasAccess = await validateTaskAccess(task_id);
  if (!hasAccess) {
    notFound();
  }

  return <ApprovedContent taskId={task_id} />;
} 