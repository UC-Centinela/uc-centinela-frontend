"use server";

import { getTokenAndEmail } from "./users";
import { Task } from "@/types/task";

// Función para obtener todas las tareas
export async function getAllTasks(): Promise<Task[]> {
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
          query FindAllTasks {
            findAllTasks {
              id
              creatorUserId
              assignationDate
              changeHistory
              comments
              requiredSendDate
              instruction
              revisorUserId
              state
              title
            }
          }
        `,
      }),
    });

    const result = await response.json();
    return result.data?.findAllTasks || [];
  } catch (error) {
    console.error("Error getting all tasks:", error);
    return [];
  }
}

// Función para obtener tareas por usuario
export async function getTasksByUser(userId: number): Promise<Task[]> {
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
          query FindTasksByUser($userId: Int!) {
            findTasksByUser(userId: $userId) {
              id
              title
              instruction
              comments
              state
              changeHistory
              assignationDate
              requiredSendDate
              creatorUserId
              revisorUserId
            }
          }
        `,
        variables: {
          userId,
        },
      }),
    });

    const result = await response.json();
    return result.data?.findTasksByUser || [];
  } catch (error) {
    console.error("Error getting tasks by user:", error);
    return [];
  }
}

export async function getTaskByReviewer(revisorId: number): Promise<Task[]> {
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
          query FindTasksByReviewer($revisorId: Int!) {
            findTasksByReviewer(revisorId: $revisorId) {
              id
              title
              instruction
              comments
              state
              changeHistory
              assignationDate
              requiredSendDate
              creatorUserId
              revisorUserId
            }
          }
        `,
        variables: {
          revisorId,
        },
      }),
    });

    const result = await response.json();
    return result.data?.findTasksByReviewer || [];
  } catch (error) {
    console.error("Error getting tasks by user:", error);
    return [];
  }
}

export async function createTask(formData: FormData) {
  const rawFormData = Object.fromEntries(formData);
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
        mutation CreateTask($input: CreateTaskInput!) {
          createTask(input: $input) {
            creatorUserId
            id
            instruction
            revisorUserId
            state
            title
            assignationDate
            requiredSendDate
            comments
          }
        }
      `,
      variables: {
        input: {
          creatorUserId: Number(rawFormData.creatorUserId),
          revisorUserId: Number(rawFormData.revisorUserId),
          state: rawFormData.state,
          title: rawFormData.title,
          instruction: rawFormData.instruction,
          assignationDate: rawFormData.assignationDate,
          requiredSendDate: rawFormData.requiredSendDate,
          comments: rawFormData.comments,
        },
      },
    }),
  });

  const result = await response.json();
  console.log(result);
  return result.data?.createTask || null;
}
