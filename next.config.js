/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  experimental: {
    optimizePackageImports: ['@radix-ui/react-slot', 'lucide-react'],
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
}

module.exports = nextConfig
