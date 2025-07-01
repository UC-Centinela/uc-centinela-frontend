"use server";

import { config } from "@/middleware";
import { cookies } from "next/headers";
import type { User } from "@/types/user";

export const getTokenAndEmail = async () => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const email = cookieStore.get("userEmail")?.value;
    return { accessToken, email };
  } catch (error) {
    console.error("Error getting token and email:", error);
    return null;
  }
};

export async function handleLogout() {
  try {
    const cookieStore = await cookies();
    cookieStore.set("accessToken", "", {
      ...config,
      maxAge: -1,
    });
    cookieStore.set("userEmail", "", {
      ...config,
      maxAge: -1,
    });
    cookieStore.set("userRole", "", {
      ...config,
      maxAge: -1,
    });

    return true;
  } catch (error) {
    console.error("Error durante el logout:", error);
    return false;
  }
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  customerId: string;
  role: string;
  idpId: string;
  rut: string;
}

interface GetUserProfileResponse {
  data?: {
    getUserByEmail?: UserProfile;
  };
  error?: string;
}

export async function getUserProfile(): Promise<GetUserProfileResponse | null> {
  try {
    const data = await getTokenAndEmail();

    if (!data?.accessToken || !data?.email) {
      return null;
    }

    const { accessToken, email } = data;

    const response = await fetch(`${process.env.NEXT_PUBLIC_GRAPHQL_API_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query: `
          query GetUserByEmail($email: String!) {
            getUserByEmail(email: $email) {
              id
              firstName
              lastName
              email
              customerId
              role
              idpId
              rut
            }
          }
        `,
        variables: {
          email,
        },
      }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
}

// Función para obtener todos los usuarios de un cliente
export async function getUsers(): Promise<User[]> {
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
          query AllUsers {
            allUsers {
              id
              firstName
              lastName
              email
              customerId
              role
              rut
            }
          }
        `,
      }),
    });

    const result = await response.json();
    return result.data?.allUsers || [];
  } catch (error) {
    console.error("Error getting users:", error);
    return [];
  }
}

// Función para obtener un usuario por ID
export async function getUserById(userId: string): Promise<User | null> {
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
          query GetUserById($userId: String!) {
            user(id: $userId) {
              id
              firstName
              lastName
              email
              customerId
              role
              rut
            }
          }
        `,
        variables: {
          userId,
        },
      }),
    });

    const result = await response.json();
    return result.data?.user || null;
  } catch (error) {
    console.error("Error getting user by ID:", error);
    return null;
  }
}

export async function updateUserRole(formData: FormData) {
  const rawFormData = Object.fromEntries(formData)
  const data = await getTokenAndEmail();

  if (!data?.accessToken) {
    return { success: false, error: "No access token" };
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
        mutation AssignRole($role: Role!, $userEmail: String!) {
          assignRole(role: $role, userEmail: $userEmail) {
            id
          }
        }
      `,
      variables: {
        role: rawFormData.role,
        userEmail: rawFormData.userEmail
      },
    }),
  });

  const result = await response.json();

  if (result.data && result.data.assignRole && result.data.assignRole.id) {
    return { success: true };
  } else if (result.errors && result.errors.length > 0) {
    return {
      success: false,
      error: result.errors[0].message || "Unknown error",
    };
  } else {
    return { success: false, error: "Unknown error" };
  }
}

export async function updateUser(formData: FormData) {
  const rawFormData = Object.fromEntries(formData)
  const data = await getTokenAndEmail();

  if (!data?.accessToken) {
    return { success: false, error: "No access token" };
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
        mutation UpdateUser($updateUserInput: UpdateUserInput!) {
          updateUser(updateUserInput: $updateUserInput) {
            id
            firstName
            lastName
            email
            customerId
            role
            rut
          }
        }
      `,
      variables: {
        updateUserInput: {
          email: rawFormData.email,
          firstName: rawFormData.firstName,
          lastName: rawFormData.lastName,
          customerId: Number(rawFormData.customerId),
          rut: rawFormData.rut,
        },
      },
    }),
  });

  const result = await response.json();

  if (result.data && result.data.updateUser && result.data.updateUser.id) {
    return { success: true };
  } else if (result.errors && result.errors.length > 0) {
    return {
      success: false,
      error: result.errors[0].message || "Unknown error",
    };
  } else {
    return { success: false, error: "Unknown error" };
  }
}

export async function createUser(formData: FormData) {
  const rawFormData = Object.fromEntries(formData)
  const data = await getTokenAndEmail();

  if (!data?.accessToken) {
    return { success: false, error: "No access token" };
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
        mutation CreateUser($input: CreateUserInput!) {
          createUser(input: $input) {
            id
            firstName
            lastName
            email
            customerId
            role
            rut
            idpId
          }
        }
      `,
      variables: {
        input: {
          firstName: rawFormData.firstName,
          lastName: rawFormData.lastName,
          email: rawFormData.email,
          customerId: Number(rawFormData.customerId),
          role: rawFormData.role,
          rut: rawFormData.rut,
        },
      },
    }),
  });

  const result = await response.json();
  if (result.data && result.data.createUser && result.data.createUser.idpId) {
    return { success: true };
  } else if (result.errors && result.errors.length > 0) {
    return {
      success: false,
      error: result.errors[0].message || "Unknown error",
    };
  } else {
    return { success: false, error: "Unknown error" };
  }
}

export async function removeUserByEmail(formData: FormData) {
  const rawFormData = Object.fromEntries(formData)
  const data = await getTokenAndEmail();

  if (!data?.accessToken) {
    return { success: false, error: "No access token" };
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
        mutation RemoveUserByEmail($email: String!) {
          removeUserByEmail(email: $email)
        }
      `,
      variables: {
        email: rawFormData.email
      },
    }),
  });

  const result = await response.json();
  if (result.data && result.data.removeUserByEmail === true) {
    return { success: true };
  } else if (result.errors && result.errors.length > 0) {
    return {
      success: false,
      error: result.errors[0].message || "Unknown error",
    };
  } else {
    return { success: false, error: "Unknown error" };
  }
}