/**
 * Configuration for llms.txt index generation.
 *
 * HOW IT WORKS
 * The generator scans every content directory in CONTENT_ROUTES (src/constants/content.js).
 * Any new directory or .md file is automatically included — you never need to register new
 * pages here. This config only shapes the output: ordering, descriptions, exclusions, etc.
 *
 * New subdirectories (e.g. content/docs/foobar/) appear as a new section ("Foobar"),
 * appended alphabetically after explicitly ordered sections. To control placement or add
 * a description, add an entry to `sections` below.
 *
 * MAINTENANCE
 * ~3-5 edits/year (new descriptions, reordering, new exclusions).
 * Build warnings flag stale entries (excludePaths matching nothing, empty sections, etc.).
 */

module.exports = {
  intro: [
    'Neon docs are available as markdown.',
    'Append `.md` to any doc URL or set `Accept: text/markdown`.',
    'This index lists all available pages.',
  ].join(' '),

  // Sections in display order. Unlisted sections append alphabetically at the end.
  //   name:        must match the derived section name (from directory path or route key)
  //   description: optional text below the ## heading (omit for no description)
  //   collapse:    optional; replaces all entries with one link { title, url, description }
  sections: [
    {
      name: 'Get Started',
      description: 'Sign up, connect your first app, and learn the basics.',
    },
    {
      name: 'Introduction',
      description: 'Architecture, features, autoscaling, branching concepts, billing, and plans.',
    },
    {
      name: 'Connect',
      description: 'Drivers, connection strings, pooling, latency, and troubleshooting.',
    },
    { name: 'AI' },
    {
      name: 'Auth',
      description: 'Managed authentication built on Better Auth that branches with your database.',
    },
    {
      name: 'Neon CLI',
      description:
        'Install: `npm i -g neonctl`. Manage projects, branches, databases, and roles from the terminal.',
    },
    {
      name: 'Data API',
      description: 'PostgREST-style REST interface for your Neon database.',
    },
    {
      name: 'Branching',
      description:
        'Instant copy-on-write database environments for dev, CI, previews, and recovery.',
    },
    { name: 'Guides' },
    {
      name: 'Import',
      collapse: {
        title: 'Neon data migration guides',
        url: 'https://neon.com/docs/import/migrate-intro.md',
        description:
          'Choose a migration method by size, downtime tolerance, and source (Postgres, MySQL, MSSQL, etc.). Covers pg_dump, pgcopydb, logical replication, and provider-specific guides.',
      },
    },
    { name: 'Manage' },
    { name: 'Reference' },
    { name: 'Local' },
    { name: 'PostgreSQL' },
    { name: 'Security' },
    { name: 'Serverless' },
    { name: 'Workflows' },
    {
      name: 'Extensions',
      collapse: {
        title: 'Postgres extensions',
        url: 'https://neon.com/docs/extensions/pg-extensions.md',
        description: 'Supported extensions, versions, and install/update instructions',
      },
    },
    {
      name: 'Solutions',
      description: 'Use-case overviews and program information.',
    },
  ],

  // Path prefixes excluded from the index (relative to content dir for the route).
  // For the "docs" route, paths are relative to content/docs/.
  excludePaths: [
    'azure/',
    'community/',
    'functions/',
    'data-types/',
    'auth/legacy/',
    'auth/migrate/from-auth-v0.1',
    'auth/migrate/from-legacy-auth',
    'changelog.md',
    'get-started/production-readiness.md',
    'guides/GUIDE_TEMPLATE.md',
    'introduction.md',
  ],

  // Reclassify specific files into a different subsection.
  // Keys are relative paths (same as doc.path). Keep minimal.
  reclassify: {
    'reference/neon-cli.md': { section: 'Neon CLI' },
  },

  // Prefix-based reclassification (first match wins). More maintainable than
  // listing individual files when an entire path subtree should move together.
  reclassifyPrefixes: [{ pathPrefix: 'reference/cli-', section: 'Neon CLI' }],

  // Route keys from CONTENT_ROUTES to collapse instead of scanning.
  // Each becomes a single link in the Additional Resources section.
  collapsedRoutes: {
    'docs/changelog': {
      title: 'Changelog',
      url: 'https://neon.com/docs/changelog',
      description: 'Latest updates and releases',
    },
    postgresql: {
      title: 'PostgreSQL Tutorial',
      url: 'https://neon.com/postgresql',
      description: 'Comprehensive PostgreSQL tutorial and reference',
    },
    guides: {
      title: 'Community Guides',
      url: 'https://neon.com/guides',
      description: 'Step-by-step tutorials for frameworks and tools',
    },
  },

  // Extra entries appended to the Additional Resources section.
  // `sourcePath` (optional): excludes that file from its natural section so it only appears here.
  additionalResources: [
    {
      title: 'Glossary',
      url: 'https://neon.com/docs/reference/glossary.md',
      sourcePath: 'reference/glossary.md',
    },
  ],
};
