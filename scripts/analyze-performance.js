#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Analizando rendimiento de la aplicación...\n');

// 1. Analizar bundle size
console.log('📦 Analizando tamaño del bundle...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  
  // Verificar si existe el archivo de análisis
  const buildPath = path.join(__dirname, '..', '.next');
  if (fs.existsSync(buildPath)) {
    console.log('✅ Build completado exitosamente');
    
    // Buscar archivos de análisis
    const analyzePath = path.join(buildPath, 'analyze');
    if (fs.existsSync(analyzePath)) {
      console.log('📊 Reporte de análisis disponible en:', analyzePath);
    }
  }
} catch (error) {
  console.error('❌ Error en el build:', error.message);
}

// 2. Verificar dependencias pesadas
console.log('\n🔍 Verificando dependencias pesadas...');
try {
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  const heavyDeps = [
    'react', 'react-dom', 'next', '@auth0/nextjs-auth0',
    'apollo-upload-client', 'graphql-upload', 'lucide-react'
  ];
  
  console.log('📋 Dependencias principales:');
  heavyDeps.forEach(dep => {
    if (dependencies[dep]) {
      console.log(`  - ${dep}: ${dependencies[dep]}`);
    }
  });
  
} catch (error) {
  console.error('❌ Error leyendo package.json:', error.message);
}

// 3. Verificar configuración de Next.js
console.log('\n⚙️ Verificando configuración de Next.js...');
try {
  const nextConfigPath = path.join(__dirname, '..', 'next.config.js');
  if (fs.existsSync(nextConfigPath)) {
    const config = fs.readFileSync(nextConfigPath, 'utf8');
    
    const checks = [
      { name: 'output: standalone', found: config.includes('output: \'standalone\'') },
      { name: 'compress: true', found: config.includes('compress: true') },
      { name: 'optimizeCss', found: config.includes('optimizeCss: true') },
      { name: 'splitChunks', found: config.includes('splitChunks') },
    ];
    
    console.log('✅ Configuraciones encontradas:');
    checks.forEach(check => {
      console.log(`  ${check.found ? '✅' : '❌'} ${check.name}`);
    });
  }
} catch (error) {
  console.error('❌ Error verificando configuración:', error.message);
}

console.log('\n🎯 Recomendaciones:');
console.log('1. Ejecuta "npm run build" para generar el bundle optimizado');
console.log('2. Usa "npm run start" para probar en producción localmente');
console.log('3. Verifica las métricas en Vercel Analytics');
console.log('4. Considera usar React.lazy() para componentes pesados');
console.log('5. Implementa lazy loading para imágenes');
