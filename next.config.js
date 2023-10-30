/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
        domains: ['www.pngarts.com', 'cdn-icons-png.flaticon.com'],
  }
}

module.exports = nextConfig
