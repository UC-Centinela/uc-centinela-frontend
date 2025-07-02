'use client'

import { useState, useEffect } from 'react'
import { gql, useLazyQuery } from '@apollo/client'
import client from '@/lib/apollo-client'
import type { TranscriptionResult } from './TranscriptionForm'
import { AlertTriangle, Mic, ChevronUp, ChevronDown } from 'lucide-react'

const FIND_MULTIMEDIA = gql`
  query FindMultimedia($id: Int!) {
    findMultimedia(id: $id) {
      id
      audioTranscription
    }
  }
`

// Mock suggestions for improvement (in a real app, these would come from the backend)
const DEFAULT_SUGGESTIONS = [
  'Nombra cuántas personas hay',
  'Describe los elementos EPP necesarios',
  'Describe cómo mitigar los riesgos'
]

interface TranscriptionDisplayProps {
  transcriptionResult: TranscriptionResult
  suggestions?: string[]
}

export default function TranscriptionDisplay({ 
  transcriptionResult,
  suggestions = DEFAULT_SUGGESTIONS 
}: TranscriptionDisplayProps) {
  const [transcription, setTranscription] = useState(transcriptionResult.transcription)
  const [mediaId] = useState(transcriptionResult.mediaId)
  const [pollCount, setPollCount] = useState(0)
  const [canRetry, setCanRetry] = useState(false)
  const [error, setError] = useState('')
  const [suggestionsExpanded, setSuggestionsExpanded] = useState(true)

  const formattedTranscription = transcription === 'Procesando transcripción...' || 
    transcription === 'Reintentando obtener transcripción...' ? 
    transcription : 
    formatTranscriptionWithTimestamps(transcription)

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

  useEffect(() => {
    if (mediaId && transcription === 'Procesando transcripción...') {
      setTimeout(() => {
        fetchMultimedia({ variables: { id: mediaId } })
      }, 5000)
    }
  }, [mediaId, transcription, fetchMultimedia])

  useEffect(() => {
    setTranscription(transcriptionResult.transcription)
  }, [transcriptionResult.transcription])

  const handleRetry = () => {
    if (!mediaId) return
    setTranscription('Reintentando obtener transcripción...')
    setPollCount(0)
    setCanRetry(false)
    fetchMultimedia({ variables: { id: mediaId } })
  }

  function formatTranscriptionWithTimestamps(text: string) {
    const lines = text.split('\n').filter(line => line.trim() !== '')
    
    if (lines.length === 0) return text
    
    let result = ''
    lines.forEach((line, index) => {
      if (index % 2 === 0) {
        const minutes = Math.floor(index / 2)
        const seconds = Math.floor(Math.random() * 60)
        result += `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}\n`
      }
      result += `${line}\n\n`
    })
    
    return result
  }

  const toggleSuggestions = () => {
    setSuggestionsExpanded(!suggestionsExpanded)
  }

  if (!transcription) return null

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-2 text-teal-700">Transcripción audio</h2>
      
      {/* Suggestions section */}
      <div className="bg-amber-50 border border-amber-200 rounded-md mb-4">
        <div 
          className="flex items-center justify-between p-3 cursor-pointer"
          onClick={toggleSuggestions}
        >
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
            <span className="font-medium text-gray-800">Se han detectado {suggestions.length} sugerencias para mejorar la descripción</span>
          </div>
          {suggestionsExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </div>
        
        {suggestionsExpanded && (
          <div className="px-3 pb-3">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="flex items-center p-2 border-t border-amber-200">
                <Mic className="h-4 w-4 text-teal-600 mr-2" />
                <span className="text-gray-700">{suggestion}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Transcription text */}
      <div className="bg-white border border-gray-200 rounded-md p-4 max-h-60 overflow-y-auto">
        {transcription === 'Procesando transcripción...' || 
         transcription === 'Reintentando obtener transcripción...' ? (
          <p className="text-gray-500">{transcription}</p>
        ) : (
          <pre className="whitespace-pre-wrap text-gray-700 font-sans">{formattedTranscription}</pre>
        )}
        
        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
        
        {canRetry && (
          <div className="mt-4">
            <button 
              className="bg-white border border-teal-700 text-teal-700 px-4 py-2 rounded-md text-sm font-medium"
              onClick={handleRetry}
            >
              Reintentar consulta
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
