/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: "",
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
