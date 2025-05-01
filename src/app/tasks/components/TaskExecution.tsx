"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronLeft, Info, AlertCircle } from "lucide-react";

export default function TaskExecution() {
  const [video, setVideo] = useState<File | null>(null);
  const [photos, setPhotos] = useState<File[]>([]);
  const [strategies, setStrategies] = useState<string[]>([]);
  const [comments, setComments] = useState<string>("");
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100 pb-6">
      <div className="bg-white p-4 shadow-sm">
        <button
          onClick={() => router.push("/tasks/id")}
          className="text-base text-red-500 mb-2 flex items-center font-medium"
        >
          <ChevronLeft className="h-5 w-5 mr-1" /> Salir
        </button>

        <h1 className="text-2xl font-bold text-teal-800 mb-6 mt-4">
          Ejecución Análisis de Riesgo
        </h1>

        <div className="flex items-center justify-between mb-2 text-sm px-4">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold mb-1">
              1
            </div>
            <span className="text-teal-800 font-semibold">Registro</span>
          </div>
          <div className="flex-1 h-1 mx-2 bg-gray-200">
            <div className="w-0 h-full bg-teal-700"></div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center mb-1">
              2
            </div>
            <span className="text-gray-500">Resultado ARTP</span>
          </div>
          <div className="flex-1 h-1 mx-2 bg-gray-200">
            <div className="w-0 h-full bg-teal-700"></div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center mb-1">
              3
            </div>
            <span className="text-gray-500">Envío</span>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 mt-4 space-y-4">
        <section className="bg-white rounded-lg p-5 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold text-gray-800">1. Tomar Video</h2>
            <div className="bg-pink-200 text-pink-700 px-3 py-0.5 rounded-full text-sm font-medium flex items-center">
              Pendiente <AlertCircle className="h-4 w-4 ml-1" />
            </div>
          </div>

          <div className="flex items-start mb-4">
            <div className="flex-shrink-0 mr-1">
              <Info className="h-5 w-5 text-teal-700 mt-0.5" />
            </div>
            <h3 className="text-base font-semibold text-gray-700">
              Instrucciones
            </h3>
          </div>

          <p className="text-gray-600 mb-6 text-base">
            Graba un video de la tarea, actividades, y peligros describiendo de
            manera exhaustiva. Solo se permiten archivos .mp4.
          </p>

          <div className="flex flex-col gap-3">
            <button className="w-full border-2 border-teal-700 text-teal-700 py-3 rounded-md font-medium text-base">
              Subir video
            </button>
            <button className="w-full bg-teal-700 text-white py-3 rounded-md font-medium text-base">
              Grabar video
            </button>
          </div>
        </section>

        <section className="bg-white rounded-lg p-5 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold text-gray-800">
              2. Tomar Fotografías
            </h2>
            <div className="bg-pink-200 text-pink-700 px-3 py-0.5 rounded-full text-sm font-medium flex items-center">
              Pendiente <AlertCircle className="h-4 w-4 ml-1" />
            </div>
          </div>

          <div className="flex items-start mb-4">
            <div className="flex-shrink-0 mr-1">
              <Info className="h-5 w-5 text-teal-700 mt-0.5" />
            </div>
            <h3 className="text-base font-semibold text-gray-700">
              Instrucciones
            </h3>
          </div>

          <p className="text-gray-600 mb-6 text-base">
            Toma fotos de la zona, herramientas y materiales a utilizar, asegura
            de tener una buena fuente de luz.
          </p>

          <button className="w-full bg-teal-700 text-white py-3 rounded-md font-medium text-base">
            Tomar fotos
          </button>
        </section>

        <section className="bg-white rounded-lg p-5 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold text-gray-800">
              3. Seleccionar Estrategias de Control
            </h2>
            <div className="bg-pink-200 text-pink-700 px-3 py-0.5 rounded-full text-sm font-medium flex items-center">
              Pendiente <AlertCircle className="h-4 w-4 ml-1" />
            </div>
          </div>

          <div className="flex items-start mb-4">
            <div className="flex-shrink-0 mr-1">
              <Info className="h-5 w-5 text-teal-700 mt-0.5" />
            </div>
            <h3 className="text-base font-semibold text-gray-700">
              Instrucciones
            </h3>
          </div>

          <p className="text-gray-600 mb-6 text-base">
            Revisa las Estrategias de Control que corresponden a la tarea y/o
            agrega nuevas.
          </p>

          <button className="w-full bg-teal-700 text-white py-3 rounded-md font-medium text-base">
            Seleccionar Estrategias
          </button>
        </section>

        <section className="bg-white rounded-lg p-5 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold text-gray-800">
              4. Comentarios Adicionales
            </h2>
            <div className="bg-pink-200 text-pink-700 px-3 py-0.5 rounded-full text-sm font-medium">
              Opcional
            </div>
          </div>

          <div className="flex items-start mb-4">
            <div className="flex-shrink-0 mr-1">
              <Info className="h-5 w-5 text-teal-700 mt-0.5" />
            </div>
            <h3 className="text-base font-semibold text-gray-700">
              Instrucciones
            </h3>
          </div>

          <p className="text-gray-600 mb-6 text-base">
            Añade información que sea útil para el Análisis de Riesgo.
          </p>

          <textarea
            className="w-full border border-gray-300 rounded-md p-3 text-base"
            placeholder="Añade comentarios"
            rows={4}
          ></textarea>
        </section>

        <button
          className="w-full bg-teal-700 text-white py-3 rounded-md font-medium text-base mt-6"
          disabled={!video || photos.length === 0 || strategies.length === 0}
        >
          Generar ARTP
        </button>
      </div>
    </div>
  );
}
