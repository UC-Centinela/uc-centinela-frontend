// Mock all dependencies before importing
jest.mock('@/lib/auth0', () => ({
  auth0: {
    middleware: jest.fn(),
    getSession: jest.fn(),
  },
}))

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}))

jest.mock('../services/users', () => ({
  getUserProfile: jest.fn(),
}))

jest.mock('../utils/functions', () => ({
  handleUserSession: jest.fn(),
}))

jest.mock('next/server', () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    next: jest.fn(),
    redirect: jest.fn(),
  },
}))

import { NextRequest, NextResponse } from 'next/server'
import { middleware, config } from '../middleware'
import { getUserProfile } from '../services/users'
import { handleUserSession } from '../utils/functions'

const mockNextResponse = NextResponse as jest.Mocked<typeof NextResponse>
const mockGetUserProfile = getUserProfile as jest.MockedFunction<typeof getUserProfile>
const mockHandleUserSession = handleUserSession as jest.MockedFunction<typeof handleUserSession>

describe('Middleware', () => {
  let mockRequest: jest.Mocked<NextRequest>

  beforeEach(() => {
    jest.clearAllMocks()
    
    mockRequest = {
      url: 'http://localhost:3000',
      nextUrl: {
        pathname: '/',
      },
    } as jest.Mocked<NextRequest>

    mockNextResponse.next.mockReturnValue({} as any)
    mockNextResponse.redirect.mockReturnValue({} as any)
    mockHandleUserSession.mockResolvedValue(NextResponse.next())
  })

  describe('middleware function', () => {
    it('should redirect to unauthorized when user is null and path is not public', async () => {
      mockRequest.nextUrl.pathname = '/tasks'
      mockGetUserProfile.mockResolvedValue(null)

      const result = await middleware(mockRequest)

      expect(mockNextResponse.redirect).toHaveBeenCalledWith(new URL('/unauthorized', mockRequest.url))
    })

    it('should allow access to public paths when user is null', async () => {
      const publicPaths = ['/', '/unauthorized', '/auth/login']
      mockGetUserProfile.mockResolvedValue(null)
      
      for (const path of publicPaths) {
        mockRequest.nextUrl.pathname = path
        await middleware(mockRequest)
        
        expect(mockHandleUserSession).toHaveBeenCalledWith(mockRequest)
      }
    })

    it('should redirect operator to tasks from root path', async () => {
      mockRequest.nextUrl.pathname = '/'
      mockGetUserProfile.mockResolvedValue({
        data: {
          getUserByEmail: {
            role: 'roleOperator',
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            customerId: 'customer1',
            idpId: 'idp1',
            rut: '12345678-9'
          }
        }
      })

      const result = await middleware(mockRequest)

      expect(mockNextResponse.redirect).toHaveBeenCalledWith(new URL('/tasks', mockRequest.url))
    })

    it('should redirect admin to unauthorized from menu path', async () => {
      mockRequest.nextUrl.pathname = '/menu'
      mockGetUserProfile.mockResolvedValue({
        data: {
          getUserByEmail: {
            role: 'roleAdmin',
            id: '1',
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@example.com',
            customerId: 'customer1',
            idpId: 'idp1',
            rut: '12345678-9'
          }
        }
      })

      const result = await middleware(mockRequest)

      expect(mockNextResponse.redirect).toHaveBeenCalledWith(new URL('/unauthorized', mockRequest.url))
    })

    it('should return response from handleUserSession when no redirects needed', async () => {
      mockRequest.nextUrl.pathname = '/tasks'
      const mockResponse = NextResponse.next()
      mockHandleUserSession.mockResolvedValue(mockResponse)
      mockGetUserProfile.mockResolvedValue({
        data: {
          getUserByEmail: {
            role: 'roleOperator',
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            customerId: 'customer1',
            idpId: 'idp1',
            rut: '12345678-9'
          }
        }
      })

      const result = await middleware(mockRequest)

      expect(result).toBe(mockResponse)
    })
  })

  describe('config object', () => {
    it('should have correct matcher configuration', () => {
      expect(config).toBeDefined()
      expect(config.matcher).toBeDefined()
      expect(Array.isArray(config.matcher)).toBe(true)
      expect(config.matcher.length).toBe(1)
      expect(config.matcher[0]).toMatch(/^\/\(.*\).*$/)
    })

    it('should exclude static files and Next.js internal routes', () => {
      const matcher = config.matcher[0]
      
      // The matcher uses a negative lookahead, so we need to test the pattern
      expect(matcher).toContain('_next/static')
      expect(matcher).toContain('_next/image')
      expect(matcher).toContain('favicon.ico')
      expect(matcher).toContain('sitemap.xml')
      expect(matcher).toContain('robots.txt')
    })
  })
}) 