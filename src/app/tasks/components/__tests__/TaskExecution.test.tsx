// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

jest.mock('@/app/transcription/components/TranscriptionForm', () => {
  return function MockTranscriptionForm({ onTranscriptionComplete, taskId }: any) {
    return (
      <div data-testid="transcription-form">
        TranscriptionForm with taskId: {taskId}
        <button 
          onClick={() => onTranscriptionComplete({
            mediaId: 123,
            transcription: 'Test transcription',
            videoUrl: 'test-video.mp4'
          })}
          data-testid="complete-transcription"
        >
          Complete Transcription
        </button>
      </div>
    )
  }
})

jest.mock('lucide-react', () => ({
  ChevronLeft: ({ className }: any) => <span className={className} data-testid="chevron-left" />,
  Info: ({ className }: any) => <span className={className} data-testid="info" />,
  AlertCircle: ({ className }: any) => <span className={className} data-testid="alert-circle" />,
  CheckCircle: ({ className }: any) => <span className={className} data-testid="check-circle" />,
}))

import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import TaskExecution from '../TaskExecution'

const mockPush = jest.fn()
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>

const mockMultimediaData = [
  {
    id: 1,
    taskId: 123,
    photoUrl: 'test-photo.jpg',
    videoUrl: null,
    audioTranscription: null
  },
  {
    id: 2,
    taskId: 123,
    photoUrl: null,
    videoUrl: 'test-video.mp4',
    audioTranscription: 'Existing transcription text'
  }
]

const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
})

describe('TaskExecution', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseRouter.mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      prefetch: jest.fn(),
    })
    mockLocalStorage.getItem.mockReturnValue(null)
  })

  it('should render without crashing', () => {
    render(<TaskExecution taskId="123" />)
    expect(screen.getByText('Ejecución Análisis de Riesgo')).toBeInTheDocument()
  })

  it('should render all main sections', () => {
    render(<TaskExecution taskId="123" />)
    
    expect(screen.getByText('Ejecución Análisis de Riesgo')).toBeInTheDocument()
    expect(screen.getByText('1. Tomar Video')).toBeInTheDocument()
    expect(screen.getByText('2. Tomar Fotografías')).toBeInTheDocument()
    expect(screen.getByText('3. Seleccionar Estrategias de Control')).toBeInTheDocument()
    expect(screen.getByText('4. Comentarios Adicionales')).toBeInTheDocument()
  })

  it('should display progress steps correctly', () => {
    render(<TaskExecution taskId="123" />)
    
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('Registro')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('Resultado ARTP')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('Envío')).toBeInTheDocument()
  })

  it('should navigate back when "Salir" is clicked', () => {
    render(<TaskExecution taskId="123" />)
    
    const exitButton = screen.getByText('Salir')
    fireEvent.click(exitButton)
    
    expect(mockPush).toHaveBeenCalledWith('/tasks/123')
  })

  it('should show transcription form when no existing video', () => {
    render(<TaskExecution taskId="123" multimediaData={[]} />)
    
    expect(screen.getByTestId('transcription-form')).toBeInTheDocument()
    expect(screen.getByText('TranscriptionForm with taskId: 123')).toBeInTheDocument()
  })

  it('should not show transcription form when existing video is present', () => {
    render(<TaskExecution taskId="123" multimediaData={mockMultimediaData} />)
    
    expect(screen.queryByTestId('transcription-form')).not.toBeInTheDocument()
  })

  it('should display "Listo" status when video exists', () => {
    render(<TaskExecution taskId="123" multimediaData={mockMultimediaData} />)
    
    expect(screen.getByText('Listo')).toBeInTheDocument()
    expect(screen.getByTestId('check-circle')).toBeInTheDocument()
  })

  it('should display "Pendiente" status when no video exists', () => {
    render(<TaskExecution taskId="123" multimediaData={[]} />)
    
    // Use getAllByText since "Pendiente" appears multiple times
    const pendienteElements = screen.getAllByText('Pendiente')
    expect(pendienteElements.length).toBeGreaterThan(0)
    expect(screen.getAllByTestId('alert-circle')).toHaveLength(3) // Video, Photos, Control strategies
  })

  it('should handle transcription completion', () => {
    render(<TaskExecution taskId="123" multimediaData={[]} />)
    
    const completeButton = screen.getByTestId('complete-transcription')
    fireEvent.click(completeButton)
    
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'transcription-123',
      JSON.stringify({
        mediaId: 123,
        transcription: 'Test transcription',
        videoUrl: 'test-video.mp4'
      })
    )
  })

  it('should display video when transcription result is available', () => {
    render(<TaskExecution taskId="123" multimediaData={[]} />)
    
    const completeButton = screen.getByTestId('complete-transcription')
    fireEvent.click(completeButton)
    
    expect(screen.getByRole('button', { name: /ver detalles/i })).toBeInTheDocument()
  })

  it('should navigate to video details when "Ver Detalles" is clicked', () => {
    render(<TaskExecution taskId="123" multimediaData={mockMultimediaData} />)
    
    const verDetallesButton = screen.getByText('Ver Detalles')
    fireEvent.click(verDetallesButton)
    
    expect(mockPush).toHaveBeenCalledWith('/tasks/123/video-details')
  })

  it('should load transcription from localStorage on mount', () => {
    const storedTranscription = JSON.stringify({
      mediaId: 456,
      transcription: 'Stored transcription'
    })
    mockLocalStorage.getItem.mockReturnValue(storedTranscription)
    
    render(<TaskExecution taskId="123" multimediaData={[]} />)
    
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('transcription-123')
  })

  it('should prefer existing video transcription over localStorage', () => {
    const storedTranscription = JSON.stringify({
      mediaId: 456,
      transcription: 'Stored transcription'
    })
    mockLocalStorage.getItem.mockReturnValue(storedTranscription)
    
    render(<TaskExecution taskId="123" multimediaData={mockMultimediaData} />)
    
    // Should use existing video transcription, not localStorage
    expect(screen.getByText('Ver Detalles')).toBeInTheDocument()
  })

  it('should handle localStorage errors gracefully', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    mockLocalStorage.setItem.mockImplementation(() => {
      throw new Error('Storage error')
    })
    
    render(<TaskExecution taskId="123" multimediaData={[]} />)
    
    const completeButton = screen.getByTestId('complete-transcription')
    fireEvent.click(completeButton)
    
    expect(consoleSpy).toHaveBeenCalledWith('Error saving transcription to localStorage:', expect.any(Error))
    consoleSpy.mockRestore()
  })

  it('should display instructions when no existing video', () => {
    render(<TaskExecution taskId="123" multimediaData={[]} />)
    
    // Use getAllByText since "Instrucciones" appears multiple times in different sections
    const instructionsElements = screen.getAllByText('Instrucciones')
    expect(instructionsElements.length).toBeGreaterThan(0)
    expect(screen.getByText(/Graba un video de la tarea/)).toBeInTheDocument()
  })

  it('should not display instructions when existing video is present', () => {
    render(<TaskExecution taskId="123" multimediaData={mockMultimediaData} />)
    
    // Instructions should not be visible since video exists
    expect(screen.queryByText(/Graba un video de la tarea/)).not.toBeInTheDocument()
  })

  it('should display all action buttons', () => {
    render(<TaskExecution taskId="123" multimediaData={[]} />)
    
    expect(screen.getByText('Grabar video')).toBeInTheDocument()
    expect(screen.getByText('Tomar fotos')).toBeInTheDocument()
    expect(screen.getByText('Seleccionar Estrategias')).toBeInTheDocument()
    expect(screen.getByText('Generar ARTP')).toBeInTheDocument()
  })

  it('should not display "Grabar video" button when video exists', () => {
    render(<TaskExecution taskId="123" multimediaData={mockMultimediaData} />)
    
    expect(screen.queryByText('Grabar video')).not.toBeInTheDocument()
  })

  it('should display textarea for additional comments', () => {
    render(<TaskExecution taskId="123" />)
    
    const textarea = screen.getByPlaceholderText('Añade comentarios')
    expect(textarea).toBeInTheDocument()
    expect(textarea).toHaveAttribute('rows', '4')
  })

  it('should display "Opcional" status for comments section', () => {
    render(<TaskExecution taskId="123" />)
    
    expect(screen.getByText('Opcional')).toBeInTheDocument()
  })

  it('should render all icons correctly', () => {
    render(<TaskExecution taskId="123" multimediaData={[]} />)
    
    expect(screen.getByTestId('chevron-left')).toBeInTheDocument()
    expect(screen.getAllByTestId('info')).toHaveLength(4) // One for each instruction section
    expect(screen.getAllByTestId('alert-circle')).toHaveLength(3) // Pending statuses
  })

  it('should handle taskId conversion to number', () => {
    render(<TaskExecution taskId="456" multimediaData={[]} />)
    
    expect(screen.getByText('TranscriptionForm with taskId: 456')).toBeInTheDocument()
  })

  it('should handle undefined taskId', () => {
    render(<TaskExecution multimediaData={[]} />)
    
    expect(screen.getByText('TranscriptionForm with taskId:')).toBeInTheDocument()
  })

  it('should handle completion with video URL', () => {
    render(<TaskExecution taskId="123" multimediaData={[]} />)
    
    const completeButton = screen.getByTestId('complete-transcription')
    fireEvent.click(completeButton)
    
    // Should create uploaded video state
    expect(screen.getByRole('button', { name: /ver detalles/i })).toBeInTheDocument()
  })

  it('should handle existing video with transcription', () => {
    const dataWithVideo = [{
      id: 1,
      taskId: 123,
      photoUrl: null,
      videoUrl: 'existing-video.mp4',
      audioTranscription: 'Existing transcription'
    }]
    
    render(<TaskExecution taskId="123" multimediaData={dataWithVideo} />)
    
    expect(screen.getByText('Listo')).toBeInTheDocument()
    expect(screen.getByText('Ver Detalles')).toBeInTheDocument()
  })

  it('should update transcription state when multimedia data changes', () => {
    const { rerender } = render(<TaskExecution taskId="123" multimediaData={[]} />)
    
    // Initially no video
    expect(screen.queryByText('Ver Detalles')).not.toBeInTheDocument()
    
    // Add video data
    rerender(<TaskExecution taskId="123" multimediaData={mockMultimediaData} />)
    
    // Should now show video details
    expect(screen.getByText('Ver Detalles')).toBeInTheDocument()
  })

  it('should display video element when transcription result has video', () => {
    render(<TaskExecution taskId="123" multimediaData={mockMultimediaData} />)
    
    // Find the video element by tag name
    const videoContainer = document.querySelector('video')
    expect(videoContainer).toBeInTheDocument()
    expect(videoContainer).toHaveAttribute('controls')
    expect(videoContainer).toHaveAttribute('poster', '/video-thumbnail.jpg')
  })
}) 