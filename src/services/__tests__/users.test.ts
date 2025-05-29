import { getTokenAndEmail, handleLogout, getUserProfile, UserProfile } from '../users'
import { cookies } from 'next/headers'

// Mock dependencies
jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}))

// Mock the middleware module with a factory function
jest.mock('../../middleware', () => ({
  config: {
    path: '/',
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
  },
}))

const mockCookies = cookies as jest.MockedFunction<typeof cookies>
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

describe('Users Service', () => {
  let mockCookieStore: any

  beforeEach(() => {
    jest.clearAllMocks()
    
    mockCookieStore = {
      get: jest.fn(),
      set: jest.fn(),
      delete: jest.fn(),
    }

    mockCookies.mockResolvedValue(mockCookieStore)
    
    // Set environment variable for tests
    process.env.NEXT_PUBLIC_GRAPHQL_API_URL = 'http://localhost:4000/graphql'
  })

  describe('getTokenAndEmail', () => {
    it('should return access token and email when cookies exist', async () => {
      mockCookieStore.get.mockImplementation((name: string) => {
        if (name === 'accessToken') return { value: 'test-token' }
        if (name === 'userEmail') return { value: 'test@example.com' }
        return undefined
      })

      const result = await getTokenAndEmail()

      expect(result).toEqual({
        accessToken: 'test-token',
        email: 'test@example.com'
      })
      expect(mockCookieStore.get).toHaveBeenCalledWith('accessToken')
      expect(mockCookieStore.get).toHaveBeenCalledWith('userEmail')
    })

    it('should return null values when cookies do not exist', async () => {
      mockCookieStore.get.mockReturnValue(undefined)

      const result = await getTokenAndEmail()

      expect(result).toEqual({
        accessToken: undefined,
        email: undefined
      })
    })

    it('should handle errors and return null', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      mockCookies.mockRejectedValue(new Error('Cookie error'))

      const result = await getTokenAndEmail()

      expect(result).toBeNull()
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error getting token and email:', expect.any(Error))
      
      consoleErrorSpy.mockRestore()
    })

    it('should handle partial cookie values', async () => {
      mockCookieStore.get.mockImplementation((name: string) => {
        if (name === 'accessToken') return { value: 'test-token' }
        if (name === 'userEmail') return undefined
        return undefined
      })

      const result = await getTokenAndEmail()

      expect(result).toEqual({
        accessToken: 'test-token',
        email: undefined
      })
    })
  })

  describe('handleLogout', () => {
    it('should clear all auth cookies and return true', async () => {
      const result = await handleLogout()

      expect(result).toBe(true)
      expect(mockCookieStore.set).toHaveBeenCalledWith('accessToken', '', {
        path: '/',
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: -1,
      })
      expect(mockCookieStore.set).toHaveBeenCalledWith('userEmail', '', {
        path: '/',
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: -1,
      })
      expect(mockCookieStore.set).toHaveBeenCalledWith('userRole', '', {
        path: '/',
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: -1,
      })
    })

    it('should handle errors and return false', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      mockCookies.mockRejectedValue(new Error('Cookie error'))

      const result = await handleLogout()

      expect(result).toBe(false)
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error durante el logout:', expect.any(Error))
      
      consoleErrorSpy.mockRestore()
    })
  })

  describe('getUserProfile', () => {
    const mockUserProfile: UserProfile = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      customerId: 'customer1',
      role: 'user',
      idpId: 'idp1',
      rut: '12345678-9'
    }

    beforeEach(() => {
      mockCookieStore.get.mockImplementation((name: string) => {
        if (name === 'accessToken') return { value: 'test-token' }
        if (name === 'userEmail') return { value: 'test@example.com' }
        return undefined
      })
    })

    it('should fetch user profile successfully', async () => {
      const mockResponse = {
        data: {
          getUserByEmail: mockUserProfile
        }
      }

      mockFetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponse),
      } as any)

      const result = await getUserProfile()

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:4000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-token',
        },
        body: expect.stringContaining('query GetUserByEmail'),
      })

      expect(result).toEqual(mockResponse)
    })

    it('should return null when no token or email available', async () => {
      mockCookieStore.get.mockReturnValue(undefined)

      const result = await getUserProfile()

      expect(result).toBeNull()
      expect(mockFetch).not.toHaveBeenCalled()
    })

    it('should return null when only token is missing', async () => {
      mockCookieStore.get.mockImplementation((name: string) => {
        if (name === 'accessToken') return undefined
        if (name === 'userEmail') return { value: 'test@example.com' }
        return undefined
      })

      const result = await getUserProfile()

      expect(result).toBeNull()
      expect(mockFetch).not.toHaveBeenCalled()
    })

    it('should return null when only email is missing', async () => {
      mockCookieStore.get.mockImplementation((name: string) => {
        if (name === 'accessToken') return { value: 'test-token' }
        if (name === 'userEmail') return undefined
        return undefined
      })

      const result = await getUserProfile()

      expect(result).toBeNull()
      expect(mockFetch).not.toHaveBeenCalled()
    })

    it('should handle fetch errors and return null', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      mockFetch.mockRejectedValue(new Error('Network error'))

      const result = await getUserProfile()

      expect(result).toBeNull()
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error getting user profile:', expect.any(Error))
      
      consoleErrorSpy.mockRestore()
    })

    it('should handle GraphQL response errors', async () => {
      const mockErrorResponse = {
        errors: [{ message: 'User not found' }]
      }

      mockFetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockErrorResponse),
      } as any)

      const result = await getUserProfile()

      expect(result).toEqual(mockErrorResponse)
    })

    it('should handle empty response data', async () => {
      const mockEmptyResponse = {
        data: null
      }

      mockFetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockEmptyResponse),
      } as any)

      const result = await getUserProfile()

      expect(result).toEqual(mockEmptyResponse)
    })

    it('should handle missing environment variable', async () => {
      const originalUrl = process.env.NEXT_PUBLIC_GRAPHQL_API_URL
      delete process.env.NEXT_PUBLIC_GRAPHQL_API_URL
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

      // Mock fetch to simulate the error that would occur
      mockFetch.mockRejectedValue(new Error('TypeError: Failed to fetch'))

      const result = await getUserProfile()

      expect(result).toBeNull()
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error getting user profile:', expect.any(Error))
      
      consoleErrorSpy.mockRestore()
      // Restore for other tests
      process.env.NEXT_PUBLIC_GRAPHQL_API_URL = originalUrl || 'http://localhost:4000/graphql'
    })
  })
}) 