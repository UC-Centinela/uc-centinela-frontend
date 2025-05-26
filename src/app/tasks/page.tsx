import TasksList from "@/app/tasks/components/TasksList";
import { getUserProfile } from "@/services/users";
import { cookies } from "next/headers";

async function fetchTasks() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  let tasks = [];

  try {

    if (!accessToken) return [];
  
    const user = await getUserProfile();
    if (!user) return [];
    const idString = user.data?.getUserByEmail?.id;
    const userId = idString ? parseInt(idString) : undefined;
  
    const response = await fetch(`${process.env.NEXT_PUBLIC_GRAPHQL_API_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query: `
          query FindTasksByUser($userId: Int!) {
            findTasksByUser(userId: $userId) {
              id
              title
              instruction
              state
              creatorUserId
              revisorUserId
              comments
              changeHistory
              assignationDate
              requiredSendDate
            }
          }
        `,
        variables: {
          userId: userId,
        }
      }),
    })
  
    const result = await response.json();
    tasks = result.data?.findTasksByUser || [];
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
  return tasks;
}

export default async function Tasks() {
  const tasks = await fetchTasks();
  return <TasksList tasks={tasks} />;
}