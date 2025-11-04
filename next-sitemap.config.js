module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_DEFAULT_SITE_URL || 'https://neon.com',
  exclude: [
    // API routes
    '/api/*',

    // RSS feeds
    '**/rss.xml',

    // Blog pages (handled by blog-sitemap.xml)
    '/blog/*',

    // PostgreSQL Tutorial (handled by sitemap-postgres.xml)
    '/postgresql/*',

    // Home page variants
    '/home',
    '/all-things-open-2023',
    '/cfe',
    '/devs',
    '/education',
    '/fireship',
    '/github',
    '/last-week-in-aws',
    '/ping-thing',
    '/pgt',
    '/radio',
    '/stackoverflow',
    '/youtube',

    // Other pages
    '/thank-you',
  ],
  generateRobotsTxt: true,
  additionalPaths: async (config) => [await config.transform(config, '/')],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        disallow: [
          // Home page variants
          '/home$',
          '/all-things-open-2023$',
          '/cfe$',
          '/devs$',
          '/education$',
          '/fireship$',
          '/github$',
          '/last-week-in-aws$',
          '/ping-thing$',
          '/pgt$',
          '/radio$',
          '/stackoverflow$',
          '/youtube$',

          // Other pages
          '/thank-you$',
        ],
      },
    ],
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_DEFAULT_SITE_URL}/blog-sitemap.xml`,
      `${process.env.NEXT_PUBLIC_DEFAULT_SITE_URL}/sitemap-postgres.xml`,
    ],
  },
};
