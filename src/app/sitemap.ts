import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://ozmevsim.com'

  // Static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/hizmetler`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/urunler`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/hakkimizda`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/iletisim`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sss`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
  ]

  try {
    // Dynamic routes from database
    const [services, products, blogPosts] = await Promise.all([
      // Services
      prisma.service.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
      }),
      // Products
      prisma.product.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
      }),
      // Blog posts
      prisma.blogPost.findMany({
        where: { 
          status: 'PUBLISHED',
          isActive: true 
        },
        select: { slug: true, updatedAt: true, publishedAt: true },
      }),
    ])

    // Service pages
    const serviceRoutes: MetadataRoute.Sitemap = services.map((service: {slug: string, updatedAt: Date}) => ({
      url: `${baseUrl}/hizmetler/${service.slug}`,
      lastModified: service.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    // Product pages
    const productRoutes: MetadataRoute.Sitemap = products.map((product: {slug: string, updatedAt: Date}) => ({
      url: `${baseUrl}/urunler/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    // Blog post pages
    const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post: {slug: string, updatedAt: Date, publishedAt: Date | null}) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))

    return [
      ...staticRoutes,
      ...serviceRoutes,
      ...productRoutes,
      ...blogRoutes,
    ]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Return static routes only if database is not available
    return staticRoutes
  }
} 