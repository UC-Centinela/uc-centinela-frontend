import { getTokenAndEmail } from "./users";
import { gql } from "@apollo/client";
import client from "@/lib/apollo-client";

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
