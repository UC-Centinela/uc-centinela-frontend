// eslint-disable-next-line @typescript-eslint/no-require-imports
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // disable PWA in development
})

const nextConfig = {
  images: {
    domains: [
      "cloud-object-storage-cos-standard-nck.s3.us-south.cloud-object-storage.appdomain.cloud"
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
