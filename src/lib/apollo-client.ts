import { ApolloClient, InMemoryCache, from } from '@apollo/client'
import { createUploadLink } from 'apollo-upload-client'
import { setContext } from '@apollo/client/link/context'
import { RetryLink } from '@apollo/client/link/retry'
import { getTokenAndEmail } from '@/services/users'

// ✅ Link de retry para requests fallidos
const retryLink = new RetryLink({
  delay: {
    initial: 300,
    max: Infinity,
    jitter: true
  },
  attempts: {
    max: 2, // Solo 2 reintentos para no empeorar la latencia
    retryIf: (error) => {
      return !!error && error.networkError;
    }
  }
});

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
  link: from([retryLink, authLink, uploadLink]),
  cache: new InMemoryCache({
    // ✅ Configuración de cache optimizada
    typePolicies: {
      Query: {
        fields: {
          // Cache para listas de tareas
          findAllTasks: {
            merge(_, incoming) {
              return incoming;
            },
          },
          // Cache para tareas por usuario
          findTasksByUser: {
            merge(_, incoming) {
              return incoming;
            },
          },
          // Cache para tareas por revisor
          findTasksByReviewer: {
            merge(_, incoming) {
              return incoming;
            },
          },
          // Cache para multimedia
          findMultimediaByTaskId: {
            merge(_, incoming) {
              return incoming;
            },
          },
          // Cache para estrategias de control
          findControlStrategiesByTask: {
            merge(_, incoming) {
              return incoming;
            },
          },
        },
      },
      Task: {
        fields: {
          // Cache individual de tareas
          comments: {
            merge(_, incoming) {
              return incoming;
            },
          },
        },
      },
    },
    // ✅ Configuración de cache
    addTypename: true,
    resultCaching: true,
  }),
  // ✅ Configuración de default options para mejor cache
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-first',
      errorPolicy: 'all',
      notifyOnNetworkStatusChange: false,
    },
    query: {
      fetchPolicy: 'cache-first',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
      fetchPolicy: 'no-cache', // Las mutaciones no usan cache
    },
  },
})

export default client
