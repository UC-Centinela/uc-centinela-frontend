import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button, buttonVariants } from '../button'

// Mock the dependencies
jest.mock('@radix-ui/react-slot', () => ({
  Slot: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}))

jest.mock('class-variance-authority', () => ({
  cva: jest.fn(() => jest.fn(() => 'mocked-class')),
}))

jest.mock('@/lib/utils', () => ({
  cn: jest.fn((...args) => args.filter(Boolean).join(' ')),
}))

describe('Button Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render without crashing', () => {
    render(<Button>Test Button</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('should render children correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('should handle click events', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('should apply custom className through cn function', () => {
    const { cn } = require('@/lib/utils')
    render(<Button className="custom-class">Test</Button>)
    expect(cn).toHaveBeenCalled()
  })

  it('should render as Slot when asChild is true', () => {
    render(<Button asChild><span>Child Element</span></Button>)
    expect(screen.getByText('Child Element')).toBeInTheDocument()
  })

  it('should have data-slot attribute', () => {
    render(<Button>Test</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('data-slot', 'button')
  })

  it('should accept different variants', () => {
    const { rerender } = render(<Button variant="destructive">Test</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()

    rerender(<Button variant="outline">Test</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()

    rerender(<Button variant="secondary">Test</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()

    rerender(<Button variant="ghost">Test</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()

    rerender(<Button variant="link">Test</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('should accept different sizes', () => {
    const { rerender } = render(<Button size="sm">Test</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()

    rerender(<Button size="lg">Test</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()

    rerender(<Button size="icon">Test</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('should forward other props to the button element', () => {
    render(<Button type="submit" id="test-button">Test</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('type', 'submit')
    expect(button).toHaveAttribute('id', 'test-button')
  })

  it('should handle keyboard events', () => {
    const handleKeyDown = jest.fn()
    render(<Button onKeyDown={handleKeyDown}>Test</Button>)
    
    const button = screen.getByRole('button')
    fireEvent.keyDown(button, { key: 'Enter' })
    expect(handleKeyDown).toHaveBeenCalledTimes(1)
  })

  it('should be focusable', () => {
    render(<Button>Test</Button>)
    const button = screen.getByRole('button')
    button.focus()
    expect(button).toHaveFocus()
  })
})

describe('buttonVariants', () => {
  it('should be defined', () => {
    expect(buttonVariants).toBeDefined()
    expect(typeof buttonVariants).toBe('function')
  })
}) 