"use server";

import { getTokenAndEmail } from "./users";

export interface ArtpControl {
  criticActivityId: string;
  description: string;
  id: string;
  title: string;
}

export interface ArtpCriticActivity {
  id: string;
  taskId: string;
  title: string;
}

export interface ArtpTool {
  criticActivityId: string;
  id: string;
  title: string;
}

export interface ArtpUndesiredEvent {
  criticActivityId: string;
  description: string;
  id: string;
  title: string;
}

export interface ArtpVerificationQuestion {
  criticActivityId: string;
  description: string;
  id: string;
  title: string;
}

export interface GenerateArtpResponse {
  controls: ArtpControl[];
  criticActivities: ArtpCriticActivity[];
  tools: ArtpTool[];
  undesiredEvents: ArtpUndesiredEvent[];
  verificationQuestions: ArtpVerificationQuestion[];
}

export interface GenerateArtpInput {
  taskId: number;
}

export async function generateArtp(
  input: GenerateArtpInput
): Promise<GenerateArtpResponse | null> {
  try {
    const data = await getTokenAndEmail();

    if (!data?.accessToken) {
      return null;
    }

    const { accessToken } = data;
    console.log(
      "next public graphql api url",
      process.env.NEXT_PUBLIC_GRAPHQL_API_URL
    );
    const response = await fetch(`${process.env.NEXT_PUBLIC_GRAPHQL_API_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query: `
          mutation GenerateArtp($input: GenerateArtpInput!) {
            generateArtp(input: $input) {
              controls {
                criticActivityId
                description
                id
                title
              }
              criticActivities {
                id
                taskId
                title
              }
              tools {
                criticActivityId
                id
                title
              }
              undesiredEvents {
                criticActivityId
                description
                id
                title
              }
              verificationQuestions {
                criticActivityId
                description
                id
                title
              }
            }
          }
        `,
        variables: {
          input,
        },
      }),
    });

    const result = await response.json();

    if (result.errors) {
      console.error("GraphQL errors:", result.errors);
      return null;
    }

    return result.data?.generateArtp || null;
  } catch (error) {
    console.error("Error generating ARTP:", error);
    return null;
  }
}
