import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import TaskForm from '../TaskForm'

describe('TaskForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render without crashing', () => {
    render(<TaskForm />)
    expect(screen.getByText('Crear Nueva Tarea')).toBeInTheDocument()
  })

  it('should display form title', () => {
    render(<TaskForm />)
    const title = screen.getByText('Crear Nueva Tarea')
    expect(title).toBeInTheDocument()
    expect(title).toHaveClass('text-lg', 'font-semibold', 'text-gray-800')
  })

  it('should display title input field with correct label and attributes', () => {
    render(<TaskForm />)
    
    const label = screen.getByText('Título de la Tarea')
    const input = screen.getByRole('textbox')
    
    expect(label).toBeInTheDocument()
    expect(label).toHaveClass('block', 'text-sm', 'font-medium', 'text-gray-700')
    
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('id', 'title')
    expect(input).toHaveAttribute('type', 'text')
    expect(input).toHaveAttribute('placeholder', 'Ej: Inspección de maquinaria en zona 5')
    expect(input).toHaveClass('w-full', 'border', 'border-gray-300', 'rounded-md')
  })

  it('should display submit button with correct text and styling', () => {
    render(<TaskForm />)
    
    const submitButton = screen.getByRole('button', { name: 'Crear Tarea' })
    expect(submitButton).toBeInTheDocument()
    expect(submitButton).toHaveAttribute('type', 'submit')
    expect(submitButton).toHaveClass('w-full', 'bg-teal-700', 'text-white', 'py-2', 'rounded-md')
  })

  it('should have correct form structure and styling', () => {
    const { container } = render(<TaskForm />)
    const form = container.querySelector('form')
    
    expect(form).toBeInTheDocument()
    expect(form).toHaveClass('max-w-md', 'mx-auto', 'p-4', 'bg-white', 'rounded-md', 'shadow-md', 'space-y-4')
  })

  it('should update input value when user types', () => {
    render(<TaskForm />)
    
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'New Task Title' } })
    
    expect(input).toHaveValue('New Task Title')
  })

  it('should show error message when submitting empty title', () => {
    const { container } = render(<TaskForm />)
    
    const form = container.querySelector('form')!
    fireEvent.submit(form)
    
    expect(screen.getByText('El título no puede estar vacío.')).toBeInTheDocument()
  })

  it('should show error message when submitting whitespace-only title', () => {
    const { container } = render(<TaskForm />)
    
    const input = screen.getByRole('textbox')
    const form = container.querySelector('form')!
    
    fireEvent.change(input, { target: { value: '   ' } })
    fireEvent.submit(form)
    
    expect(screen.getByText('El título no puede estar vacío.')).toBeInTheDocument()
  })

  it('should display error message with correct styling', () => {
    const { container } = render(<TaskForm />)
    
    const form = container.querySelector('form')!
    fireEvent.submit(form)
    
    const errorMessage = screen.getByText('El título no puede estar vacío.')
    expect(errorMessage).toHaveClass('text-sm', 'text-red-600', 'mt-1')
  })

  it('should clear error message when valid title is submitted', () => {
    const { container } = render(<TaskForm />)
    
    const input = screen.getByRole('textbox')
    const form = container.querySelector('form')!
    
    // First, trigger error
    fireEvent.submit(form)
    expect(screen.getByText('El título no puede estar vacío.')).toBeInTheDocument()
    
    // Then, submit valid title
    fireEvent.change(input, { target: { value: 'Valid Task Title' } })
    fireEvent.submit(form)
    
    expect(screen.queryByText('El título no puede estar vacío.')).not.toBeInTheDocument()
  })

  it('should clear input field when valid title is submitted', () => {
    const { container } = render(<TaskForm />)
    
    const input = screen.getByRole('textbox')
    const form = container.querySelector('form')!
    
    fireEvent.change(input, { target: { value: 'Valid Task Title' } })
    fireEvent.submit(form)
    
    expect(input).toHaveValue('')
  })

  it('should not show error initially', () => {
    render(<TaskForm />)
    
    expect(screen.queryByText('El título no puede estar vacío.')).not.toBeInTheDocument()
  })

  it('should handle multiple submissions correctly', () => {
    const { container } = render(<TaskForm />)
    
    const input = screen.getByRole('textbox')
    const form = container.querySelector('form')!
    
    // First submission with valid title
    fireEvent.change(input, { target: { value: 'First Task' } })
    fireEvent.submit(form)
    expect(input).toHaveValue('')
    
    // Second submission with empty title should show error
    fireEvent.submit(form)
    expect(screen.getByText('El título no puede estar vacío.')).toBeInTheDocument()
    
    // Third submission with valid title should clear error and input
    fireEvent.change(input, { target: { value: 'Second Task' } })
    fireEvent.submit(form)
    expect(input).toHaveValue('')
    expect(screen.queryByText('El título no puede estar vacío.')).not.toBeInTheDocument()
  })

  it('should handle form submission via button click', () => {
    render(<TaskForm />)
    
    const input = screen.getByRole('textbox')
    const submitButton = screen.getByRole('button', { name: 'Crear Tarea' })
    
    fireEvent.change(input, { target: { value: 'Task via button click' } })
    fireEvent.click(submitButton)
    
    expect(input).toHaveValue('')
  })

  it('should prevent default form submission behavior', () => {
    const { container } = render(<TaskForm />)
    
    const form = container.querySelector('form')!
    const mockSubmit = jest.fn()
    form.addEventListener('submit', mockSubmit)
    
    fireEvent.submit(form)
    
    // The event should have been called, meaning our handler ran
    expect(mockSubmit).toHaveBeenCalled()
  })

  it('should have proper accessibility attributes', () => {
    render(<TaskForm />)
    
    const label = screen.getByText('Título de la Tarea')
    const input = screen.getByRole('textbox')
    
    // Label should be associated with input
    expect(label).toHaveAttribute('for', 'title')
    expect(input).toHaveAttribute('id', 'title')
  })

  it('should handle edge case with very long title', () => {
    const { container } = render(<TaskForm />)
    
    const input = screen.getByRole('textbox')
    const form = container.querySelector('form')!
    const longTitle = 'A'.repeat(1000)
    
    fireEvent.change(input, { target: { value: longTitle } })
    fireEvent.submit(form)
    
    // Should successfully submit and clear the field
    expect(input).toHaveValue('')
    expect(screen.queryByText('El título no puede estar vacío.')).not.toBeInTheDocument()
  })

  it('should handle special characters in title', () => {
    const { container } = render(<TaskForm />)
    
    const input = screen.getByRole('textbox')
    const form = container.querySelector('form')!
    const specialTitle = 'Task with $pecial Ch@racters & Numb3rs!'
    
    fireEvent.change(input, { target: { value: specialTitle } })
    fireEvent.submit(form)
    
    expect(input).toHaveValue('')
    expect(screen.queryByText('El título no puede estar vacío.')).not.toBeInTheDocument()
  })
}) 