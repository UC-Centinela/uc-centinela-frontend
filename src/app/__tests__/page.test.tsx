import React from 'react'
import { render, screen } from '@testing-library/react'
import Home from '../page'

// Mock the LoginForm component
jest.mock('@/components/loginForm', () => {
  return function MockLoginForm() {
    return <div data-testid="login-form">Login Form</div>
  }
})

describe('Home Page', () => {
  it('should render without crashing', () => {
    render(<Home />)
    expect(screen.getByTestId('login-form')).toBeInTheDocument()
  })

  it('should render LoginForm component', () => {
    render(<Home />)
    expect(screen.getByText('Login Form')).toBeInTheDocument()
  })

  it('should have correct layout classes', () => {
    const { container } = render(<Home />)
    const mainDiv = container.firstChild
    expect(mainDiv).toHaveClass('flex', 'justify-center', 'items-center', 'h-screen')
  })

  it('should center the login form', () => {
    const { container } = render(<Home />)
    const mainDiv = container.firstChild
    expect(mainDiv).toHaveClass('justify-center', 'items-center')
  })

  it('should take full screen height', () => {
    const { container } = render(<Home />)
    const mainDiv = container.firstChild
    expect(mainDiv).toHaveClass('h-screen')
  })
}) 