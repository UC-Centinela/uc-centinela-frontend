// Mock dependencies
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data, options) => ({
      json: jest.fn().mockResolvedValue(data),
      status: options?.status || 200,
      data,
      ...options
    })),
  },
}))

jest.mock('@/lib/auth0', () => ({
  auth0: {
    getSession: jest.fn(),
  },
}))

import { NextResponse } from 'next/server'
import { auth0 } from '@/lib/auth0'
import { GET } from '../route'

const mockNextResponse = NextResponse as jest.Mocked<typeof NextResponse>
const mockAuth0 = auth0 as jest.Mocked<typeof auth0>

describe('Session API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET method', () => {
    it('should return session data when user is authenticated', async () => {
      const mockSession = {
        user: {
          email: 'test@example.com',
          name: 'Test User',
          sub: 'auth0|123456',
        },
        tokenSet: {
          accessToken: 'access-token-123',
          idToken: 'id-token-456',
        },
        internal: {
          timestamp: Date.now(),
        }
      }

      mockAuth0.getSession.mockResolvedValue(mockSession)

      await GET()

      expect(mockAuth0.getSession).toHaveBeenCalledTimes(1)
      expect(mockNextResponse.json).toHaveBeenCalledWith(mockSession)
    })

    it('should return 401 when no session exists', async () => {
      mockAuth0.getSession.mockResolvedValue(null)

      await GET()

      expect(mockAuth0.getSession).toHaveBeenCalledTimes(1)
      expect(mockNextResponse.json).toHaveBeenCalledWith(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    })

    it('should return 401 when session is undefined', async () => {
      mockAuth0.getSession.mockResolvedValue(undefined as any)

      await GET()

      expect(mockAuth0.getSession).toHaveBeenCalledTimes(1)
      expect(mockNextResponse.json).toHaveBeenCalledWith(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    })

    it('should handle auth0.getSession errors', async () => {
      const error = new Error('Auth0 error')
      mockAuth0.getSession.mockRejectedValue(error)
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

      await GET()

      expect(mockAuth0.getSession).toHaveBeenCalledTimes(1)
      expect(consoleSpy).toHaveBeenCalledWith('Error getting session:', error)
      expect(mockNextResponse.json).toHaveBeenCalledWith(
        { error: 'Internal server error' },
        { status: 500 }
      )

      consoleSpy.mockRestore()
    })

    it('should handle session with minimal user data', async () => {
      const mockMinimalSession = {
        user: {
          sub: 'auth0|123456',
        },
        tokenSet: {
          accessToken: 'access-token-123',
        },
        internal: {
          timestamp: Date.now(),
        }
      }

      mockAuth0.getSession.mockResolvedValue(mockMinimalSession)

      await GET()

      expect(mockAuth0.getSession).toHaveBeenCalledTimes(1)
      expect(mockNextResponse.json).toHaveBeenCalledWith(mockMinimalSession)
    })

    it('should handle session with complete user profile', async () => {
      const mockCompleteSession = {
        user: {
          email: 'test@example.com',
          name: 'Test User',
          nickname: 'testuser',
          picture: 'https://example.com/avatar.jpg',
          sub: 'auth0|123456',
          email_verified: true,
          updated_at: '2024-01-01T00:00:00.000Z',
        },
        tokenSet: {
          accessToken: 'access-token-123',
          idToken: 'id-token-456',
          refreshToken: 'refresh-token-789',
          expiresAt: Date.now() + 3600000,
        },
        internal: {
          timestamp: Date.now(),
        }
      }

      mockAuth0.getSession.mockResolvedValue(mockCompleteSession)

      await GET()

      expect(mockAuth0.getSession).toHaveBeenCalledTimes(1)
      expect(mockNextResponse.json).toHaveBeenCalledWith(mockCompleteSession)
    })

    it('should handle network timeout errors', async () => {
      const timeoutError = new Error('Request timeout')
      timeoutError.name = 'TimeoutError'
      mockAuth0.getSession.mockRejectedValue(timeoutError)
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

      await GET()

      expect(consoleSpy).toHaveBeenCalledWith('Error getting session:', timeoutError)
      expect(mockNextResponse.json).toHaveBeenCalledWith(
        { error: 'Internal server error' },
        { status: 500 }
      )

      consoleSpy.mockRestore()
    })

    it('should handle auth0 configuration errors', async () => {
      const configError = new Error('Auth0 not configured')
      mockAuth0.getSession.mockRejectedValue(configError)
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

      await GET()

      expect(consoleSpy).toHaveBeenCalledWith('Error getting session:', configError)
      expect(mockNextResponse.json).toHaveBeenCalledWith(
        { error: 'Internal server error' },
        { status: 500 }
      )

      consoleSpy.mockRestore()
    })

    it('should handle promise rejection without error object', async () => {
      mockAuth0.getSession.mockRejectedValue('String error')
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

      await GET()

      expect(consoleSpy).toHaveBeenCalledWith('Error getting session:', 'String error')
      expect(mockNextResponse.json).toHaveBeenCalledWith(
        { error: 'Internal server error' },
        { status: 500 }
      )

      consoleSpy.mockRestore()
    })
  })
}) 