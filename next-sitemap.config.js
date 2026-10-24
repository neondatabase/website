const { guideHasExternalCanonical } = require('./src/utils/guide-has-external-canonical');

module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_DEFAULT_SITE_URL || 'https://neon.com',
  transform: async (config, routePath) => {
    if (guideHasExternalCanonical(routePath)) {
      return null;
    }

    return {
      loc: routePath,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      changefreq: config.changefreq,
      priority: config.priority,
      alternateRefs: config.alternateRefs ?? [],
      trailingSlash: config.trailingSlash,
    };
  },
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
        allow: '/',
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
    transformRobotsTxt: async (_config, robotsTxt) => {
      return robotsTxt.replace(
        '# Host',
        'Content-Signal: ai-train=yes, search=yes, ai-input=yes\n\n# Host'
      );
    },
  },
};
