#!/usr/bin/env node

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Configuración
const APP_URL = process.env.APP_URL || 'https://tu-app.vercel.app';
const OUTPUT_FILE = path.join(__dirname, '..', 'diagnosis-report.json');

async function diagnoseCurrentDeployment() {
  console.log('🔍 Iniciando diagnóstico de la aplicación desplegada...\n');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Configurar métricas
  await page.setCacheEnabled(false);
  await page.setViewport({ width: 1920, height: 1080 });
  
  console.log(`📱 Analizando: ${APP_URL}`);
  
  // 1. Métricas de navegación
  console.log('⏱️ Midiendo tiempos de carga...');
  
  const navigationMetrics = await page.evaluate(() => {
    const navigation = performance.getEntriesByType('navigation')[0];
    return {
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
      totalTime: navigation.loadEventEnd - navigation.fetchStart,
      dns: navigation.domainLookupEnd - navigation.domainLookupStart,
      tcp: navigation.connectEnd - navigation.connectStart,
      request: navigation.responseEnd - navigation.requestStart,
      response: navigation.responseEnd - navigation.responseStart
    };
  });
  
  // 2. Métricas de pintura
  console.log('🎨 Analizando métricas de pintura...');
  
  const paintMetrics = await page.evaluate(() => {
    const paints = performance.getEntriesByType('paint');
    const fcp = paints.find(p => p.name === 'first-contentful-paint');
    const lcp = paints.find(p => p.name === 'largest-contentful-paint');
    
    return {
      firstContentfulPaint: fcp ? fcp.startTime : null,
      largestContentfulPaint: lcp ? lcp.startTime : null
    };
  });
  
  // 3. Análisis de recursos
  console.log('📦 Analizando recursos cargados...');
  
  const resourceAnalysis = await page.evaluate(() => {
    const resources = performance.getEntriesByType('resource');
    
    const analysis = {
      totalResources: resources.length,
      totalSize: 0,
      slowResources: [],
      largeResources: [],
      byType: {}
    };
    
    resources.forEach(resource => {
      const size = resource.transferSize || 0;
      analysis.totalSize += size;
      
      // Recursos lentos (>1s)
      if (resource.duration > 1000) {
        analysis.slowResources.push({
          name: resource.name,
          duration: resource.duration,
          size: size
        });
      }
      
      // Recursos grandes (>500KB)
      if (size > 500000) {
        analysis.largeResources.push({
          name: resource.name,
          size: size,
          duration: resource.duration
        });
      }
      
      // Agrupar por tipo
      const type = resource.name.split('.').pop() || 'unknown';
      if (!analysis.byType[type]) {
        analysis.byType[type] = { count: 0, totalSize: 0 };
      }
      analysis.byType[type].count++;
      analysis.byType[type].totalSize += size;
    });
    
    return analysis;
  });
  
  // 4. Análisis de JavaScript
  console.log('⚡ Analizando JavaScript...');
  
  const jsAnalysis = await page.evaluate(() => {
    const scripts = Array.from(document.querySelectorAll('script'));
    const jsResources = performance.getEntriesByType('resource')
      .filter(r => r.name.includes('.js'));
    
    return {
      inlineScripts: scripts.filter(s => !s.src).length,
      externalScripts: scripts.filter(s => s.src).length,
      jsFiles: jsResources.length,
      jsTotalSize: jsResources.reduce((sum, r) => sum + (r.transferSize || 0), 0),
      jsFiles: jsResources.map(r => ({
        name: r.name,
        size: r.transferSize || 0,
        duration: r.duration
      }))
    };
  });
  
  // 5. Análisis de CSS
  console.log('🎨 Analizando CSS...');
  
  const cssAnalysis = await page.evaluate(() => {
    const stylesheets = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
    const cssResources = performance.getEntriesByType('resource')
      .filter(r => r.name.includes('.css'));
    
    return {
      stylesheets: stylesheets.length,
      cssFiles: cssResources.length,
      cssTotalSize: cssResources.reduce((sum, r) => sum + (r.transferSize || 0), 0)
    };
  });
  
  // 6. Análisis de imágenes
  console.log('🖼️ Analizando imágenes...');
  
  const imageAnalysis = await page.evaluate(() => {
    const images = Array.from(document.querySelectorAll('img'));
    const imageResources = performance.getEntriesByType('resource')
      .filter(r => /\.(jpg|jpeg|png|gif|webp|avif)$/i.test(r.name));
    
    return {
      totalImages: images.length,
      imageFiles: imageResources.length,
      imageTotalSize: imageResources.reduce((sum, r) => sum + (r.transferSize || 0), 0),
      unoptimizedImages: images.filter(img => !img.src.includes('_next/static')).length
    };
  });
  
  // 7. Análisis de Core Web Vitals
  console.log('📊 Calculando Core Web Vitals...');
  
  const coreWebVitals = await page.evaluate(() => {
    // Simular cálculo de CLS
    let clsValue = 0;
    let clsEntries = [];
    
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsEntries.push(entry);
          clsValue += entry.value;
        }
      }
    });
    
    observer.observe({ entryTypes: ['layout-shift'] });
    
    return {
      cls: clsValue,
      clsEntries: clsEntries.length
    };
  });
  
  // Compilar reporte
  const diagnosisReport = {
    timestamp: new Date().toISOString(),
    url: APP_URL,
    navigation: navigationMetrics,
    paint: paintMetrics,
    resources: resourceAnalysis,
    javascript: jsAnalysis,
    css: cssAnalysis,
    images: imageAnalysis,
    coreWebVitals: coreWebVitals,
    recommendations: []
  };
  
  // Generar recomendaciones
  if (navigationMetrics.totalTime > 3000) {
    diagnosisReport.recommendations.push('⚠️ Tiempo total de carga > 3s - Optimizar bundle');
  }
  
  if (paintMetrics.firstContentfulPaint > 1800) {
    diagnosisReport.recommendations.push('⚠️ FCP > 1.8s - Optimizar renderizado inicial');
  }
  
  if (resourceAnalysis.slowResources.length > 0) {
    diagnosisReport.recommendations.push(`⚠️ ${resourceAnalysis.slowResources.length} recursos lentos detectados`);
  }
  
  if (resourceAnalysis.largeResources.length > 0) {
    diagnosisReport.recommendations.push(`⚠️ ${resourceAnalysis.largeResources.length} recursos grandes detectados`);
  }
  
  if (jsAnalysis.jsTotalSize > 1000000) {
    diagnosisReport.recommendations.push('⚠️ JavaScript total > 1MB - Implementar code splitting');
  }
  
  if (imageAnalysis.unoptimizedImages > 0) {
    diagnosisReport.recommendations.push(`⚠️ ${imageAnalysis.unoptimizedImages} imágenes sin optimizar`);
  }
  
  // Guardar reporte
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(diagnosisReport, null, 2));
  
  console.log('\n📋 Reporte de diagnóstico generado:');
  console.log(`📄 Archivo: ${OUTPUT_FILE}`);
  console.log('\n🎯 Métricas principales:');
  console.log(`⏱️ Tiempo total: ${navigationMetrics.totalTime.toFixed(2)}ms`);
  console.log(`🎨 FCP: ${paintMetrics.firstContentfulPaint?.toFixed(2) || 'N/A'}ms`);
  console.log(`📦 Recursos totales: ${resourceAnalysis.totalResources}`);
  console.log(`📦 Tamaño total: ${(resourceAnalysis.totalSize / 1024 / 1024).toFixed(2)}MB`);
  console.log(`⚡ JS total: ${(jsAnalysis.jsTotalSize / 1024 / 1024).toFixed(2)}MB`);
  console.log(`🎨 CSS total: ${(cssAnalysis.cssTotalSize / 1024 / 1024).toFixed(2)}MB`);
  console.log(`🖼️ Imágenes: ${imageAnalysis.totalImages} (${imageAnalysis.unoptimizedImages} sin optimizar)`);
  
  if (diagnosisReport.recommendations.length > 0) {
    console.log('\n⚠️ Recomendaciones:');
    diagnosisReport.recommendations.forEach(rec => console.log(`  ${rec}`));
  }
  
  await browser.close();
  
  return diagnosisReport;
}

// Ejecutar si se llama directamente
if (require.main === module) {
  diagnoseCurrentDeployment()
    .then(() => {
      console.log('\n✅ Diagnóstico completado');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Error en diagnóstico:', error);
      process.exit(1);
    });
}

module.exports = { diagnoseCurrentDeployment };
