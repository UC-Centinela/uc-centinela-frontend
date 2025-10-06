#!/usr/bin/env node

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const APP_URL = process.env.APP_URL || 'https://tu-app.vercel.app';

async function analyzeNetworkPerformance() {
  console.log('🌐 Analizando rendimiento de red...\n');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Habilitar análisis de red
  await page.setRequestInterception(true);
  
  const requests = [];
  const responses = [];
  
  page.on('request', request => {
    requests.push({
      url: request.url(),
      method: request.method(),
      headers: request.headers(),
      timestamp: Date.now()
    });
    request.continue();
  });
  
  page.on('response', response => {
    responses.push({
      url: response.url(),
      status: response.status(),
      headers: response.headers(),
      timestamp: Date.now()
    });
  });
  
  // Navegar a la página
  console.log(`📱 Cargando: ${APP_URL}`);
  const startTime = Date.now();
  
  await page.goto(APP_URL, {
    waitUntil: 'networkidle0',
    timeout: 30000
  });
  
  const endTime = Date.now();
  const totalLoadTime = endTime - startTime;
  
  // Analizar requests
  const analysis = {
    totalRequests: requests.length,
    totalLoadTime: totalLoadTime,
    requests: requests.map(req => ({
      url: req.url,
      method: req.method,
      domain: new URL(req.url).hostname
    })),
    responses: responses.map(res => ({
      url: res.url,
      status: res.status,
      domain: new URL(res.url).hostname
    })),
    domains: {},
    slowRequests: [],
    failedRequests: []
  };
  
  // Agrupar por dominio
  requests.forEach(req => {
    const domain = new URL(req.url).hostname;
    if (!analysis.domains[domain]) {
      analysis.domains[domain] = { requests: 0, size: 0 };
    }
    analysis.domains[domain].requests++;
  });
  
  // Identificar requests lentos y fallidos
  responses.forEach(res => {
    if (res.status >= 400) {
      analysis.failedRequests.push({
        url: res.url,
        status: res.status
      });
    }
  });
  
  // Análisis de GraphQL
  const graphqlRequests = requests.filter(req => 
    req.url.includes('graphql') || req.url.includes('/api/')
  );
  
  const graphqlAnalysis = {
    totalQueries: graphqlRequests.length,
    queries: graphqlRequests.map(req => ({
      url: req.url,
      method: req.method
    }))
  };
  
  // Análisis de recursos estáticos
  const staticResources = requests.filter(req => {
    const url = req.url;
    return url.includes('_next/static') || 
           url.includes('.js') || 
           url.includes('.css') || 
           url.includes('.png') || 
           url.includes('.jpg') ||
           url.includes('.webp');
  });
  
  const staticAnalysis = {
    totalStatic: staticResources.length,
    jsFiles: staticResources.filter(r => r.url.includes('.js')).length,
    cssFiles: staticResources.filter(r => r.url.includes('.css')).length,
    images: staticResources.filter(r => 
      r.url.includes('.png') || r.url.includes('.jpg') || r.url.includes('.webp')
    ).length
  };
  
  // Generar reporte
  const networkReport = {
    timestamp: new Date().toISOString(),
    url: APP_URL,
    summary: {
      totalLoadTime: totalLoadTime,
      totalRequests: analysis.totalRequests,
      totalDomains: Object.keys(analysis.domains).length,
      failedRequests: analysis.failedRequests.length
    },
    domains: analysis.domains,
    graphql: graphqlAnalysis,
    static: staticAnalysis,
    issues: []
  };
  
  // Identificar problemas
  if (totalLoadTime > 5000) {
    networkReport.issues.push('⚠️ Tiempo de carga > 5s');
  }
  
  if (analysis.failedRequests.length > 0) {
    networkReport.issues.push(`⚠️ ${analysis.failedRequests.length} requests fallidos`);
  }
  
  if (graphqlRequests.length > 10) {
    networkReport.issues.push(`⚠️ ${graphqlRequests.length} queries GraphQL - Considerar optimización`);
  }
  
  if (staticResources.length > 50) {
    networkReport.issues.push(`⚠️ ${staticResources.length} recursos estáticos - Considerar CDN`);
  }
  
  // Guardar reporte
  const outputFile = path.join(__dirname, '..', 'network-analysis.json');
  fs.writeFileSync(outputFile, JSON.stringify(networkReport, null, 2));
  
  console.log('\n📊 Análisis de red completado:');
  console.log(`⏱️ Tiempo total: ${totalLoadTime}ms`);
  console.log(`📦 Requests totales: ${analysis.totalRequests}`);
  console.log(`🌐 Dominios únicos: ${Object.keys(analysis.domains).length}`);
  console.log(`🔍 Requests GraphQL: ${graphqlRequests.length}`);
  console.log(`📁 Recursos estáticos: ${staticResources.length}`);
  
  if (networkReport.issues.length > 0) {
    console.log('\n⚠️ Problemas detectados:');
    networkReport.issues.forEach(issue => console.log(`  ${issue}`));
  }
  
  console.log(`\n📄 Reporte guardado en: ${outputFile}`);
  
  await browser.close();
  
  return networkReport;
}

if (require.main === module) {
  analyzeNetworkPerformance()
    .then(() => {
      console.log('\n✅ Análisis de red completado');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Error en análisis:', error);
      process.exit(1);
    });
}

module.exports = { analyzeNetworkPerformance };
