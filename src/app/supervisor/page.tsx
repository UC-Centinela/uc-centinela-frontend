import { SupervisorDashboard } from "./components/SupervisorDashboard";
import { getUsers, getUserProfile } from "@/services/users";
import { getTaskByReviewer } from "@/services/task";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

async function SupervisorPage() {
  const userProfile = await getUserProfile();
  const userId = userProfile?.data?.getUserByEmail?.id;

  if (!userId) {
    return null;
  }

  const [users, tasks] = await Promise.all([
    getUsers(),
    getTaskByReviewer(Number(userId)),
  ]);

  return (
    <main>
      <SupervisorDashboard 
        initialTasks={tasks}
        users={users}
      />
    </main>
  );
}

export default SupervisorPage;