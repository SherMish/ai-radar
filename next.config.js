/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { 
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: "https",
        hostname: "img.logo.dev", // Add more if needed
      },
    ],
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;