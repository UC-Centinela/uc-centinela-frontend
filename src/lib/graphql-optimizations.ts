// Optimizaciones críticas para GraphQL
import { ApolloClient, InMemoryCache, from, split } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import { setContext } from '@apollo/client/link/context';
import { RetryLink } from '@apollo/client/link/retry';
import { BatchHttpLink } from '@apollo/client/link/batch-http';
import { getTokenAndEmail } from '@/services/users';

// ✅ Link de retry para requests fallidos
const retryLink = new RetryLink({
  delay: {
    initial: 300,
    max: Infinity,
    jitter: true
  },
  attempts: {
    max: 3,
    retryIf: (error) => {
      // Solo reintentar en errores de red
      return !!error && error.networkError;
    }
  }
});

// ✅ Link de batch para múltiples queries
const batchLink = new BatchHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_API_URL || '/api/graphql',
  batchMax: 5, // Agrupar hasta 5 requests
  batchInterval: 20, // 20ms de delay
});

// ✅ Link de upload optimizado
const uploadLink = createUploadLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_API_URL || '/api/graphql',
  credentials: 'include',
  // ✅ Configuración de timeout
  fetchOptions: {
    timeout: 10000, // 10 segundos timeout
  }
});

// ✅ Link de autenticación optimizado
const authLink = setContext(async (_, { headers }) => {
  try {
    const auth = await getTokenAndEmail();
    const accessToken = auth?.accessToken;
    
    return {
      headers: {
        ...headers,
        ...(accessToken && { authorization: `Bearer ${accessToken}` }),
        // ✅ Headers de optimización
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    }
  } catch (error) {
    console.error('Error getting access token:', error);
    return { headers };
  }
});

// ✅ Cliente Apollo optimizado
export const optimizedClient = new ApolloClient({
  link: from([
    retryLink,
    authLink,
    // Usar batch para queries normales, upload para archivos
    split(
      operation => operation.getContext().hasUpload,
      uploadLink,
      batchLink
    )
  ]),
  cache: new InMemoryCache({
    // ✅ Configuración de cache optimizada
    typePolicies: {
      Query: {
        fields: {
          findMultimediaByTaskId: {
            merge(_, incoming) {
              return incoming;
            },
          },
          findAllTasks: {
            merge(_, incoming) {
              return incoming;
            },
          },
          findControlStrategiesByTask: {
            merge(_, incoming) {
              return incoming;
            },
          },
        },
      },
    },
    // ✅ Configuración de cache
    possibleTypes: {},
    addTypename: false,
  }),
  // ✅ Configuración de conexión optimizada
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
    },
  },
  // ✅ Configuración de conexión
  connectToDevTools: process.env.NODE_ENV === 'development',
});

