"use client";

import { User } from "@/types/user";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import TaskForm from "../components/taskForm";
import { createTask } from "@/services/task";
import { useRouter } from "next/navigation";

interface TaskContentLayoutProps {
  users: User[];
}

export default function TaskContentLayout({ users }: TaskContentLayoutProps) {
  const router = useRouter();
  const handleSubmit = async (formData: FormData) => {
    const response = await createTask(formData);
    if (response?.success) {
      router.push("/supervisor");
    } else {
      console.log(response);
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
