/** @type {import('next').NextConfig} */
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
};

module.exports = nextConfig;
