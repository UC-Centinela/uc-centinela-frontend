/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      buffer: require.resolve('buffer'),
    }
    return config
  },
}

module.exports = nextConfig
