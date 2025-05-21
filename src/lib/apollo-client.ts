import { ApolloClient, InMemoryCache } from '@apollo/client'
import { createUploadLink } from 'apollo-upload-client'

const client = new ApolloClient({
  link: createUploadLink({
    uri: process.env.NEXT_PUBLIC_APP_BASE_URL + '/graphql',
    credentials: 'include',
  }),
  cache: new InMemoryCache(),
})

export default client
