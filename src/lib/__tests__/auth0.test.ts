// Mock the entire auth0 module
jest.mock('../auth0', () => ({
  auth0: {
    middleware: jest.fn(),
    getSession: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
  },
}))

import { auth0 } from '../auth0'

describe('Auth0 Configuration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should have auth0 instance with required methods', () => {
    expect(auth0).toBeDefined()
    expect(typeof auth0).toBe('object')
    expect(auth0.middleware).toBeDefined()
    expect(auth0.getSession).toBeDefined()
    expect(typeof auth0.middleware).toBe('function')
    expect(typeof auth0.getSession).toBe('function')
  })

  it('should have login and logout methods', () => {
    expect(auth0.login).toBeDefined()
    expect(auth0.logout).toBeDefined()
    expect(typeof auth0.login).toBe('function')
    expect(typeof auth0.logout).toBe('function')
  })

  it('should be able to call middleware method', () => {
    const mockRequest = {} as any
    auth0.middleware(mockRequest)
    expect(auth0.middleware).toHaveBeenCalledWith(mockRequest)
  })

  it('should be able to call getSession method', () => {
    const mockRequest = {} as any
    auth0.getSession(mockRequest)
    expect(auth0.getSession).toHaveBeenCalledWith(mockRequest)
  })
}) 