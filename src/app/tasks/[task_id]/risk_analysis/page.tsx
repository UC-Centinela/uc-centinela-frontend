import TaskExecution from "../../components/TaskExecution";

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

export default async function RiskAnalysis({ params }: { params: { task_id: string } }) {
  const multimediaData = await getMultimediaData(params.task_id);
  
  return <TaskExecution taskId={params.task_id} multimediaData={multimediaData} />;
}
