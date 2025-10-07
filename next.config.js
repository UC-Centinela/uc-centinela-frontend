// eslint-disable-next-line @typescript-eslint/no-require-imports
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // disable PWA in development
})

const nextConfig = {
  output: 'standalone',
  basePath: process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_BASE_URL : '',
  
  // ✅ Optimizaciones de rendimiento
  compress: true,
  poweredByHeader: false,
  
  // ✅ Optimización de imágenes
  images: {
    domains: [
      process.env.NEXT_PUBLIC_IBM_COS_ENDPOINT
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },

  experimental: {
    // ✅ Optimización de package imports (seguro)
    optimizePackageImports: ['@apollo/client', 'lucide-react'],
    // ✅ Mejoras de rendimiento sin interferir con Apollo
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  webpack: (config, { dev, isServer }) => {
    // ✅ Fallbacks para compatibilidad
    config.resolve.fallback = {
      ...config.resolve.fallback,
      buffer: require.resolve("buffer"),
    };
    
    // ✅ Optimizaciones de producción
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          apollo: {
            test: /[\\/]node_modules[\\/]@apollo[\\/]/,
            name: 'apollo',
            chunks: 'all',
            priority: 20,
          },
        },
      };
    }
    
    return config;
  },
  reactStrictMode: false
};

module.exports = withPWA(nextConfig);
