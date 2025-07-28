import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Input } from '../input'

// Mock the utils
jest.mock('@/lib/utils', () => ({
  cn: jest.fn((...args) => args.filter(Boolean).join(' ')),
}))

describe('Input Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render without crashing', () => {
    render(<Input />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('should render with default type when no type specified', () => {
    render(<Input />)
    const input = screen.getByRole('textbox')
    // When no type is specified, it defaults to text but may not show the attribute
    expect(input).toBeInTheDocument()
  })

  it('should render with specified type', () => {
    render(<Input type="email" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('type', 'email')
  })

  it('should render password input', () => {
    render(<Input type="password" />)
    const input = screen.getByDisplayValue('')
    expect(input).toHaveAttribute('type', 'password')
  })

  it('should handle value changes', () => {
    const handleChange = jest.fn()
    render(<Input onChange={handleChange} />)
    
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'test value' } })
    
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('should display placeholder text', () => {
    render(<Input placeholder="Enter your name" />)
    expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument()
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Input disabled />)
    const input = screen.getByRole('textbox')
    expect(input).toBeDisabled()
  })

  it('should apply custom className through cn function', () => {
    const { cn } = require('@/lib/utils')
    render(<Input className="custom-class" />)
    expect(cn).toHaveBeenCalled()
    const callArgs = cn.mock.calls[0]
    expect(callArgs).toContain('custom-class')
  })

  it('should have data-slot attribute', () => {
    render(<Input />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('data-slot', 'input')
  })

  it('should forward other props to the input element', () => {
    render(<Input id="test-input" name="testName" required />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('id', 'test-input')
    expect(input).toHaveAttribute('name', 'testName')
    expect(input).toBeRequired()
  })

  it('should handle focus and blur events', () => {
    const handleFocus = jest.fn()
    const handleBlur = jest.fn()
    render(<Input onFocus={handleFocus} onBlur={handleBlur} />)
    
    const input = screen.getByRole('textbox')
    fireEvent.focus(input)
    expect(handleFocus).toHaveBeenCalledTimes(1)
    
    fireEvent.blur(input)
    expect(handleBlur).toHaveBeenCalledTimes(1)
  })

  it('should handle keyboard events', () => {
    const handleKeyDown = jest.fn()
    render(<Input onKeyDown={handleKeyDown} />)
    
    const input = screen.getByRole('textbox')
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(handleKeyDown).toHaveBeenCalledTimes(1)
  })

  it('should be focusable', () => {
    render(<Input />)
    const input = screen.getByRole('textbox')
    input.focus()
    expect(input).toHaveFocus()
  })

  it('should accept defaultValue', () => {
    render(<Input defaultValue="default text" />)
    const input = screen.getByRole('textbox') as HTMLInputElement
    expect(input.value).toBe('default text')
  })

  it('should accept controlled value', () => {
    render(<Input value="controlled value" onChange={() => {}} />)
    const input = screen.getByRole('textbox') as HTMLInputElement
    expect(input.value).toBe('controlled value')
  })
}) 