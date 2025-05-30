'use client'

import { useState, useRef } from 'react'
import { gql, useMutation } from '@apollo/client'
import { Buffer } from 'buffer'
import { Button } from "@/components/ui/button"
import client from '@/lib/apollo-client'
import { Trash2 } from 'lucide-react'

const UPLOAD_MULTIMEDIA = gql`
  mutation UploadMultimedia($input: UploadMultimediaInput!) {
    uploadMultimedia(input: $input) {
      id
      taskId
      photoUrl
      videoUrl
      audioTranscription
    }
  }
`

const DELETE_MULTIMEDIA = gql`
  mutation DeleteMultimedia($deleteMultimediaId: Int!) {
    deleteMultimedia(id: $deleteMultimediaId)
  }
`

// Definir los tipos de archivos permitidos
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif'
]

const ALLOWED_IMAGE_EXTENSIONS = '.jpg,.jpeg,.png,.gif'

export interface PhotoUploadResult {
  mediaId: number | null
  photoUrl: string | null
}

interface PhotoUploadFormProps {
  onPhotosComplete: (results: PhotoUploadResult[]) => void
  taskId?: number
}

export default function PhotoUploadForm({ onPhotosComplete, taskId }: PhotoUploadFormProps) {
  const [files, setFiles] = useState<File[]>([])
  const [fileNames, setFileNames] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showFileInput, setShowFileInput] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [uploadMultimedia] = useMutation(UPLOAD_MULTIMEDIA, { client })
  const [deleteMultimedia] = useMutation(DELETE_MULTIMEDIA, {
    client,
    onCompleted: () => {
      setIsDeleting(false)
      setShowDeleteConfirm(null)
    },
    onError: (error) => {
      console.error('Error deleting photo:', error)
      setIsDeleting(false)
      setShowDeleteConfirm(null)
    }
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    if (selectedFiles.length === 0) return

    // Validar cada archivo
    const invalidFiles = selectedFiles.filter(file => !ALLOWED_IMAGE_TYPES.includes(file.type))
    if (invalidFiles.length > 0) {
      setError(`Por favor, selecciona solo archivos de imagen en los siguientes formatos: ${ALLOWED_IMAGE_EXTENSIONS}`)
      return
    }

    // Validar tamaño de archivos (máximo 5MB por archivo)
    const maxSize = 5 * 1024 * 1024 // 5MB en bytes
    const oversizedFiles = selectedFiles.filter(file => file.size > maxSize)
    if (oversizedFiles.length > 0) {
      setError('Algunas imágenes son demasiado grandes. El tamaño máximo permitido es 5MB por imagen.')
      return
    }

    setFiles(selectedFiles)
    setFileNames(selectedFiles.map(file => file.name))
    setError('')
  }

  const handleDeletePhoto = async (id: number) => {
    setIsDeleting(true)
    try {
      await deleteMultimedia({
        variables: {
          deleteMultimediaId: id
        }
      })
    } catch (error) {
      console.error('Error in delete operation:', error)
      setIsDeleting(false)
      setShowDeleteConfirm(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (files.length === 0) {
      setError('Debes seleccionar al menos una foto.')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const uploadPromises = files.map(async (file) => {
        const buffer = await file.arrayBuffer()
        const base64 = Buffer.from(buffer).toString('base64')

        return uploadMultimedia({
          variables: {
            input: {
              taskId,
              filename: file.name,
              mimetype: file.type,
              base64,
              type: 'PHOTO'
            }
          }
        })
      })

      const results = await Promise.all(uploadPromises)
      const uploadedPhotos = results.map(result => {
        const photo = result.data?.uploadMultimedia
        return {
          mediaId: photo?.id || null,
          photoUrl: photo?.photoUrl || null
        }
      })

      onPhotosComplete(uploadedPhotos)
      
      setShowFileInput(false)
      setFiles([])
      setFileNames([])
      
    } catch (err: any) {
      console.error('Error:', err)
      if (err.graphQLErrors?.length > 0) {
        setError(err.graphQLErrors.map((e: any) => e.message).join('\n'))
      } else if (err.networkError) {
        setError('Error de red: ' + err.networkError.message)
      } else {
        setError(err.message || 'Error desconocido al subir las fotos')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto">
      {showFileInput ? (
        <div>
          <div className="border border-gray-300 p-4 rounded-md text-center">
            <input
              type="file"
              accept={ALLOWED_IMAGE_EXTENSIONS}
              onChange={handleFileChange}
              ref={fileInputRef}
              multiple
              hidden
            />
            {fileNames.length === 0 ? (
              <>
                <p className="text-sm text-gray-500 mb-2">Selecciona las fotos (JPG, JPEG, PNG o GIF)</p>
                <Button 
                  type="button"
                  className="bg-teal-700 hover:bg-teal-800 text-white"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Buscar fotos
                </Button>
              </>
            ) : (
              <>
                <p className="text-sm font-medium">{fileNames.length} foto(s) seleccionada(s)</p>
                <div className="mt-2 text-sm text-gray-500">
                  {fileNames.map((name, index) => (
                    <div key={index}>{name}</div>
                  ))}
                </div>
                <Button 
                  type="button"
                  variant="link"
                  className="text-teal-700 mt-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Cambiar fotos
                </Button>
              </>
            )}
          </div>
          {error && <p className="text-sm text-red-600 mt-2 whitespace-pre-wrap">{error}</p>}
        </div>
      ) : null}

      {files.length > 0 ? (
        <Button 
          className="w-full bg-teal-700 hover:bg-teal-800 text-white rounded-md font-normal text-lg mb-4 flex items-center justify-center h-12 mt-6"
          disabled={isLoading}
          onClick={() => handleSubmit(new Event('submit') as any)}
        >
          {isLoading ? 'Subiendo...' : 'Subir fotos'}
        </Button>
      ) : (
        <>
          <Button 
            className="w-full bg-teal-700 hover:bg-teal-800 text-white rounded-md font-normal text-lg mb-4 flex items-center justify-center h-12 mt-6"
            disabled={isLoading}
            onClick={() => {
              setShowFileInput(true)
              setTimeout(() => fileInputRef.current?.click(), 100)
            }}
          >
            Subir fotos
          </Button>
        </>
      )}

      {/* Delete confirmation modal */}
      {showDeleteConfirm !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-medium text-gray-900 mb-4">¿Estás seguro que deseas eliminar esta foto?</h3>
            <p className="text-sm text-gray-500 mb-6">Esta acción no se puede deshacer.</p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
                disabled={isDeleting}
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDeletePhoto(showDeleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium flex items-center"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Eliminando...
                  </>
                ) : (
                  <>Eliminar foto</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  )
} 