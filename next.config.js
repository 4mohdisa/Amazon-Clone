/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'links.papareact.com'
      },
      {
        protocol: 'https',
        hostname: 'fakestoreapi.com'
      }
    ]
  },
  env: {
    stripe_public_key: process.env.STRIPE_PUBLIC_KEY,
    HOST: process.env.HOST || 'http://localhost:3000'
  }
}

module.exports = nextConfig