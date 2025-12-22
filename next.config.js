/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Restringir CORS a dominios específicos
  experimental: {
    serverActions: {
      // Solo permitir desde el dominio de producción y localhost para desarrollo
      allowedOrigins: [
        'https://s1mple.dev',
        'https://s1mple.cloud',
        'http://localhost:3000',
        'http://127.0.0.1:3000',
      ],
    },
  },
  // Redirecciones de dominio
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 's1mple.cloud',
          },
        ],
        destination: 'https://s1mple.dev/:path*',
        permanent: true,
      },
    ]
  },
  // Headers de seguridad adicionales
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig

