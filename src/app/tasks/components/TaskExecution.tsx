"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import {
  ChevronLeft,
  Info,
  AlertCircle,
  CheckCircle,
  X,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import TranscriptionForm, {
  TranscriptionResult,
} from "@/app/transcription/components/TranscriptionForm";
import PhotoUploadForm, {
  PhotoUploadResult,
} from "@/app/tasks/components/PhotoUploadForm";
import ControlStrategySelector from "@/app/tasks/components/ControlStrategySelector";
import { gql, useQuery, useMutation } from "@apollo/client";
import client from "@/lib/apollo-client";
import Image from "next/image";
import { MultimediaItem } from "@/types/multimedia";
import { updateTask } from "@/services/task";
import { useControlStrategies } from "./TaskExecutionClientWrapper";
import { generateArtp } from "@/services/artp";

const FIND_CONTROL_STRATEGIES_BY_TASK = gql`
  query FindControlStrategiesByTask($taskId: Int!) {
    findControlStrategiesByTask(taskId: $taskId) {
      id
      title
    }
  }
`;

const UNASSIGN_CONTROL_STRATEGY = gql`
  mutation unassignControlStrategy($input: UnassignControlStrategyInput!) {
    unassignControlStrategy(input: $input) {
      id
      title
      controlStrategyIds
    }
  }
`;

interface ControlStrategy {
  id: string;
  taskId?: number | null;
  title: string;
}

interface TaskExecutionProps {
  taskId?: string;
  multimediaData?: MultimediaItem[];
  taskComments?: string | null;
}

export default function TaskExecution({
  taskId,
  multimediaData = [],
  taskComments = null,
}: TaskExecutionProps) {
  const router = useRouter();
  const [isGeneratingARTP, setIsGeneratingARTP] = useState(false);
  const [transcriptionResult, setTranscriptionResult] =
    useState<TranscriptionResult | null>(null);
  const [uploadedVideo, setUploadedVideo] = useState<MultimediaItem | null>(
    null
  );
  const [uploadedPhotos, setUploadedPhotos] = useState<MultimediaItem[]>([]);
  const [showStrategySelector, setShowStrategySelector] = useState(false);
  const { selectedStrategies, setSelectedStrategies } = useControlStrategies();
  const [comments, setComments] = useState(taskComments || "");
  const [isEditingComments, setIsEditingComments] = useState(false);
  const [isSavingComments, setIsSavingComments] = useState(false);
  const [error, setError] = useState<string>("");

  // Extraer video existente y fotos existentes de los datos pasados por props
  const existingVideo = multimediaData.find((item) => item.videoUrl);
  const existingPhotos = multimediaData.filter((item) => item.photoUrl);

  // Booleanos para saber si hay video o fotos
  const hasExistingVideo = !!existingVideo || !!uploadedVideo;
  const totalPhotos = existingPhotos.length + uploadedPhotos.length;
  const hasExistingPhotos = totalPhotos > 0;

  // Obtener todas las estrategias de control
  const { loading: loadingStrategies } = useQuery(
    FIND_CONTROL_STRATEGIES_BY_TASK,
    {
      client,
      variables: { taskId: taskId ? Number(taskId) : 0 },
      skip: !taskId,
      onError: (error) => {
        console.error("Error fetching strategies:", error);
      },
      onCompleted: (data) => {
        if (data?.findControlStrategiesByTask) {
          setSelectedStrategies(data.findControlStrategiesByTask);
        }
      },
    }
  );

  const handleUpdateTask = async (taskId: string, newComments: string) => {
    setIsSavingComments(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("id", taskId);
      formData.append("comments", newComments.trim());

      const result = await updateTask(formData);
      if (result?.success) {
        if (result.data?.comments !== undefined) {
          setComments(result.data.comments || "");
          setIsEditingComments(false);
          setIsSavingComments(false);
          setError("");
        }
      } else {
        console.error("Error updating task:", result?.error || "Unknown error");
        setIsSavingComments(false);
        setError(
          "Error al guardar los comentarios. Por favor, intente de nuevo."
        );
      }
    } catch (error) {
      console.error("Error updating task:", error);
      setIsSavingComments(false);
      setError(
        "Error al guardar los comentarios. Por favor, intente de nuevo."
      );
    }
  };

  const [unassignControlStrategy] = useMutation(UNASSIGN_CONTROL_STRATEGY, {
    client,
    onError: (error) => {
      console.error("Error unassigning control strategy:", error);
      setError("Error al eliminar la estrategia. Por favor, intente de nuevo.");
    },
  });

  // Inicializar transcriptionResult con los datos almacenados o con los existentes en BD
  useEffect(() => {
    if (existingVideo) {
      setTranscriptionResult({
        mediaId: existingVideo.id,
        transcription: existingVideo.audioTranscription || "",
        videoUrl: existingVideo.videoUrl || null,
      });
    } else {
      const stored = localStorage.getItem(`transcription-${taskId}`);
      if (stored) {
        setTranscriptionResult(JSON.parse(stored));
      }
    }
  }, [taskId, existingVideo]);

  // Sincronizar comentarios si cambian desde props
  useEffect(() => {
    setComments(taskComments || "");
    setIsEditingComments(false);
  }, [taskComments]);

  // Handler para TranscriptionForm
  const handleTranscriptionComplete = (result: TranscriptionResult) => {
    setTranscriptionResult(result);

    try {
      localStorage.setItem(`transcription-${taskId}`, JSON.stringify(result));

      if (result.videoUrl) {
        const newVideo: MultimediaItem = {
          id: result.mediaId || 0,
          taskId: taskId ? Number(taskId) : 0,
          photoUrl: null,
          videoUrl: result.videoUrl,
          audioTranscription: result.transcription,
        };
        setUploadedVideo(newVideo);
      }
    } catch (error) {
      console.error("Error saving transcription to localStorage:", error);
    }
  };

  // Handler para PhotoUploadForm (sin redirección automática)
  const handlePhotosComplete = (results: PhotoUploadResult[]) => {
    const nuevasFotos: MultimediaItem[] = results.map((result) => ({
      id: result.mediaId || 0,
      taskId: taskId ? Number(taskId) : 0,
      photoUrl: result.photoUrl || null,
      videoUrl: null,
      audioTranscription: null,
    }));

    setUploadedPhotos((prev) => [...prev, ...nuevasFotos]);
  };

  const handleStrategySelection = (strategies: ControlStrategy[]) => {
    setSelectedStrategies(strategies);
    setShowStrategySelector(false);
  };

  const handleStrategyRemoval = async (strategy: ControlStrategy) => {
    try {
      // If the strategy has a taskId matching the current task, unassign it via API
      await unassignControlStrategy({
        variables: {
          input: {
            taskId: Number(taskId),
            controlStrategyId: Number(strategy.id),
          },
        },
      });

      // Remove from UI regardless of API call
      setSelectedStrategies(
        selectedStrategies.filter((s) => s.id !== strategy.id)
      );
    } catch (error) {
      console.error("Error removing strategy:", error);
      setError("Error al eliminar la estrategia. Por favor, intente de nuevo.");
    }
  };

  const handleSaveComments = async () => {
    if (!comments.trim() || !taskId) return;
    await handleUpdateTask(taskId, comments.trim());
  };

  const canGenerateARTP = useMemo(() => {
    const hasVideo = hasExistingVideo;
    const hasStrategies = selectedStrategies.length > 0;
    return hasVideo && hasStrategies;
  }, [hasExistingVideo, selectedStrategies.length]);

  const handleGenerateARTP = async () => {
    if (!canGenerateARTP) return;
    setIsGeneratingARTP(true);
    try {
      const result = await generateArtp({ taskId: Number(taskId) });
      if (result) {
        console.log("artp result", result);
      } else {
        console.error("Error generating ARTP:", result);
      }
    } catch (error) {
      console.error("Error generating ARTP:", error);
    } finally {
      setIsGeneratingARTP(false);
      router.push(`/tasks/${taskId}/artp-result`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-6">
      {/* Encabezado y navegación */}
      <div className="bg-white p-4 shadow-sm">
        <Button
          variant="ghost"
          onClick={() => router.push(`/tasks/${taskId}`)}
          className="text-red-500 mb-2"
          disabled={isGeneratingARTP}
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
        {/* ========== SECCIÓN 1: SUBIR VIDEO ========== */}
        <section className="bg-white rounded-lg p-5 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold text-gray-800">1. Subir Video</h2>
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
                Suba un video de la tarea, actividades y peligros describiendo
                de manera exhaustiva. Solo se permiten archivos{" "}
                <strong>.mp4</strong>.
              </p>
            </>
          )}

          <div className="flex flex-col gap-3">
            {!hasExistingVideo ? (
              <TranscriptionForm
                onTranscriptionComplete={handleTranscriptionComplete}
                taskId={taskId ? Number(taskId) : undefined}
              />
            ) : null}

            {(transcriptionResult || hasExistingVideo) && (
              <div className="mt-6">
                <div className="relative aspect-video bg-gray-800 rounded-md overflow-hidden">
                  <video
                    src={(existingVideo || uploadedVideo)?.videoUrl || ""}
                    className="w-full h-full object-cover"
                    poster="/video-thumbnail.jpg"
                    controls
                  />
                </div>
                <div className="flex justify-end mt-2">
                  <Button
                    variant="ghost"
                    onClick={() =>
                      router.push(`/tasks/${taskId}/video-details`)
                    }
                    className="text-red-500"
                    disabled={isGeneratingARTP}
                  >
                    Ver Detalles
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 ml-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ========== SECCIÓN 2: SUBIR FOTOGRAFÍAS ========== */}
        <section className="bg-white rounded-lg p-5 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold text-gray-800">
              2. Subir Fotografías
            </h2>
            {hasExistingPhotos ? (
              <div className="bg-green-200 text-green-700 px-3 py-0.5 rounded-full text-sm font-medium flex items-center">
                Listo <CheckCircle className="h-4 w-4 ml-1" />
              </div>
            ) : (
              <div className="bg-pink-200 text-pink-700 px-3 py-0.5 rounded-full text-sm font-medium">
                Opcional
              </div>
            )}
          </div>

          {totalPhotos === 0 && (
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
                Suba fotos de la zona, herramientas y materiales a utilizar.
                Asegúrese de tener buena iluminación. Puede subir hasta 5 fotos
                en total.
              </p>
            </>
          )}

          {hasExistingPhotos && (
            <div className="mt-6">
              <div className="grid grid-cols-2 gap-4">
                {[...existingPhotos, ...uploadedPhotos].map((photo, index) => (
                  <div
                    key={index}
                    className="relative aspect-square bg-gray-100 rounded-md overflow-hidden"
                  >
                    <Image
                      src={photo.photoUrl || ""}
                      alt={`Foto ${index + 1}`}
                      className="w-full h-full object-cover"
                      width={300}
                      height={300}
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end mt-2">
                <Button
                  variant="ghost"
                  onClick={() => router.push(`/tasks/${taskId}/photo-details`)}
                  className="text-red-500"
                  disabled={isGeneratingARTP}
                >
                  Ver Detalles
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Button>
              </div>
            </div>
          )}

          {totalPhotos < 5 && (
            <div className="mt-6">
              <PhotoUploadForm
                onPhotosComplete={handlePhotosComplete}
                taskId={taskId ? Number(taskId) : undefined}
              />
            </div>
          )}
        </section>

        {/* ========== SECCIÓN 3: SELECCIONAR ESTRATEGIAS DE CONTROL ========== */}
        <section className="bg-white rounded-lg p-5 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold text-gray-800">
              3. Seleccionar Estrategias de Control
            </h2>
            {loadingStrategies ? (
              <div className="bg-gray-200 text-gray-700 px-3 py-0.5 rounded-full text-sm font-medium flex items-center">
                Cargando...
              </div>
            ) : selectedStrategies.length > 0 ? (
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
                    {strategy.title}
                    <button
                      onClick={() => handleStrategyRemoval(strategy)}
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
                disabled={isGeneratingARTP}
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
                Revise las estrategias de control que correspondan a la tarea
                y/o agregue nuevas.
              </p>

              <Button
                onClick={() => setShowStrategySelector(true)}
                className="w-full bg-teal-700 hover:bg-teal-800 text-white rounded-md font-normal text-lg mb-4 flex items-center justify-center h-12"
                disabled={isGeneratingARTP}
              >
                Seleccionar Estrategias
              </Button>
            </>
          )}
        </section>

        {/* ========== SECCIÓN 4: COMENTARIOS ADICIONALES ========== */}
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
            Añada información que sea útil para el análisis de riesgo.
          </p>

          {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}

          {isEditingComments ? (
            <>
              <textarea
                className="w-full border border-gray-300 rounded-md p-3 text-base mb-4"
                placeholder="Añada comentarios"
                rows={4}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              />
              <Button
                onClick={handleSaveComments}
                disabled={
                  !comments.trim() || isSavingComments || isGeneratingARTP
                }
                className="w-full bg-teal-700 hover:bg-teal-800 text-white rounded-md font-normal text-lg h-12"
              >
                {isSavingComments ? "Guardando..." : "Guardar comentarios"}
              </Button>
            </>
          ) : (
            <>
              <div className="w-full bg-gray-50 rounded-md p-3 text-base mb-4 min-h-[100px]">
                {comments || "No hay comentarios"}
              </div>
              <Button
                onClick={() => setIsEditingComments(true)}
                className="w-full bg-teal-700 hover:bg-teal-800 text-white rounded-md font-normal text-lg h-12"
                disabled={isGeneratingARTP}
              >
                {comments ? "Editar comentarios" : "Agregar comentarios"}
              </Button>
            </>
          )}
        </section>

        <Button
          onClick={handleGenerateARTP}
          disabled={!canGenerateARTP || isGeneratingARTP}
          className="w-full bg-teal-700 hover:bg-teal-800 text-white rounded-md font-normal text-lg mb-4 flex items-center justify-center h-12 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGeneratingARTP ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Generando Análisis de Riesgo...
            </>
          ) : !canGenerateARTP ? (
            <>
              Completa los requisitos para generar ARTP
              <AlertCircle className="ml-2 h-5 w-5" />
            </>
          ) : (
            <>Generar ARTP</>
          )}
        </Button>

        {isGeneratingARTP && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-6 mt-4">
            <div className="flex items-center justify-center mb-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mr-3" />
              <h3 className="text-lg font-semibold text-blue-800">
                Generando Análisis de Riesgo
              </h3>
            </div>
            <div className="text-center text-blue-700 mb-4">
              <p className="mb-2">Estamos procesando su información...</p>
              <p className="text-sm">
                Esto puede tomar unos momentos. Por favor, no cierre esta
                página.
              </p>
            </div>
          </div>
        )}

        {!canGenerateARTP && !isGeneratingARTP && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mt-2">
            <h3 className="text-sm font-medium text-yellow-800 mb-2">
              Requisitos pendientes:
            </h3>
            <ul className="list-disc pl-5 text-sm text-yellow-700">
              {!hasExistingVideo && <li>Debe subir un video de la tarea</li>}
              {selectedStrategies.length === 0 && (
                <li>Debe seleccionar al menos una estrategia de control</li>
              )}
            </ul>
          </div>
        )}
      </div>

      {showStrategySelector && (
        <ControlStrategySelector
          onClose={() => setShowStrategySelector(false)}
          onConfirm={handleStrategySelection}
          taskId={Number(taskId)}
          existingStrategies={selectedStrategies}
        />
      )}
    </div>
  );
}
