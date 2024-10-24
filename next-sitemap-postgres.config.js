module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_DEFAULT_SITE_URL || 'https://neon.tech',
  exclude: ['/docs/*', '!/postgresql/*', '/*'],
  sitemapBaseFileName: 'sitemap-postgres',
};
