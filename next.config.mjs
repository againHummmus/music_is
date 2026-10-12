import Icons from 'unplugin-icons/webpack';

/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
  webpack(config) {
    config.plugins.push(
      Icons({
        compiler: 'jsx',
        jsx: 'react',
      })
    );
    return config;
  },
  images: {
    domains: ['ibdzyayxgmuikjdhagsh.supabase.co'],
  },
};

export default nextConfig;
