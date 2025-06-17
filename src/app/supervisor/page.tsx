import { SupervisorDashboard } from "./components/SupervisorDashboard";
import { getUsers, getUserProfile } from "@/services/users";
import { getTaskByReviewer, updateTask } from "@/services/task";

export async function editTask(formData: FormData) {
  const result = await updateTask(formData);
  if (result?.success) {
    return { 
      success: true,
      task: result.data,
    };
  } else {
    return { 
      success: false,
      error: result?.error || "Error updating task comment",
    };
  }
}

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