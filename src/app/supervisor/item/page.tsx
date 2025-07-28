import { getUsers, getUserProfile } from "@/services/users";
import TaskContentLayout from "./taskContentLayout";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function SupervisorPage() {
  const userProfile = await getUserProfile();
  const userId = userProfile?.data?.getUserByEmail?.id;

  if (!userId) {
    return null;
  }

  const users = await getUsers();

  return <TaskContentLayout users={users} />;
}