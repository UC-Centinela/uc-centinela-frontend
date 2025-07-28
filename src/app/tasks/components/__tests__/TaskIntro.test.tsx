// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock UI components
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, className, variant, ...props }: any) => (
    <button onClick={onClick} className={className} data-variant={variant} {...props}>
      {children}
    </button>
  ),
}))

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  ChevronLeft: ({ className }: any) => <span className={className} data-testid="chevron-left" />,
  FileText: ({ className }: any) => <span className={className} data-testid="file-text" />,
  Edit: ({ className }: any) => <span className={className} data-testid="edit" />,
}))

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import TaskIntro from '../TaskIntro'

const mockPush = jest.fn()

describe('TaskIntro', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    })
  })

  it('should render without crashing', () => {
    render(<TaskIntro />)
  })

  it('should display the main title', () => {
    render(<TaskIntro />)
    const title = screen.getByText(/Posicionamiento de cable minero eléctrico sobre el pretil utilizando equipo de apoyo/i)
    expect(title).toBeInTheDocument()
    expect(title).toHaveClass('text-2xl', 'md:text-4xl', 'font-bold', 'text-teal-800')
  })

  it('should display the description text', () => {
    render(<TaskIntro />)
    const description = screen.getByText(/Realiza el Análisis de Riesgo para completar la información acerca de la tarea/i)
    expect(description).toBeInTheDocument()
    expect(description).toHaveClass('text-lg', 'md:text-xl', 'text-gray-700')
  })

  it('should display the steps section title', () => {
    render(<TaskIntro />)
    const stepsTitle = screen.getByText(/Son solo 3 pasos:/i)
    expect(stepsTitle).toBeInTheDocument()
    expect(stepsTitle).toHaveClass('font-bold', 'text-xl', 'md:text-2xl', 'text-teal-800')
  })

  it('should display all three steps with correct content', () => {
    render(<TaskIntro />)
    
    // Step 1
    expect(screen.getByText(/1\./)).toBeInTheDocument()
    expect(screen.getByText(/Registra las actividades y el entorno de la tarea/i)).toBeInTheDocument()
    
    // Step 2
    expect(screen.getByText(/2\./)).toBeInTheDocument()
    expect(screen.getByText(/Revisa y\/o edita la propuesta de controles de riesgo ARTP/i)).toBeInTheDocument()
    
    // Step 3
    expect(screen.getByText(/3\./)).toBeInTheDocument()
    expect(screen.getByText(/Envía la propuesta de ARTP para su revisión/i)).toBeInTheDocument()
  })

  it('should display correct icons for each step', () => {
    render(<TaskIntro />)
    
    // Should have one FileText icon and two Edit icons
    expect(screen.getByTestId('file-text')).toBeInTheDocument()
    expect(screen.getAllByTestId('edit')).toHaveLength(2)
  })

  it('should have a back button that navigates to tasks', () => {
    render(<TaskIntro />)
    
    const backButton = screen.getByText(/Volver a Tareas Asignadas/i)
    expect(backButton).toBeInTheDocument()
    
    fireEvent.click(backButton)
    expect(mockPush).toHaveBeenCalledWith('/tasks')
  })

  it('should have a start analysis button', () => {
    render(<TaskIntro />)
    
    const startButton = screen.getByText(/Comenzar Análisis de Riesgo/i)
    expect(startButton).toBeInTheDocument()
    expect(startButton).toHaveClass('w-full', 'bg-teal-700', 'hover:bg-teal-800', 'text-white')
  })

  it('should navigate to risk analysis when start button is clicked with taskId', () => {
    const taskId = '123'
    render(<TaskIntro taskId={taskId} />)
    
    const startButton = screen.getByText(/Comenzar Análisis de Riesgo/i)
    fireEvent.click(startButton)
    
    expect(mockPush).toHaveBeenCalledWith('/tasks/123/risk_analysis')
  })

  it('should navigate to risk analysis with default id when no taskId provided', () => {
    render(<TaskIntro />)
    
    const startButton = screen.getByText(/Comenzar Análisis de Riesgo/i)
    fireEvent.click(startButton)
    
    expect(mockPush).toHaveBeenCalledWith('/tasks/id/risk_analysis')
  })

  it('should have correct layout structure', () => {
    const { container } = render(<TaskIntro />)
    
    // Check main container has correct classes
    const mainContainer = container.firstChild
    expect(mainContainer).toHaveClass('min-h-screen', 'bg-slate-50', 'w-full')
  })

  it('should display chevron left icon in back button', () => {
    render(<TaskIntro />)
    
    const chevronIcon = screen.getByTestId('chevron-left')
    expect(chevronIcon).toBeInTheDocument()
    expect(chevronIcon).toHaveClass('h-4', 'w-4', 'mr-1')
  })

  it('should have proper responsive classes', () => {
    render(<TaskIntro />)
    
    const title = screen.getByText(/Posicionamiento de cable minero eléctrico/i)
    expect(title).toHaveClass('text-2xl', 'md:text-4xl')
    
    const description = screen.getByText(/Realiza el Análisis de Riesgo/i)
    expect(description).toHaveClass('text-lg', 'md:text-xl')
  })

  it('should render steps in a responsive grid layout', () => {
    render(<TaskIntro />)
    
    // Find the container that holds all steps
    const stepsContainer = screen.getByText(/1\./).closest('.space-y-4')
    expect(stepsContainer).toHaveClass('space-y-4', 'md:grid', 'md:grid-cols-3', 'md:gap-4', 'md:space-y-0')
  })
}) 