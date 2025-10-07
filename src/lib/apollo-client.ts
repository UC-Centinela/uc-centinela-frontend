import { ApolloClient, InMemoryCache, from } from '@apollo/client'
import { createUploadLink } from 'apollo-upload-client'
import { setContext } from '@apollo/client/link/context'
import { getTokenAndEmail } from '@/services/users'

const uploadLink = createUploadLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_API_URL || '/api/graphql',
  credentials: 'include',
})

const authLink = setContext(async (_, { headers }) => {
  try {
    const auth = await getTokenAndEmail()
    const accessToken = auth?.accessToken
    
    return {
      headers: {
        ...headers,
        ...(accessToken && { authorization: `Bearer ${accessToken}` }),
      }
    }
  } catch (error) {
    console.error('Error getting access token:', error)
    return { headers }
  }
})

const client = new ApolloClient({
  link: from([authLink, uploadLink]),
  cache: new InMemoryCache(),
})

export default client
