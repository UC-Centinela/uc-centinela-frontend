import React from 'react'
import { render, screen } from '@testing-library/react'
import LoginForm from '../loginForm'

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} />
  }
})

// Mock Next.js Link component
jest.mock('next/link', () => {
  return function MockLink({ children, href, ...props }: any) {
    return <a href={href} {...props}>{children}</a>
  }
})

describe('LoginForm', () => {
  it('should render without crashing', () => {
    render(<LoginForm />)
  })

  it('should display the logo', () => {
    render(<LoginForm />)
    const logo = screen.getByAltText('Centinela Logo')
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('src', '/logo.png')
  })

  it('should display the main heading', () => {
    render(<LoginForm />)
    const heading = screen.getByRole('heading', { 
      name: /Asistente de Control de Riesgos Operacionales/i 
    })
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveClass('text-2xl', 'font-bold', 'text-[#2C5282]')
  })

  it('should display the description text', () => {
    render(<LoginForm />)
    const description = screen.getByText(/Plataforma para la gestión y análisis de riesgos en operaciones mineras/i)
    expect(description).toBeInTheDocument()
    expect(description).toHaveClass('text-gray-600')
  })

  it('should display the login button with correct text', () => {
    render(<LoginForm />)
    const loginButton = screen.getByRole('button', { name: /Iniciar Sesión/i })
    expect(loginButton).toBeInTheDocument()
    expect(loginButton).toHaveClass('w-full', 'bg-[#2C5282]', 'hover:bg-[#1e3a5f]', 'text-white')
  })

  it('should have correct link href for login', () => {
    render(<LoginForm />)
    const loginLink = screen.getByRole('link')
    expect(loginLink).toHaveAttribute('href', 'auth/login?returnTo=/')
  })

  it('should apply correct styling classes to container', () => {
    const { container } = render(<LoginForm />)
    const formContainer = container.firstChild
    expect(formContainer).toHaveClass(
      'text-center',
      'max-w-md',
      'w-full',
      'bg-white',
      'p-8',
      'rounded-lg',
      'shadow-md'
    )
  })

  it('should have proper semantic structure', () => {
    render(<LoginForm />)
    
    // Check that all required elements are present
    expect(screen.getByAltText('Centinela Logo')).toBeInTheDocument()
    expect(screen.getByRole('heading')).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeInTheDocument()
    expect(screen.getByRole('link')).toBeInTheDocument()
  })
}) 