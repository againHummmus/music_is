import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';
import Icons from 'unplugin-icons/webpack';

// Here we use the @cloudflare/next-on-pages next-dev module to allow us to use bindings during local development
// (when running the application with `next dev`), for more information see:
// https://github.com/cloudflare/next-on-pages/blob/main/internal-packages/next-dev/README.md
if (process.env.NODE_ENV === 'development') {
    await setupDevPlatform();
}

/** @type {import('next').NextConfig} */
const nextConfig = {
    swcMinify: true,
    webpack(config) {
        config.plugins.push(
            Icons({
                compiler: 'jsx',
                jsx: 'react',
            }),
        );
        return config;
    },
    images: {
        domains: ['yhqndbnnfvdaouwsmqan.supabase.co'],
    },
};

export default nextConfig;
