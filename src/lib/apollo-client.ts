import { ApolloClient, InMemoryCache } from '@apollo/client'
import { createUploadLink } from 'apollo-upload-client'

const client = new ApolloClient({
  link: createUploadLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_API_URL || '/api/graphql',
    credentials: 'include',
  }),
  cache: new InMemoryCache(),
})

export default client
