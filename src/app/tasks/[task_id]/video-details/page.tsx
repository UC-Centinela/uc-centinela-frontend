import { gql } from '@apollo/client'
import client from '@/lib/apollo-client'
import VideoDetailsClient from './VideoDetailsClient'
import { notFound } from 'next/navigation'
import { validateTaskAccess } from "@/services/tasks";

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
`

interface MultimediaItem {
  id: number;
  taskId: number;
  photoUrl: string | null;
  videoUrl: string | null;
  audioTranscription: string | null;
}

async function getMultimediaData(taskId: string): Promise<MultimediaItem[]> {
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

interface PageProps {
  params: Promise<{
    task_id: string;
  }>;
}

export default async function VideoDetailsPage({ params }: PageProps) {
  const { task_id } = await params;
  
  // Validate task access
  const hasAccess = await validateTaskAccess(task_id);
  if (!hasAccess) {
    notFound();
  }
  
  const multimediaData = await getMultimediaData(task_id);
  const videoData = multimediaData.find((item) => item.videoUrl);

  return <VideoDetailsClient taskId={task_id} initialVideoData={videoData} />;
}
