import { gql, ApolloClient, InMemoryCache } from '@apollo/client';

// ✅ Query optimizada para multimedia
export const OPTIMIZED_MULTIMEDIA_QUERY = gql`
  query FindMultimediaByTaskId($taskId: Int!) {
    findMultimediaByTaskId(taskId: $taskId) {
      id
      taskId
      photoUrl
      videoUrl
      audioTranscription
    }
  }
`;

// ✅ Query optimizada para tareas
export const OPTIMIZED_TASKS_QUERY = gql`
  query FindAllTasks {
    findAllTasks {
      id
      title
      state
      assignationDate
      requiredSendDate
      instruction
    }
  }
`;

// ✅ Query optimizada para estrategias de control
export const OPTIMIZED_CONTROL_STRATEGIES_QUERY = gql`
  query FindControlStrategiesByTask($taskId: Int!) {
    findControlStrategiesByTask(taskId: $taskId) {
      id
      title
      description
    }
  }
`;

// ✅ Query optimizada para actividades críticas
export const OPTIMIZED_CRITICAL_ACTIVITIES_QUERY = gql`
  query FindCriticalActivitiesByTaskId($taskId: Int!) {
    findCriticalActivitiesByTaskId(taskId: $taskId) {
      id
      title
      taskId
    }
  }
`;

// ✅ Query combinada para reducir requests
export const COMBINED_TASK_DATA_QUERY = gql`
  query GetTaskData($taskId: Int!) {
    findMultimediaByTaskId(taskId: $taskId) {
      id
      taskId
      photoUrl
      videoUrl
      audioTranscription
    }
    findControlStrategiesByTask(taskId: $taskId) {
      id
      title
      description
    }
    findCriticalActivitiesByTaskId(taskId: $taskId) {
      id
      title
      taskId
    }
  }
`;

// ✅ Configuración de cache para queries
export const CACHE_CONFIGS = {
  multimedia: {
    fetchPolicy: 'cache-first' as const,
    errorPolicy: 'all' as const,
    notifyOnNetworkStatusChange: false,
  },
  tasks: {
    fetchPolicy: 'cache-first' as const,
    errorPolicy: 'all' as const,
    notifyOnNetworkStatusChange: false,
  },
  strategies: {
    fetchPolicy: 'cache-first' as const,
    errorPolicy: 'all' as const,
    notifyOnNetworkStatusChange: false,
  },
};

// ✅ Función para prefetch de datos críticos
export const prefetchCriticalData = async (client: ApolloClient<InMemoryCache>, taskId: number) => {
  try {
    await client.query({
      query: COMBINED_TASK_DATA_QUERY,
      variables: { taskId },
      ...CACHE_CONFIGS.multimedia,
    });
  } catch (error) {
    console.error('Error prefetching data:', error);
  }
};
