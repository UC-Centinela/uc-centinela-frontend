// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock services
jest.mock('@/services/users', () => ({
  handleLogout: jest.fn(),
}))

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  ArrowRight: ({ className }: any) => <span className={className} data-testid="arrow-right" />,
  Plus: ({ className }: any) => <span className={className} data-testid="plus" />,
  Calendar: ({ className }: any) => <span className={className} data-testid="calendar" />,
  Clock: ({ className }: any) => <span className={className} data-testid="clock" />,
  User: ({ className }: any) => <span className={className} data-testid="user" />,
  LogOut: ({ className }: any) => <span className={className} data-testid="logout" />,
}))

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import { handleLogout } from '@/services/users'
import TasksList from '../TasksList'

const mockPush = jest.fn()
const mockHandleLogout = handleLogout as jest.MockedFunction<typeof handleLogout>

const mockTasks = [
  {
    id: '1',
    title: 'Task 1 - Pending',
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
    title: 'Task 2 - In Progress',
    instruction: 'Test instruction 2',
    state: 'IN_PROGRESS',
    creatorUserId: 'user1',
    revisorUserId: 'user2',
    comments: 'Test comments',
    changeHistory: 'Started',
    assignationDate: '2024-01-10T10:00:00.000Z',
    requiredSendDate: '2024-01-25T10:00:00.000Z',
  },
  {
    id: '3',
    title: 'Task 3 - Completed',
    instruction: 'Test instruction 3',
    state: 'COMPLETED',
    creatorUserId: 'user1',
    revisorUserId: 'user2',
    comments: 'Test comments',
    changeHistory: 'Completed',
    assignationDate: '2024-01-05T10:00:00.000Z',
    requiredSendDate: '2024-01-20T10:00:00.000Z',
  },
  {
    id: '4',
    title: 'Task 4 - Reviewed',
    instruction: 'Test instruction 4',
    state: 'REVIEWED',
    creatorUserId: 'user1',
    revisorUserId: 'user2',
    comments: 'Test comments',
    changeHistory: 'Reviewed',
    assignationDate: '2024-01-01T10:00:00.000Z',
    requiredSendDate: '2024-01-15T10:00:00.000Z',
  },
]

describe('TasksList', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    })
  })

  it('should render without crashing', () => {
    render(<TasksList tasks={[]} />)
    expect(screen.getByText('Tareas asignadas')).toBeInTheDocument()
  })

  it('should display the main title', () => {
    render(<TasksList tasks={mockTasks} />)
    const title = screen.getByText('Tareas asignadas')
    expect(title).toBeInTheDocument()
    expect(title).toHaveClass('text-2xl', 'font-bold', 'text-teal-700')
  })

  it('should display all navigation tabs', () => {
    render(<TasksList tasks={mockTasks} />)
    expect(screen.getByText('Asignadas')).toBeInTheDocument()
    expect(screen.getByText('En Revisión')).toBeInTheDocument()
    expect(screen.getByText('Aprobadas')).toBeInTheDocument()
  })

  it('should have "Asignadas" tab active by default', () => {
    render(<TasksList tasks={mockTasks} />)
    const assignedTab = screen.getByText('Asignadas')
    expect(assignedTab).toHaveClass('border-b-2', 'border-teal-700', 'font-medium', 'text-black')
  })

  it('should switch tabs when clicked', () => {
    render(<TasksList tasks={mockTasks} />)
    
    // Click on "En Revisión" tab
    fireEvent.click(screen.getByText('En Revisión'))
    const reviewTab = screen.getByText('En Revisión')
    expect(reviewTab).toHaveClass('border-b-2', 'border-teal-700', 'font-medium', 'text-black')
    
    // Click on "Aprobadas" tab
    fireEvent.click(screen.getByText('Aprobadas'))
    const approvedTab = screen.getByText('Aprobadas')
    expect(approvedTab).toHaveClass('border-b-2', 'border-teal-700', 'font-medium', 'text-black')
  })

  it('should filter tasks by state based on active tab', () => {
    render(<TasksList tasks={mockTasks} />)
    
    // Default "Asignadas" tab should show PENDING and IN_PROGRESS tasks
    expect(screen.getByText('Task 1 - Pending')).toBeInTheDocument()
    expect(screen.getByText('Task 2 - In Progress')).toBeInTheDocument()
    expect(screen.queryByText('Task 3 - Completed')).not.toBeInTheDocument()
    expect(screen.queryByText('Task 4 - Reviewed')).not.toBeInTheDocument()
    
    // Switch to "En Revisión" tab should show COMPLETED tasks
    fireEvent.click(screen.getByText('En Revisión'))
    expect(screen.queryByText('Task 1 - Pending')).not.toBeInTheDocument()
    expect(screen.queryByText('Task 2 - In Progress')).not.toBeInTheDocument()
    expect(screen.getByText('Task 3 - Completed')).toBeInTheDocument()
    expect(screen.queryByText('Task 4 - Reviewed')).not.toBeInTheDocument()
    
    // Switch to "Aprobadas" tab should show REVIEWED tasks
    fireEvent.click(screen.getByText('Aprobadas'))
    expect(screen.queryByText('Task 1 - Pending')).not.toBeInTheDocument()
    expect(screen.queryByText('Task 2 - In Progress')).not.toBeInTheDocument()
    expect(screen.queryByText('Task 3 - Completed')).not.toBeInTheDocument()
    expect(screen.getByText('Task 4 - Reviewed')).toBeInTheDocument()
  })

  it('should display task information correctly', () => {
    render(<TasksList tasks={mockTasks} />)
    
    // Check task title
    expect(screen.getByText('Task 1 - Pending')).toBeInTheDocument()
    
    // Check formatted dates
    expect(screen.getByText('Fecha Asignación: 15/01/2024')).toBeInTheDocument()
    expect(screen.getByText('Fecha Requerida Envío: 30/01/2024')).toBeInTheDocument()
  })

  it('should handle invalid dates gracefully', () => {
    const taskWithInvalidDate = [{
      ...mockTasks[0],
      assignationDate: 'invalid-date',
      requiredSendDate: 'invalid-date',
    }]
    
    render(<TasksList tasks={taskWithInvalidDate} />)
    expect(screen.getByText('Fecha Asignación: Fecha inválida')).toBeInTheDocument()
    expect(screen.getByText('Fecha Requerida Envío: Fecha inválida')).toBeInTheDocument()
  })

  it('should display icons correctly', () => {
    render(<TasksList tasks={mockTasks} />)
    
    // Header icons
    expect(screen.getByTestId('user')).toBeInTheDocument()
    expect(screen.getByTestId('logout')).toBeInTheDocument()
    
    // Task detail icons
    expect(screen.getAllByTestId('calendar')).toHaveLength(2) // Two tasks visible by default
    expect(screen.getAllByTestId('clock')).toHaveLength(2)
    expect(screen.getAllByTestId('arrow-right')).toHaveLength(2)
    
    // Plus button icon
    expect(screen.getByTestId('plus')).toBeInTheDocument()
  })

  it('should navigate to task details when "Ver Detalles" is clicked', () => {
    render(<TasksList tasks={mockTasks} />)
    
    const viewDetailsButtons = screen.getAllByText('Ver Detalles')
    fireEvent.click(viewDetailsButtons[0])
    
    expect(mockPush).toHaveBeenCalledWith('/tasks/1')
  })

  it('should navigate to add task when plus button is clicked', () => {
    render(<TasksList tasks={mockTasks} />)
    
    const plusButton = screen.getByTestId('plus').closest('button')
    fireEvent.click(plusButton!)
    
    expect(mockPush).toHaveBeenCalledWith('/tasks/item')
  })

  it('should call handleLogout when logout button is clicked', () => {
    render(<TasksList tasks={mockTasks} />)
    
    const logoutButton = screen.getByTestId('logout').closest('a')
    fireEvent.click(logoutButton!)
    
    expect(mockHandleLogout).toHaveBeenCalledTimes(1)
  })

  it('should display empty state message when no tasks match filter', () => {
    render(<TasksList tasks={[]} />)
    expect(screen.getByText('No tienes tareas asignadas')).toBeInTheDocument()
    
    // Switch to other tabs and check empty messages
    fireEvent.click(screen.getByText('En Revisión'))
    expect(screen.getByText('No tienes tareas en revisión')).toBeInTheDocument()
    
    fireEvent.click(screen.getByText('Aprobadas'))
    expect(screen.getByText('No tienes tareas aprobadas')).toBeInTheDocument()
  })

  it('should display empty state when tasks exist but none match current filter', () => {
    // Tasks with only PENDING state
    const pendingOnlyTasks = [mockTasks[0]]
    render(<TasksList tasks={pendingOnlyTasks} />)
    
    // Switch to review tab - should show no tasks
    fireEvent.click(screen.getByText('En Revisión'))
    expect(screen.getByText('No tienes tareas en revisión')).toBeInTheDocument()
  })

  it('should have correct styling for active and inactive tabs', () => {
    render(<TasksList tasks={mockTasks} />)
    
    const assignedTab = screen.getByText('Asignadas')
    const reviewTab = screen.getByText('En Revisión')
    const approvedTab = screen.getByText('Aprobadas')
    
    // Initially, assigned tab should be active
    expect(assignedTab).toHaveClass('border-b-2', 'border-teal-700', 'font-medium', 'text-black')
    expect(reviewTab).toHaveClass('text-gray-400')
    expect(approvedTab).toHaveClass('text-gray-400')
    
    // After clicking review tab
    fireEvent.click(reviewTab)
    expect(reviewTab).toHaveClass('border-b-2', 'border-teal-700', 'font-medium', 'text-black')
  })

  it('should have correct layout and responsive classes', () => {
    const { container } = render(<TasksList tasks={mockTasks} />)
    const mainContainer = container.firstChild
    expect(mainContainer).toHaveClass('min-h-screen', 'bg-gray-100')
  })

  it('should position plus button correctly', () => {
    render(<TasksList tasks={mockTasks} />)
    const plusButtonContainer = screen.getByTestId('plus').closest('div')
    expect(plusButtonContainer).toHaveClass('fixed', 'bottom-6', 'right-6')
  })

  it('should format dates correctly with different date formats', () => {
    const taskWithDifferentDate = [{
      ...mockTasks[0],
      assignationDate: '2024-12-31T23:59:59.999Z',
      requiredSendDate: '2024-01-01T00:00:00.000Z',
    }]
    
    render(<TasksList tasks={taskWithDifferentDate} />)
    expect(screen.getByText('Fecha Asignación: 31/12/2024')).toBeInTheDocument()
    expect(screen.getByText('Fecha Requerida Envío: 01/01/2024')).toBeInTheDocument()
  })
}) 