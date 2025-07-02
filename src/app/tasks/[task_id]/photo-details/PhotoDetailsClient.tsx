// src/app/tasks/[task_id]/photo-details/PhotoDetailsClient.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Trash2 } from "lucide-react";
import Image from "next/image";
import { gql, useMutation } from "@apollo/client";
import client from "@/lib/apollo-client";

interface PhotoData {
  id: number;
  taskId: number;
  photoUrl: string;
}

interface Props {
  taskId: string;
  initialPhotos: PhotoData[];
}

const DELETE_MULTIMEDIA = gql`
  mutation DeleteMultimedia($deleteMultimediaId: Int!) {
    deleteMultimedia(id: $deleteMultimediaId)
  }
`;

export default function PhotoDetailsClient({ taskId, initialPhotos }: Props) {
  const router = useRouter();

  // Estado local con todas las fotos que llegaron desde el servidor
  const [photos, setPhotos] = useState<PhotoData[]>(initialPhotos);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirmId, setShowDeleteConfirmId] = useState<number | null>(null);

  const [deleteMultimedia] = useMutation(DELETE_MULTIMEDIA, {
    client,
    onCompleted: () => {
      // Al confirmar borrado, actualizamos el estado local para remover la foto
      setPhotos((prev) => prev.filter((p) => p.id !== showDeleteConfirmId!));
      setShowDeleteConfirmId(null);
      setIsDeleting(false);
    },
    onError: (error) => {
      console.error("Error deleting photo:", error);
      setShowDeleteConfirmId(null);
      setIsDeleting(false);
    },
  });

  const handleDeletePhoto = async (photoId: number) => {
    setIsDeleting(true);
    try {
      await deleteMultimedia({
        variables: { deleteMultimediaId: photoId },
      });
    } catch {
      setIsDeleting(false);
      setShowDeleteConfirmId(null);
    }
  };

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
          Detalles de Fotos
        </h1>
      </div>

      <div className="max-w-lg mx-auto px-4 mt-4">
        <div className="bg-white rounded-lg p-5 shadow-sm">
          <div className="grid grid-cols-2 gap-4">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="relative aspect-square bg-gray-100 rounded-md overflow-hidden"
              >
                <Image
                  src={photo.photoUrl}
                  alt={`Foto ${photo.id}`}
                  className="w-full h-full object-cover"
                  width={300}
                  height={300}
                  onError={(e) => {
                    const img = e.currentTarget as HTMLImageElement;
                    img.src = "https://via.placeholder.com/300";
                  }}
                />
                {!isDeleting && (
                  <button
                    onClick={() => setShowDeleteConfirmId(photo.id)}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-md transition-colors"
                    title="Eliminar foto"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal de confirmación para borrar una foto */}
      {showDeleteConfirmId !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              ¿Está seguro de eliminar esta foto?
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirmId(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
                disabled={isDeleting}
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDeletePhoto(showDeleteConfirmId!)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium flex items-center"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                ) : null}
                Eliminar foto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
