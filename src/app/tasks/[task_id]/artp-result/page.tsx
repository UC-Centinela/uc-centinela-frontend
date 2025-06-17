import { validateTaskAccess } from "@/services/task";
import { notFound } from "next/navigation";
import ARTPResultContent from "./ARTPResultContent";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function ARTPResultPage({ params }: any) {
  const task_id = params.task_id;

  const hasAccess = await validateTaskAccess(task_id);
  if (!hasAccess) {
    notFound();
  }

  return <ARTPResultContent taskId={task_id} />;
}