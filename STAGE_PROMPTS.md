# 🎯 Prompts para Implementación por Etapas

## 📋 Instrucciones de Uso

Para cada etapa, copia y pega el prompt correspondiente. Cada prompt está diseñado para ser independiente y seguro.

---

## 🟢 ETAPA 1: Configuración Base (BAJO RIESGO)

### **Prompt:**
```
Necesito implementar la ETAPA 1 de optimización de rendimiento. Esta es la configuración base sin cambios en lógica de negocio.

OBJETIVO: Configuración básica de Next.js y Vercel para mejor rendimiento.

CAMBIOS A IMPLEMENTAR:
1. En next.config.js:
   - Agregar `output: 'standalone'` para Vercel
   - Habilitar `compress: true`
   - Configurar headers básicos

2. En vercel.json:
   - Agregar headers de cache para recursos estáticos
   - Configurar cache para _next/static
   - Headers de seguridad básicos

3. En src/app/layout.tsx:
   - Integrar Vercel Speed Insights
   - Agregar componente <SpeedInsights />

4. En package.json:
   - Agregar @vercel/speed-insights a dependencies

REQUISITOS:
- No modificar lógica de negocio existente
- Mantener toda la funcionalidad actual
- Solo agregar configuraciones de optimización
- Asegurar que el build funcione correctamente

Verificar que:
- npm run build funciona sin errores
- npm run start funciona correctamente
- No se rompe ninguna funcionalidad existente
```

---

## 🟢 ETAPA 2: Optimización de Imágenes (BAJO RIESGO)

### **Prompt:**
```
Necesito implementar la ETAPA 2 de optimización de rendimiento. Esta etapa se enfoca en optimizar la carga de imágenes.

OBJETIVO: Mejorar rendimiento de imágenes sin afectar funcionalidad.

CAMBIOS A IMPLEMENTAR:
1. En next.config.js:
   - Configurar formats: ['image/webp', 'image/avif']
   - Agregar minimumCacheTTL: 60
   - Configurar dangerouslyAllowSVG: true
   - Agregar contentSecurityPolicy para SVG

2. Crear src/components/OptimizedImage.tsx:
   - Componente wrapper para next/image
   - Props para priority, quality, sizes
   - Loading states optimizados
   - Fallback para imágenes rotas

3. Actualizar componentes existentes:
   - Reemplazar <img> por <OptimizedImage> donde sea apropiado
   - Mantener funcionalidad existente

REQUISITOS:
- No cambiar la lógica de negocio
- Mantener todas las imágenes funcionando
- Mejorar rendimiento de carga
- Asegurar compatibilidad con todos los formatos actuales

Verificar que:
- Todas las imágenes cargan correctamente
- Formatos WebP/AVIF funcionan
- No hay errores de imagen
- Funcionalidad existente se mantiene
```

---

## 🟡 ETAPA 3: Code Splitting Básico (MEDIO RIESGO)

### **Prompt:**
```
Necesito implementar la ETAPA 3 de optimización de rendimiento. Esta etapa se enfoca en optimizar el code splitting.

OBJETIVO: Separar chunks por librería para mejor caching y carga.

CAMBIOS A IMPLEMENTAR:
1. En next.config.js, agregar webpack optimization:
   - Configurar splitChunks con cacheGroups
   - Separar vendor chunks por librería:
     * React: react, react-dom
     * Apollo: @apollo, graphql
     * UI: @radix-ui, lucide-react
   - Configurar límites de tamaño (maxSize: 200KB)
   - Priorizar chunks críticos

2. Configuración de chunks:
   - vendor: node_modules generales
   - react: React específico (priority: 20)
   - apollo: GraphQL específico (priority: 15)
   - ui: UI libraries (priority: 12)
   - common: código compartido (priority: 5)

REQUISITOS:
- Mantener funcionalidad existente
- Mejorar tiempo de carga inicial
- Optimizar caching de recursos
- No romper imports existentes

Verificar que:
- Bundle se divide correctamente
- Chunks se cargan en orden correcto
- No hay errores de importación
- Funcionalidad se mantiene intacta
```

---

## 🔴 ETAPA 4: GraphQL Optimizations (ALTO RIESGO)

### **Prompt:**
```
Necesito implementar la ETAPA 4 de optimización de rendimiento. Esta etapa se enfoca en optimizar las consultas GraphQL.

OBJETIVO: Reducir número de requests GraphQL y mejorar rendimiento.

CAMBIOS A IMPLEMENTAR:
1. Crear src/lib/graphql-optimizations.ts:
   - Configurar RetryLink con delay y attempts
   - Configurar BatchHttpLink para agrupar queries
   - Implementar split entre upload y batch links
   - Configurar timeout de 10 segundos

2. Crear src/lib/optimized-queries.ts:
   - Queries optimizadas para multimedia, tasks, control strategies
   - Query combinada para datos críticos de tarea
   - Configuraciones de cache específicas
   - Función de prefetch para datos críticos

3. Modificar src/lib/apollo-client.ts:
   - Integrar optimizaciones de graphql-optimizations.ts
   - Configurar cache-first policy
   - Implementar batching automático
   - Agregar retry logic

4. Actualizar componentes que usan GraphQL:
   - Cambiar fetchPolicy a 'cache-first'
   - Implementar batching donde sea posible
   - Usar queries optimizadas

REQUISITOS:
- Mantener toda la funcionalidad GraphQL existente
- Reducir número de requests de 5 a 1-2
- Implementar retry automático para errores de red
- Mejorar cache hit rate
- No romper autenticación ni autorización

Verificar que:
- Todas las queries GraphQL funcionan
- Batching reduce número de requests
- Retry logic funciona para errores de red
- Cache mejora rendimiento
- Autenticación se mantiene
```

---

## 🟡 ETAPA 5: Lazy Loading (MEDIO RIESGO)

### **Prompt:**
```
Necesito implementar la ETAPA 5 de optimización de rendimiento. Esta etapa se enfoca en lazy loading de componentes.

OBJETIVO: Cargar componentes pesados solo cuando se necesiten.

CAMBIOS A IMPLEMENTAR:
1. Crear src/components/LazyComponents.tsx:
   - Función createLazyComponent para dynamic imports
   - Componente SuspenseWrapper con fallback
   - Loading spinner optimizado
   - Configuración SSR: false para componentes client-side

2. Identificar componentes pesados para lazy loading:
   - Componentes de administración
   - Modales complejos
   - Componentes de análisis
   - Componentes que no están en la ruta crítica

3. Implementar lazy loading:
   - Usar dynamic() de Next.js
   - Envolver en Suspense
   - Agregar loading states apropiados
   - Mantener funcionalidad existente

REQUISITOS:
- No afectar funcionalidad existente
- Mejorar tiempo de carga inicial
- Mantener UX fluida
- Loading states apropiados
- No romper navegación

Verificar que:
- Componentes se cargan cuando se necesitan
- Loading states funcionan correctamente
- No hay errores de Suspense
- Funcionalidad se mantiene
- UX es fluida
```

---

## 🔴 ETAPA 6: Optimizaciones Avanzadas (ALTO RIESGO)

### **Prompt:**
```
Necesito implementar la ETAPA 6 de optimización de rendimiento. Esta etapa incluye optimizaciones experimentales y avanzadas.

OBJETIVO: Implementar optimizaciones avanzadas para máximo rendimiento.

CAMBIOS A IMPLEMENTAR:
1. En next.config.js, agregar optimizaciones experimentales:
   - optimizePackageImports para librerías específicas
   - Configuraciones avanzadas de webpack
   - Optimizaciones de bundle

2. Crear scripts de análisis de rendimiento:
   - scripts/performance-analysis.js
   - scripts/diagnose-current.js
   - scripts/network-analysis.js
   - scripts/vercel-analysis.js

3. Optimizaciones de PWA:
   - Configurar service worker optimizado
   - Implementar caching strategies
   - Optimizar offline functionality

4. Agregar scripts en package.json:
   - npm run analyze
   - npm run diagnose
   - npm run network
   - npm run vercel-check
   - npm run performance

REQUISITOS:
- Mantener funcionalidad existente
- Implementar monitoreo de rendimiento
- Optimizar para Core Web Vitals
- Preparar para análisis continuo
- No romper funcionalidad crítica

Verificar que:
- Optimizaciones experimentales funcionan
- Scripts de análisis ejecutan correctamente
- PWA funciona correctamente
- Métricas de rendimiento mejoran
- No hay errores en producción
```

---

## 🚨 Prompt de Rollback (Si algo sale mal)

### **Prompt:**
```
Algo salió mal en la implementación de optimizaciones. Necesito hacer rollback a la versión anterior que funcionaba.

OBJETIVO: Revertir a la versión estable anterior.

ACCIONES A REALIZAR:
1. Identificar el commit anterior que funcionaba
2. Revertir cambios problemáticos
3. Verificar que todo funciona correctamente
4. Redesplegar versión estable

REQUISITOS:
- Mantener funcionalidad que sí funcionaba
- Eliminar cambios que causaron problemas
- Asegurar que el build funciona
- Verificar que el despliegue es exitoso

Verificar que:
- npm run build funciona sin errores
- npm run start funciona correctamente
- Todas las funcionalidades críticas funcionan
- Despliegue en Vercel es exitoso
```

---

## 📊 Prompt de Verificación Post-Despliegue

### **Prompt:**
```
Necesito verificar que la implementación de optimizaciones funcionó correctamente después del despliegue.

OBJETIVO: Confirmar que las optimizaciones están funcionando y mejorando el rendimiento.

VERIFICACIONES A REALIZAR:
1. Funcionalidad básica:
   - Login/logout funciona
   - Navegación entre páginas funciona
   - Formularios funcionan
   - GraphQL queries funcionan

2. Rendimiento:
   - Tiempo de carga inicial mejorado
   - Bundle size reducido
   - Menos requests GraphQL
   - Core Web Vitals mejorados

3. Vercel Speed Insights:
   - Dashboard muestra métricas
   - Core Web Vitals dentro de rangos aceptables
   - Performance score mejorado

4. Scripts de análisis:
   - npm run performance ejecuta correctamente
   - Métricas muestran mejoras
   - No hay errores críticos

REQUISITOS:
- Todas las funcionalidades críticas funcionan
- Métricas de rendimiento mejoraron
- No hay errores en consola
- Usuario puede usar la aplicación normalmente

Reportar:
- ✅ Funcionalidades que funcionan
- ❌ Problemas encontrados
- 📊 Métricas de rendimiento
- 🎯 Próximos pasos recomendados
```

---

## 🎯 Instrucciones de Uso

1. **Copia el prompt de la etapa que quieres implementar**
2. **Pégalo en una nueva conversación**
3. **Espera a que se implementen los cambios**
4. **Verifica que funciona localmente**
5. **Haz commit y push**
6. **Despliega en Vercel**
7. **Usa el prompt de verificación**
8. **Continúa con la siguiente etapa**

¿Quieres que empecemos con la ETAPA 1?
