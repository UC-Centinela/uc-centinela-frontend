"use server"

import { ControlStrategy } from "@/types/controlStrategies";

export async function getControlStrategiesByTaskId(taskId: string): Promise<ControlStrategy[]> {
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_GRAPHQL_API_URL || "/api/graphql",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            query FindControlStrategiesByTask($taskId: Int!) {
              findControlStrategiesByTask(taskId: $taskId) {
                id
                title
              }
            }
          `,
          variables: { taskId: Number(taskId) },
        }),
      }
    );

    const data = await response.json();
    return data.data.findControlStrategiesByTask;
  } catch (error) {
    console.error("Error fetching control strategies:", error);
    return [];
  }
}