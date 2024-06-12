const { withNextVideo } = require("next-video/process");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: "",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ipfs.io",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.ibb.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "gittjeqpqcmmbterylkd.supabase.co",
        port: "",
        pathname: "/**",
      },
    ],
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;

    return config;
  },
};

module.exports = withNextVideo(nextConfig, { folder: "y" });
