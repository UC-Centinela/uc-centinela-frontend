"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface ApprovedContentProps {
  taskId: string;
}

export default function ApprovedContent({ taskId }: ApprovedContentProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100 pb-6">
      <div className="bg-white p-4 shadow-sm">
        <Button
          variant="ghost"
          onClick={() => router.push('/tasks')}
          className="text-red-500 mb-2"
        >
          <ChevronLeft className="h-5 w-5 mr-1" /> Volver a tareas
        </Button>

        <h1 className="text-2xl font-bold text-teal-800 mb-6 mt-4">
          Estado ARTP
        </h1>

        <div className="flex items-center justify-between mb-2 text-sm px-4">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold mb-1">
              <CheckCircle className="h-5 w-5" />
            </div>
            <span className="text-teal-800 font-semibold">Registro</span>
          </div>
          <div className="flex-1 h-1 mx-2 bg-teal-700">
            <div className="w-full h-full bg-teal-700"></div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-teal-700 text-white flex items-center justify-center mb-1">
              <CheckCircle className="h-5 w-5" />
            </div>
            <span className="text-teal-800 font-semibold">Resultado ARTP</span>
          </div>
          <div className="flex-1 h-1 mx-2 bg-teal-700">
            <div className="w-full h-full bg-teal-700"></div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-teal-700 text-white flex items-center justify-center mb-1">
              <CheckCircle className="h-5 w-5" />
            </div>
            <span className="text-teal-800 font-semibold">Envío</span>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 mt-8">
        <div className="bg-white rounded-lg p-8 shadow-sm text-center">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-8">
            Tu propuesta de ARTP ha sido aprobada
          </h2>
          <Button 
            onClick={() => router.push('/tasks')}
            className="w-full bg-teal-700 hover:bg-teal-800 text-white rounded-md font-normal text-lg h-12"
          >
            Volver a tareas
          </Button>
        </div>
      </div>
    </div>
  );
} 