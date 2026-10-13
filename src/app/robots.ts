import { MetadataRoute } from 'next';

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
