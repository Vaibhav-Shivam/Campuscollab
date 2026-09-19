import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://campuscollab-rx9f.onrender.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/dashboard/private/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
