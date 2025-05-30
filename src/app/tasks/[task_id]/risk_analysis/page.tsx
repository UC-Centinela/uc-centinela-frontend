import TaskExecution from "../../components/TaskExecution";
import { notFound } from 'next/navigation';
import { validateTaskAccess } from "@/services/tasks";
import { cookies } from "next/headers";
import { getUserProfile } from "@/services/users";

interface Task {
  id: string;
  title: string;
  instruction: string;
  comments: string;
  state: string;
  changeHistory: string[];
  assignationDate: string;
  requiredSendDate: string;
  creatorUserId: number;
  revisorUserId: number;
}

async function getTaskData(taskId: string) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return null;
    }

    // Get user profile to get userId
    const user = await getUserProfile();
    if (!user?.data?.getUserByEmail?.id) {
      return null;
    }

    const userId = parseInt(user.data.getUserByEmail.id);
    console.log('Getting tasks for user:', userId);

    const response = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_API_URL || '/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
          userId
        },
      }),
    });
    
    const data = await response.json();
    const tasks = data.data?.findTasksByUser || [];
    console.log('All tasks received:', tasks);
    console.log('Task ID:', taskId);
    // Find the specific task by ID
    const task = tasks.find((t: Task) => t.id.toString() === taskId);
    console.log('Found task:', task);
    console.log('Task comments:', task?.comments);
    
    return task || null;
  } catch (error) {
    console.error("Error fetching task data:", error);
    return null;
  }
}

async function getMultimediaData(taskId: string) {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_API_URL || '/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query FindMultimediaByTaskId($taskId: Int!) {
            findMultimediaByTaskId(taskId: $taskId) {
              id
              taskId
              photoUrl
              videoUrl
              audioTranscription
            }
          }
        `,
        variables: { taskId: Number(taskId) },
      }),
    });
    
    const data = await response.json();
    return data.data.findMultimediaByTaskId;
  } catch (error) {
    console.error("Error fetching multimedia data:", error);
    return [];
  }
}

export default async function RiskAnalysisPage({ params }: { params: { task_id: string } }) {
  const { task_id } = params;
  console.log('Loading risk analysis for task:', task_id);

  // Validate task access
  const hasAccess = await validateTaskAccess(task_id);
  if (!hasAccess) {
    notFound();
  }

  const [taskData, multimediaData] = await Promise.all([
    getTaskData(task_id),
    getMultimediaData(task_id)
  ]);

  console.log('Task data loaded:', taskData);
  console.log('Task comments to be passed:', taskData?.comments);

  return (
    <TaskExecution 
      taskId={task_id} 
      multimediaData={multimediaData} 
      taskComments={taskData?.comments || null}
    />
  );
}
