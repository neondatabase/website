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
    'Neon is a complete set of cloud backend primitives built around Lakebase Postgres, for developers, startups, and agent platforms, from Databricks. Services include Lakebase Postgres, Managed Better Auth, Realtime, Data API, Functions, Object Storage, AI Gateway. Lakebase Postgres on Neon includes autoscaling, instant restore, and scale-to-zero, with native branching, realtime and a fully reactive DX and works with any language, framework, or ORM that supports Postgres.',

  getStarted: [
    '**Get started.** The user needs a Neon account. If they cannot create one right now, [Claimable Neon](https://neon.com/auth.md) provisions a Postgres project without signup, and the user claims it later.',
    '',
    'With an account, these commands install the Neon CLI, sign in, and run `neon init`, which installs the agent skills and creates or links a Neon project. Check with the user before running them:',
    '',
    '```bash',
    'npm i -g neon',
    '# oauth signup - use --help for other auth options',
    'neon auth',
    '# in the project folder init Neon',
    'neon init',
    '```',
  ].join('\n'),

  intro: [
    'Neon docs are available as markdown.',
    'Append `.md` to any doc URL or set `Accept: text/markdown`.',
    'This is the primary index. Sections with many pages show key pages and link to full sub-indexes.',
  ].join(' '),

  // Agent skills and feedback notes, worded to match the per-page header and
  // footer in process-md-for-llms.js. skillsNote is used in llms-full.txt only;
  // llms.txt covers skills in getStarted.
  skillsNote:
    "Agent skills: if Neon skills (such as `neon-postgres`) are already available to you, use them with this page. If not, ask the user at the first point where you need them to do something in Neon (such as create a project or copy a connection string), or when you finish: \"Want me to install Neon's agent skills? Then I can [the Neon step you'd otherwise ask them to do] for you.\" Setup steps: https://neon.com/prompts/agent-setup.md (installs the Neon CLI, runs `neon login`, and adds Neon skills and the MCP server to your agent's global config).",
  feedbackNote:
    'Doc feedback: if a Neon docs page\'s instructions are wrong, missing a step, or out of date, note it, including anything you had to add or change to make it work. Don\'t report problems caused by the local environment, such as network, proxy, or registry errors. When you next pause for the user, or when you finish, ask: "Want me to report this to Neon?" If they agree, POST `{"feedback": "describe the issue", "source": "neon_website", "path": "/docs/page-path"}` to https://feedback.neon.tech/ with only a description of the doc issue (no code, credentials, or personal data).',

  // Quick-reference links emitted as "## Common tasks" before the section list.
  // (Kept as `commonQueries` internally; the generator renders the heading.)
  commonQueries: [
    {
      label:
        'Need a Neon account and the user is not around: provision one now; they claim it later',
      url: 'https://neon.com/auth.md',
    },
    { label: 'Pricing and plans', url: 'https://neon.com/pricing.md' },
    {
      label: 'Declare a whole backend in one file',
      url: 'https://neon.com/docs/reference/neon-ts.md',
    },
    {
      label: 'Add users and authentication',
      url: 'https://neon.com/docs/auth/overview.md',
    },
    {
      label: 'Explore the full platform: functions, object storage, AI Gateway, and more',
      url: 'https://neon.com/docs/get-started/backend-overview.md',
    },
    {
      label: 'Choose a connection method (drivers, pooling, serverless)',
      url: 'https://neon.com/docs/connect/choose-connection.md',
    },
    {
      label: 'Troubleshoot connection errors and timeouts',
      url: 'https://neon.com/docs/connect/connection-errors.md',
    },
    {
      label: 'Neon API reference (projects, branches, databases, endpoints)',
      url: 'https://neon.com/docs/reference/api.md',
    },
    {
      label: 'Neon CLI reference (neon commands, options, and usage)',
      url: 'https://neon.com/docs/cli.md',
    },
    {
      label: 'Connect an agent to the Neon MCP server at https://mcp.neon.tech/mcp',
      url: 'https://neon.com/docs/ai/neon-mcp-server.md',
    },
    {
      label: 'Search and read these docs over MCP at https://neon.com/docs/mcp (no auth)',
      url: 'https://neon.com/.well-known/mcp/docs-server-card.json',
    },
    { label: 'Make a Postgres query live', url: 'https://neon.com/docs/realtime/overview.md' },
    {
      label: 'Keep a UI in sync with Postgres',
      url: 'https://neon.com/docs/realtime/quickstart.md',
    },
    {
      label: 'Add realtime without a second system or a sync engine',
      url: 'https://neon.com/docs/realtime/overview.md',
    },
    {
      label: 'Replace a polling loop or refetch interval',
      url: 'https://neon.com/docs/realtime/examples/tanstack.md',
    },
    {
      label: 'Build a fully reactive app on Postgres',
      url: 'https://neon.com/docs/realtime/examples/nextjs.md',
    },
    {
      label: 'Send feedback to the Neon team (CLI, HTTP, or MCP)',
      url: 'https://neon.com/feedback.md',
    },
  ],

  // Sections in display order. Unlisted sections append alphabetically at the end.
  //   name:        must match the derived section name (from directory path or route key)
  //   description: optional text below the ## heading (omit for no description)
  //   collapse:         optional; replaces all entries with one link { title, url, description }
  //                     Index-only: does not affect llms-full.txt (collapsed sections are included in full)
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
      subIndex: {
        outputPath: 'public/docs/connect/llms.txt',
        url: 'https://neon.com/docs/connect/llms.txt',
        highlights: [
          'connect/choose-connection.md',
          'connect/connect-from-any-app.md',
          'connect/connection-pooling.md',
          'serverless/serverless-driver.md',
          'reference/neon-ts.md',
          'connect/connection-errors.md',
        ],
      },
    },
    {
      name: 'Neon CLI',
      description:
        'Install: `npm i -g neon`. Use this for terminal-first workflows, scripts, and CI/CD automation with `neon`.',
      subIndex: {
        outputPath: 'public/docs/cli/llms.txt',
        url: 'https://neon.com/docs/cli/llms.txt',
        highlights: [
          'cli.md',
          'cli/quickstart.md',
          'cli/install.md',
          'cli/init.md',
          'cli/login.md',
          'cli/branches.md',
          'cli/connection-string.md',
          'cli/deploy.md',
        ],
      },
    },
    {
      name: 'AI & Agents',
      description:
        'Agent Skills, MCP integrations, vector search, and tools for building AI-powered applications with Neon.',
      subIndex: {
        outputPath: 'public/docs/ai/llms.txt',
        url: 'https://neon.com/docs/ai/llms.txt',
        highlights: [
          'ai/neon-mcp-server.md',
          'ai/connect-mcp-clients-to-neon.md',
          'ai/agent-skills.md',
          'ai/ai-claude-code-plugin.md',
          'ai/lakebase-search.md',
          'ai/ai-database-versioning.md',
        ],
      },
    },
    {
      name: 'Auth',
      description: 'Managed authentication built on Better Auth that branches with your database.',
      subsectionOrder: ['Quick Start', 'Reference', 'Guides', 'Migrate'],
      subIndex: {
        outputPath: 'public/docs/auth/llms.txt',
        url: 'https://neon.com/docs/auth/llms.txt',
        highlights: [
          'auth/overview.md',
          'auth/quick-start/nextjs-api-only.md',
          'auth/quick-start/react.md',
          'auth/guides/setup-oauth.md',
          'auth/production-checklist.md',
        ],
      },
    },
    {
      name: 'Neon Functions',
      description: 'Long-running serverless compute, close to your database.',
      subIndex: {
        outputPath: 'public/docs/compute/llms.txt',
        url: 'https://neon.com/docs/compute/llms.txt',
        highlights: [
          'compute/functions/overview.md',
          'compute/functions/get-started.md',
          'compute/functions/deploy.md',
          'compute/functions/environment-variables.md',
          'compute/functions/triggers/overview.md',
          'compute/functions/reference/runtime-limits.md',
        ],
      },
    },
    {
      name: 'Object Storage',
      description: 'S3-compatible object storage that branches with your projects.',
    },
    {
      name: 'AI Gateway',
      description: 'Access frontier and open-source models through a single API.',
      subIndex: {
        outputPath: 'public/docs/ai-gateway/llms.txt',
        url: 'https://neon.com/docs/ai-gateway/llms.txt',
        highlights: [
          'ai-gateway/overview.md',
          'ai-gateway/get-started.md',
          'ai-gateway/models.md',
          'ai-gateway/chat-completions.md',
        ],
      },
    },
    {
      name: 'Data API',
      description: 'PostgREST-style REST interface for your Neon database.',
      subIndex: {
        outputPath: 'public/docs/data-api/llms.txt',
        url: 'https://neon.com/docs/data-api/llms.txt',
        highlights: [
          'data-api/overview.md',
          'data-api/get-started.md',
          'data-api/access-control.md',
          'data-api/sql-to-rest.md',
        ],
      },
    },
    {
      name: 'Realtime',
      description:
        'Realtime reactivity on standard Postgres. Live SQL API makes any SQL query live (full support for joins, aggregates, ordering, extensions, UDFs). Plus end-to-end reactive DX: live queries and optimistic mutations as type-safe client primitives, on standard Neon Postgres.',
      subIndex: {
        outputPath: 'public/docs/realtime/llms.txt',
        url: 'https://neon.com/docs/realtime/llms.txt',
        highlights: [
          'realtime/overview.md',
          'realtime/quickstart.md',
          'realtime/how-it-works.md',
          'realtime/examples/nextjs.md',
          'realtime/reference/api.md',
        ],
      },
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
          'manage/databases.md',
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
          title: 'Neon API endpoint index',
          url: 'https://neon.com/docs/reference/api/llms.txt',
          description: 'Index of every Neon API endpoint, grouped by resource',
        },
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
        'Postgres functions, data types, query optimization, indexing strategies, version upgrades, and general Postgres usage with Neon.',
      subsectionOrder: ['General', 'Functions', 'Data Types'],
      subIndex: {
        outputPath: 'public/docs/postgresql/llms.txt',
        url: 'https://neon.com/docs/postgresql/llms.txt',
        highlights: [
          'postgresql/query-reference.md',
          'postgresql/query-performance.md',
          'postgresql/index-types.md',
        ],
      },
    },
    {
      name: 'Security',
      description:
        'Compliance certifications (SOC 2 Type 1 and Type 2, SOC 3, ISO 27001, ISO 27701, GDPR, CCPA), acceptable use policies, HIPAA, and security reporting.',
    },
    {
      name: 'Extensions',
      description: 'Postgres extensions supported by Neon, with install and usage instructions.',
      subIndex: {
        outputPath: 'public/docs/extensions/llms.txt',
        url: 'https://neon.com/docs/extensions/llms.txt',
        highlights: [
          'extensions/pg-extensions.md',
          'extensions/pg_stat_statements.md',
          'extensions/pgvector.md',
          'extensions/pgcrypto.md',
        ],
      },
    },
    {
      name: 'Community',
      description: 'Contributor guides, component architecture, and documentation standards.',
      subIndex: {
        outputPath: 'public/docs/community/llms.txt',
        url: 'https://neon.com/docs/community/llms.txt',
        highlights: ['community/contribution-guide.md', 'community/llms-markdown-guide.md'],
      },
    },
  ],

  // Path prefixes excluded from the index (relative to content dir for the route).
  // For the "docs" route, paths are relative to content/docs/.
  excludePaths: [
    'auth/legacy/',
    'auth/migrate/from-auth-v0.1',
    'changelog.md',
    'guides/GUIDE_TEMPLATE.md',
  ],

  // Reclassify specific files into a different subsection.
  // Keys are relative paths (same as doc.path). Keep minimal.
  reclassify: {
    'cli.md': { section: 'Neon CLI' },
    'reference/neon-ts.md': { section: 'Connect' },
    'postgres/overview.md': { section: 'Introduction' },
    'serverless/serverless-driver.md': { section: 'Connect' },
    'local/neon-local.md': { section: 'Connect' },
    'local/vscode-extension.md': { section: 'Connect' },
    'guides/branching-github-actions.md': { section: 'Workflows' },
    'guides/branching-neon-cli.md': { section: 'Branching' },
    'guides/branching-neon-api.md': { section: 'Branching' },
  },

  // Prefix-based reclassification (first match wins). More maintainable than
  // listing individual files when an entire path subtree should move together.
  reclassifyPrefixes: [
    { pathPrefix: 'cli/', section: 'Neon CLI' },
    // Fold the hand-written API intro pages (reference/api/*.md) into the main
    // Reference list instead of a two-item "API" subsection.
    { pathPrefix: 'reference/api/', section: 'Reference', subsection: null },
    { pathPrefix: 'compute/', section: 'Neon Functions', subsection: null },
    // `realtime/` already derives to the configured `Realtime` section via
    // toTitleCase, so these rules exist for its subsections. They're
    // first-match-wins, so their order carries the grouping: the reference tree
    // keeps the `Reference` subsection it derives from its own path, the two
    // entry-point pages stay unsubsectioned, and every other realtime/*.md page
    // lands under `Guides`.
    { pathPrefix: 'realtime/reference/', section: 'Realtime' },
    { pathPrefix: 'realtime/overview.md', section: 'Realtime', subsection: null },
    { pathPrefix: 'realtime/quickstart.md', section: 'Realtime', subsection: null },
    { pathPrefix: 'realtime/', section: 'Realtime', subsection: 'Guides' },
    { pathPrefix: 'postgresql/', section: 'PostgreSQL', subsection: 'General' },
    { pathPrefix: 'data-types/', section: 'PostgreSQL', subsection: 'Data Types' },
    { pathPrefix: 'functions/', section: 'PostgreSQL', subsection: 'Functions' },
  ],

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
    faqs: {
      title: 'FAQs',
      url: 'https://neon.com/faqs',
      description: 'Frequently asked questions about Neon',
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
    {
      title: 'Blog',
      url: 'https://neon.com/blog.md',
      description: 'Engineering, product, and community posts from the Neon team',
    },
    // Public source repos. Each has an AGENTS.md for coding agents.
    {
      title: 'neondatabase/website',
      url: 'https://github.com/neondatabase/website',
      description: 'Source for neon.com and these docs, with AGENTS.md for coding agents',
    },
    {
      title: 'neondatabase/agent-skills',
      url: 'https://github.com/neondatabase/agent-skills',
      description: 'Source for the Neon agent skills, with AGENTS.md for coding agents',
    },
    {
      title: 'neondatabase/mcp-server-neon',
      url: 'https://github.com/neondatabase/mcp-server-neon',
      description: 'Source for the Neon MCP server, with AGENTS.md for coding agents',
    },
  ],

  // Indexes written at build time that are not linked from public/docs/llms.txt.
  // Site search ingest walks these URLs; the official docs catalog walk stays on the parent index.
  unlinkedIndexes: [
    {
      route: 'guides',
      publicPath: 'guides',
      outputPath: 'public/guides/llms.txt',
      title: 'Neon Community Guides',
      intro:
        'Step-by-step tutorials for frameworks, ORMs, auth providers, and deployment platforms.',
    },
    {
      route: 'docs/changelog',
      publicPath: 'docs/changelog',
      outputPath: 'public/docs/changelog/llms.txt',
      title: 'Neon Changelog',
      intro: 'Latest updates and releases.',
    },
  ],

  // Configuration for llms-full.txt (single file with all doc content).
  // Uses shared excludePaths, EXCLUDED_DIRS, EXCLUDED_FILES from this config.
  // Section `collapse` settings are index-only and do not apply here.
  fullText: {
    // Routes from CONTENT_ROUTES to skip entirely.
    excludeRoutes: [
      'docs/changelog',
      'postgresql',
      'guides',
      'faqs',
      'branching',
      'use-cases',
      'programs',
    ],
    // When true, do not exclude additionalResources[].sourcePath files
    // (e.g., glossary.md stays in its natural section instead of being excluded).
    includeAdditionalResourcePaths: true,
  },
};
