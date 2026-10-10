/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/DERE-AI',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
