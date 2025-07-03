"use server";

import { getTokenAndEmail } from "./users";

export interface CreateControlInput {
  criticActivityId: string | number;
  title: string;
  description?: string;
}

export interface UpdateControlInput {
  criticActivityId: string | number;
  id: string | number;
  title: string;
  description?: string;
}

export interface Control {
  criticActivityId: string;
  description: string;
  id: string;
  title: string;
}

export async function createControl(
  input: CreateControlInput
): Promise<Control | null> {
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
          mutation CreateControl($input: CreateControlInput!) {
            createControl(input: $input) {
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
    return result.data?.createControl || null;
  } catch (error) {
    console.error("Error creating control:", error);
    return null;
  }
}

export async function deleteControl(id: string | number): Promise<boolean> {
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
          mutation DeleteControl($deleteControlId: Int!) {
            deleteControl(id: $deleteControlId)
          }
        `,
        variables: {
          deleteControlId: Number(id),
        },
      }),
    });
    const result = await response.json();
    if (result.errors) {
      console.error("GraphQL errors:", result.errors);
      return false;
    }
    return result.data?.deleteControl === true;
  } catch (error) {
    console.error("Error deleting control:", error);
    return false;
  }
}

export async function updateControl(
  input: UpdateControlInput
): Promise<Control | null> {
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
          mutation UpdateControl($input: UpdateControlInput!) {
            updateControl(input: $input) {
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
    return result.data?.updateControl || null;
  } catch (error) {
    console.error("Error updating control:", error);
    return null;
  }
}
