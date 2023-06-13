module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_DEFAULT_SITE_URL || 'https://neon.tech',
  exclude: ['/blog/wp-draft-post-preview-page'],
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        disallow: '/blog/wp-draft-post-preview-page$',
      },
    ],
  },
};
