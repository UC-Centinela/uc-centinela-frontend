// eslint-disable-next-line @typescript-eslint/no-require-imports
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // disable PWA in development
})

const nextConfig = {
  output: 'standalone', // ✅ CRÍTICO para Vercel
  basePath: process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_BASE_URL : '',
  
  // ✅ Optimización de imágenes
  images: {
    domains: [
      process.env.NEXT_PUBLIC_IBM_COS_ENDPOINT
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // ✅ Optimizaciones experimentales
  experimental: {
    // optimizeCss: true, // Temporalmente deshabilitado por error de critters
    optimizePackageImports: ['lucide-react', '@radix-ui/react-dialog', '@radix-ui/react-label', '@radix-ui/react-slot'],
  },

  // ✅ Compresión y optimización
  compress: true,
  poweredByHeader: false,
  
  webpack: (config, { dev, isServer }) => {
    // ✅ Optimización de bundle CRÍTICA
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        cacheGroups: {
          // ✅ Vendor chunks optimizados
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
            maxSize: 200000,
          },
          // ✅ React específico
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react',
            chunks: 'all',
            priority: 20,
          },
          // ✅ Apollo/GraphQL específico
          apollo: {
            test: /[\\/]node_modules[\\/](@apollo|graphql)[\\/]/,
            name: 'apollo',
            chunks: 'all',
            priority: 15,
          },
          // ✅ UI libraries
          ui: {
            test: /[\\/]node_modules[\\/](@radix-ui|lucide-react)[\\/]/,
            name: 'ui',
            chunks: 'all',
            priority: 12,
          },
          // ✅ Common chunks
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 5,
            enforce: true,
            maxSize: 100000,
          },
        },
      };
    }

    config.resolve.fallback = {
      ...config.resolve.fallback,
      buffer: require.resolve("buffer"),
    };
    return config;
  },
  
  reactStrictMode: false
};

module.exports = withPWA(nextConfig);
