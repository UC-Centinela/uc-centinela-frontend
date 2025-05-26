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