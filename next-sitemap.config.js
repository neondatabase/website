module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_DEFAULT_SITE_URL || 'https://neon.tech',
  exclude: [
    '/blog/wp-draft-post-preview-page',
    '/blog/rss.xml',
    '/docs/release-notes/rss.xml',
    '/last-week-in-aws',
  ],
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        disallow: ['/blog/wp-draft-post-preview-page$', '/last-week-in-aws$'],
      },
    ],
  },
};
