// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

jest.mock('next/image', () => {
  return function MockImage({ src, alt, onError, ...props }: any) {
    return (
      <img 
        src={src} 
        alt={alt} 
        onError={onError}
        {...props}
        data-testid="next-image"
      />
    )
  }
})

jest.mock('@apollo/client', () => ({
  gql: jest.fn(),
}))

jest.mock('@/lib/apollo-client', () => ({
  query: jest.fn(),
}))

jest.mock('lucide-react', () => ({
  ChevronLeft: ({ className }: any) => <span className={className} data-testid="chevron-left" />,
  AlertTriangle: ({ className }: any) => <span className={className} data-testid="alert-triangle" />,
  ChevronUp: ({ className }: any) => <span className={className} data-testid="chevron-up" />,
  Mic: ({ className }: any) => <span className={className} data-testid="mic" />,
}))

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import client from '@/lib/apollo-client'
import VideoDetailsPage from '../page'
import '@testing-library/jest-dom'

const mockPush = jest.fn()
const mockBack = jest.fn()
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>
const mockClient = client as jest.Mocked<typeof client>

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
    audioTranscription: 'Test video transcription'
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

describe('VideoDetailsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseRouter.mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      back: mockBack,
      forward: jest.fn(),
      refresh: jest.fn(),
      prefetch: jest.fn(),
    })
    mockLocalStorage.getItem.mockReturnValue(null)
  })

  it('should show loading spinner initially', () => {
    mockClient.query.mockImplementation(() => new Promise(() => {})) // Never resolves
    
    const params = { task_id: '123' }
    render(<VideoDetailsPage params={params} />)
    
    // Find loading spinner by its class
    expect(document.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('should render video details when data is loaded', async () => {
    mockClient.query.mockResolvedValue({
      data: {
        findMultimediaByTaskId: mockMultimediaData
      },
      loading: false,
      networkStatus: 7
    } as any)

    const params = { task_id: '123' }
    render(<VideoDetailsPage params={params} />)

    await waitFor(() => {
      expect(screen.getByText('Análisis de Video')).toBeInTheDocument()
    })

    expect(screen.getByText('Elementos detectados')).toBeInTheDocument()
    expect(screen.getByText('Condiciones del entorno:')).toBeInTheDocument()
  })

  it('should display video when video data is available', async () => {
    mockClient.query.mockResolvedValue({
      data: {
        findMultimediaByTaskId: mockMultimediaData
      },
      loading: false,
      networkStatus: 7
    } as any)

    const params = { task_id: '123' }
    render(<VideoDetailsPage params={params} />)

    await waitFor(() => {
      // Find video element by tag name
      const video = document.querySelector('video')
      expect(video).toBeInTheDocument()
      expect(video).toHaveAttribute('src', 'test-video.mp4')
      expect(video).toHaveAttribute('controls')
    })
  })

  it('should display placeholder when no video data', async () => {
    const dataWithoutVideo = [{
      id: 1,
      taskId: 123,
      photoUrl: 'test-photo.jpg',
      videoUrl: null,
      audioTranscription: null
    }]

    mockClient.query.mockResolvedValue({
      data: {
        findMultimediaByTaskId: dataWithoutVideo
      },
      loading: false,
      networkStatus: 7
    } as any)

    const params = { task_id: '123' }
    render(<VideoDetailsPage params={params} />)

    await waitFor(() => {
      expect(screen.getByTestId('next-image')).toBeInTheDocument()
    })
  })

  it('should navigate back when "Volver" is clicked', async () => {
    mockClient.query.mockResolvedValue({
      data: {
        findMultimediaByTaskId: mockMultimediaData
      },
      loading: false,
      networkStatus: 7
    } as any)

    const params = { task_id: '123' }
    render(<VideoDetailsPage params={params} />)

    await waitFor(() => {
      const backButton = screen.getByText('Volver')
      fireEvent.click(backButton)
      expect(mockBack).toHaveBeenCalledTimes(1)
    })
  })

  it('should handle GraphQL query errors', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    
    mockClient.query.mockRejectedValue(new Error('GraphQL error'))

    const params = { task_id: '123' }
    render(<VideoDetailsPage params={params} />)

    await waitFor(() => {
      expect(screen.getByText('Análisis de Video')).toBeInTheDocument()
    })

    expect(consoleSpy).toHaveBeenCalledWith('Error fetching multimedia data:', expect.any(Error))
    consoleSpy.mockRestore()
  })

  it('should load transcription from localStorage when no video data', async () => {
    mockClient.query.mockResolvedValue({
      data: {
        findMultimediaByTaskId: []
      },
      loading: false,
      networkStatus: 7
    } as any)

    const storedTranscription = JSON.stringify({
      mediaId: 456,
      transcription: 'Stored transcription text'
    })
    mockLocalStorage.getItem.mockReturnValue(storedTranscription)

    const params = { task_id: '123' }
    render(<VideoDetailsPage params={params} />)

    await waitFor(() => {
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('transcription-123')
    })
  })

  it('should handle localStorage errors gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    
    mockClient.query.mockResolvedValue({
      data: {
        findMultimediaByTaskId: []
      },
      loading: false,
      networkStatus: 7
    } as any)

    mockLocalStorage.getItem.mockImplementation(() => {
      throw new Error('Storage error')
    })

    const params = { task_id: '123' }
    render(<VideoDetailsPage params={params} />)

    await waitFor(() => {
      expect(screen.getByText('Análisis de Video')).toBeInTheDocument()
    })

    expect(consoleSpy).toHaveBeenCalledWith('Error loading transcription data:', expect.any(Error))
    consoleSpy.mockRestore()
  })

  it('should display transcription sections', async () => {
    mockClient.query.mockResolvedValue({
      data: {
        findMultimediaByTaskId: mockMultimediaData
      },
      loading: false,
      networkStatus: 7
    } as any)

    const params = { task_id: '123' }
    render(<VideoDetailsPage params={params} />)

    await waitFor(() => {
      expect(screen.getByText('Transcripción audio')).toBeInTheDocument()
      expect(screen.getByText('Test video transcription')).toBeInTheDocument()
    })
  })

  it('should handle image loading errors', async () => {
    mockClient.query.mockResolvedValue({
      data: {
        findMultimediaByTaskId: [{
          id: 1,
          taskId: 123,
          photoUrl: null,
          videoUrl: null,
          audioTranscription: null
        }]
      },
      loading: false,
      networkStatus: 7
    } as any)

    const params = { task_id: '123' }
    render(<VideoDetailsPage params={params} />)

    await waitFor(() => {
      const image = screen.getByTestId('next-image')
      fireEvent.error(image)
      expect(image).toHaveAttribute('src', 'https://via.placeholder.com/640x360?text=Video+Preview')
    })
  })

  it('should display all detection sections', async () => {
    mockClient.query.mockResolvedValue({
      data: {
        findMultimediaByTaskId: mockMultimediaData
      },
      loading: false,
      networkStatus: 7
    } as any)

    const params = { task_id: '123' }
    render(<VideoDetailsPage params={params} />)

    await waitFor(() => {
      expect(screen.getByText('Condiciones del entorno:')).toBeInTheDocument()
      expect(screen.getByText('Equipos y herramientas:')).toBeInTheDocument()
      expect(screen.getByText('Personas:')).toBeInTheDocument()
    })
  })

  it('should convert taskId to number in GraphQL query', async () => {
    mockClient.query.mockResolvedValue({
      data: {
        findMultimediaByTaskId: []
      },
      loading: false,
      networkStatus: 7
    } as any)

    const params = { task_id: '456' }
    render(<VideoDetailsPage params={params} />)

    await waitFor(() => {
      expect(mockClient.query).toHaveBeenCalledWith({
        query: undefined, // GQL returns undefined in mock
        variables: { taskId: 456 }
      })
    })
  })

  it('should handle empty transcription gracefully', async () => {
    const dataWithEmptyTranscription = [{
      id: 1,
      taskId: 123,
      photoUrl: null,
      videoUrl: 'test-video.mp4',
      audioTranscription: null
    }]

    mockClient.query.mockResolvedValue({
      data: {
        findMultimediaByTaskId: dataWithEmptyTranscription
      },
      loading: false,
      networkStatus: 7
    } as any)

    const params = { task_id: '123' }
    render(<VideoDetailsPage params={params} />)

    await waitFor(() => {
      expect(screen.getByText('Análisis de Video')).toBeInTheDocument()
    })
  })

  it('should show no transcription message when no data found', async () => {
    mockClient.query.mockResolvedValue({
      data: {
        findMultimediaByTaskId: []
      },
      loading: false,
      networkStatus: 7
    } as any)

    mockLocalStorage.getItem.mockReturnValue(null)

    const params = { task_id: '123' }
    render(<VideoDetailsPage params={params} />)

    await waitFor(() => {
      expect(screen.getByText('No se encontró transcripción para este video.')).toBeInTheDocument()
    })
  })

  it('should handle loading state for video details client', async () => {
    mockClient.query.mockResolvedValue({
      data: {
        findMultimediaByTaskId: mockMultimediaData
      },
      loading: false,
      networkStatus: 7
    } as any)

    const params = { task_id: '123' }
    render(<VideoDetailsPage params={params} />)

    // Should show loading spinner during GraphQL query
    expect(document.querySelector('.animate-spin')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('Análisis de Video')).toBeInTheDocument()
    })
  })

  it('should render icons correctly', async () => {
    mockClient.query.mockResolvedValue({
      data: {
        findMultimediaByTaskId: mockMultimediaData
      },
      loading: false,
      networkStatus: 7
    } as any)

    const params = { task_id: '123' }
    render(<VideoDetailsPage params={params} />)

    await waitFor(() => {
      expect(screen.getByTestId('chevron-left')).toBeInTheDocument()
    })
  })

  it('should handle malformed localStorage data', async () => {
    mockClient.query.mockResolvedValue({
      data: {
        findMultimediaByTaskId: []
      },
      loading: false,
      networkStatus: 7
    } as any)

    mockLocalStorage.getItem.mockReturnValue('invalid json')

    const params = { task_id: '123' }
    render(<VideoDetailsPage params={params} />)

    await waitFor(() => {
      expect(screen.getByText('Error al cargar la transcripción.')).toBeInTheDocument()
    })
  })
}) 