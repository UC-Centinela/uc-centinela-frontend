import { getTokenAndEmail } from "./users";

export interface CriticalActivity {
  id: string;
  title: string;
  taskId: string;
}

export async function getCriticalActivitiesByTaskId(
  taskId: string
): Promise<CriticalActivity[]> {
  try {
    const data = await getTokenAndEmail();
    if (!data?.accessToken) {
      return [];
    }
    const { accessToken } = data;

    const response = await fetch(`${process.env.NEXT_PUBLIC_GRAPHQL_API_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query: `
          query GetCriticalActivitiesByTaskId($taskId: Float!) {
            findAllCriticActivitiesByTask(taskId: $taskId) {
              id
              title
              taskId
            }
          }
        `,
        variables: {
          taskId: Number(taskId),
        },
      }),
    });

    const result = await response.json();
    if (result.errors) {
      console.error("GraphQL errors:", result.errors);
      return [];
    }
    console.log("Critical activities result:", result);
    return result.data?.findAllCriticActivitiesByTask || [];
  } catch (error) {
    console.error("Error fetching critical activities:", error);
    return [];
  }
}
