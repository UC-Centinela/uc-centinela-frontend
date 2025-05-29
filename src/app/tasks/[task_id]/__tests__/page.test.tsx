// Mock the TaskIntro component
jest.mock('@/app/tasks/components/TaskIntro', () => {
  return function MockTaskIntro({ taskId }: any) {
    return <div data-testid="task-intro">TaskIntro with taskId: {taskId}</div>
  }
})

import React from 'react'
import { render, screen } from '@testing-library/react'
import TaskPage from '../page'

describe('TaskPage', () => {
  it('should render without crashing', () => {
    const params = { task_id: '123' }
    render(<TaskPage params={params} />)
    expect(screen.getByTestId('task-intro')).toBeInTheDocument()
  })

  it('should pass task_id parameter to TaskIntro', () => {
    const params = { task_id: '456' }
    render(<TaskPage params={params} />)
    expect(screen.getByText('TaskIntro with taskId: 456')).toBeInTheDocument()
  })

  it('should handle string task_id parameter', () => {
    const params = { task_id: 'abc123' }
    render(<TaskPage params={params} />)
    expect(screen.getByText('TaskIntro with taskId: abc123')).toBeInTheDocument()
  })

  it('should handle empty task_id parameter', () => {
    const params = { task_id: '' }
    render(<TaskPage params={params} />)
    expect(screen.getByText('TaskIntro with taskId:')).toBeInTheDocument()
  })

  it('should render TaskIntro component', () => {
    const params = { task_id: '999' }
    render(<TaskPage params={params} />)
    expect(screen.getByTestId('task-intro')).toBeInTheDocument()
  })
}) 