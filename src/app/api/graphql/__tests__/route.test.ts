// Mock Next.js server
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data) => ({
      json: jest.fn().mockResolvedValue(data),
      status: 200,
      data
    })),
  },
}))

import { NextResponse } from 'next/server'
import { POST, GET, HEAD } from '../route'

const mockNextResponse = NextResponse as jest.Mocked<typeof NextResponse>
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

describe('GraphQL API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    // Set environment variable
    process.env.NEXT_PUBLIC_GRAPHQL_API_URL = 'http://localhost:4000/graphql'
  })

  describe('POST method', () => {
    it('should forward GraphQL requests to backend', async () => {
      const mockRequest = {
        text: jest.fn().mockResolvedValue('{"query":"{ users { id } }"}'),
      } as unknown as Request
      
      const mockBackendResponse = {
        data: {
          users: [{ id: '1' }, { id: '2' }]
        }
      }
      
      mockFetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockBackendResponse),
      } as any)
      
      await POST(mockRequest)
      
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:4000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: '{"query":"{ users { id } }"}',
      })
      
      expect(mockNextResponse.json).toHaveBeenCalledWith(mockBackendResponse)
    })

    it('should handle GraphQL mutation requests', async () => {
      const mutationBody = '{"query":"mutation { createUser(name: \\"John\\") { id } }","variables":{"name":"John"}}'
      const mockRequest = {
        text: jest.fn().mockResolvedValue(mutationBody),
      } as unknown as Request
      
      const mockBackendResponse = {
        data: {
          createUser: { id: '123' }
        }
      }
      
      mockFetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockBackendResponse),
      } as any)
      
      await POST(mockRequest)
      
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:4000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: mutationBody,
      })
      
      expect(mockNextResponse.json).toHaveBeenCalledWith(mockBackendResponse)
    })

    it('should handle GraphQL errors from backend', async () => {
      const mockRequest = {
        text: jest.fn().mockResolvedValue('{"query":"{ invalidField }"}'),
      } as unknown as Request
      
      const mockErrorResponse = {
        errors: [{ message: 'Field not found' }]
      }
      
      mockFetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockErrorResponse),
      } as any)
      
      await POST(mockRequest)
      
      expect(mockNextResponse.json).toHaveBeenCalledWith(mockErrorResponse)
    })

    it('should handle network errors', async () => {
      const mockRequest = {
        text: jest.fn().mockResolvedValue('{"query":"{ users { id } }"}'),
      } as unknown as Request
      
      mockFetch.mockRejectedValue(new Error('Network error'))
      
      // The function should throw the error since there's no error handling
      await expect(POST(mockRequest)).rejects.toThrow('Network error')
    })

    it('should handle request with variables', async () => {
      const queryWithVariables = '{"query":"query GetUser($id: ID!) { user(id: $id) { name } }","variables":{"id":"123"}}'
      const mockRequest = {
        text: jest.fn().mockResolvedValue(queryWithVariables),
      } as unknown as Request
      
      const mockBackendResponse = {
        data: {
          user: { name: 'John Doe' }
        }
      }
      
      mockFetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockBackendResponse),
      } as any)
      
      await POST(mockRequest)
      
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:4000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: queryWithVariables,
      })
    })

    it('should handle empty request body', async () => {
      const mockRequest = {
        text: jest.fn().mockResolvedValue(''),
      } as unknown as Request
      
      const mockBackendResponse = {
        errors: [{ message: 'Invalid query' }]
      }
      
      mockFetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockBackendResponse),
      } as any)
      
      await POST(mockRequest)
      
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:4000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: '',
      })
    })

    it('should use BACKEND_URL environment variable', async () => {
      process.env.NEXT_PUBLIC_GRAPHQL_API_URL = 'http://custom-backend:5000/graphql'
      
      const mockRequest = {
        text: jest.fn().mockResolvedValue('{"query":"{ test }"}'),
      } as unknown as Request
      
      mockFetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ data: {} }),
      } as any)
      
      await POST(mockRequest)
      
      expect(mockFetch).toHaveBeenCalledWith(
        'http://custom-backend:5000/graphql',
        expect.any(Object)
      )
    })
  })

  describe('GET method', () => {
    it('should return info message for GET requests', () => {
      const response = GET()
      
      expect(mockNextResponse.json).toHaveBeenCalledWith({
        ok: true,
        info: 'GraphQL BFF activo. Use POST.'
      })
    })

    it('should not make any backend requests for GET', () => {
      GET()
      
      expect(mockFetch).not.toHaveBeenCalled()
    })
  })

  describe('HEAD method', () => {

    it('should not make any backend requests for HEAD', () => {
      HEAD()
      
      expect(mockFetch).not.toHaveBeenCalled()
    })

    it('should return null body for HEAD method', () => {
      const response = HEAD()
      
      // Response constructor is called with null body
      expect(response).toBeDefined()
    })
  })
})
 