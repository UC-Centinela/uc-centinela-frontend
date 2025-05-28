// Mock Apollo Client and apollo-upload-client before importing
jest.mock('@apollo/client', () => ({
  ApolloClient: jest.fn().mockImplementation(() => ({
    query: jest.fn(),
    mutate: jest.fn(),
    subscribe: jest.fn(),
    cache: {
      readQuery: jest.fn(),
      writeQuery: jest.fn(),
    },
  })),
  InMemoryCache: jest.fn(),
}))

jest.mock('apollo-upload-client', () => ({
  createUploadLink: jest.fn().mockReturnValue({}),
}))

import apolloClient from '../apollo-client'

describe('Apollo Client Configuration', () => {
  it('should create apollo client instance', () => {
    expect(apolloClient).toBeDefined()
    expect(typeof apolloClient).toBe('object')
  })

  it('should have required methods', () => {
    expect(apolloClient.query).toBeDefined()
    expect(apolloClient.mutate).toBeDefined()
    expect(apolloClient.subscribe).toBeDefined()
    expect(typeof apolloClient.query).toBe('function')
    expect(typeof apolloClient.mutate).toBe('function')
    expect(typeof apolloClient.subscribe).toBe('function')
  })

  it('should have cache property', () => {
    expect(apolloClient.cache).toBeDefined()
    expect(typeof apolloClient.cache).toBe('object')
  })
}) 