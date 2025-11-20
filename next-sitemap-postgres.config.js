module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_DEFAULT_SITE_URL || 'https://neon.com',
  exclude: ['/*', '!/postgresql/*'],
  sitemapBaseFileName: 'sitemap-postgres',
  generateIndexSitemap: false,
  transform: async (config, path) => {
    // Exclude RSS feed
    if (path.endsWith('/rss.xml')) {
      return null;
    }

    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
};
