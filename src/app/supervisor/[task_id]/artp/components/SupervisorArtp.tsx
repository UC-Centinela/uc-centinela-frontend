"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Edit, X, Wrench, AlertTriangle, Shield, HelpCircle, ChevronDown, ChevronRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ArtpData, Task, Tools, UndesiredEvent, Control, VerificationQuestion } from "@/types/task"
import EditModal from "./EditModal"
import DeleteConfirmModal from "./DeleteConfirmModal"
import RejectModal from "./RejectModal"

// Union type for items that can be edited/deleted
type EditableItem = Tools | UndesiredEvent | Control | VerificationQuestion

interface SupervisorArtpProps {
    artpData: ArtpData
    taskData: Task
    editToolAction: (formData: FormData) => Promise<{ success: boolean; message: string }>
    editUndesiredEventAction: (formData: FormData) => Promise<{ success: boolean; message: string }>
    editControlAction: (formData: FormData) => Promise<{ success: boolean; message: string }>
    editVerificationQuestionAction: (formData: FormData) => Promise<{ success: boolean; message: string }>
    deleteToolAction: (toolId: string, taskId: string) => Promise<{ success: boolean; message: string }>
    deleteUndesiredEventAction: (eventId: string, taskId: string) => Promise<{ success: boolean; message: string }>
    deleteControlAction: (controlId: string, taskId: string) => Promise<{ success: boolean; message: string }>
    deleteVerificationQuestionAction: (
        questionId: string,
        taskId: string,
    ) => Promise<{ success: boolean; message: string }>
    approveTaskAction: (taskId: string) => Promise<boolean>
    rejectTaskAction: (taskId: string, comment: string) => Promise<boolean>
}

interface ActionButtonsProps {
    onEdit: () => void;
    onDelete: () => void;
}

interface EditModalState {
    isOpen: boolean
    type: "tool" | "undesiredEvent" | "control" | "verificationQuestion" | null
    item: EditableItem | null
    title: string
}

interface DeleteModalState {
    isOpen: boolean
    type: "tool" | "undesiredEvent" | "control" | "verificationQuestion" | null
    item: EditableItem | null
    title: string
}

function ActionButtons({ onEdit, onDelete }: ActionButtonsProps) {
  return (
    <div className="flex gap-2 ml-auto">
      <Button
        size="sm"
        variant="outline"
        onClick={onEdit}
        className="border-blue-500 text-blue-600 hover:bg-blue-50 px-3 py-1 text-xs"
      >
        <Edit className="h-3 w-3 mr-1" />
        Editar
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={onDelete}
        className="border-red-500 text-red-600 hover:bg-red-50 px-3 py-1 text-xs"
      >
        <X className="h-3 w-3 mr-1" />
        Borrar
      </Button>
    </div>
  )
}

export default function SupervisorArtp({
    artpData,
    taskData,
    editToolAction,
    editUndesiredEventAction,
    editControlAction,
    editVerificationQuestionAction, 
    deleteToolAction,
    deleteUndesiredEventAction,
    deleteControlAction,
    deleteVerificationQuestionAction,
    approveTaskAction,
    rejectTaskAction
}: SupervisorArtpProps) {
    const router = useRouter();

    const [expandedActivities, setExpandedActivities] = useState<Set<number>>(new Set())
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
    const [isApproving, setIsApproving] = useState(false)
    const [editModal, setEditModal] = useState<EditModalState>({
        isOpen: false,
        type: null,
        item: null,
        title: "",
    })

    const [deleteModal, setDeleteModal] = useState<DeleteModalState>({
        isOpen: false,
        type: null,
        item: null,
        title: "",
    })

    const [isRejecting, setIsRejecting] = useState(false)
    const [rejectModalOpen, setRejectModalOpen] = useState(false)
    const [rejectComment, setRejectComment] = useState("")
    const [rejectError, setRejectError] = useState("")

    const isReadOnly = taskData.state === "REVIEWED" || taskData.state === "IS_REJECTED";

    const getDataForCriticActivity = (criticActivityId: number) => {
        return {
            tools: artpData.tools?.filter((tool) => tool.criticActivityId === criticActivityId) || [],
            undesiredEvents: artpData.undesiredEvents?.filter((event) => event.criticActivityId === criticActivityId) || [],
            controls: artpData.controls?.filter((control) => control.criticActivityId === criticActivityId) || [],
            verificationQuestions: artpData.verificationQuestions?.filter((question) => question.criticActivityId === criticActivityId) || []
        }
    }

    const handleEdit = (type: "tool" | "undesiredEvent" | "control" | "verificationQuestion", item: EditableItem) => {
        const titles = {
            tool: "Editar Herramienta",
            undesiredEvent: "Editar Evento No Deseado",
            control: "Editar Control",
            verificationQuestion: "Editar Pregunta de Verificación",
        }

        setEditModal({
            isOpen: true,
            type,
            item,
            title: titles[type],
        })
    }

    const handleDelete = (type: "tool" | "undesiredEvent" | "control" | "verificationQuestion", item: EditableItem) => {
        const titles = {
            tool: "Eliminar Herramienta",
            undesiredEvent: "Eliminar Evento No Deseado",
            control: "Eliminar Control",
            verificationQuestion: "Eliminar Pregunta de Verificación",
        }

        setDeleteModal({
            isOpen: true,
            type,
            item,
            title: titles[type],
        })
    }

    const closeModal = () => {
        setEditModal({
            isOpen: false,
            type: null,
            item: null,
            title: "",
        })
    }

    const closeDeleteModal = () => {
        setDeleteModal({
            isOpen: false,
            type: null,
            item: null,
            title: "",
        })
    }

    const getEditAction = () => {
        switch (editModal.type) {
            case "tool":
                return editToolAction
            case "undesiredEvent":
                return editUndesiredEventAction
            case "control":
                return editControlAction
            case "verificationQuestion":
                return editVerificationQuestionAction
            default:
                return editToolAction
        }
    }

    const handleDeleteConfirm = async () => {
        if (!deleteModal.type || !deleteModal.item) return

        try {
            let result
            const itemId = deleteModal.item.id.toString()
            const taskId = taskData.id.toString()

            switch (deleteModal.type) {
                case "tool":
                    result = await deleteToolAction(itemId, taskId)
                    break
                case "undesiredEvent":
                    result = await deleteUndesiredEventAction(itemId, taskId)
                    break
                case "control":
                    result = await deleteControlAction(itemId, taskId)
                    break
                case "verificationQuestion":
                    result = await deleteVerificationQuestionAction(itemId, taskId)
                    break
                default:
                    return
            }

            if (result.success) {
                closeDeleteModal()
                // Optionally show success message
            }
        } catch (error) {
            console.error("Error deleting item:", error)
        }
    }

    const handleApproveTask = async () => {
        setIsApproving(true)
        try {
            const success = await approveTaskAction(taskData.id.toString())
            if (success) {
                router.push(`/supervisor/${taskData.id}/artp/approved`)
            } else {
                console.error("Error approving task")
            }
        } catch (error) {
            console.error("Error approving task:", error)
        } finally {
            setIsApproving(false)
        }
    }

    const handleRejectTaskWithComment = async (comment: string): Promise<boolean> => {
        if (!comment.trim()) {
            setRejectError("Debes ingresar un comentario explicando el motivo del rechazo.")
            return false;
        }
        setIsRejecting(true)
        setRejectError("")
        try {
            const success = await rejectTaskAction(taskData.id.toString(), comment)
            if (success) {
                setRejectComment("")
                return true;
            } else {
                setRejectError("Ocurrió un error al rechazar la tarea.")
                return false;
            }
        } catch (error) {
            setRejectError("Ocurrió un error al rechazar la tarea.")
            console.error("Error rejecting task:", error)
            return false;
        } finally {
            setIsRejecting(false)
        }
    }

    const toggleActivity = (activityId: number) => {
        const newExpanded = new Set(expandedActivities)
        if (newExpanded.has(activityId)) {
            newExpanded.delete(activityId)
        } else {
            newExpanded.add(activityId)
        }
        setExpandedActivities(newExpanded)
     }

    const toggleSection = (sectionKey: string) => {
        const newExpanded = new Set(expandedSections)
        if (newExpanded.has(sectionKey)) {
            newExpanded.delete(sectionKey)
        } else {
            newExpanded.add(sectionKey)
        }
        setExpandedSections(newExpanded)
    }

    return (
        <div className="min-h-screen bg-gray-100 pb-6">
            <div className="bg-white p-4 shadow-sm">
                <Button variant="ghost" onClick={() => router.back()} className="text-red-500 mb-2">
                    <ChevronLeft className="h-5 w-5 mr-1" /> Volver
                </Button>

                <h1 className="text-2xl font-bold text-teal-800 mb-6 mt-4">{taskData.title}</h1>

                <div className="flex items-center justify-between mb-2 text-sm px-4">
                    <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-bold mb-1">
                            1
                        </div>
                        <span className="text-gray-500">Registro</span>
                    </div>
                    <div className="flex-1 h-1 mx-2 bg-gray-200">
                        <div className="w-full h-full bg-teal-700"></div>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold mb-1">
                            2
                        </div>
                        <span className="text-teal-800 font-semibold">ARTP</span>
                    </div>
                </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">Análisis de Riesgo de la Tarea Planificado (ARTP)</h2>
            </div>

            <div className="px-6 py-6">
                <div className="space-y-4">
                    {artpData.criticActivities.map((activity, index) => {
                        const activityData = getDataForCriticActivity(activity.id);
                        const number = index + 1;
                        const isExpanded = expandedActivities.has(activity.id)
                        return (
                            <section key={activity.id} className="bg-white rounded-lg shadow-sm">
                                <div 
                                    className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                                    onClick={() => toggleActivity(activity.id)}
                                >
                                    <div className="border-l-4 border-teal-700 pl-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">
                                                    {number}
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-semibold text-gray-800">{activity.title}</h3>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {isExpanded ? (
                                                    <ChevronDown className="h-5 w-5 text-gray-500" />
                                                ) : (
                                                    <ChevronRight className="h-5 w-5 text-gray-500" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div className="px-6 pb-6 space-y-6">
                                        {activityData.tools?.length > 0 && (
                                            <div>
                                                <div 
                                                    className="flex items-center justify-between p-3 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
                                                    onClick={() => toggleSection(`tools-${activity.id}`)}
                                                >
                                                    <div className="flex items-center">
                                                        <Wrench className="h-5 w-5 text-teal-700 mr-2" />
                                                        <h4 className="text-mg font-semibold text-gray-800">Herramientas y equipos escenciales</h4>
                                                        <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs ml-2">
                                                            {activityData.tools.length}
                                                        </div>
                                                    </div>
                                                    {expandedSections.has(`tools-${activity.id}`) ? (
                                                        <ChevronDown className="h-4 w-4 text-gray-500" />
                                                    ) : (
                                                        <ChevronRight className="h-4 w-4 text-gray-500" />
                                                    )}
                                                </div>

                                                {expandedSections.has(`tools-${activity.id}`) && (
                                                    <div className="mt-3 space-y-2">
                                                        {activityData.tools.map((tool) => (
                                                            <div key={tool.id} className="bg-gray-50 rounded-lg p-4 flex items-start justify-between">
                                                                <div className="flex-1">
                                                                    <p className="text-sm text-gray-800">{tool.title}</p>
                                                                </div>
                                                                {!isReadOnly && (
                                                                    <ActionButtons
                                                                        onEdit={() => handleEdit("tool", tool)}
                                                                        onDelete={() => handleDelete("tool", tool)}
                                                                    />
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {activityData.undesiredEvents?.length > 0 && (
                                            <div>
                                                <div 
                                                    className="flex items-center justify-between p-3 bg-red-50 rounded-lg cursor-pointer hover:bg-red-100 transition-colors"
                                                    onClick={() => toggleSection(`undesiredEvents-${activity.id}`)}
                                                >
                                                    <div className="flex items-center">
                                                        <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                                                        <h4 className="text-mg font-semibold text-gray-800">Evento no deseado o consecuencia</h4>
                                                        <div className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs ml-2">
                                                            {activityData.undesiredEvents.length}
                                                        </div>
                                                    </div>
                                                    {expandedSections.has(`undesiredEvents-${activity.id}`) ? (
                                                        <ChevronDown className="h-4 w-4 text-gray-500" />
                                                    ) : (
                                                        <ChevronRight className="h-4 w-4 text-gray-500" />
                                                    )}
                                                </div>

                                                {expandedSections.has(`undesiredEvents-${activity.id}`) && (
                                                    <div className="mt-3 space-y-2">
                                                        {activityData.undesiredEvents.map((event) => (
                                                            <div key={event.id} className="bg-gray-50 rounded-lg p-4 flex items-start justify-between">
                                                                <div className="flex-1">
                                                                    <p className="text-sm text-gray-800">{event.title}</p>
                                                                    {event.description && (
                                                                        <p className="text-xs text-gray-600 mb-2">{event.description}</p>
                                                                    )}
                                                                </div>
                                                                {!isReadOnly && (
                                                                    <ActionButtons
                                                                        onEdit={() => handleEdit("undesiredEvent", event)}
                                                                        onDelete={() => handleDelete("undesiredEvent", event)}
                                                                    />
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {activityData.controls?.length > 0 && (
                                            <div>
                                                <div 
                                                    className="flex items-center justify-between p-3 bg-green-50 rounded-lg cursor-pointer hover:bg-green-100 transition-colors"
                                                    onClick={() => toggleSection(`controls-${activity.id}`)}
                                                >
                                                    <div className="flex items-center">
                                                        <Shield className="h-5 w-5 text-green-600 mr-2" />
                                                        <h4 className="text-mg font-semibold text-gray-800">Controles</h4>
                                                        <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs ml-2">
                                                            {activityData.controls.length}
                                                        </div>
                                                    </div>
                                                    {expandedSections.has(`controls-${activity.id}`) ? (
                                                        <ChevronDown className="h-4 w-4 text-gray-500" />
                                                    ) : (
                                                        <ChevronRight className="h-4 w-4 text-gray-500" />
                                                    )}
                                                </div>

                                                {expandedSections.has(`controls-${activity.id}`) && (
                                                    <div className="mt-3 space-y-2">
                                                        {activityData.controls.map((control) => (
                                                            <div key={control.id} className="bg-gray-50 rounded-lg p-4 flex items-start justify-between">
                                                                <div className="flex-1">
                                                                    <p className="text-sm text-gray-800">{control.title}</p>
                                                                    {control.description && (
                                                                        <p className="text-xs text-gray-600 mb-2">{control.description}</p>
                                                                    )}
                                                                </div>
                                                                {!isReadOnly && (
                                                                    <ActionButtons
                                                                        onEdit={() => handleEdit("control", control)}
                                                                        onDelete={() => handleDelete("control", control)}
                                                                    />
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {activityData.verificationQuestions?.length > 0 && (
                                            <div>
                                                <div 
                                                    className="flex items-center justify-between p-3 bg-purple-50 rounded-lg cursor-pointer hover:bg-purple-100 transition-colors"
                                                    onClick={() => toggleSection(`questions-${activity.id}`)}
                                                >
                                                    <div className="flex items-center">
                                                        <HelpCircle className="h-5 w-5 text-purple-600 mr-2" />
                                                        <h4 className="text-mg font-semibold text-gray-800">Preguntas de verificación de controles</h4>
                                                        <div className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs ml-2">
                                                            {activityData.verificationQuestions.length}
                                                        </div>
                                                    </div>
                                                    {expandedSections.has(`questions-${activity.id}`) ? (
                                                        <ChevronDown className="h-4 w-4 text-gray-500" />
                                                    ) : (
                                                        <ChevronRight className="h-4 w-4 text-gray-500" />
                                                    )}
                                                </div>

                                                {expandedSections.has(`questions-${activity.id}`) && (
                                                    <div className="mt-3 space-y-2">
                                                        {activityData.verificationQuestions.map((question) => (
                                                            <div key={question.id} className="bg-gray-50 rounded-lg p-4 flex items-start justify-between">
                                                                <div className="flex-1">
                                                                    <p className="text-sm text-gray-800">{question.title}</p>
                                                                    {question.description && (
                                                                        <p className="text-xs text-gray-600 mb-2">{question.description}</p>
                                                                    )}
                                                                </div>
                                                                {!isReadOnly && (
                                                                    <ActionButtons
                                                                        onEdit={() => handleEdit("verificationQuestion", question)}
                                                                        onDelete={() => handleDelete("verificationQuestion", question)}
                                                                    />
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </section>
                        )
                    })}
                </div>

                <div className="mt-8 flex justify-center gap-4">
                    {isReadOnly ? (
                        <div className="text-lg text-gray-600 font-semibold py-6">
                          {taskData.state === "REVIEWED"
                            ? "La tarea ya ha sido aprobada y no se puede modificar."
                            : taskData.state === "IS_REJECTED"
                            ? "La tarea fue rechazada y no se puede modificar."
                            : "La tarea no se puede modificar."}
                        </div>
                    ) : (
                        <>
                        <Button
                            onClick={handleApproveTask}
                            disabled={isApproving}
                            className="bg-teal-700 hover:bg-teal-800 text-white px-8 py-3 text-lg font-semibold"
                            size="lg"
                        >
                            {isApproving ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Aprobando...
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    <Check className="h-5 w-5 mr-2" />
                                    Aprobar ARTP
                                </div>
                            )}
                        </Button>
                        <Button
                            onClick={() => setRejectModalOpen(true)}
                            disabled={isRejecting}
                            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg font-semibold"
                            size="lg"
                        >
                            {isRejecting ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Rechazando...
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    <X className="h-5 w-5 mr-2" />
                                    Rechazar ARTP
                                </div>
                            )}
                        </Button>
                        </>
                    )}
                </div>

            </div>

            {editModal.isOpen && editModal.type && editModal.item && (
                <EditModal
                    isOpen={editModal.isOpen}
                    onClose={closeModal}
                    title={editModal.title}
                    item={editModal.item!}
                    taskId={taskData.id.toString()}
                    action={getEditAction()}
                    type={editModal.type}
                />
            )}

            {deleteModal.isOpen && deleteModal.type && (
                <DeleteConfirmModal
                    isOpen={deleteModal.isOpen}
                    onClose={closeDeleteModal}
                    onConfirm={handleDeleteConfirm}
                    itemName={deleteModal.item?.title || ""}
                    type={deleteModal.type}
                />
            )}

            {rejectModalOpen && (
                <RejectModal
                    isOpen={rejectModalOpen}
                    onClose={() => { setRejectModalOpen(false); setRejectError(""); }}
                    onConfirm={async (comment) => await handleRejectTaskWithComment(comment)}
                    loading={isRejecting}
                    error={rejectError}
                    comment={rejectComment}
                    setComment={setRejectComment}
                    taskId={taskData.id.toString()}
                />
            )}
        </div>
    )
}