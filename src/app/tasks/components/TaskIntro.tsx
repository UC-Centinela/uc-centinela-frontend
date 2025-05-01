"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, FileText, Edit } from "lucide-react";
import React from "react";

export default function TaskIntro() {
  const router = useRouter();

  const steps = [
    {
      id: 1,
      text: "Registra las actividades y el entorno de la tarea",
      icon: <FileText />,
    },
    {
      id: 2,
      text: "Revisa y/o edita la propuesta de controles de riesgo ARTP",
      icon: <Edit />,
    },
    {
      id: 3,
      text: "Envía la propuesta de ARTP para su revisión",
      icon: <Edit />,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 w-full">
      <div className="flex flex-col justify-between min-h-screen max-w-full md:max-w-4xl mx-auto">
        <div className="w-full">
          <div className="p-4 pb-2 bg-sky-50">
            <Button
              variant="ghost"
              className="text-sm md:text-base text-red-600 mb-3 p-0 flex items-center font-normal"
              onClick={() => router.push("/tasks")}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Volver a Tareas Asignadas
            </Button>

            <h1 className="text-2xl md:text-4xl font-bold text-teal-800 mb-8">
              Posicionamiento de cable minero eléctrico sobre el pretil
              utilizando equipo de apoyo
            </h1>
          </div>

          <div className="px-4 pb-6">
            <p className="text-lg md:text-xl text-gray-700 mb-6 mt-6">
              Realiza el Análisis de Riesgo para completar la información acerca
              de la tarea.
            </p>

            <h2 className="font-bold text-xl md:text-2xl text-teal-800 mb-5">
              Son solo 3 pasos:
            </h2>

            <div className="space-y-4 md:grid md:grid-cols-3 md:gap-4 md:space-y-0">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className="flex items-start p-4 bg-gray-100 rounded-lg shadow-sm"
                >
                  <div className="mr-3 flex items-center">
                    {React.cloneElement(step.icon, {
                      className: "h-5 w-5 text-teal-700 mt-1",
                    })}
                  </div>
                  <div>
                    <span className="text-teal-700 font-bold mr-2 text-lg">
                      {step.id}.
                    </span>
                    <span className="text-gray-800 text-base md:text-lg">
                      {step.text}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 w-full mt-8 md:mt-auto pb-8">
          <Button
            onClick={() => router.push("/tasks/id/risk_analysis")}
            className="w-full md:max-w-xs md:mx-auto md:block bg-teal-700 hover:bg-teal-800 text-white rounded-md font-normal text-lg mb-4 flex items-center justify-center h-12"
          >
            Comenzar Análisis de Riesgo
          </Button>
        </div>
      </div>
    </div>
  );
}