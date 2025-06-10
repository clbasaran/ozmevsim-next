/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://ozmevsim.com',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: [
    '/admin/*',
    '/api/*',
    '/functions/*',
    '/_headers',
    '/_redirects',
    '/404',
    '/500'
  ],
  additionalPaths: async (config) => {
    // Add dynamic paths here if needed
    return [
      await config.transform(config, '/products'),
      await config.transform(config, '/services'),
      await config.transform(config, '/blog'),
      await config.transform(config, '/about'),
      await config.transform(config, '/contact'),
      await config.transform(config, '/faq'),
    ]
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/api',
          '/functions',
          '/_next',
          '/static',
        ],
      },
    ],
    additionalSitemaps: [
      'https://ozmevsim.com/sitemap.xml',
    ],
  },
  transform: async (config, path) => {
    // Default priority and changefreq
    let priority = 0.7
    let changefreq = 'weekly'

    // Customize based on path
    if (path === '/') {
      priority = 1.0
      changefreq = 'daily'
    } else if (path.startsWith('/products') || path.startsWith('/services')) {
      priority = 0.9
      changefreq = 'weekly'
    } else if (path.startsWith('/blog')) {
      priority = 0.8
      changefreq = 'daily'
    } else if (path === '/contact' || path === '/about') {
      priority = 0.6
      changefreq = 'monthly'
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
    }
  },
} 