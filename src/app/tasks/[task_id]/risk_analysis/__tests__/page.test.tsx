// Mock dependencies
jest.mock('../../../components/TaskExecution', () => {
  return function MockTaskExecution({ taskId, multimediaData }: any) {
    return (
      <div data-testid="task-execution">
        TaskExecution with taskId: {taskId}, multimedia count: {multimediaData?.length || 0}
        {multimediaData?.map((item: any) => (
          <div key={item.id} data-testid={`multimedia-${item.id}`}>
            {item.videoUrl || item.photoUrl}
          </div>
        ))}
      </div>
    )
  }
})

jest.mock('@apollo/client', () => ({
  gql: jest.fn(),
}))

jest.mock('@/lib/apollo-client', () => ({
  query: jest.fn(),
}))

import React from 'react'
import { render, screen } from '@testing-library/react'
import client from '@/lib/apollo-client'
import RiskAnalysis from '../page'
import '@testing-library/jest-dom'

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
    audioTranscription: 'Test transcription'
  }
]

describe('RiskAnalysis', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render TaskExecution with fetched multimedia data', async () => {
    mockClient.query.mockResolvedValue({
      data: {
        findMultimediaByTaskId: mockMultimediaData
      },
      loading: false,
      networkStatus: 7
    } as any)

    const params = { task_id: '123' }
    const RiskAnalysisComponent = await RiskAnalysis({ params })
    render(RiskAnalysisComponent)

    expect(screen.getByTestId('task-execution')).toBeInTheDocument()
    expect(screen.getByText('TaskExecution with taskId: 123, multimedia count: 2')).toBeInTheDocument()
    expect(screen.getByTestId('multimedia-1')).toBeInTheDocument()
    expect(screen.getByTestId('multimedia-2')).toBeInTheDocument()
  })

  it('should handle empty multimedia data', async () => {
    mockClient.query.mockResolvedValue({
      data: {
        findMultimediaByTaskId: []
      },
      loading: false,
      networkStatus: 7
    } as any)

    const params = { task_id: '456' }
    const RiskAnalysisComponent = await RiskAnalysis({ params })
    render(RiskAnalysisComponent)

    expect(screen.getByTestId('task-execution')).toBeInTheDocument()
    expect(screen.getByText('TaskExecution with taskId: 456, multimedia count: 0')).toBeInTheDocument()
  })

  it('should handle GraphQL query errors', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    
    mockClient.query.mockRejectedValue(new Error('GraphQL error'))

    const params = { task_id: '789' }
    const RiskAnalysisComponent = await RiskAnalysis({ params })
    render(RiskAnalysisComponent)

    expect(screen.getByTestId('task-execution')).toBeInTheDocument()
    expect(screen.getByText('TaskExecution with taskId: 789, multimedia count: 0')).toBeInTheDocument()
    expect(consoleSpy).toHaveBeenCalledWith('Error fetching multimedia data:', expect.any(Error))
    
    consoleSpy.mockRestore()
  })

  it('should convert taskId to number in GraphQL query', async () => {
    mockClient.query.mockResolvedValue({
      data: {
        findMultimediaByTaskId: []
      },
      loading: false,
      networkStatus: 7
    } as any)

    const params = { task_id: '999' }
    await RiskAnalysis({ params })

    expect(mockClient.query).toHaveBeenCalledWith({
      query: undefined, // GQL query returns undefined in our mock
      variables: { taskId: 999 }
    })
  })

  it('should handle null response from GraphQL', async () => {
    mockClient.query.mockResolvedValue({
      data: {
        findMultimediaByTaskId: null
      },
      loading: false,
      networkStatus: 7
    } as any)

    const params = { task_id: '123' }
    const RiskAnalysisComponent = await RiskAnalysis({ params })
    render(RiskAnalysisComponent)

    expect(screen.getByTestId('task-execution')).toBeInTheDocument()
    expect(screen.getByText('TaskExecution with taskId: 123, multimedia count: 0')).toBeInTheDocument()
  })

  it('should pass correct props to TaskExecution', async () => {
    const singleMultimedia = [{
      id: 1,
      taskId: 123,
      photoUrl: 'single-photo.jpg',
      videoUrl: null,
      audioTranscription: null
    }]

    mockClient.query.mockResolvedValue({
      data: {
        findMultimediaByTaskId: singleMultimedia
      },
      loading: false,
      networkStatus: 7
    } as any)

    const params = { task_id: '123' }
    const RiskAnalysisComponent = await RiskAnalysis({ params })
    render(RiskAnalysisComponent)

    expect(screen.getByText('TaskExecution with taskId: 123, multimedia count: 1')).toBeInTheDocument()
    expect(screen.getByText('single-photo.jpg')).toBeInTheDocument()
  })

  it('should handle string taskId parameter', async () => {
    mockClient.query.mockResolvedValue({
      data: {
        findMultimediaByTaskId: []
      },
      loading: false,
      networkStatus: 7
    } as any)

    const params = { task_id: 'abc123' }
    await RiskAnalysis({ params })

    expect(mockClient.query).toHaveBeenCalledWith({
      query: undefined,
      variables: { taskId: NaN } // Number('abc123') = NaN
    })
  })

  it('should handle multimedia data with both photo and video', async () => {
    const mixedData = [{
      id: 1,
      taskId: 123,
      photoUrl: 'test-photo.jpg',
      videoUrl: 'test-video.mp4',
      audioTranscription: 'Mixed media transcription'
    }]

    mockClient.query.mockResolvedValue({
      data: {
        findMultimediaByTaskId: mixedData
      },
      loading: false,
      networkStatus: 7
    } as any)

    const params = { task_id: '123' }
    const RiskAnalysisComponent = await RiskAnalysis({ params })
    render(RiskAnalysisComponent)

    expect(screen.getByTestId('multimedia-1')).toBeInTheDocument()
    // Should display video URL (the first truthy value in the test component)
    expect(screen.getByText('test-video.mp4')).toBeInTheDocument()
  })
}) 