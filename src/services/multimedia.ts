"use server"

import { MultimediaItem } from "@/types/multimedia"

export async function getMultimediaDataByTaskId(taskId: string): Promise<MultimediaItem[]> {
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
            query FindMultimediaByTaskId($taskId: Int!) {
              findMultimediaByTaskId(taskId: $taskId) {
                id
                taskId
                photoUrl
                videoUrl
                audioTranscription
              }
            }
          `,
          variables: { taskId: Number(taskId) },
        }),
      }
    );

    const data = await response.json();
    return data.data.findMultimediaByTaskId;
  } catch (error) {
    console.error("Error fetching multimedia data:", error);
    return [];
  }
}