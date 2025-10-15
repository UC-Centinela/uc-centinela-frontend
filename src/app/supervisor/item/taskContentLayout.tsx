"use client";

import { User } from "@/types/user";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import TaskForm from "../components/taskForm";
import { createTask } from "@/services/task";
import { useRouterLoading } from "@/hooks/useRouterLoading";

interface TaskContentLayoutProps {
  users: User[];
}

export default function TaskContentLayout({ users }: TaskContentLayoutProps) {
  const { push: pushWithLoading } = useRouterLoading();
  const handleSubmit = async (formData: FormData) => {
    console.log('📝 [TaskContentLayout] === INICIANDO ENVÍO DE FORMULARIO ===');
    console.log('📝 [TaskContentLayout] FormData recibido:', formData);
    
    // Log de todos los campos del formulario
    const formDataEntries = Array.from(formData.entries());
    console.log('📝 [TaskContentLayout] Campos del formulario:', formDataEntries);
    
    // Log específico de campos de ubicación
    const locationFields = formDataEntries.filter(([key]) => 
      key.includes('latitude') || key.includes('longitude') || key.includes('location')
    );
    console.log('📝 [TaskContentLayout] Campos de ubicación:', locationFields);
    
    const response = await createTask(formData);
    console.log('📝 [TaskContentLayout] Respuesta del servicio:', response);
    
    if (response?.success) {
      console.log('📝 [TaskContentLayout] ✅ Tarea creada exitosamente, redirigiendo...');
      pushWithLoading("/supervisor");
    } else {
      console.error('📝 [TaskContentLayout] ❌ Error en la creación de tarea:', response);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h6 className="text-xs text-[#666666] font-medium">
            Supervisor de evaluación de riesgo
          </h6>
          <h1 className="text-[#176170] font-semibold text-xl">
            Crear nueva tarea
          </h1>
        </div>
      </div>

      <div className="mb-6">
        <Link href="/supervisor">
          <span className="inline-flex items-center gap-2 text-[#176170] hover:underline text-sm font-medium">
            <ArrowLeft className="h-4 w-4" /> Volver
          </span>
        </Link>
      </div>

      <form action={handleSubmit}>
        <TaskForm users={users} />
      </form>
    </div>
  );
}
