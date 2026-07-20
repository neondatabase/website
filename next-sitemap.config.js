const fs = require('fs');
const path = require('path');

const matter = require('gray-matter');

const DOCS_CONTENT_DIR = path.join(__dirname, 'content/docs');

// Collect /docs/... URLs for pages marked `unlisted: true` in frontmatter so they
// stay out of the sitemap (in addition to their noindex tag).
function collectUnlistedDocs(dir = DOCS_CONTENT_DIR, base = '') {
  const excluded = [];
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return excluded;
  }
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = base ? `${base}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      excluded.push(...collectUnlistedDocs(fullPath, relPath));
    } else if (entry.name.endsWith('.md')) {
      try {
        const { data } = matter(fs.readFileSync(fullPath, 'utf8'));
        if (data.unlisted) excluded.push(`/docs/${relPath.replace(/\.md$/, '')}`);
      } catch {
        // Ignore unreadable files; they simply won't be excluded here.
      }
    }
  }
  return excluded;
}

const unlistedDocs = collectUnlistedDocs();

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

    // Early-access preview (noindex; predates the `unlisted` flag)
    '/docs/manage/user-permissions-preview',

    // Unlisted docs pages (frontmatter `unlisted: true`)
    ...unlistedDocs,
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
