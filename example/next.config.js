/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@apteva/apteva-kit'],
  images: {
    domains: ['images.unsplash.com'],
  },
};

module.exports = nextConfig;
