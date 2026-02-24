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
  tagline:
    "Neon is a serverless Postgres platform that separates compute and storage to offer autoscaling, branching, instant restore, and scale-to-zero. It's fully compatible with Postgres and works with any language, framework, or ORM that supports Postgres.",

  intro: [
    'Neon docs are available as markdown.',
    'Append `.md` to any doc URL or set `Accept: text/markdown`.',
    'This is the primary index. Sections with many pages show key pages and link to full sub-indexes.',
  ].join(' '),

  // Sections in display order. Unlisted sections append alphabetically at the end.
  //   name:        must match the derived section name (from directory path or route key)
  //   description: optional text below the ## heading (omit for no description)
  //   collapse:         optional; replaces all entries with one link { title, url, description }
  //   subIndex:         optional; moves full listing to a separate file, shows only highlights inline
  //                     { outputPath, url, highlights: ['path/to/file.md', ...] }
  //   subsectionOrder:        optional; explicit ordering for subsections (unlisted ones sort alphabetically after)
  //   subsectionDescriptions: optional; { 'Subsection Name': 'description text' }
  //   extraEntries:           optional; static entries appended to the section [{ title, url, description }]
  sections: [
    {
      name: 'Introduction',
      description: 'Architecture, features, autoscaling, branching concepts, billing, and plans.',
      subIndex: {
        outputPath: 'public/docs/introduction/llms.txt',
        url: 'https://neon.com/docs/introduction/llms.txt',
        highlights: [
          'introduction/architecture-overview.md',
          'introduction/about-billing.md',
          'introduction/autoscaling.md',
          'introduction/scale-to-zero.md',
          'introduction/branching.md',
          'introduction/read-replicas.md',
        ],
      },
    },
    {
      name: 'Get Started',
      description:
        'First-time setup: org/project creation, connection strings, driver installation, optional auth, and initial schema setup.',
    },
    {
      name: 'Connect',
      description: 'Drivers, connection strings, pooling, local dev tooling, and troubleshooting.',
    },
    {
      name: 'Neon CLI',
      description:
        'Install: `npm i -g neonctl`. Use this for terminal-first workflows, scripts, and CI/CD automation with `neonctl`.',
    },
    {
      name: 'AI',
      description:
        'AI rules, MCP integrations, vector search, and tools for building AI-powered applications with Neon.',
    },
    {
      name: 'Auth',
      description: 'Managed authentication built on Better Auth that branches with your database.',
      subsectionOrder: ['Quick Start', 'Reference', 'Guides', 'Migrate'],
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
    {
      name: 'Manage',
      description: 'Projects, branches, computes, roles, databases, and organization settings.',
      subIndex: {
        outputPath: 'public/docs/manage/llms.txt',
        url: 'https://neon.com/docs/manage/llms.txt',
        highlights: [
          'manage/projects.md',
          'manage/branches.md',
          'manage/computes.md',
          'manage/organizations.md',
          'manage/backups.md',
        ],
      },
    },
    {
      name: 'Guides',
      description:
        'Step-by-step integration guides for frameworks, ORMs, auth providers, and deployment platforms.',
      subIndex: {
        outputPath: 'public/docs/guides/llms.txt',
        url: 'https://neon.com/docs/guides/llms.txt',
        highlights: [
          'guides/nextjs.md',
          'guides/prisma.md',
          'guides/drizzle.md',
          'guides/integrations.md',
          'guides/vercel-overview.md',
          'guides/platform-integration-overview.md',
          'guides/row-level-security.md',
        ],
      },
    },
    {
      name: 'Import',
      description:
        'Migration guides by source, size, and downtime tolerance. Covers pg_dump, pgcopydb, logical replication, and provider-specific guides.',
      subIndex: {
        outputPath: 'public/docs/import/llms.txt',
        url: 'https://neon.com/docs/import/llms.txt',
        highlights: [
          'import/migrate-intro.md',
          'import/migrate-from-postgres.md',
          'import/import-sample-data.md',
          'import/import-from-csv.md',
          'import/import-data-assistant.md',
          'import/migrate-from-supabase.md',
        ],
      },
    },
    {
      name: 'Workflows',
      description:
        'Automate branching, data anonymization, and database provisioning in CI/CD pipelines and GitHub Actions.',
    },
    {
      name: 'Reference',
      description:
        'API reference, SDKs, Terraform provider, Postgres compatibility, and platform-level tooling.',
      extraEntries: [
        {
          title: 'Neon API OpenAPI Spec',
          url: 'https://neon.com/api_spec/release/v2.json',
          description: 'Machine-readable OpenAPI 3.0 specification for the Neon API',
        },
      ],
    },
    {
      name: 'PostgreSQL',
      description:
        'Postgres query optimization, indexing strategies, version upgrades, and general Postgres usage with Neon.',
    },
    {
      name: 'Security',
      description:
        'Compliance certifications, acceptable use policies, HIPAA, and security reporting.',
    },
    {
      name: 'Extensions',
      collapse: {
        title: 'Postgres extensions',
        url: 'https://neon.com/docs/extensions/pg-extensions.md',
        description: 'Supported extensions, versions, and install/update instructions',
      },
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
    'serverless/serverless-driver.md': { section: 'Connect' },
    'local/neon-local.md': { section: 'Connect', subsection: 'Local Development' },
    'local/vscode-extension.md': { section: 'Connect', subsection: 'Local Development' },
    'guides/branching-github-actions.md': { section: 'Workflows' },
    'guides/branching-neon-cli.md': { section: 'Branching' },
    'guides/branching-neon-api.md': { section: 'Branching' },
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
      url: 'https://neon.com/postgresql/tutorial',
      description: 'Comprehensive PostgreSQL tutorial and reference',
    },
    guides: {
      title: 'Community Guides',
      url: 'https://neon.com/guides',
      description: 'Step-by-step tutorials for frameworks and tools',
    },
    'use-cases': null,
    programs: null,
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
