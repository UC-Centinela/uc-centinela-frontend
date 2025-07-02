// Mock Next.js server
jest.mock('next/server', () => ({
  NextResponse: {
    redirect: jest.fn((url) => ({
      url: url.href,
      status: 302,
      headers: new Map([['Location', url.href]]),
    })),
  },
}))

import { NextResponse } from 'next/server'
import { GET } from '../route'

const mockNextResponse = NextResponse as jest.Mocked<typeof NextResponse>

describe('Auth Callback Route', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET method', () => {
    it('should redirect to home page by default', async () => {
      const mockRequest = {
        url: 'https://example.com/auth/callback',
      } as unknown as Request
      
      await GET(mockRequest)
      
      expect(mockNextResponse.redirect).toHaveBeenCalledWith(
        new URL('/', 'https://example.com')
      )
    })

    it('should redirect to returnTo parameter when provided', async () => {
      const mockRequest = {
        url: 'https://example.com/auth/callback?returnTo=/tasks',
      } as unknown as Request
      
      await GET(mockRequest)
      
      expect(mockNextResponse.redirect).toHaveBeenCalledWith(
        new URL('/tasks', 'https://example.com')
      )
    })

    it('should handle custom returnTo path', async () => {
      const mockRequest = {
        url: 'https://example.com/auth/callback?returnTo=/dashboard',
      } as unknown as Request
      
      await GET(mockRequest)
      
      expect(mockNextResponse.redirect).toHaveBeenCalledWith(
        new URL('/dashboard', 'https://example.com')
      )
    })

    it('should handle returnTo with multiple path segments', async () => {
      const mockRequest = {
        url: 'https://example.com/auth/callback?returnTo=/tasks/123/details',
      } as unknown as Request
      
      await GET(mockRequest)
      
      expect(mockNextResponse.redirect).toHaveBeenCalledWith(
        new URL('/tasks/123/details', 'https://example.com')
      )
    })

    it('should handle empty returnTo parameter', async () => {
      const mockRequest = {
        url: 'https://example.com/auth/callback?returnTo=',
      } as unknown as Request
      
      await GET(mockRequest)
      
      expect(mockNextResponse.redirect).toHaveBeenCalledWith(
        new URL('/', 'https://example.com')
      )
    })

    it('should handle multiple query parameters', async () => {
      const mockRequest = {
        url: 'https://example.com/auth/callback?code=abc123&state=xyz789&returnTo=/tasks',
      } as unknown as Request
      
      await GET(mockRequest)
      
      expect(mockNextResponse.redirect).toHaveBeenCalledWith(
        new URL('/tasks', 'https://example.com')
      )
    })

    it('should work with different domains', async () => {
      const mockRequest = {
        url: 'https://myapp.com/auth/callback?returnTo=/profile',
      } as unknown as Request
      
      await GET(mockRequest)
      
      expect(mockNextResponse.redirect).toHaveBeenCalledWith(
        new URL('/profile', 'https://myapp.com')
      )
    })

    it('should work with different ports', async () => {
      const mockRequest = {
        url: 'http://localhost:3000/auth/callback?returnTo=/settings',
      } as unknown as Request
      
      await GET(mockRequest)
      
      expect(mockNextResponse.redirect).toHaveBeenCalledWith(
        new URL('/settings', 'http://localhost:3000')
      )
    })

    it('should handle returnTo with query parameters', async () => {
      const mockRequest = {
        url: 'https://example.com/auth/callback?returnTo=/tasks?filter=pending',
      } as unknown as Request
      
      await GET(mockRequest)
      
      expect(mockNextResponse.redirect).toHaveBeenCalledWith(
        new URL('/tasks?filter=pending', 'https://example.com')
      )
    })

    it('should handle URL-encoded returnTo parameter', async () => {
      const mockRequest = {
        url: 'https://example.com/auth/callback?returnTo=%2Ftasks%2F123',
      } as unknown as Request
      
      await GET(mockRequest)
      
      expect(mockNextResponse.redirect).toHaveBeenCalledWith(
        new URL('/tasks/123', 'https://example.com')
      )
    })

    it('should handle returnTo with hash fragment', async () => {
      const mockRequest = {
        url: 'https://example.com/auth/callback?returnTo=/dashboard#section1',
      } as unknown as Request
      
      await GET(mockRequest)
      
      expect(mockNextResponse.redirect).toHaveBeenCalledWith(
        new URL('/dashboard#section1', 'https://example.com')
      )
    })

    it('should preserve origin when creating redirect URL', async () => {
      const mockRequest = {
        url: 'https://secure.example.com/auth/callback?returnTo=/admin',
      } as unknown as Request
      
      await GET(mockRequest)
      
      expect(mockNextResponse.redirect).toHaveBeenCalledWith(
        new URL('/admin', 'https://secure.example.com')
      )
    })

    it('should handle case-sensitive returnTo parameter', async () => {
      const mockRequest = {
        url: 'https://example.com/auth/callback?ReturnTo=/tasks',
      } as unknown as Request
      
      await GET(mockRequest)
      
      // Should default to home since parameter name is case-sensitive
      expect(mockNextResponse.redirect).toHaveBeenCalledWith(
        new URL('/', 'https://example.com')
      )
    })

    it('should handle malformed URLs gracefully', async () => {
      const mockRequest = {
        url: 'https://example.com/auth/callback?returnTo=//malicious.com',
      } as unknown as Request
      
      await GET(mockRequest)
      
      // Should still work with the provided returnTo, URL constructor handles relative paths
      expect(mockNextResponse.redirect).toHaveBeenCalledWith(
        new URL('//malicious.com', 'https://example.com')
      )
    })
  })
}) 