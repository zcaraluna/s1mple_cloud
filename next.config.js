/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Asegurar que Next.js escuche en todas las interfaces
  experimental: {
    serverActions: {
      allowedOrigins: ['*'],
    },
  },
}

module.exports = nextConfig

