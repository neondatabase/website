module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_DEFAULT_SITE_URL || 'https://neon.com',
  exclude: [
    // API routes
    '/api/*',

    // XML routes (RSS feeds and sitemaps)
    '**/*.xml',

    // Blog pages (handled by blog-sitemap.xml)
    '/blog/*',

    // PostgreSQL Tutorial (handled by sitemap-postgres.xml)
    '/postgresql/*',

    // Home page for logged-in users
    '/home',

    // Legacy docs
    '/docs/auth/legacy/*',
  ],
  generateRobotsTxt: true,
  additionalPaths: async (config) => [await config.transform(config, '/')],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        disallow: [
          // Home page for logged-in users
          '/home$',

          // Legacy docs
          '/docs/auth/legacy/',
        ],
      },
    ],
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_DEFAULT_SITE_URL}/blog-sitemap.xml`,
      `${process.env.NEXT_PUBLIC_DEFAULT_SITE_URL}/sitemap-postgres.xml`,
    ],
  },
};
