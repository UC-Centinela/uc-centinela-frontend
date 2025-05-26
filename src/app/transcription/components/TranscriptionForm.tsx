'use client'

import { useState, useRef } from 'react'
import { gql, useMutation } from '@apollo/client'
import { Buffer } from 'buffer'
import client from '@/lib/apollo-client'

const UPLOAD_VIDEO = gql`
  mutation UploadVideo($input: UploadVideoInput!) {
    uploadVideo(input: $input) {
      id
      videoUrl
      audioTranscription
    }
  }
`

export interface TranscriptionResult {
  mediaId: number | null
  transcription: string
  videoUrl?: string | null
}

interface TranscriptionFormProps {
  onTranscriptionComplete: (result: TranscriptionResult) => void
  taskId?: number
}

export default function TranscriptionForm({ onTranscriptionComplete, taskId }: TranscriptionFormProps) {
  const [file, setFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showFileInput, setShowFileInput] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [uploadVideo] = useMutation(UPLOAD_VIDEO, { client })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    if (!selectedFile.type.startsWith('video/') && !selectedFile.type.startsWith('audio/')) {
      setError('Selecciona un archivo de video o audio válido.')
      return
    }

    setFile(selectedFile)
    setFileName(selectedFile.name)
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      setError('Debes seleccionar un archivo.')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const buffer = await file.arrayBuffer()
      const base64 = Buffer.from(buffer).toString('base64')

      const result = await uploadVideo({
        variables: {
          input: {
            taskId,
            filename: file.name,
            mimetype: file.type,
            base64
          }
        }
      })

      const uploadedVideo = result.data?.uploadVideo;
      const id = uploadedVideo?.id;
      const videoUrl = uploadedVideo?.videoUrl;
      const immediateTranscription = uploadedVideo?.audioTranscription;

      onTranscriptionComplete({
        mediaId: id || null,
        transcription: immediateTranscription || 'Procesando transcripción...',
        videoUrl: videoUrl
      })
      
      setShowFileInput(false);
      setFile(null);
      setFileName('');
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Error:', err)
      if (err.graphQLErrors?.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setError(err.graphQLErrors.map((e: any) => e.message).join('\n'))
      } else if (err.networkError) {
        setError('Error de red: ' + err.networkError.message)
      } else {
        setError(err.message || 'Error desconocido al subir el video')
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
              accept="video/*,audio/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              hidden
            />
            {!fileName ? (
              <>
                <p className="text-sm text-gray-500 mb-2">Selecciona un archivo</p>
                <button 
                  type="button" 
                  className="bg-teal-700 text-white py-3 rounded-md font-medium text-base" 
                  onClick={() => fileInputRef.current?.click()}
                >
                  Buscar archivo
                </button>
              </>
            ) : (
              <>
                <p className="text-sm font-medium">{fileName}</p>
                <button 
                  type="button" 
                  className="text-teal-700 underline" 
                  onClick={() => fileInputRef.current?.click()}
                >
                  Cambiar archivo
                </button>
              </>
            )}
          </div>
          {error && <p className="text-sm text-red-600 mt-2 whitespace-pre-wrap">{error}</p>}
        </div>
      ) : null}

      {file ? (
        <button 
          type="button" 
          className="w-full bg-teal-700 text-white py-3 rounded-md font-medium text-base" 
          disabled={isLoading}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onClick={() => handleSubmit(new Event('submit') as any)}
        >
          {isLoading ? 'Procesando...' : 'Subir y Transcribir'}
        </button>
      ) : (
        <>
          <button 
            type="button" 
            className="w-full border border-teal-700 text-teal-700 py-3 rounded-md font-medium text-base mb-3" 
            disabled={isLoading}
            onClick={() => {
              setShowFileInput(true);
              setTimeout(() => fileInputRef.current?.click(), 100);
            }}
          >
            Subir video
          </button>
        </>
      )}
    </form>
  )
}
