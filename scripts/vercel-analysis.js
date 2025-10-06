#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');

const APP_URL = process.env.APP_URL || 'https://tu-app.vercel.app';

async function analyzeVercelDeployment() {
  console.log('🚀 Analizando deployment de Vercel...\n');
  
  const analysis = {
    timestamp: new Date().toISOString(),
    url: APP_URL,
    checks: [],
    recommendations: []
  };
  
  // 1. Verificar headers de respuesta
  console.log('🔍 Verificando headers de respuesta...');
  
  const headers = await new Promise((resolve, reject) => {
    const req = https.request(APP_URL, { method: 'HEAD' }, (res) => {
      resolve({
        status: res.statusCode,
        headers: res.headers
      });
    });
    
    req.on('error', reject);
    req.setTimeout(10000, () => reject(new Error('Timeout')));
    req.end();
  });
  
  // Verificar headers importantes
  const headerChecks = [
    {
      name: 'X-Vercel-Cache',
      value: headers.headers['x-vercel-cache'],
      expected: 'HIT',
      description: 'Cache de Vercel activo'
    },
    {
      name: 'X-Vercel-Id',
      value: headers.headers['x-vercel-id'],
      expected: 'present',
      description: 'ID de Vercel presente'
    },
    {
      name: 'Content-Encoding',
      value: headers.headers['content-encoding'],
      expected: 'gzip',
      description: 'Compresión gzip activa'
    },
    {
      name: 'Cache-Control',
      value: headers.headers['cache-control'],
      expected: 'present',
      description: 'Headers de cache configurados'
    }
  ];
  
  headerChecks.forEach(check => {
    const passed = check.expected === 'present' ? 
      !!check.value : 
      check.value === check.expected;
    
    analysis.checks.push({
      name: check.name,
      passed,
      value: check.value,
      description: check.description
    });
    
    if (!passed) {
      analysis.recommendations.push(`⚠️ ${check.description} - Configurar en vercel.json`);
    }
  });
  
  // 2. Verificar tiempo de respuesta
  console.log('⏱️ Midiendo tiempo de respuesta...');
  
  const responseTime = await new Promise((resolve, reject) => {
    const start = Date.now();
    const req = https.request(APP_URL, (res) => {
      const end = Date.now();
      resolve(end - start);
    });
    
    req.on('error', reject);
    req.setTimeout(10000, () => reject(new Error('Timeout')));
    req.end();
  });
  
  analysis.checks.push({
    name: 'Response Time',
    passed: responseTime < 1000,
    value: `${responseTime}ms`,
    description: 'Tiempo de respuesta < 1s'
  });
  
  if (responseTime > 1000) {
    analysis.recommendations.push('⚠️ Tiempo de respuesta > 1s - Optimizar aplicación');
  }
  
  // 3. Verificar configuración de Next.js
  console.log('⚙️ Verificando configuración de Next.js...');
  
  try {
    const nextConfigPath = path.join(__dirname, '..', 'next.config.js');
    const nextConfig = fs.readFileSync(nextConfigPath, 'utf8');
    
    const configChecks = [
      {
        name: 'output: standalone',
        found: nextConfig.includes('output: \'standalone\''),
        description: 'Configuración standalone para Vercel'
      },
      {
        name: 'compress: true',
        found: nextConfig.includes('compress: true'),
        description: 'Compresión habilitada'
      },
      {
        name: 'optimizeCss',
        found: nextConfig.includes('optimizeCss: true'),
        description: 'Optimización de CSS'
      },
      {
        name: 'splitChunks',
        found: nextConfig.includes('splitChunks'),
        description: 'Code splitting configurado'
      }
    ];
    
    configChecks.forEach(check => {
      analysis.checks.push({
        name: check.name,
        passed: check.found,
        value: check.found ? 'present' : 'missing',
        description: check.description
      });
      
      if (!check.found) {
        analysis.recommendations.push(`⚠️ ${check.description} - Agregar a next.config.js`);
      }
    });
    
  } catch (error) {
    analysis.checks.push({
      name: 'Next.js Config',
      passed: false,
      value: 'Error reading config',
      description: 'Archivo next.config.js no encontrado'
    });
  }
  
  // 4. Verificar vercel.json
  console.log('📄 Verificando vercel.json...');
  
  try {
    const vercelConfigPath = path.join(__dirname, '..', 'vercel.json');
    const vercelConfig = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf8'));
    
    const vercelChecks = [
      {
        name: 'Headers',
        found: !!vercelConfig.headers,
        description: 'Headers de seguridad configurados'
      },
      {
        name: 'Cache Headers',
        found: vercelConfig.headers?.some(h => h.headers?.some(header => header.key === 'Cache-Control')),
        description: 'Headers de cache configurados'
      },
      {
        name: 'Functions Runtime',
        found: !!vercelConfig.functions,
        description: 'Runtime de funciones configurado'
      }
    ];
    
    vercelChecks.forEach(check => {
      analysis.checks.push({
        name: `Vercel ${check.name}`,
        passed: check.found,
        value: check.found ? 'present' : 'missing',
        description: check.description
      });
      
      if (!check.found) {
        analysis.recommendations.push(`⚠️ ${check.description} - Configurar en vercel.json`);
      }
    });
    
  } catch (error) {
    analysis.checks.push({
      name: 'Vercel Config',
      passed: false,
      value: 'Error reading config',
      description: 'Archivo vercel.json no encontrado'
    });
  }
  
  // 5. Generar reporte
  const passedChecks = analysis.checks.filter(c => c.passed).length;
  const totalChecks = analysis.checks.length;
  
  console.log('\n📊 Análisis de Vercel completado:');
  console.log(`✅ Checks pasados: ${passedChecks}/${totalChecks}`);
  console.log(`⏱️ Tiempo de respuesta: ${responseTime}ms`);
  console.log(`📄 Status: ${headers.status}`);
  
  if (analysis.recommendations.length > 0) {
    console.log('\n⚠️ Recomendaciones:');
    analysis.recommendations.forEach(rec => console.log(`  ${rec}`));
  }
  
  // Guardar reporte
  const outputFile = path.join(__dirname, '..', 'vercel-analysis.json');
  fs.writeFileSync(outputFile, JSON.stringify(analysis, null, 2));
  
  console.log(`\n📄 Reporte guardado en: ${outputFile}`);
  
  return analysis;
}

if (require.main === module) {
  analyzeVercelDeployment()
    .then(() => {
      console.log('\n✅ Análisis de Vercel completado');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Error en análisis:', error);
      process.exit(1);
    });
}

module.exports = { analyzeVercelDeployment };
