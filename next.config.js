/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: [
    // '@aitube/clap'
  ],
  experimental: {
    serverActions: {

      // necessary as we are generating Clap files on server-side
      // however, we are only generating text and not assets, so it should be lightweight,
      // usually below 2mb
      bodySizeLimit: '4mb',
    },
  }
}

module.exports = nextConfig
