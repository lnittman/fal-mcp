/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['fal.ai', 'fal.media'],
  },
  transpilePackages: ['@fal-mcp/ascii', '@fal-mcp/design', '@fal-mcp/ai'],
}

module.exports = nextConfig