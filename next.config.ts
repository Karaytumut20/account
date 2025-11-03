/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    transpilePackages: ['postprocessing'],
  },
};

module.exports = nextConfig;