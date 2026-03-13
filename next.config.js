/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {},
  images: {
    domains: [], // Ha használsz külső képeket, ide add hozzá a domaineket
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "nodemailer": false,
      "fs": false,
      "net": false,
      "tls": false,
      "dns": false,
      "child_process": false,
    };
    return config;
  },
};

module.exports = nextConfig;
