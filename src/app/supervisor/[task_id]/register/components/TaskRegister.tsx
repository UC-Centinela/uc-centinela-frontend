"use client"

import { ChevronLeft, Info } from "lucide-react"
import { useRouterLoading } from "@/hooks/useRouterLoading"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import type { Task } from "@/types/task"
import type { MultimediaItem } from "@/types/multimedia"
import type { ControlStrategy } from "@/types/controlStrategies"

export interface TaskRegisterProps {
    taskData: Task | null;
    multimediaData: MultimediaItem[];
    controlStrategies: ControlStrategy[];
}

export default function TaskRegister({
    taskData,
    multimediaData,
    controlStrategies,
}: TaskRegisterProps) {
    const { push: pushWithLoading } = useRouterLoading();

    const videoUrl:string = multimediaData.find(item => item.videoUrl)?.videoUrl || "";
    const photoUrls:string[]  = multimediaData
        .filter(item => item.photoUrl !== null)
        .map(item => item.photoUrl as string);
    const audioTranscription:string = multimediaData.find(item => item.audioTranscription)?.audioTranscription || "";

    if (!taskData) {
        return (
            <div className="min-h-screen bg-[#f4f4f4] flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-600 mb-2">Tarea no encontrada</h2>
                    <p className="text-gray-500">No se pudo cargar la información de la tarea.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 pb-6">
            <div className="bg-white p-4 shadow-sm">
                <Button
                    variant="ghost"
                    onClick={() => pushWithLoading(`/supervisor`)}
                    className="text-red-500 mb-2"
                >
                    <ChevronLeft className="h-5 w-5 mr-1" /> Volver
                </Button>
                <h1 className="text-2xl font-bold text-teal-800 mb-6 mt-4">{taskData.title}</h1>

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
                        <span className="text-gray-500">ARTP</span>
                    </div>
                </div>
            </div>

            <div className="px-6 py-6">
                <section className="mb-8">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Estrategias de Control</h2>
                    {controlStrategies.length > 0 ? (
                        <div className="flex flex-wrap gap-3">
                            {controlStrategies.map((strategy) => (
                                <div key={strategy.id} className="bg-teal-700 text-white px-4 py-2 rounded-full text-sm">
                                    {strategy.title}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600 text-sm">No hay estrategias de control disponibles</p>
                    )}
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <section>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-gray-800">Levantamiento en Terreno</h2>
                        </div>
                        {videoUrl ? (
                            <div className="bg-white rounded-lg p-4 shadow-sm h-[400px] flex flex-col">
                                <div className="relative aspect-video bg-gray-800 rounded-md overflow-hidden">
                                    <video src={videoUrl} className="w-full h-full object-cover" controls />
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg p-4 shadow-sm">
                                <div className="text-center py-8">
                                    <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600">No hay video disponible para esta tarea.</p>
                                </div>
                            </div>
                        )}
                    </section>

                    <section>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-gray-800">Transcripción de audio</h2>
                        </div>
                        <div className="bg-white rounded-lg p-4 shadow-sm h-[400px] flex flex-col">
                            {audioTranscription.length > 0 ? (
                                <div className="max-h-96 overflow-y-auto">
                                    <div className="space-y-3">
                                        <p className="text-gray-800 text-sm leading-relaxed">{audioTranscription}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600">No hay transcripción de audio disponible.</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                <section>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-gray-800">Imágenes asociadas</h2>
                    </div>
                    {photoUrls.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {photoUrls.map((photoUrl, index) => (
                                <div key={index} className="bg-white rounded-lg p-2 shadow-sm">
                                    <div className="bg-gray-100 rounded-md overflow-hidden flex justify-center items-center">
                                        <Image
                                            src={photoUrl}
                                            alt={`Imagen ${index + 1}`}
                                            width={300}
                                            height={200}
                                            className="rounded max-w-full h-auto"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg p-8 shadow-sm text-center">
                            <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">No hay imágenes asociadas a esta tarea.</p>
                        </div>
                    )}
                </section>

                <div className="mt-8 flex justify-end">
                    <Button
                        onClick={() => pushWithLoading(`/supervisor/${taskData.id}/artp`)}
                        className="bg-teal-700 hover:bg-teal-800 text-white rounded-md font-normal text-lg px-8 py-3"
                    >
                        Ver ARTP
                    </Button>
                </div>
            </div> 
        </div>
    )
}