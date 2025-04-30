"use client";

import { useState, useEffect } from "react";

export default function TaskExecution() {
  const [video, setVideo] = useState<File | null>(null);
  const [photos, setPhotos] = useState<File[]>([]);
  const [strategies, setStrategies] = useState<string[]>([]);
  const [comments, setComments] = useState<string>("");

  useEffect(() => {
    const fetchStrategies = async () => {
      const response = await fetch("/api/strategies");
      const data = await response.json();
      setStrategies(data);
    };
    fetchStrategies();

    const fetchPhotos = async () => {
      const response = await fetch("/api/photos");
      const data = await response.json();
      setPhotos(data);
    };
    fetchPhotos();

    const fetchVideo = async () => {
      const response = await fetch("/api/video");
      const data = await response.json();
      setVideo(data);
    };
    fetchVideo();

    const fetchComments = async () => {
      const response = await fetch("/api/comments");
      const data = await response.json();
      setComments(data);
    };
    fetchComments();
  }, []);
  
  

  return (
    <div className="p-4 max-w-md mx-auto min-h-screen bg-white">
      <button className="text-sm text-red-600 mb-4">&larr; Volver a Tareas Asignadas</button>

      <h1 className="text-xl font-bold text-gray-800">Ejecución Análisis de Riesgo</h1>

      <div className="flex items-center justify-between my-4 text-xs font-semibold text-gray-600">
        <div className="text-teal-800">1 Registro</div>
        <div>Resultado ARTP</div>
        <div>Envío</div>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
        <div className="h-full bg-teal-600 w-1/3"></div>
      </div>

      <section className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-bold">1. Tomar Video</h2>
          {video ? (
            <span className="text-green-700 text-xs font-semibold">Completado</span>
          ) : (
            <span className="text-pink-700 text-xs font-semibold">Pendiente</span>
          )}
        </div>
        <p className="text-sm text-gray-700 mb-4">
          <span className="font-semibold">Instrucciones: </span>
          Graba un video de la tarea, actividades, y peligros describiendo de manera exhaustiva. Solo se permiten archivos .mp4.
        </p>
        <div className="flex flex-col gap-2">
          <button className="w-full border border-teal-700 text-teal-700 py-2 rounded-md">Subir video</button>
          <button className="w-full bg-teal-700 text-white py-2 rounded-md">Grabar video</button>
        </div>
      </section>

      <section className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-bold">2. Tomar Fotografías</h2>
          {photos.length > 0 ? (
            <span className="text-green-700 text-xs font-semibold">Completado</span>
          ) : (
            <span className="text-pink-700 text-xs font-semibold">Pendiente</span>
          )}
        </div>
        <p className="text-sm text-gray-700 mb-4">
          <span className="font-semibold">Instrucciones: </span>
          Toma fotos de la zona, herramientas y materiales a utilizar, asegura de tener una buena fuente de luz.
        </p>
        <button className="w-full bg-teal-700 text-white py-2 rounded-md">Tomar fotos</button>
      </section>

      <section className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-bold">3. Seleccionar Estrateguas de Control</h2>
          {strategies.length > 0 ? (
            <span className="text-green-700 text-xs font-semibold">Completado</span>
          ) : (
            <span className="text-pink-700 text-xs font-semibold">Pendiente</span>
          )}
        </div>
        <p className="text-sm text-gray-700 mb-4">
          <span className="font-semibold">Instrucciones: </span>
          Revisa las Estrategias de Control qu ecorresponden a la tarea y/o agrega nuevas.
        </p>
        <button className="w-full bg-teal-700 text-white py-2 rounded-md">Seleccionar Estrategias</button>
      </section>

      <section className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-bold">4. Comentarios Adicionales</h2>
          <span className="text-pink-700 text-xs font-semibold">Opcional</span>
        </div>
        <p className="text-sm text-gray-700 mb-4">
          <span className="font-semibold">Instrucciones: </span>
          Añade información que sea útil para el Análisis de Riesgo.
        </p>
        {comments.length > 0 ? (
          <textarea className="w-full border border-gray-300 rounded-md p-2" placeholder="Añade comentarios"></textarea>
        ) : (
          <textarea className="w-full border border-gray-300 rounded-md p-2" placeholder="Añade comentarios"></textarea>
        )}
      </section>

      <button className="w-full bg-teal-700 text-white py-2 rounded-md" disabled={!video || photos.length === 0 || strategies.length === 0}>Generar ARTP</button>
    </div>
  );
}