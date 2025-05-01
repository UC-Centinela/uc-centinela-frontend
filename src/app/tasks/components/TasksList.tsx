"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Plus, Calendar, Clock, User, LogOut } from "lucide-react";

export default function TasksList() {
    const [activeTab, setActiveTab] = useState("assigned");
    const router = useRouter();
    
    const tasks = [
        {
            id: 1,
            title: "Posicionamiento de cable minero eléctrico sobre el pretil utilizando equipo de apoyo",
            status: "assigned",
            assignmentDate: "8/02/25",
            requiredDate: "12/02/25",
        },
        {
            id: 2,
            title: "Depositación hidráulica de arenas (Tranque Mauro)",
            status: "assigned",
            assignmentDate: "8/02/25",
            requiredDate: "12/02/25",
        },
        {
            id: 3,
            title: "Operación carga, traslado y descarga de material con camión tolva (fuera de botadero de ripios)",
            status: "review",
            assignmentDate: "8/02/25",
            requiredDate: "12/02/25",
        },
        {
            id: 4,
            title: "Posicionamiento de cable minero eléctrico sobre el pretil utilizando equipo de apoyo",
            status: "assigned",
            assignmentDate: "8/02/25",
            requiredDate: "12/02/25",
        },
    ]

    const filteredTasks = tasks.filter((task) => task.status === activeTab);

    const getStatusName = () => {
        if (activeTab === "assigned") return "asignadas";
        if (activeTab === "review") return "en revisión";
        return "aprobadas";
    }

    return (
        <div className="min-h-screen bg-white">
          
            <div className="p-4 pb-2 flex justify-between items-center">
                <h1 className="text-xl font-medium text-teal-700">Tareas asignadas</h1>
                <div className="flex gap-2">
                    <button className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center">
                        <User className="h-4 w-4 text-teal-700" />
                    </button>
                    <button className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center">
                        <LogOut className="h-4 w-4 text-teal-700" />
                    </button>
                </div>
            </div>
            <div className="px-4 border-b">
                <div className="flex text-sm">
                    <button
                        className={`py-2 px-1 ${activeTab === "assigned" ? "border-b-2 border-teal-700 font-medium" : "text-gray-500"}`}
                        onClick={() => setActiveTab("assigned")}
                    >
                        Asignadas
                    </button>
                    <button
                        className={`py-2 px-1 mx-4 ${activeTab === "review" ? "border-b-2 border-teal-700 font-medium" : "text-gray-500"}`}
                        onClick={() => setActiveTab("review")}
                    >
                        En Revisión
                    </button>
                    <button
                        className={`py-2 px-1 ${activeTab === "approved" ? "border-b-2 border-teal-700 font-medium" : "text-gray-500"}`}
                        onClick={() => setActiveTab("approved")}
                    >
                        Aprobadas
                    </button>
                </div>
            </div>
            <div className="p-4 space-y-4">
                {filteredTasks.length > 0 ? (
                    filteredTasks.map((task) => (
                        <div key={task.id} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                            <h2 className="text-teal-700 font-medium mb-2">{task.title}</h2>
                            <div className="flex flex-col gap-1 mb-2">
                                <div className="flex items-center text-xs text-gray-600">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    Fecha Asignación: {task.assignmentDate}
                                </div>
                                <div className="flex items-center text-xs text-gray-600">
                                    <Clock className="h-3 w-3 mr-1" />
                                    Fecha Requerida Envío: {task.requiredDate}
                                </div>
                            </div>
                            <div className="flex justify-end">
                            <button
                                onClick={() => router.push(`/tasks/${task.id}`)}
                                className="text-xs text-red-500 flex items-center hover:text-red-700 hover:underline transition"
                                >
                                    Ver Detalles <ArrowRight className="h-3 w-3 ml-1" />
                            </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-gray-500">No tienes tareas {getStatusName()}</div>
                )}
            </div>
            <div className="fixed bottom-6 right-6">
                <button 
                    onClick={() => router.push("/tasks/item")}
                    className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                    <Plus className="h-6 w-6" />
                </button>
            </div>
        </div>
    )
}