import TaskExecution from "../../components/TaskExecution";
import { gql } from "@apollo/client";
import client from "@/lib/apollo-client";

const FIND_MULTIMEDIA_BY_TASK_ID = gql`
  query FindMultimediaByTaskId($taskId: Int!) {
    findMultimediaByTaskId(taskId: $taskId) {
      id
      taskId
      photoUrl
      videoUrl
      audioTranscription
    }
  }
`;

async function getMultimediaData(taskId: string) {
  try {
    const { data } = await client.query({
      query: FIND_MULTIMEDIA_BY_TASK_ID,
      variables: { taskId: Number(taskId) },
    });
    return data.findMultimediaByTaskId;
  } catch (error) {
    console.error("Error fetching multimedia data:", error);
    return [];
  }
}

export default async function RiskAnalysis({ params }: { params: Promise<{ task_id: string }> }) {
  const { task_id } = await params;
  const multimediaData = await getMultimediaData(task_id);
  
  return <TaskExecution taskId={task_id} multimediaData={multimediaData} />;
}
