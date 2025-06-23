import SupervisorArtp from "./components/SupervisorArtp";
import { generateArtp, getTasksByReviewer, updateTool, updateUndesiredEvent, updateControl, updateVerificationQuestion } from "@/services/task";
import { notFound } from "next/navigation";
import type { ArtpData, Task } from "@/types/task";
import { cookies } from "next/headers";
import { getUserProfile } from "@/services/users";
import { revalidatePath } from "next/cache";

async function getArtpData(taskId: string): Promise<ArtpData | null> {
    try {
        const formData = new FormData();
        formData.append("taskId", taskId);
        const artpData = await generateArtp(formData);
        return artpData;
    } catch (error) {
        console.error("Error fetching ARTP data:", error);
        return null;
    }
}

async function getTaskData(taskId: string): Promise<Task | null> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return null;
    }

    const user = await getUserProfile();
    if (!user?.data?.getUserByEmail?.id) {
      return null;
    }

    const userId = parseInt(user.data.getUserByEmail.id);

    const tasks = await getTasksByReviewer(userId);

    const task = tasks.find((t: Task) => t.id.toString() === taskId);

    return task || null;
  } catch (error) {
    console.error("Error fetching task data:", error);
    return null;
  }
}

async function editTool(formData: FormData) {
  "use server"
  try {
    const toolId = formData.get('toolId') as string
    const serviceFormData = new FormData
    serviceFormData.append('id', toolId)
    serviceFormData.append('title', formData.get('title') as string)
    const result = await updateTool(serviceFormData)
    if (!result) {
      return { success: false, message: 'Error'}
    }
    if (result.success) {
      const taskId = formData.get('taskId') as string
      revalidatePath(`/supervisor/${taskId}/artp`)
      return { success: true, message: 'Herramienta actualizada correctamente' }
    } else {
      return { success: false, message: result.error || "Error al actualizar la herramienta" }
    }
  } catch (error) {
    console.error("Error updating tool:", error)
    return { success: false, message: "Error al actualizar la herramienta" }
  }
}

async function editUndesiredEvent(formData: FormData) {
  "use server"
  try {
    const eventId = formData.get("eventId") as string
    const serviceFormData = new FormData()
    serviceFormData.append("id", eventId)
    serviceFormData.append("title", formData.get("title") as string)
    serviceFormData.append("description", formData.get("description") as string)
    const result = await updateUndesiredEvent(serviceFormData)
    if (!result) {
      return { success: false, message: "Error" }
    }
    if (result.success) {
      const taskId = formData.get("taskId") as string
      revalidatePath(`/supervisor/${taskId}/artp`)
      return { success: true, message: "Evento no deseado actualizado correctamente" }
    } else {
      return { success: false, message: result.error || "Error al actualizar el evento no deseado" }
    }
  } catch (error) {
    console.error("Error updating undesired event:", error)
    return { success: false, message: "Error al actualizar el evento no deseado" }
  }
}

async function editControl(formData: FormData) {
  "use server"
  try {
    const controlId = formData.get("controlId") as string
    const serviceFormData = new FormData()
    serviceFormData.append("id", controlId)
    serviceFormData.append("title", formData.get("title") as string)
    serviceFormData.append("description", formData.get("description") as string)
    const result = await updateControl(serviceFormData)
    if (!result) {
      return { success: false, message: "Error" }
    }
    if (result.success) {
      const taskId = formData.get("taskId") as string
      revalidatePath(`/supervisor/${taskId}/artp`)
      return { success: true, message: "Control actualizado correctamente" }
    } else {
      return { success: false, message: result.error || "Error al actualizar el control" }
    }
  } catch (error) {
    console.error("Error updating control:", error)
    return { success: false, message: "Error al actualizar el control" }
  }
}

async function editVerificationQuestion(formData: FormData) {
  "use server"
  try {
    const questionId = formData.get("questionId") as string
    const serviceFormData = new FormData()
    serviceFormData.append("id", questionId)
    serviceFormData.append("title", formData.get("title") as string)
    serviceFormData.append("description", formData.get("description") as string)
    const result = await updateVerificationQuestion(serviceFormData)
    if (!result) {
      return { success: false, message: "Error" }
    }
    if (result.success) {
      const taskId = formData.get("taskId") as string
      revalidatePath(`/supervisor/${taskId}/artp`)
      return { success: true, message: "Pregunta de verificación actualizada correctamente" }
    } else {
      return { success: false, message: result.error || "Error al actualizar la pregunta de verificación" }
    }
  } catch (error) {
    console.error("Error updating verification question:", error)
    return { success: false, message: "Error al actualizar la pregunta de verificación" }
  }
}

export default async function ArtpSupervisorPage({
    params
} : {
    params: Promise<{ task_id: string }>
}) {
    const { task_id } = await params;
    const [artpData, taskData] = await Promise.all([getArtpData(task_id), getTaskData(task_id)]);
    if (!taskData) {
        notFound();
    }
    if (!artpData) {
        notFound();
    }
    return (
      <SupervisorArtp
        artpData={artpData}
        taskData={taskData}
        editToolAction={editTool}
        editUndesiredEventAction={editUndesiredEvent}
        editControlAction={editControl}
        editVerificationQuestionAction={editVerificationQuestion}
      />
    )
}