// Mock Next.js Link component
jest.mock('next/link', () => {
  return function MockLink({ children, href, ...props }: any) {
    return <a href={href} {...props}>{children}</a>
  }
})

// Mock Lucide icon
jest.mock('lucide-react', () => ({
  ShieldAlert: ({ className, size }: any) => (
    <span className={className} data-testid="shield-alert" data-size={size} />
  ),
}))

import React from 'react'
import { render, screen } from '@testing-library/react'
import UnauthorizedPage from '../page'

describe('UnauthorizedPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render without crashing', () => {
    render(<UnauthorizedPage />)
    expect(screen.getByText('Acceso denegado')).toBeInTheDocument()
  })

  it('should display the shield alert icon', () => {
    render(<UnauthorizedPage />)
    
    const icon = screen.getByTestId('shield-alert')
    expect(icon).toBeInTheDocument()
    expect(icon).toHaveClass('text-red-500')
    expect(icon).toHaveAttribute('data-size', '64')
  })

  it('should display the main heading', () => {
    render(<UnauthorizedPage />)
    
    const heading = screen.getByRole('heading', { name: 'Acceso denegado' })
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveClass('text-2xl', 'font-bold', 'text-gray-800')
  })

  it('should display the error message', () => {
    render(<UnauthorizedPage />)
    
    const message = screen.getByText(/Lo sentimos, no tienes permisos para acceder a esta página/i)
    expect(message).toBeInTheDocument()
    expect(message).toHaveClass('text-gray-600', 'text-center', 'max-w-md')
  })

  it('should display additional help text', () => {
    render(<UnauthorizedPage />)
    
    expect(screen.getByText(/Si crees que esto es un error, contacta al administrador/i)).toBeInTheDocument()
  })

  it('should display the back to home button', () => {
    render(<UnauthorizedPage />)
    
    const button = screen.getByRole('button', { name: 'Volver al inicio' })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('mt-4', 'px-6', 'py-2', 'bg-teal-600', 'text-white', 'rounded-md', 'shadow')
  })

  it('should have correct link to home page', () => {
    render(<UnauthorizedPage />)
    
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/')
  })

  it('should have correct main layout structure', () => {
    const { container } = render(<UnauthorizedPage />)
    
    const main = container.querySelector('main')
    expect(main).toBeInTheDocument()
    expect(main).toHaveClass('flex', 'h-screen', 'flex-col', 'items-center', 'justify-center', 'bg-gray-50')
  })

  it('should have correct content container styling', () => {
    const { container } = render(<UnauthorizedPage />)
    
    const contentDiv = container.querySelector('div.flex.flex-col.items-center')
    expect(contentDiv).toBeInTheDocument()
    expect(contentDiv).toHaveClass('bg-white', 'p-8', 'rounded-xl', 'shadow-lg', 'gap-6')
  })

  it('should center content on screen', () => {
    const { container } = render(<UnauthorizedPage />)
    
    const main = container.querySelector('main')
    expect(main).toHaveClass('items-center', 'justify-center')
  })

  it('should have semantic HTML structure', () => {
    render(<UnauthorizedPage />)
    
    // Check that all required elements are present
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByRole('heading')).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeInTheDocument()
    expect(screen.getByRole('link')).toBeInTheDocument()
  })

  it('should display both parts of the error message', () => {
    render(<UnauthorizedPage />)
    
    // Check for both parts of the error message separately since they're separated by a <br />
    expect(screen.getByText(/Lo sentimos, no tienes permisos para acceder a esta página/i)).toBeInTheDocument()
    expect(screen.getByText(/Si crees que esto es un error, contacta al administrador/i)).toBeInTheDocument()
  })

  it('should have proper button hover classes', () => {
    render(<UnauthorizedPage />)
    
    const button = screen.getByRole('button', { name: 'Volver al inicio' })
    expect(button).toHaveClass('hover:bg-teal-700', 'transition')
  })

  it('should render icon with correct styling', () => {
    render(<UnauthorizedPage />)
    
    const icon = screen.getByTestId('shield-alert')
    expect(icon).toHaveClass('text-red-500')
  })

  it('should have responsive text classes', () => {
    render(<UnauthorizedPage />)
    
    const heading = screen.getByRole('heading')
    expect(heading).toHaveClass('text-2xl')
    
    const message = screen.getByText(/Lo sentimos, no tienes permisos/i)
    expect(message).toHaveClass('text-center')
  })
}) 