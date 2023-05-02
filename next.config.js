/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: '/',
                destination: '/projects',
                permanent: true,
            },
        ]
    },
    images: {
        remotePatterns: [
          {
            protocol: 'http',
            // hostname: '185.125.200.128',
            hostname: '172.18.159.223',
            port: '3001',
            pathname: '/image/**',
          },
        ],
      },
}

module.exports = nextConfig
