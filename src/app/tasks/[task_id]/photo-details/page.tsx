import { notFound, redirect } from "next/navigation";
import client from "@/lib/apollo-client";
import { gql } from "@apollo/client";
import PhotoDetailsClient from "./PhotoDetailsClient";
import { getTaskData, validateTaskAccess } from "@/services/task";

const FIND_MULTIMEDIA_BY_TASK_ID = gql`
  query FindMultimediaByTaskId($taskId: Int!) {
    findMultimediaByTaskId(taskId: $taskId) {
      id
      taskId
      photoUrl
    }
  }
`;

interface MultimediaItem {
  id: number;
  taskId: number;
  photoUrl: string | null;
}

// Para el componente cliente, photoUrl ya no puede ser null
interface PhotoData {
  id: number;
  taskId: number;
  photoUrl: string;
}

async function getPhotoData(taskId: string): Promise<PhotoData[]> {
  try {
    const { data } = await client.query<{
      findMultimediaByTaskId: MultimediaItem[];
    }>({
      query: FIND_MULTIMEDIA_BY_TASK_ID,
      variables: { taskId: Number(taskId) },
      fetchPolicy: "no-cache",
    });

    // Filtramos solo los que tengan photoUrl != null
    const soloConFoto = data.findMultimediaByTaskId.filter(
      (item) => item.photoUrl !== null
    );

    // Mapeamos a PhotoData (le decimos a TS que photoUrl nunca será null tras el filtro)
    return soloConFoto.map((item) => ({
      id: item.id,
      taskId: item.taskId,
      photoUrl: item.photoUrl!, // el “!” indica que aquí sabemos que ya no es null
    }));
  } catch (error) {
    console.error("Error fetching multimedia data:", error);
    return [];
  }
}

interface PageProps {
  params: Promise<{ task_id: string }>; // Next.js en este caso pasa params como Promesa
}

export default async function PhotoDetailsPage({ params }: PageProps) {
  // <-- Aquí esperamos que se resuelva la promesa “params”
  const { task_id } = await params;
  const taskData = await getTaskData(task_id);
  // Validar acceso
  const hasAccess = await validateTaskAccess(task_id);
  if (!hasAccess) {
    notFound();
  }

  const photoData = await getPhotoData(task_id);

  // Si no hay fotos, mostrar 404
  if (!photoData || photoData.length === 0) {
    notFound();
  }

  if (taskData?.state === "COMPLETED") {
    redirect(`/tasks/${task_id}/send`);
  } else if (taskData?.state === "REVIEWED") {
    redirect(`/tasks/${task_id}/approved`);
  } else if (taskData?.state === "IS_REJECTED") {
    redirect(`/tasks`);
  }

  // photoData ya es PhotoData[], sin photoUrl null
  return <PhotoDetailsClient taskId={task_id} initialPhotos={photoData} />;
}
