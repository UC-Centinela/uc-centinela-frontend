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
  const [isProcessing, setIsProcessing] = useState(false)
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
    setIsProcessing(true)
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

      if (taskId) {
        // Force a hard redirect to completely bypass React's rendering cycle
        document.body.style.cursor = 'wait';
        window.location.replace(`/tasks/${taskId}/video-details`);
        return;
      }
      
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
      setIsProcessing(false)
    } finally {
      setIsLoading(false);
    }
  }

  if (isProcessing) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-xl">
          <div className="text-teal-700 mb-6 flex items-center justify-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
            <span className="text-lg font-medium">Procesando el video</span>
          </div>
          
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16">
              <svg className="animate-spin w-full h-full text-teal-700" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path opacity="0.2" fillRule="evenodd" clipRule="evenodd" d="M12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="currentColor" />
                <path d="M12 22C17.5228 22 22 17.5228 22 12H19C19 15.866 15.866 19 12 19V22Z" fill="currentColor" />
              </svg>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-lg font-medium">Espera unos momentos</p>
            <p className="text-gray-500 mb-4">por favor</p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 text-sm text-yellow-800 text-center">
              <p className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
                No cierres ni refresques esta página
              </p>
              <p className="mt-1">El proceso continuará automáticamente</p>
            </div>
          </div>
        </div>
      </div>
    )
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
            className="w-full bg-teal-700 text-white py-3 rounded-md font-medium text-base"
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
