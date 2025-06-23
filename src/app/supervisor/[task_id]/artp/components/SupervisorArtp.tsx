"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Edit, X, Wrench, AlertTriangle, Shield, HelpCircle, ChevronDown, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ArtpData, Task } from "@/types/task"
import EditModal from "./EditModal"

interface SupervisorArtpProps {
    artpData: ArtpData;
    taskData: Task;
    editToolAction: (formData: FormData) => Promise<{ success: boolean; message: string }>
    editUndesiredEventAction: (formData: FormData) => Promise<{ success: boolean; message: string }>
    editControlAction: (formData: FormData) => Promise<{ success: boolean; message: string }>
    editVerificationQuestionAction: (formData: FormData) => Promise<{ success: boolean; message: string }>
}

interface ActionButtonsProps {
    onEdit: () => void;
    onDelete: () => void;
}

interface EditModalState {
    isOpen: boolean
    type: "tool" | "undesiredEvent" | "control" | "verificationQuestion" | null
    item: any
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
}: SupervisorArtpProps) {
    const router = useRouter();

    const [expandedActivities, setExpandedActivities] = useState<Set<number>>(new Set())
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
    const [editModal, setEditModal] = useState<EditModalState>({
        isOpen: false,
        type: null,
        item: null,
        title: "",
    })

    const getDataForCriticActivity = (criticActivityId: number) => {
        return {
            tools: artpData.tools?.filter((tool) => tool.criticActivityId === criticActivityId) || [],
            undesiredEvents: artpData.undesiredEvents?.filter((event) => event.criticActivityId === criticActivityId) || [],
            controls: artpData.controls?.filter((control) => control.criticActivityId === criticActivityId) || [],
            verificationQuestions: artpData.verificationQuestions?.filter((question) => question.criticActivityId === criticActivityId) || []
        }
    }

    const handleEdit = (type: "tool" | "undesiredEvent" | "control" | "verificationQuestion", item: any) => {
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

    const handleDelete = (type: string, id: string) => {
        console.log(`Delete ${type} with ID ${id}`)
        // Implementar funcionalidad de borrar más tarde
    }

    const closeModal = () => {
        setEditModal({
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
                                                                <ActionButtons
                                                                    onEdit={() => handleEdit("tool", tool)}
                                                                    onDelete={() => handleDelete("tool", tool.id.toString())}
                                                                />
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
                                                                <ActionButtons
                                                                    onEdit={() => handleEdit("undesiredEvent", event)}
                                                                    onDelete={() => handleDelete("undesiredEvent", event.id.toString())}
                                                                />
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
                                                                <ActionButtons
                                                                    onEdit={() => handleEdit("control", control)}
                                                                    onDelete={() => handleDelete("control", control.id.toString())}
                                                                />
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
                                                                <ActionButtons
                                                                    onEdit={() => handleEdit("verificationQuestion", question)}
                                                                    onDelete={() => handleDelete("verificationQuestion", question.id.toString())}
                                                                />
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
            </div>

            {editModal.isOpen && editModal.type && (
                <EditModal
                    isOpen={editModal.isOpen}
                    onClose={closeModal}
                    title={editModal.title}
                    item={editModal.item}
                    taskId={taskData.id.toString()}
                    action={getEditAction()}
                    type={editModal.type}
                />
            )}
        </div>
    )
}