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
  
  // ✅ PRUEBA 1: Solo compress
  compress: true,
  // ✅ PRUEBA 2: Agregar poweredByHeader
  poweredByHeader: false,
  
  images: {
    domains: [
      process.env.NEXT_PUBLIC_IBM_COS_ENDPOINT
    ]
  },

  experimental: {
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      buffer: require.resolve("buffer"),
    };
    return config;
  },
  reactStrictMode: false
};

module.exports = withPWA(nextConfig);
