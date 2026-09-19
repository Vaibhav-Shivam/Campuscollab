import { MetadataRoute } from 'next';
import { initialProjects, initialStudents } from '@/data/mockData';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://campuscollab-rx9f.onrender.com';

  const staticRoutes = [
    '',
    '/projects',
    '/students',
    '/match',
    '/events',
    '/dashboard'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  const projectRoutes = initialProjects.map((p) => ({
    url: `${baseUrl}/projects/${p.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const studentRoutes = initialStudents.map((s) => ({
    url: `${baseUrl}/students/${s.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...projectRoutes, ...studentRoutes];
}
