module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_DEFAULT_SITE_URL || 'https://afiliarerv.com.br',
  generateRobotsTxt: true, // (optional)
  exclude: ['/docs/*', '!/postgresql/*', '/*'],
  sitemapBaseFileName: 'sitemap-postgres',
};
