"use server";

import { getTokenAndEmail } from "./users";

export interface CreateUndesiredEventInput {
  criticActivityId: string | number;
  title: string;
  description?: string;
}

export interface UpdateUndesiredEventInput {
  criticActivityId: string | number;
  id: string | number;
  title: string;
  description?: string;
}

export interface UndesiredEvent {
  criticActivityId: string;
  description: string;
  id: string;
  title: string;
}

export async function createUndesiredEvent(
  input: CreateUndesiredEventInput
): Promise<UndesiredEvent | null> {
  try {
    const data = await getTokenAndEmail();
    if (!data?.accessToken) {
      return null;
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
          mutation CreateUndesiredEvent($input: CreateUndesiredEventInput!) {
            createUndesiredEvent(input: $input) {
              criticActivityId
              description
              id
              title
            }
          }
        `,
        variables: {
          input: {
            criticActivityId: input.criticActivityId,
            title: input.title,
            description: input.description ?? null,
          },
        },
      }),
    });
    const result = await response.json();
    if (result.errors) {
      console.error("GraphQL errors:", result.errors);
      return null;
    }
    return result.data?.createUndesiredEvent || null;
  } catch (error) {
    console.error("Error creating undesired event:", error);
    return null;
  }
}

export async function deleteUndesiredEvent(
  id: string | number
): Promise<boolean> {
  try {
    const data = await getTokenAndEmail();
    if (!data?.accessToken) {
      return false;
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
          mutation DeleteUndesiredEvent($deleteUndesiredEventId: Int!) {
            deleteUndesiredEvent(id: $deleteUndesiredEventId)
          }
        `,
        variables: {
          deleteUndesiredEventId: Number(id),
        },
      }),
    });
    const result = await response.json();
    if (result.errors) {
      console.error("GraphQL errors:", result.errors);
      return false;
    }
    return result.data?.deleteUndesiredEvent === true;
  } catch (error) {
    console.error("Error deleting undesired event:", error);
    return false;
  }
}

export async function updateUndesiredEvent(
  input: UpdateUndesiredEventInput
): Promise<UndesiredEvent | null> {
  try {
    const data = await getTokenAndEmail();
    if (!data?.accessToken) {
      return null;
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
          mutation UpdateUndesiredEvent($input: UpdateUndesiredEventInput!) {
            updateUndesiredEvent(input: $input) {
              criticActivityId
              description
              id
              title
            }
          }
        `,
        variables: {
          input: {
            criticActivityId: input.criticActivityId,
            id: input.id,
            title: input.title,
            description: input.description ?? null,
          },
        },
      }),
    });
    const result = await response.json();
    if (result.errors) {
      console.error("GraphQL errors:", result.errors);
      return null;
    }
    return result.data?.updateUndesiredEvent || null;
  } catch (error) {
    console.error("Error updating undesired event:", error);
    return null;
  }
}
