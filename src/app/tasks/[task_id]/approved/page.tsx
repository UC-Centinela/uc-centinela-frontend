import { validateTaskAccess } from "@/services/task";
import { notFound } from "next/navigation";
import ApprovedContent from "./ApprovedContent";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function ApprovedPage({ params }: any) {
  const task_id = params.task_id;

  const hasAccess = await validateTaskAccess(task_id);
  if (!hasAccess) {
    notFound();
  }

  return <ApprovedContent taskId={task_id} />;
}