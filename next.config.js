/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  serverExternalPackages: ['sqlite3', 'sqlite'],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('sqlite3', 'sqlite');
    }
    return config;
  },
};

module.exports = nextConfig;