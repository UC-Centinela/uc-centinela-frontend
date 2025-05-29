// Mock the TaskForm component
jest.mock('@/app/tasks/components/TaskForm', () => {
  return function MockTaskForm() {
    return <div data-testid="task-form">TaskForm component</div>
  }
})

import React from 'react'
import { render, screen } from '@testing-library/react'
import NewTaskPage from '../page'

describe('NewTaskPage', () => {
  it('should render without crashing', () => {
    render(<NewTaskPage />)
    expect(screen.getByTestId('task-form')).toBeInTheDocument()
  })

  it('should render TaskForm component', () => {
    render(<NewTaskPage />)
    expect(screen.getByText('TaskForm component')).toBeInTheDocument()
  })

  it('should have correct container styling', () => {
    const { container } = render(<NewTaskPage />)
    const mainDiv = container.firstChild
    expect(mainDiv).toHaveClass('min-h-screen', 'bg-gray-50', 'p-4')
  })

  it('should display TaskForm within styled container', () => {
    render(<NewTaskPage />)
    const taskForm = screen.getByTestId('task-form')
    expect(taskForm).toBeInTheDocument()
    expect(taskForm.parentElement).toHaveClass('min-h-screen', 'bg-gray-50', 'p-4')
  })
}) 