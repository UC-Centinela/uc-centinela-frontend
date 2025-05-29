import VideoDetailsClient from './VideoDetailsClient'

export default async function VideoDetailsPage({ params }: { params: Promise<{ task_id: string }> }) {
  const { task_id } = await params;
  return <VideoDetailsClient taskId={task_id} />;
}
