#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Análisis específico basado en los datos proporcionados
function analyzePerformanceData() {
  console.log('🔍 Analizando datos de rendimiento específicos...\n');
  
  const analysis = {
    timestamp: new Date().toISOString(),
    criticalIssues: [],
    recommendations: [],
    metrics: {}
  };
  
  // 1. Análisis de tiempo de carga
  const navigationTime = 2629.2; // ms
  const fcp = 2560; // ms
  
  analysis.metrics.navigationTime = navigationTime;
  analysis.metrics.fcp = fcp;
  
  if (navigationTime > 2000) {
    analysis.criticalIssues.push({
      issue: 'Tiempo de navegación excesivo',
      value: `${navigationTime}ms`,
      threshold: '2000ms',
      impact: 'CRÍTICO'
    });
  }
  
  if (fcp > 1800) {
    analysis.criticalIssues.push({
      issue: 'First Contentful Paint muy lento',
      value: `${fcp}ms`,
      threshold: '1800ms',
      impact: 'CRÍTICO'
    });
  }
  
  // 2. Análisis de requests GraphQL
  const graphqlRequests = [
    { start: 3399.6, end: 4465.2, duration: 1065.6 },
    { start: 7001, end: 7510.2, duration: 509.2 },
    { start: 13437.2, end: 14588.7, duration: 1151.5 },
    { start: 15953.6, end: 16764, duration: 810.4 },
    { start: 18203.7, end: 19040.6, duration: 836.9 }
  ];
  
  const totalGraphqlTime = graphqlRequests.reduce((sum, req) => sum + req.duration, 0);
  const avgGraphqlTime = totalGraphqlTime / graphqlRequests.length;
  
  analysis.metrics.graphqlRequests = graphqlRequests.length;
  analysis.metrics.totalGraphqlTime = totalGraphqlTime;
  analysis.metrics.avgGraphqlTime = avgGraphqlTime;
  
  if (graphqlRequests.length > 3) {
    analysis.criticalIssues.push({
      issue: 'Demasiados requests GraphQL',
      value: `${graphqlRequests.length} requests`,
      threshold: '3 requests',
      impact: 'ALTO'
    });
  }
  
  if (avgGraphqlTime > 500) {
    analysis.criticalIssues.push({
      issue: 'Requests GraphQL muy lentos',
      value: `${avgGraphqlTime.toFixed(2)}ms promedio`,
      threshold: '500ms',
      impact: 'CRÍTICO'
    });
  }
  
  // 3. Análisis de bundle JavaScript
  const jsChunks = [
    { name: '4bd1b696-48cb6b2fb201adba.js', size: 169075 },
    { name: '684-bf4f423dd6f1bd18.js', size: 172434 },
    { name: '267-f8b06b374c63e546.js', size: 199662 },
    { name: '46-1c6d4db4ba1919a9.js', size: 34524 },
    { name: '352-f33b38ecd155c91b.js', size: 27409 }
  ];
  
  const totalJsSize = jsChunks.reduce((sum, chunk) => sum + chunk.size, 0);
  const largestChunk = Math.max(...jsChunks.map(chunk => chunk.size));
  
  analysis.metrics.totalJsSize = totalJsSize;
  analysis.metrics.largestChunk = largestChunk;
  analysis.metrics.jsChunks = jsChunks.length;
  
  if (totalJsSize > 500000) {
    analysis.criticalIssues.push({
      issue: 'Bundle JavaScript muy grande',
      value: `${(totalJsSize / 1024).toFixed(2)}KB`,
      threshold: '500KB',
      impact: 'ALTO'
    });
  }
  
  if (largestChunk > 150000) {
    analysis.criticalIssues.push({
      issue: 'Chunk JavaScript muy grande',
      value: `${(largestChunk / 1024).toFixed(2)}KB`,
      threshold: '150KB',
      impact: 'ALTO'
    });
  }
  
  // 4. Generar recomendaciones específicas
  if (analysis.criticalIssues.length > 0) {
    analysis.recommendations.push('🚨 IMPLEMENTAR OPTIMIZACIONES CRÍTICAS:');
    
    if (analysis.metrics.fcp > 1800) {
      analysis.recommendations.push('1. Implementar lazy loading de componentes pesados');
      analysis.recommendations.push('2. Optimizar code splitting en next.config.js');
      analysis.recommendations.push('3. Preload de recursos críticos');
    }
    
    if (analysis.metrics.avgGraphqlTime > 500) {
      analysis.recommendations.push('4. Implementar batching de GraphQL queries');
      analysis.recommendations.push('5. Agregar retry logic para requests fallidos');
      analysis.recommendations.push('6. Optimizar cache de Apollo Client');
    }
    
    if (analysis.metrics.totalJsSize > 500000) {
      analysis.recommendations.push('7. Implementar dynamic imports para componentes');
      analysis.recommendations.push('8. Optimizar splitChunks en webpack');
      analysis.recommendations.push('9. Remover dependencias no utilizadas');
    }
    
    if (analysis.metrics.graphqlRequests > 3) {
      analysis.recommendations.push('10. Combinar queries GraphQL en una sola request');
      analysis.recommendations.push('11. Implementar prefetching de datos críticos');
      analysis.recommendations.push('12. Usar cache-first para queries repetitivas');
    }
  }
  
  // 5. Generar reporte
  console.log('📊 Análisis de rendimiento completado:');
  console.log(`⏱️ Tiempo de navegación: ${navigationTime}ms`);
  console.log(`🎨 First Contentful Paint: ${fcp}ms`);
  console.log(`📦 Bundle JavaScript: ${(totalJsSize / 1024).toFixed(2)}KB`);
  console.log(`🔍 Requests GraphQL: ${graphqlRequests.length}`);
  console.log(`⏱️ Tiempo promedio GraphQL: ${avgGraphqlTime.toFixed(2)}ms`);
  
  if (analysis.criticalIssues.length > 0) {
    console.log('\n🚨 Problemas críticos detectados:');
    analysis.criticalIssues.forEach((issue, index) => {
      console.log(`${index + 1}. ${issue.issue}: ${issue.value} (${issue.impact})`);
    });
  }
  
  if (analysis.recommendations.length > 0) {
    console.log('\n💡 Recomendaciones:');
    analysis.recommendations.forEach(rec => console.log(`  ${rec}`));
  }
  
  // Guardar reporte
  const outputFile = path.join(__dirname, '..', 'performance-analysis.json');
  fs.writeFileSync(outputFile, JSON.stringify(analysis, null, 2));
  
  console.log(`\n📄 Reporte guardado en: ${outputFile}`);
  
  return analysis;
}

if (require.main === module) {
  analyzePerformanceData();
}

module.exports = { analyzePerformanceData };
