// Mock Google fonts
jest.mock('next/font/google', () => ({
  Geist: jest.fn(() => ({
    variable: '--font-geist-sans',
    className: 'geist-sans'
  })),
  Geist_Mono: jest.fn(() => ({
    variable: '--font-geist-mono', 
    className: 'geist-mono'
  }))
}))

import { Geist, Geist_Mono } from 'next/font/google'
import RootLayout from '../layout'

describe('RootLayout', () => {
  it('should export font configuration', () => {
    expect(Geist).toHaveBeenCalledWith({
      variable: "--font-geist-sans",
      subsets: ['latin']
    })
    expect(Geist_Mono).toHaveBeenCalledWith({
      variable: "--font-geist-mono",
      subsets: ['latin']
    })
  })

  it('should be a function', () => {
    expect(typeof RootLayout).toBe('function')
  })

  it('should have correct metadata export', async () => {
    const { metadata } = await import('../layout')
    expect(metadata).toBeDefined()
    expect(metadata.title).toBe('Centinela Antofagasta Minerals')
    expect(metadata.description).toBeDefined()
  })
}) 