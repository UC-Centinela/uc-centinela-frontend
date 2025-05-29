// Mock the dependencies
jest.mock('@/app/tasks/components/TasksList', () => {
  return function MockTasksList({ tasks }: any) {
    return (
      <div data-testid="tasks-list">
        TasksList with {tasks.length} tasks
        {tasks.map((task: any) => (
          <div key={task.id} data-testid={`task-${task.id}`}>
            {task.title}
          </div>
        ))}
      </div>
    )
  }
})

jest.mock('@/services/users', () => ({
  getUserProfile: jest.fn(),
}))

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}))

import React from 'react'
import { render, screen } from '@testing-library/react'
import { cookies } from 'next/headers'
import { getUserProfile } from '@/services/users'
import Tasks from '../page'

const mockCookies = cookies as jest.MockedFunction<typeof cookies>
const mockGetUserProfile = getUserProfile as jest.MockedFunction<typeof getUserProfile>
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

const mockTasks = [
  {
    id: '1',
    title: 'Test Task 1',
    instruction: 'Test instruction 1',
    state: 'PENDING',
    creatorUserId: 'user1',
    revisorUserId: 'user2',
    comments: 'Test comments',
    changeHistory: 'Created',
    assignationDate: '2024-01-15T10:00:00.000Z',
    requiredSendDate: '2024-01-30T10:00:00.000Z',
  },
  {
    id: '2',
    title: 'Test Task 2',
    instruction: 'Test instruction 2',
    state: 'IN_PROGRESS',
    creatorUserId: 'user1',
    revisorUserId: 'user2',
    comments: 'Test comments',
    changeHistory: 'Started',
    assignationDate: '2024-01-10T10:00:00.000Z',
    requiredSendDate: '2024-01-25T10:00:00.000Z',
  },
]

const mockCookieStore = {
  get: jest.fn(),
  set: jest.fn(),
  delete: jest.fn(),
}

const mockUserProfile = {
  data: {
    getUserByEmail: {
      id: '123',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      customerId: 'customer1',
      role: 'roleOperator',
      idpId: 'idp1',
      rut: '12345678-9'
    }
  }
}

describe('Tasks Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    // Default setup
    mockCookies.mockResolvedValue(mockCookieStore)
    mockCookieStore.get.mockReturnValue({ value: 'test-token' })
    mockGetUserProfile.mockResolvedValue(mockUserProfile)
    mockFetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        data: {
          findTasksByUser: mockTasks
        }
      })
    } as any)
    
    // Set environment variable
    process.env.NEXT_PUBLIC_GRAPHQL_API_URL = 'http://localhost:4000/graphql'
  })

  it('should render TasksList component with fetched tasks', async () => {
    const TasksComponent = await Tasks()
    render(TasksComponent)
    
    expect(screen.getByTestId('tasks-list')).toBeInTheDocument()
    expect(screen.getByText('TasksList with 2 tasks')).toBeInTheDocument()
    expect(screen.getByTestId('task-1')).toBeInTheDocument()
    expect(screen.getByTestId('task-2')).toBeInTheDocument()
    expect(screen.getByText('Test Task 1')).toBeInTheDocument()
    expect(screen.getByText('Test Task 2')).toBeInTheDocument()
  })

  it('should render TasksList with empty array when no access token', async () => {
    mockCookieStore.get.mockReturnValue(undefined)
    
    const TasksComponent = await Tasks()
    render(TasksComponent)
    
    expect(screen.getByTestId('tasks-list')).toBeInTheDocument()
    expect(screen.getByText('TasksList with 0 tasks')).toBeInTheDocument()
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('should render TasksList with empty array when no user profile', async () => {
    mockGetUserProfile.mockResolvedValue(null)
    
    const TasksComponent = await Tasks()
    render(TasksComponent)
    
    expect(screen.getByTestId('tasks-list')).toBeInTheDocument()
    expect(screen.getByText('TasksList with 0 tasks')).toBeInTheDocument()
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('should handle fetch error gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    mockFetch.mockRejectedValue(new Error('Network error'))
    
    const TasksComponent = await Tasks()
    render(TasksComponent)
    
    expect(screen.getByTestId('tasks-list')).toBeInTheDocument()
    expect(screen.getByText('TasksList with 0 tasks')).toBeInTheDocument()
    expect(consoleSpy).toHaveBeenCalledWith('Error fetching tasks:', expect.any(Error))
    
    consoleSpy.mockRestore()
  })

  it('should make correct GraphQL request', async () => {
    await Tasks()
    
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:4000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer test-token',
      },
      body: JSON.stringify({
        query: expect.stringContaining('query FindTasksByUser'),
        variables: {
          userId: 123,
        }
      })
    })
  })

  it('should handle user profile without id', async () => {
    mockGetUserProfile.mockResolvedValue({
      data: {
        getUserByEmail: {
          ...mockUserProfile.data.getUserByEmail,
          id: undefined
        }
      }
    })
    
    const TasksComponent = await Tasks()
    render(TasksComponent)
    
    expect(screen.getByTestId('tasks-list')).toBeInTheDocument()
    expect(screen.getByText('TasksList with 0 tasks')).toBeInTheDocument()
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('should handle non-numeric user id', async () => {
    mockGetUserProfile.mockResolvedValue({
      data: {
        getUserByEmail: {
          ...mockUserProfile.data.getUserByEmail,
          id: 'invalid-id'
        }
      }
    })
    
    const TasksComponent = await Tasks()
    render(TasksComponent)
    
    expect(screen.getByTestId('tasks-list')).toBeInTheDocument()
    expect(screen.getByText('TasksList with 0 tasks')).toBeInTheDocument()
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('should handle empty response from GraphQL', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        data: {
          findTasksByUser: null
        }
      })
    } as any)
    
    const TasksComponent = await Tasks()
    render(TasksComponent)
    
    expect(screen.getByTestId('tasks-list')).toBeInTheDocument()
    expect(screen.getByText('TasksList with 0 tasks')).toBeInTheDocument()
  })

  it('should handle GraphQL response without data', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        errors: [{ message: 'User not found' }]
      })
    } as any)
    
    const TasksComponent = await Tasks()
    render(TasksComponent)
    
    expect(screen.getByTestId('tasks-list')).toBeInTheDocument()
    expect(screen.getByText('TasksList with 0 tasks')).toBeInTheDocument()
  })

  it('should handle cookies function throwing error', async () => {
    mockCookies.mockRejectedValue(new Error('Cookie error'))
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    
    const TasksComponent = await Tasks()
    render(TasksComponent)
    
    expect(screen.getByTestId('tasks-list')).toBeInTheDocument()
    expect(screen.getByText('TasksList with 0 tasks')).toBeInTheDocument()
    expect(consoleSpy).toHaveBeenCalledWith('Error fetching tasks:', expect.any(Error))
    
    consoleSpy.mockRestore()
  })

  it('should handle getUserProfile throwing error', async () => {
    mockGetUserProfile.mockRejectedValue(new Error('User profile error'))
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    
    const TasksComponent = await Tasks()
    render(TasksComponent)
    
    expect(screen.getByTestId('tasks-list')).toBeInTheDocument()
    expect(screen.getByText('TasksList with 0 tasks')).toBeInTheDocument()
    expect(consoleSpy).toHaveBeenCalledWith('Error fetching tasks:', expect.any(Error))
    
    consoleSpy.mockRestore()
  })

  it('should correctly parse string userId to integer', async () => {
    mockGetUserProfile.mockResolvedValue({
      data: {
        getUserByEmail: {
          ...mockUserProfile.data.getUserByEmail,
          id: '456'
        }
      }
    })
    
    await Tasks()
    
    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        body: expect.stringContaining('"userId":456')
      })
    )
  })
}) 