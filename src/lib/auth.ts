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

export async function getUserProfile(
  email: string,
  accessToken: string
): Promise<GetUserProfileResponse> {
  try {
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
    console.error("Error fetching user profile:", error);
    return { error: "Failed to fetch user profile" };
  }
}
