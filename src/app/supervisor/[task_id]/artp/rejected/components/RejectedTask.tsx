"use client"

import { Button } from "@/components/ui/button"
import { Task } from "@/types/task"
import { useRouter } from "next/navigation"
import { XCircle } from "lucide-react"

interface RejectedTaskProps {
    taskData: Task
}

export default function RejectedTask({ taskData }: RejectedTaskProps) {
    const router = useRouter()
    
    return (
        <div className="min-h-screen bg-gray-10 pb-6">
            <div className="bg-white p-4 shadow-sm">
                <h1 className="text-2xl font-bold text-teal-800 mb-6 mt-4">{taskData.title}</h1>

                <div className="flex items-center justify-between mb-2 text-sm px-4">
                    <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold mb-1">
                            1
                        </div>
                        <span className="text-teal-800 font-semibold">Registro</span>
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

                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800">Análisis de Riesgo de la Tarea Planificado (ARTP)</h2>
                </div>

                <div className="px-6 py-12 flex flex-col items-center justify-center min-h-[60vh]">
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center max-w-md w-full">
                        <div className="mb-6">
                            <XCircle className="h-20 w-20 text-red-800 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">Tarea Rechazada</h3>
                            <p className="text-gray-600">
                                El Análisis de Riesgo de la Tarea Planificado ha sido rechazado correctamente.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <Button
                                onClick={() => router.push("/supervisor")}
                                className="w-full bg-red-700 hover:bg-red-800 text-white py-3 text-lg font-semibold"
                                size="lg"
                            >
                                Volver a Inicio
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}