/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    // Exclude undici from webpack processing to avoid private field syntax issues
    config.externals = config.externals || [];
    if (isServer) {
      config.externals.push('undici');
    }
    return config;
  },
}

export default nextConfig
