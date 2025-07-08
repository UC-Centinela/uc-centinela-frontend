import { validateTaskAccess } from "@/services/task";
import { notFound } from "next/navigation";
import SendContent from "./SendContent";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function SendPage({ params }: any) {
  const task_id = params.task_id;

  const hasAccess = await validateTaskAccess(task_id);
  if (!hasAccess) {
    notFound();
  }

  return <SendContent taskId={task_id} />;
}