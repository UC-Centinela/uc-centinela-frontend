// Mock the dependencies before importing
jest.mock('@/lib/auth0', () => ({
  auth0: {
    middleware: jest.fn(),
    getSession: jest.fn(),
  },
}))

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}))

jest.mock('next/server', () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    next: jest.fn(),
  },
}))

import { NextRequest, NextResponse } from 'next/server'
import { handleUserSession } from '../functions'
import { auth0 } from '@/lib/auth0'
import { cookies } from 'next/headers'

const mockAuth0 = auth0 as jest.Mocked<typeof auth0>
const mockCookies = cookies as jest.MockedFunction<typeof cookies>
const mockNextResponse = NextResponse as jest.Mocked<typeof NextResponse>

describe('handleUserSession', () => {
  let mockRequest: jest.Mocked<NextRequest>
  let mockCookieStore: any

  beforeEach(() => {
    jest.clearAllMocks()
    
    mockRequest = {
      url: 'http://localhost:3000',
      headers: new Headers(),
    } as jest.Mocked<NextRequest>

    mockCookieStore = {
      set: jest.fn(),
      get: jest.fn(),
      delete: jest.fn(),
    }

    mockCookies.mockResolvedValue(mockCookieStore)
    mockAuth0.middleware.mockResolvedValue(NextResponse.next())
    mockNextResponse.next.mockReturnValue({} as any)
  })

  it('should return auth0 middleware response when no session', async () => {
    const expectedResponse = NextResponse.next()
    mockAuth0.middleware.mockResolvedValue(expectedResponse)
    mockAuth0.getSession.mockResolvedValue(null)

    const result = await handleUserSession(mockRequest)

    expect(mockAuth0.middleware).toHaveBeenCalledWith(mockRequest)
    expect(mockAuth0.getSession).toHaveBeenCalledWith(mockRequest)
    expect(result).toBe(expectedResponse)
  })

  it('should return auth0 middleware response when session has no user', async () => {
    const expectedResponse = NextResponse.next()
    mockAuth0.middleware.mockResolvedValue(expectedResponse)
    mockAuth0.getSession.mockResolvedValue({})

    const result = await handleUserSession(mockRequest)

    expect(result).toBe(expectedResponse)
  })

  it('should return auth0 middleware response when session has no email', async () => {
    const expectedResponse = NextResponse.next()
    mockAuth0.middleware.mockResolvedValue(expectedResponse)
    mockAuth0.getSession.mockResolvedValue({ user: {} })

    const result = await handleUserSession(mockRequest)

    expect(result).toBe(expectedResponse)
  })

  it('should set cookies and return new response when session has user email and access token', async () => {
    const mockSession = {
      user: { email: 'test@example.com' },
      tokenSet: { accessToken: 'test-token' }
    }
    
    const expectedResponse = NextResponse.next()
    const newResponse = {}
    
    mockAuth0.middleware.mockResolvedValue(expectedResponse)
    mockAuth0.getSession.mockResolvedValue(mockSession)
    mockNextResponse.next.mockReturnValue(newResponse as any)

    const result = await handleUserSession(mockRequest)

    expect(mockCookieStore.set).toHaveBeenCalledWith('userEmail', 'test@example.com', {
      path: '/',
      httpOnly: true,
      secure: false, // NODE_ENV is not set to production in tests
      sameSite: 'lax',
    })

    expect(mockCookieStore.set).toHaveBeenCalledWith('accessToken', 'test-token', {
      path: '/',
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    })

    expect(result).toBe(newResponse)
  })

  it('should set secure cookies in production environment', async () => {
    const originalNodeEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'production'

    const mockSession = {
      user: { email: 'test@example.com' },
      tokenSet: { accessToken: 'test-token' }
    }
    
    mockAuth0.middleware.mockResolvedValue(NextResponse.next())
    mockAuth0.getSession.mockResolvedValue(mockSession)
    mockNextResponse.next.mockReturnValue({} as any)

    await handleUserSession(mockRequest)

    expect(mockCookieStore.set).toHaveBeenCalledWith('userEmail', 'test@example.com', {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    })

    expect(mockCookieStore.set).toHaveBeenCalledWith('accessToken', 'test-token', {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    })

    // Restore original NODE_ENV
    process.env.NODE_ENV = originalNodeEnv
  })

  it('should return auth0 middleware response when session has user email but no access token', async () => {
    const mockSession = {
      user: { email: 'test@example.com' },
      tokenSet: {}
    }
    
    const expectedResponse = NextResponse.next()
    mockAuth0.middleware.mockResolvedValue(expectedResponse)
    mockAuth0.getSession.mockResolvedValue(mockSession)

    const result = await handleUserSession(mockRequest)

    expect(mockCookieStore.set).not.toHaveBeenCalled()
    expect(result).toBe(expectedResponse)
  })

  it('should handle errors gracefully and return auth0 middleware response', async () => {
    const mockSession = {
      user: { email: 'test@example.com' },
      tokenSet: { accessToken: 'test-token' }
    }
    
    const expectedResponse = NextResponse.next()
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    
    mockAuth0.middleware.mockResolvedValue(expectedResponse)
    mockAuth0.getSession.mockResolvedValue(mockSession)
    mockCookies.mockRejectedValue(new Error('Cookie error'))

    const result = await handleUserSession(mockRequest)

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error in handleUserSession:', expect.any(Error))
    expect(result).toBe(expectedResponse)

    consoleErrorSpy.mockRestore()
  })

  it('should handle missing tokenSet gracefully', async () => {
    const mockSession = {
      user: { email: 'test@example.com' }
      // tokenSet is undefined
    }
    
    const expectedResponse = NextResponse.next()
    mockAuth0.middleware.mockResolvedValue(expectedResponse)
    mockAuth0.getSession.mockResolvedValue(mockSession)

    const result = await handleUserSession(mockRequest)

    expect(mockCookieStore.set).not.toHaveBeenCalled()
    expect(result).toBe(expectedResponse)
  })
}) 