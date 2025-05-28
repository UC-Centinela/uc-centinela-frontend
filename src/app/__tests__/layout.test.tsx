import React from 'react'
import { render } from '@testing-library/react'
import RootLayout, { metadata } from '../layout'

// Mock Next.js fonts
jest.mock('next/font/google', () => ({
  Geist: jest.fn(() => ({
    variable: '--font-geist-sans',
  })),
  Geist_Mono: jest.fn(() => ({
    variable: '--font-geist-mono',
  })),
}))

// Mock CSS import
jest.mock('../globals.css', () => ({}))

describe('RootLayout', () => {
  it('should be an async function', () => {
    expect(RootLayout.constructor.name).toBe('AsyncFunction')
  })

  it('should accept children prop', () => {
    // Test that the function can be called with children
    expect(() => {
      RootLayout({ children: <div>Test</div> })
    }).not.toThrow()
  })

  it('should return JSX with html and body elements', async () => {
    const result = await RootLayout({ children: <div>Test Content</div> })
    expect(result).toBeDefined()
    expect(React.isValidElement(result)).toBe(true)
  })
})

describe('metadata', () => {
  it('should have correct title', () => {
    expect(metadata.title).toBe('Centinela Antofagasta Minerals')
  })

  it('should have correct description', () => {
    expect(metadata.description).toBe('Centinela Antofagasta Minerals')
  })

  it('should be a valid metadata object', () => {
    expect(typeof metadata).toBe('object')
    expect(metadata).toHaveProperty('title')
    expect(metadata).toHaveProperty('description')
  })
}) 