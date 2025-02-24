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
  resolve: {
    preferRelative: true,
  },
}

module.exports = nextConfig
