import React from 'react'
import { render, screen } from '@testing-library/react'
import { Label } from '../label'

// Mock the dependencies
jest.mock('@radix-ui/react-label', () => ({
  Root: ({ children, ...props }: any) => <label {...props}>{children}</label>,
}))

jest.mock('@/lib/utils', () => ({
  cn: jest.fn((...args) => args.filter(Boolean).join(' ')),
}))

describe('Label Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render without crashing', () => {
    render(<Label>Test Label</Label>)
    expect(screen.getByText('Test Label')).toBeInTheDocument()
  })

  it('should render children correctly', () => {
    render(<Label>Label Text</Label>)
    expect(screen.getByText('Label Text')).toBeInTheDocument()
  })

  it('should apply custom className through cn function', () => {
    const { cn } = require('@/lib/utils')
    render(<Label className="custom-class">Test</Label>)
    expect(cn).toHaveBeenCalledWith(expect.anything(), 'custom-class')
  })

  it('should have data-slot attribute', () => {
    render(<Label>Test</Label>)
    const label = screen.getByText('Test')
    expect(label).toHaveAttribute('data-slot', 'label')
  })

  it('should forward other props to the label element', () => {
    render(<Label htmlFor="test-input" id="test-label">Test Label</Label>)
    const label = screen.getByText('Test Label')
    expect(label).toHaveAttribute('for', 'test-input')
    expect(label).toHaveAttribute('id', 'test-label')
  })

  it('should render with complex children', () => {
    render(
      <Label>
        <span>Required</span>
        <span>*</span>
      </Label>
    )
    expect(screen.getByText('Required')).toBeInTheDocument()
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('should render as a label element', () => {
    render(<Label htmlFor="input-id">Label for input</Label>)
    const label = screen.getByText('Label for input')
    expect(label.tagName).toBe('LABEL')
  })

  it('should handle empty children', () => {
    render(<Label />)
    // Should render without error even with no children
    expect(document.querySelector('[data-slot="label"]')).toBeInTheDocument()
  })
}) 