"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Plus, Calendar, Clock, User, LogOut } from "lucide-react";
import { handleLogout } from "@/services/users";

interface Task {
  id: string;
  title: string;
  instruction: string;
  state: string;
  creatorUserId: string;
  revisorUserId: string;
  comments: string;
  changeHistory: string;
  assignationDate: string;
  requiredSendDate: string;
}

export default function TasksList({ tasks }: { tasks: Task[] }) {
  const [activeTab, setActiveTab] = useState("assigned");
  const router = useRouter();

  const getStatesByTab = (tab: string) => {
    switch (tab) {
      case "assigned":
        return ["PENDING", "IN_PROGRESS"];
      case "review":
        return ["COMPLETED"];
      case "approved":
        return ["REVIEWED"];
      default:
        return [];
    }
  };

  const filteredTasks = tasks.filter((task) =>
    getStatesByTab(activeTab).includes(task.state)
  );

  const getStatusName = () => {
    if (activeTab === "assigned") return "asignadas";
    if (activeTab === "review") return "en revisión";
    return "aprobadas";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-4 pb-2 flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-teal-700 mt-4">
          Tareas asignadas
        </h1>
        <div className="flex gap-2 mt-4">
          <button className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
            <User className="h-5 w-5 text-teal-700" />
          </button>
          <a
            href="/auth/logout"
            className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center"
            onClick={() => handleLogout()}
          >
            <LogOut className="h-5 w-5 text-teal-700" />
          </a>
        </div>
      </div>
      <div className="px-4 border-b bg-gray-100">
        <div className="flex text-sm justify-center">
          <button
            className={`py-3 px-4 ${
              activeTab === "assigned"
                ? "border-b-2 border-teal-700 font-medium text-black"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab("assigned")}
          >
            Asignadas
          </button>
          <button
            className={`py-3 px-4 ${
              activeTab === "review"
                ? "border-b-2 border-teal-700 font-medium text-black"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab("review")}
          >
            En Revisión
          </button>
          <button
            className={`py-3 px-4 ${
              activeTab === "approved"
                ? "border-b-2 border-teal-700 font-medium text-black"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab("approved")}
          >
            Aprobadas
          </button>
        </div>
      </div>
      <div className="p-4 space-y-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div key={task.id} className="bg-white rounded-lg p-4 shadow-sm">
              <h2 className="text-lg font-medium text-teal-700 mb-3">
                {task.title}
              </h2>
              <div className="flex flex-col gap-2 mb-3">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  Fecha Asignación: {formatDate(task.assignationDate)}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-2" />
                  Fecha Requerida Envío: {formatDate(task.requiredSendDate)}
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => router.push(`/tasks/${task.id}`)}
                  className="text-sm text-red-400 flex items-center hover:text-red-600 transition"
                >
                  Ver Detalles <ArrowRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No tienes tareas {getStatusName()}
          </div>
        )}
      </div>
      <div className="fixed bottom-6 right-6">
        <button
          onClick={() => router.push("/tasks/item")}
          className="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg transition hover:bg-red-700"
        >
          <Plus className="h-7 w-7" />
        </button>
      </div>
    </div>
  );
}
