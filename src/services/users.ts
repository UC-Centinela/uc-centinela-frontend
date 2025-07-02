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
