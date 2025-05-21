'use client'

import { useState, useRef } from 'react'
import { gql, useMutation, useLazyQuery } from '@apollo/client'
import { Buffer } from 'buffer'
import client from '@/lib/apollo-client'
import { Button } from '@/components/ui/button'

const UPLOAD_VIDEO = gql`
  mutation UploadVideo($input: UploadVideoInput!) {
    uploadVideo(input: $input) {
      id
      videoUrl
      audioTranscription
    }
  }
`

const FIND_MULTIMEDIA = gql`
  query FindMultimedia($id: Int!) {
    findMultimedia(id: $id) {
      id
      audioTranscription
    }
  }
`

export default function TranscriptionForm() {
  const [file, setFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [transcription, setTranscription] = useState('')
  const [mediaId, setMediaId] = useState<number | null>(null)
  const [pollCount, setPollCount] = useState(0)
  const [canRetry, setCanRetry] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const taskId = 1

  const [uploadVideo] = useMutation(UPLOAD_VIDEO, { client })
  const [fetchMultimedia] = useLazyQuery(FIND_MULTIMEDIA, {
    client,
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      const audio = data?.findMultimedia?.audioTranscription
      if (audio) {
        setTranscription(audio)
        setCanRetry(false)
      } else {
        if (pollCount < 3) {
          setPollCount((prev) => prev + 1)
          setTimeout(() => {
            fetchMultimedia({ variables: { id: mediaId } })
          }, 5000)
        } else {
          setCanRetry(true)
          setTranscription('Transcripción aún no disponible. Puedes reintentar manualmente.')
        }
      }
    },
    onError: (err) => {
      setError(err.message || 'Error al consultar la transcripción')
    }
  })

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
    setTranscription('')
    setPollCount(0)
    setCanRetry(false)

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

      const id = result.data?.uploadVideo?.id
      const immediateTranscription = result.data?.uploadVideo?.audioTranscription

      setMediaId(id)

      if (immediateTranscription) {
        setTranscription(immediateTranscription)
      } else {
        setTranscription('Procesando transcripción...')
        setTimeout(() => {
          fetchMultimedia({ variables: { id } })
        }, 5000)
      }
    } catch (err: any) {
      console.error('Error:', err)
      if (err.graphQLErrors?.length > 0) {
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

  const handleRetry = () => {
    if (!mediaId) return
    setTranscription('Reintentando obtener transcripción...')
    setPollCount(0)
    setCanRetry(false)
    fetchMultimedia({ variables: { id: mediaId } })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto">
      <div>
        <label className="block mb-2 text-sm font-medium">Archivo de Video o Audio</label>
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
              <Button type="button" onClick={() => fileInputRef.current?.click()}>
                Buscar archivo
              </Button>
            </>
          ) : (
            <>
              <p className="text-sm font-medium">{fileName}</p>
              <Button type="button" variant="link" onClick={() => fileInputRef.current?.click()}>
                Cambiar archivo
              </Button>
            </>
          )}
        </div>
        {error && <p className="text-sm text-red-600 mt-2 whitespace-pre-wrap">{error}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading || !file}>
        {isLoading ? 'Procesando...' : 'Subir y Transcribir'}
      </Button>

      {transcription && (
        <div className="mt-6 bg-gray-100 p-4 rounded-md">
          <h2 className="text-lg font-semibold mb-2">Transcripción</h2>
          <p className="whitespace-pre-wrap">{transcription}</p>
          {canRetry && (
            <div className="mt-4">
              <Button variant="outline" onClick={handleRetry}>
                Reintentar consulta
              </Button>
            </div>
          )}
        </div>
      )}
    </form>
  )
}
