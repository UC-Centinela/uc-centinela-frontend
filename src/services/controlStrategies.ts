"use server"

import { ControlStrategy } from "@/types/controlStrategies";
import { getTokenAndEmail } from "./users";

export async function getControlStrategiesByTaskId(taskId: string): Promise<ControlStrategy[]> {
  try {
    const tokenEmailData = await getTokenAndEmail();

    if (!tokenEmailData?.accessToken) {
      return [];
    }

    const { accessToken } = tokenEmailData;

    const response = await fetch(
      process.env.NEXT_PUBLIC_GRAPHQL_API_URL || "/api/graphql",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
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