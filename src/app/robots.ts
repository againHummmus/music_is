import { MetadataRoute } from 'next';

export const runtime = 'edge';

export default function robots(): MetadataRoute.Robots {
    const robots = {
        rules: [
            {
                userAgent: '*',
                disallow: '/',
            },
        ],
    };

    return robots;
}
