"use server";

import { getTokenAndEmail } from "./users";

export interface CreateToolInput {
  criticActivityId: string | number;
  title: string;
}

export interface Tool {
  criticActivityId: string;
  id: string;
  title: string;
}

export interface UpdateToolInput {
  criticActivityId: string | number;
  id: string | number;
  title: string;
}

export async function createTool(input: CreateToolInput): Promise<Tool | null> {
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
          mutation CreateTool($input: CreateToolInput!) {
            createTool(input: $input) {
              criticActivityId
              id
              title
            }
          }
        `,
        variables: {
          input: {
            criticActivityId: input.criticActivityId,
            title: input.title,
          },
        },
      }),
    });
    const result = await response.json();
    if (result.errors) {
      console.error("GraphQL errors:", result.errors);
      return null;
    }
    return result.data?.createTool || null;
  } catch (error) {
    console.error("Error creating tool:", error);
    return null;
  }
}

export async function deleteTool(id: string | number): Promise<boolean> {
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
          mutation DeleteTool($deleteToolId: Int!) {
            deleteTool(id: $deleteToolId)
          }
        `,
        variables: {
          deleteToolId: Number(id),
        },
      }),
    });
    const result = await response.json();
    if (result.errors) {
      console.error("GraphQL errors:", result.errors);
      return false;
    }
    return result.data?.deleteTool === true;
  } catch (error) {
    console.error("Error deleting tool:", error);
    return false;
  }
}

export async function updateTool(input: UpdateToolInput): Promise<Tool | null> {
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
          mutation UpdateTool($input: UpdateToolInput!) {
            updateTool(input: $input) {
              criticActivityId
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
          },
        },
      }),
    });
    const result = await response.json();
    if (result.errors) {
      console.error("GraphQL errors:", result.errors);
      return null;
    }
    return result.data?.updateTool || null;
  } catch (error) {
    console.error("Error updating tool:", error);
    return null;
  }
}
