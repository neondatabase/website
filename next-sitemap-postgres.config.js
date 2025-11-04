module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_DEFAULT_SITE_URL || 'https://neon.com',
  // Include only /postgresql/* pages
  exclude: ['/*', '!/postgresql/*'],
  sitemapBaseFileName: 'sitemap-postgres',
};
