"use server";

import { getTokenAndEmail } from "./users";

export interface CreateVerificationQuestionInput {
  criticActivityId: string | number;
  title: string;
  description?: string;
}

export interface UpdateVerificationQuestionInput {
  criticActivityId: string | number;
  id: string | number;
  title: string;
  description?: string;
}

export interface VerificationQuestion {
  criticActivityId: string;
  description: string;
  id: string;
  title: string;
}

export async function createVerificationQuestion(
  input: CreateVerificationQuestionInput
): Promise<VerificationQuestion | null> {
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
          mutation CreateVerificationQuestion($input: CreateVerificationQuestionInput!) {
            createVerificationQuestion(input: $input) {
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
    return result.data?.createVerificationQuestion || null;
  } catch (error) {
    console.error("Error creating verification question:", error);
    return null;
  }
}

export async function deleteVerificationQuestion(
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
          mutation DeleteVerificationQuestion($deleteVerificationQuestionId: Int!) {
            deleteVerificationQuestion(id: $deleteVerificationQuestionId)
          }
        `,
        variables: {
          deleteVerificationQuestionId: Number(id),
        },
      }),
    });
    const result = await response.json();
    if (result.errors) {
      console.error("GraphQL errors:", result.errors);
      return false;
    }
    return result.data?.deleteVerificationQuestion === true;
  } catch (error) {
    console.error("Error deleting verification question:", error);
    return false;
  }
}

export async function updateVerificationQuestion(
  input: UpdateVerificationQuestionInput
): Promise<VerificationQuestion | null> {
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
          mutation UpdateVerificationQuestion($input: UpdateVerificationQuestionInput!) {
            updateVerificationQuestion(input: $input) {
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
    return result.data?.updateVerificationQuestion || null;
  } catch (error) {
    console.error("Error updating verification question:", error);
    return null;
  }
}
