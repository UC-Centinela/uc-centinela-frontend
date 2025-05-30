'use client'

import { useState, useRef } from 'react'
import { gql, useMutation } from '@apollo/client'
import { Buffer } from 'buffer'
import { Button } from "@/components/ui/button"
import client from '@/lib/apollo-client'

const UPLOAD_PHOTOS = gql`
  mutation UploadPhotos($input: UploadPhotosInput!) {
    uploadPhotos(input: $input) {
      id
      photoUrl
    }
  }
`

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
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [uploadPhotos] = useMutation(UPLOAD_PHOTOS, { client })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    if (selectedFiles.length === 0) return

    const invalidFiles = selectedFiles.filter(file => !file.type.startsWith('image/'))
    if (invalidFiles.length > 0) {
      setError('Por favor, selecciona solo archivos de imagen.')
      return
    }

    setFiles(selectedFiles)
    setFileNames(selectedFiles.map(file => file.name))
    setError('')
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

        return uploadPhotos({
          variables: {
            input: {
              taskId,
              filename: file.name,
              mimetype: file.type,
              base64
            }
          }
        })
      })

      const results = await Promise.all(uploadPromises)
      const uploadedPhotos = results.map(result => {
        const photo = result.data?.uploadPhotos
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
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              multiple
              hidden
            />
            {fileNames.length === 0 ? (
              <>
                <p className="text-sm text-gray-500 mb-2">Selecciona las fotos</p>
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
    </form>
  )
} 