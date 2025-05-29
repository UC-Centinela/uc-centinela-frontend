// Mock the TaskIntro component
jest.mock('@/app/tasks/components/TaskIntro', () => {
  return function MockTaskIntro({ taskId }: { taskId: string }) {
    return <div data-testid="task-intro">TaskIntro with taskId: {taskId}</div>
  }
})

import React from 'react'
import { render, screen } from '@testing-library/react'
import TaskPage from '../page'

// Helper function to create async params for Next.js 15
const createAsyncParams = (task_id: string) => Promise.resolve({ task_id })

describe('TaskPage', () => {
  it('should render without crashing', async () => {
    const params = createAsyncParams('123')
    const PageComponent = await TaskPage({ params })
    render(PageComponent)
    expect(screen.getByTestId('task-intro')).toBeInTheDocument()
  })

  it('should pass task_id parameter to TaskIntro', async () => {
    const params = createAsyncParams('456')
    const PageComponent = await TaskPage({ params })
    render(PageComponent)
    expect(screen.getByText('TaskIntro with taskId: 456')).toBeInTheDocument()
  })

  it('should handle string task_id parameter', async () => {
    const params = createAsyncParams('abc123')
    const PageComponent = await TaskPage({ params })
    render(PageComponent)
    expect(screen.getByText('TaskIntro with taskId: abc123')).toBeInTheDocument()
  })

  it('should handle empty task_id parameter', async () => {
    const params = createAsyncParams('')
    const PageComponent = await TaskPage({ params })
    render(PageComponent)
    expect(screen.getByText('TaskIntro with taskId:')).toBeInTheDocument()
  })

  it('should render TaskIntro component', async () => {
    const params = createAsyncParams('999')
    const PageComponent = await TaskPage({ params })
    render(PageComponent)
    expect(screen.getByTestId('task-intro')).toBeInTheDocument()
  })
}) 