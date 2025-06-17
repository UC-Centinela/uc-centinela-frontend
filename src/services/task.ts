import { getTokenAndEmail } from "./users";
import { Task } from "@/types/task";
import { gql } from "@apollo/client";
import client from "@/lib/apollo-client";

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

  if (result.data?.createTask) {
    return { success: true };
  } else {
    return { success: false };
  }
}

// Types for form data and field transforms
type FormDataValue = FormDataEntryValue | null | undefined;

type FieldTransforms = {
  id: (value: FormDataValue) => number;
  creatorUserId: (value: FormDataValue) => number;
  revisorUserId: (value: FormDataValue) => number;
  state: (value: FormDataValue) => string;
  title: (value: FormDataValue) => string;
  instruction: (value: FormDataValue) => string;
  assignationDate: (value: FormDataValue) => string;
  requiredSendDate: (value: FormDataValue) => string;
  comments: (value: FormDataValue) => string;
};

type UpdateTaskInput = {
  id: number;
  creatorUserId?: number;
  revisorUserId?: number;
  state?: string;
  title?: string;
  instruction?: string;
  assignationDate?: string;
  requiredSendDate?: string;
  comments?: string;
};

export async function updateTask(formData: FormData) {
  const rawFormData = Object.fromEntries(formData);
  const data = await getTokenAndEmail();

  if (!data?.accessToken) {
    return null;
  }

  const { accessToken } = data;

  if (!rawFormData.id) {
    return { success: false, error: "Task ID is required" };
  }

  const fieldTransforms: FieldTransforms = {
    id: (value: FormDataValue) => Number(value),
    creatorUserId: (value: FormDataValue) => Number(value),
    revisorUserId: (value: FormDataValue) => Number(value),
    state: (value: FormDataValue) => value instanceof File ? value.name : String(value),
    title: (value: FormDataValue) => value instanceof File ? value.name : String(value),
    instruction: (value: FormDataValue) => value instanceof File ? value.name : String(value),
    assignationDate: (value: FormDataValue) => value instanceof File ? value.name : String(value),
    requiredSendDate: (value: FormDataValue) => value instanceof File ? value.name : String(value),
    comments: (value: FormDataValue) => value instanceof File ? value.name : String(value),
  }

  const input = Object.entries(fieldTransforms).reduce((acc, [key, transform]) => {
    const value = rawFormData[key];
    if (key === 'id') {
      (acc as Record<string, unknown>)[key] = transform(value);
    } else if (value !== undefined && value !== null && value !== '') {
      (acc as Record<string, unknown>)[key] = transform(value);
    }
    return acc;
  }, {} as UpdateTaskInput)

  const response = await fetch(`${process.env.NEXT_PUBLIC_GRAPHQL_API_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      query: `
        mutation UpdateTask($input: UpdateTaskInput!) {
          updateTask(input: $input) {
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
        input,
      },
    }),
  });
  const result = await response.json();
  if (result.data?.updateTask) {
    return { success: true, data: result.data.updateTask };
  } else {
    return { success: false, error: result.errors?.[0]?.message || "Unknown error" };
  }
}

const CHECK_TASK_ACCESS = gql`
  query FindTask($findTaskId: Int!, $userEmail: String!) {
    findTask(id: $findTaskId, userEmail: $userEmail) {
      id
    }
  }
`;

export async function validateTaskAccess(taskId: string): Promise<boolean> {
  try {
    // Check if taskId is a valid integer
    if (!/^\d+$/.test(taskId)) {
      return false;
    }

    // Get user email from cookies
    const auth = await getTokenAndEmail();
    if (!auth || !auth.email) {
      return false;
    }

    // Query the API to check if the user has access to this task
    const { data, errors } = await client.query({
      query: CHECK_TASK_ACCESS,
      variables: { 
        findTaskId: Number(taskId), 
        userEmail: auth.email 
      },
      fetchPolicy: 'network-only' // Don't use cache for this security check
    });

    // If there are errors or no data, the user doesn't have access
    if (errors || !data || !data.findTask) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error validating task access:", error);
    return false;
  }
}