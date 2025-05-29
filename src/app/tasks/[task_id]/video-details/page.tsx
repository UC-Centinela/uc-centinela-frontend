'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import Image from 'next/image'
import type { TranscriptionResult } from '@/app/transcription/components/TranscriptionForm'
import { gql, useMutation } from '@apollo/client'
import client from '@/lib/apollo-client'
import { AlertTriangle, ChevronUp, Mic, Trash2 } from 'lucide-react'

const FIND_MULTIMEDIA_BY_TASK_ID = gql`
  query FindMultimediaByTaskId($taskId: Int!) {
    findMultimediaByTaskId(taskId: $taskId) {
      id
      taskId
      photoUrl
      videoUrl
      audioTranscription
    }
  }
`;

const DELETE_MULTIMEDIA = gql`
  mutation DeleteMultimedia($deleteMultimediaId: Int!) {
    deleteMultimedia(id: $deleteMultimediaId)
  }
`;

function getMultimediaData(taskId: string) {
  return client.query({
    query: FIND_MULTIMEDIA_BY_TASK_ID,
    variables: { taskId: Number(taskId) },
  })
    .then(({ data }) => data.findMultimediaByTaskId)
    .catch(error => {
      console.error("Error fetching multimedia data:", error);
      return [];
    });
}

interface MultimediaData {
  id: number;
  taskId: number;
  photoUrl: string | null;
  videoUrl: string | null;
  audioTranscription: string | null;
}

export default function VideoDetailsPage({ params }: { params: { task_id: string } }) {
  const taskId = params.task_id;
  const [videoData, setVideoData] = useState<MultimediaData | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    getMultimediaData(taskId)
      .then(multimediaData => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const video = multimediaData.find((item: any) => item.videoUrl);
        setVideoData(video);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [taskId]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-700"></div>
      </div>
    );
  }
  
  return <VideoDetailsClient taskId={taskId} videoData={videoData} />;
}

function VideoDetailsClient({ taskId, videoData }: { taskId: string, videoData?: MultimediaData }) {
  const router = useRouter();
  const [transcriptionResult, setTranscriptionResult] = useState<TranscriptionResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Initialize the delete mutation
  const [deleteMultimedia] = useMutation(DELETE_MULTIMEDIA, {
    client,
    onCompleted: () => {
      try {
        localStorage.removeItem(`transcription-${taskId}`);
        console.log(`Removed transcription-${taskId} from localStorage`);
      } catch (error) {
        console.error('Error removing item from localStorage:', error);
      }
      
      router.push(`/tasks/${taskId}/risk_analysis`);
    },
    onError: (error) => {
      console.error('Error deleting video:', error);
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  });

  const handleDeleteVideo = async () => {
    if (!videoData?.id) return;
    
    setIsDeleting(true);
    try {
      await deleteMultimedia({
        variables: {
          deleteMultimediaId: videoData.id
        }
      });
      // The onCompleted callback will handle the redirect
    } catch (error) {
      console.error('Error in delete operation:', error);
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };
  
  useEffect(() => {
    if (videoData) {
      setTranscriptionResult({
        mediaId: videoData.id,
        transcription: videoData.audioTranscription || ''
      });
      setLoading(false);
    } else {
      try {
        const storedData = localStorage.getItem(`transcription-${taskId}`);
        if (storedData) {
          setTranscriptionResult(JSON.parse(storedData));
        } else {
          setTranscriptionResult({
            mediaId: null,
            transcription: 'No se encontró transcripción para este video.'
          });
        }
      } catch (error) {
        console.error('Error loading transcription data:', error);
        setTranscriptionResult({
          mediaId: null,
          transcription: 'Error al cargar la transcripción.'
        });
      } finally {
        setLoading(false);
      }
    }
  }, [taskId, videoData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-700"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-6">
      <div className="bg-white p-4 shadow-sm">
        <button
          onClick={() => router.push(`/tasks/${taskId}/risk_analysis`)}
          className="text-base text-red-500 mb-2 flex items-center font-medium"
        >
          <ChevronLeft className="h-5 w-5 mr-1" /> Volver
        </button>

        <h1 className="text-2xl font-bold text-teal-800 mb-6 mt-4">
          Análisis de Video
        </h1>
      </div>

      <div className="max-w-lg mx-auto px-4 mt-4 space-y-4">
        <div className="bg-white rounded-lg p-5 shadow-sm">
          {/* Video preview */}
          <div className="relative aspect-video bg-gray-800 mb-6 rounded-md overflow-hidden">
            {videoData?.videoUrl ? (
              <>
                <video 
                  src={videoData.videoUrl} 
                  controls 
                  className="w-full h-full object-cover"
                  poster="/video-thumbnail.jpg"
                />
                {/* Delete video button */}
                {!isDeleting && (
                  <button 
                    onClick={() => setShowDeleteConfirm(true)}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-md transition-colors"
                    title="Eliminar video"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
              </>
            ) : (
              <>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white bg-opacity-80 rounded-full flex items-center justify-center cursor-pointer">
                    <div className="w-0 h-0 border-t-8 border-t-transparent border-l-16 border-l-teal-700 border-b-8 border-b-transparent ml-1"></div>
                  </div>
                </div>
                <Image 
                  src="/video-thumbnail.jpg" 
                  alt="Video thumbnail" 
                  className="w-full h-full object-cover"
                  width={640}
                  height={360}
                  onError={(e) => {
                    const imgElement = e.currentTarget as HTMLImageElement;
                    imgElement.src = 'https://via.placeholder.com/640x360?text=Video+Preview';
                  }}
                />
              </>
            )}
          </div>
          
          {/* Delete confirmation modal */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
                <h3 className="text-lg font-medium text-gray-900 mb-4">¿Estás seguro que deseas eliminar este video?</h3>
                <p className="text-sm text-gray-500 mb-6">Esta acción no se puede deshacer. El video y su transcripción serán eliminados permanentemente.</p>
                
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
                    disabled={isDeleting}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleDeleteVideo}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium flex items-center"
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                        Eliminando...
                      </>
                    ) : (
                      <>Eliminar video</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Elements detected section */}
          <h2 className="text-lg font-semibold text-teal-700 mb-4">Elementos detectados</h2>
          
          <div className="mb-6">
            <div className="flex items-start mb-3">
              <div className="text-teal-600 mr-2">☀</div>
              <div>
                <h3 className="font-medium text-teal-700">Condiciones del entorno:</h3>
                <ul className="list-disc pl-5 mt-1 space-y-2">
                  <li>
                    <span className="font-medium">Área abierta:</span> La escena muestra una zona al aire libre, probablemente una operación minera o una planta industrial en un ambiente desértico.
                  </li>
                  <li>
                    <span className="font-medium">Visibilidad:</span> El cielo despejado proporciona buena visibilidad, pero el terreno se observa polvoriento y con acumulaciones de material arenoso, posiblemente residuos industriales.
                  </li>
                  <li>
                    <span className="font-medium">Estado del terreno:</span> El camino parece estar húmedo en ciertas áreas y tiene charcos. Esto puede indicar presencia de agua o líquidos industriales, posiblemente mezclados con contaminantes.
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="flex items-start mb-3">
              <div className="text-teal-600 mr-2">🧰</div>
              <div>
                <h3 className="font-medium text-teal-700">Equipos y herramientas:</h3>
                <ul className="list-disc pl-5 mt-1">
                  <li>No se observan equipos específicos en la escena.</li>
                </ul>
              </div>
            </div>
            
            <div className="flex items-start mb-3">
              <div className="text-teal-600 mr-2">👤</div>
              <div>
                <h3 className="font-medium text-teal-700">Personas:</h3>
                <ul className="list-disc pl-5 mt-1">
                  <li>Ausencia de trabajadores en la escena</li>
                </ul>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="text-teal-600 mr-2">⚠</div>
              <div>
                <h3 className="font-medium text-teal-700">Riesgos Visibles:</h3>
                <ul className="list-disc pl-5 mt-1 space-y-2">
                  <li>
                    <span className="font-medium">Terreno resbaladizo:</span> El suelo húmedo y las posibles acumulaciones de residuos podrían representar un riesgo de caídas o deslizamientos, especialmente para vehículos y peatones.
                  </li>
                  <li>
                    <span className="font-medium">Posible contaminación:</span> La apariencia del suelo podría sugerir la presencia de químicos o residuos, lo que implicaría riesgos para la salud.
                  </li>
                  <li>
                    <span className="font-medium">Falta de señalización adicional:</span> Aunque hay un letrero de &quot;Pare&quot;, no se observan más señales que indiquen riesgos específicos, lo que podría generar confusión en conductores o peatones.
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Transcription section */}
          {transcriptionResult && (
            <div>
              <h2 className="text-lg font-semibold text-teal-700 mb-4">Transcripción audio</h2>
              
              {/* Suggestions section */}
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-4">
                <div className="flex items-start mb-3">
                  <div className="text-amber-500 mr-2">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">Se han detectado 3 sugerencias para mejorar la descripción</h3>
                  </div>
                  <button className="ml-auto">
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
                
                <div className="space-y-3">
                  {['Nombra cuántas personas hay', 'Describe los elementos EPP necesarios', 'Describe cómo mitigar los riesgos'].map((suggestion, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border-t border-gray-200">
                      <span>{suggestion}</span>
                      <Mic className="h-5 w-5 text-teal-600" />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200 whitespace-pre-wrap">
                {transcriptionResult.transcription}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
