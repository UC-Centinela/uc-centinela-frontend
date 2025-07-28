import TasksList from "@/app/tasks/components/TasksList";
import { getUserProfile } from "@/services/users";
import { cookies } from "next/headers";
import { getTasksByUser } from "@/services/task";
import NotFound from "../not-found";

export default async function Tasks() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  if (!accessToken) return [];
  const user = await getUserProfile();
  if (!user) return [];
  const idString = user.data?.getUserByEmail?.id;
  const userId = idString ? parseInt(idString) : undefined;
  if (!userId) return <NotFound />;
  const tasks = await getTasksByUser(userId);
  return <TasksList tasks={tasks} />;
}