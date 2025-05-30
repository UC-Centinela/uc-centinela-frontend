"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronLeft, Info, AlertCircle, CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import TranscriptionForm from "@/app/transcription/components/TranscriptionForm";
import PhotoUploadForm from "@/app/tasks/components/PhotoUploadForm";
import type { TranscriptionResult } from "@/app/transcription/components/TranscriptionForm";
import type { PhotoUploadResult } from "@/app/tasks/components/PhotoUploadForm";
import ControlStrategySelector from "@/app/tasks/components/ControlStrategySelector";

interface MultimediaData {
  id: number;
  taskId: number;
  photoUrl: string | null;
  videoUrl: string | null;
  audioTranscription: string | null;
}

interface ControlStrategy {
  id: string;
  name: string;
}

interface TaskExecutionProps {
  taskId?: string;
  multimediaData?: MultimediaData[];
}

export default function TaskExecution({ taskId, multimediaData = [] }: TaskExecutionProps) {
  const router = useRouter();
  const [transcriptionResult, setTranscriptionResult] = useState<TranscriptionResult | null>(null);
  const [uploadedVideo, setUploadedVideo] = useState<MultimediaData | null>(null);
  const [uploadedPhotos, setUploadedPhotos] = useState<MultimediaData[]>([]);
  const [showStrategySelector, setShowStrategySelector] = useState(false);
  const [selectedStrategies, setSelectedStrategies] = useState<ControlStrategy[]>([]);
  
  const existingVideo = multimediaData.find(item => item.videoUrl);
  const existingPhotos = multimediaData.filter(item => item.photoUrl);
  const hasExistingVideo = !!existingVideo || !!uploadedVideo;
  const hasExistingPhotos = existingPhotos.length > 0 || uploadedPhotos.length > 0;

  useEffect(() => {
    if (existingVideo) {
      setTranscriptionResult({
        mediaId: existingVideo.id,
        transcription: existingVideo.audioTranscription || ''
      });
    } else {
      const storedTranscriptionResult = localStorage.getItem(`transcription-${taskId}`);
      if (storedTranscriptionResult) {
        setTranscriptionResult(JSON.parse(storedTranscriptionResult));
      }
    }
  }, [taskId, existingVideo]);

  const handleTranscriptionComplete = (result: TranscriptionResult) => {
    setTranscriptionResult(result);
    
    try {
      localStorage.setItem(`transcription-${taskId}`, JSON.stringify(result));
      
      if (result.videoUrl) {
        const newVideo = {
          id: result.mediaId || 0,
          taskId: taskId ? Number(taskId) : 0,
          photoUrl: null,
          videoUrl: result.videoUrl,
          audioTranscription: result.transcription
        };
        
        setUploadedVideo(newVideo);
      }
    } catch (error) {
      console.error('Error saving transcription to localStorage:', error);
    }
  };

  const handlePhotosComplete = (results: PhotoUploadResult[]) => {
    const newPhotos = results.map(result => ({
      id: result.mediaId || 0,
      taskId: taskId ? Number(taskId) : 0,
      photoUrl: result.photoUrl,
      videoUrl: null,
      audioTranscription: null
    }));
    
    setUploadedPhotos(prev => [...prev, ...newPhotos]);
  };

  const handleStrategySelection = (strategies: ControlStrategy[]) => {
    setSelectedStrategies(strategies);
    setShowStrategySelector(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-6">
      <div className="bg-white p-4 shadow-sm">
        <Button
          variant="ghost"
          onClick={() => router.push(`/tasks/${taskId}`)}
          className="text-red-500 mb-2"
        >
          <ChevronLeft className="h-5 w-5 mr-1" /> Salir
        </Button>

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
            {hasExistingVideo ? (
              <div className="bg-green-200 text-green-700 px-3 py-0.5 rounded-full text-sm font-medium flex items-center">
                Listo <CheckCircle className="h-4 w-4 ml-1" />
              </div>
            ) : (
              <div className="bg-pink-200 text-pink-700 px-3 py-0.5 rounded-full text-sm font-medium flex items-center">
                Pendiente <AlertCircle className="h-4 w-4 ml-1" />
              </div>
            )}
          </div>

          {!hasExistingVideo && (
            <>
              <div className="flex items-start mb-4">
                <div className="flex-shrink-0 mr-1">
                  <Info className="h-5 w-5 text-teal-700 mt-0.5" />
                </div>
                <h3 className="text-base font-semibold text-gray-700">
                  Instrucciones
                </h3>
              </div>

              <p className="text-gray-600 mb-6 text-base">
                Sube un video de la tarea, actividades, y peligros describiendo de
                manera exhaustiva. Solo se permiten archivos .mp4.
              </p>
            </>
          )}

          <div className="flex flex-col gap-3">
            <div className="w-full">
              {!hasExistingVideo ? (
                <TranscriptionForm 
                  onTranscriptionComplete={handleTranscriptionComplete} 
                  taskId={taskId ? Number(taskId) : undefined}
                />
              ) : null}
              
              {/* Video preview with Ver Detalles link when transcription is available */}
              {(transcriptionResult || hasExistingVideo) && (
                <div className="mt-6">
                  <div className="relative aspect-video bg-gray-800 rounded-md overflow-hidden">
                    <video 
                      src={(existingVideo || uploadedVideo)?.videoUrl || ''} 
                      className="w-full h-full object-cover"
                      poster="/video-thumbnail.jpg"
                      controls
                    />
                  </div>
                  <div className="flex justify-end mt-2">
                    <Button 
                      variant="ghost"
                      onClick={() => router.push(`/tasks/${taskId}/video-details`)}
                      className="text-red-500"
                    >
                      Ver Detalles
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            {/* {!hasExistingVideo && (
              // TODO: implementar grabar video
              <button className="w-full bg-teal-700 text-white py-3 rounded-md font-medium text-base">
                Grabar video
              </button>
            )} */}
          </div>
        </section>

        <section className="bg-white rounded-lg p-5 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold text-gray-800">
              2. Tomar Fotografías
            </h2>
            {hasExistingPhotos ? (
              <div className="bg-green-200 text-green-700 px-3 py-0.5 rounded-full text-sm font-medium flex items-center">
                Listo <CheckCircle className="h-4 w-4 ml-1" />
              </div>
            ) : (
              <div className="bg-pink-200 text-pink-700 px-3 py-0.5 rounded-full text-sm font-medium flex items-center">
                Pendiente <AlertCircle className="h-4 w-4 ml-1" />
              </div>
            )}
          </div>

          {!hasExistingPhotos && (
            <>
              <div className="flex items-start mb-4">
                <div className="flex-shrink-0 mr-1">
                  <Info className="h-5 w-5 text-teal-700 mt-0.5" />
                </div>
                <h3 className="text-base font-semibold text-gray-700">
                  Instrucciones
                </h3>
              </div>

              <p className="text-gray-600 mb-6 text-base">
                Sube fotos de la zona, herramientas y materiales a utilizar, asegura
                de tener una buena fuente de luz.
              </p>
            </>
          )}

          <div className="flex flex-col gap-3">
            <div className="w-full">
              {!hasExistingPhotos ? (
                <PhotoUploadForm 
                  onPhotosComplete={handlePhotosComplete} 
                  taskId={taskId ? Number(taskId) : undefined}
                />
              ) : (
                <div className="mt-6">
                  <div className="grid grid-cols-2 gap-4">
                    {[...existingPhotos, ...uploadedPhotos].map((photo, index) => (
                      <div key={index} className="relative aspect-square bg-gray-100 rounded-md overflow-hidden">
                        <img 
                          src={photo.photoUrl || ''} 
                          alt={`Foto ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="bg-white rounded-lg p-5 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold text-gray-800">
              3. Seleccionar Estrategias de Control
            </h2>
            {selectedStrategies.length > 0 ? (
              <div className="bg-green-200 text-green-700 px-3 py-0.5 rounded-full text-sm font-medium flex items-center">
                Listo <CheckCircle className="h-4 w-4 ml-1" />
              </div>
            ) : (
              <div className="bg-pink-200 text-pink-700 px-3 py-0.5 rounded-full text-sm font-medium flex items-center">
                Pendiente <AlertCircle className="h-4 w-4 ml-1" />
              </div>
            )}
          </div>

          {selectedStrategies.length > 0 ? (
            <div className="mt-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedStrategies.map((strategy) => (
                  <div
                    key={strategy.id}
                    className="bg-teal-700 text-white px-4 py-2 rounded-full text-sm flex items-center gap-2"
                  >
                    {strategy.name}
                    <button
                      onClick={() => setSelectedStrategies(prev => prev.filter(s => s.id !== strategy.id))}
                      className="hover:bg-teal-800 rounded-full p-0.5"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <Button
                onClick={() => setShowStrategySelector(true)}
                className="w-full bg-teal-700 hover:bg-teal-800 text-white rounded-md font-normal text-lg h-12"
              >
                Agregar más estrategias
              </Button>
            </div>
          ) : (
            <>
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

              <Button
                onClick={() => setShowStrategySelector(true)}
                className="w-full bg-teal-700 hover:bg-teal-800 text-white rounded-md font-normal text-lg mb-4 flex items-center justify-center h-12"
              >
                Seleccionar Estrategias
              </Button>
            </>
          )}
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

        <Button 
          className="w-full bg-teal-700 hover:bg-teal-800 text-white rounded-md font-normal text-lg mb-4 flex items-center justify-center h-12 mt-6"
        >
          Generar ARTP
        </Button>
      </div>

      {showStrategySelector && (
        <ControlStrategySelector
          onClose={() => setShowStrategySelector(false)}
          onConfirm={handleStrategySelection}
          suggestedStrategies={[
            { id: "8", name: "Interacción con Energía Eléctrica" },
            { id: "9", name: "Interacción con Energía Hidráulica" },
          ]}
        />
      )}
    </div>
  );
}
