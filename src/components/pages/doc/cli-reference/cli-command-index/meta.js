// Curated editorial copy for the overview command index (from the approved
// design handoff): short row descriptions and example commands ONLY.
// Everything enumerable (signatures, option chips, subcommand chips,
// grouping) derives from schema.json so it can never go stale; this file
// is presentation copy a human chose to write.
//
// Examples are simple, curated overview examples by design (user
// decision); a command without curated examples falls back to the CLI's
// own .example() strings from the schema, then to its signature.
//
// Every example here must be a valid invocation: meta.test.js validates
// each one against schema.json, so a CLI change that invalidates an
// example fails the test suite.
const META = {
  auth: { desc: 'Browser OAuth; stores credentials locally.', examples: ['neon auth'] },
  init: {
    desc: 'Wire up MCP, agent skills, and editor (Cursor/VS Code/Claude).',
    examples: ['npx neonctl@latest init'],
  },
  link: {
    desc: 'Bind the directory to a project; writes .neon and pulls env.',
    examples: ['neon link', 'neon link --org-id org-abc --project-id polished-snowflake-1234'],
  },
  checkout: {
    desc: 'Pin a branch in .neon; auto-pulls its env vars.',
    examples: ['neon checkout feat/auth'],
  },
  env: {
    desc: "Write the branch's DATABASE_URL + Neon vars to .env.",
    examples: ['neon env pull'],
  },
  'set-context': {
    desc: 'Write org/project/branch context to .neon.',
    examples: ['neon set-context --project-id polished-snowflake-1234'],
  },
  me: { desc: 'Show the authenticated user.', examples: ['neon me'] },
  completion: { desc: 'Generate a shell completion script.' },
  projects: { desc: 'Manage projects.', examples: ['neon projects list'] },
  branches: {
    desc: 'Create, diff, reset, restore, and manage branches.',
    examples: [
      'neon branches create --name feat/auth --parent main',
      'neon branches restore main ^self@2024-05-06T10:00:00Z --preserve-under-name backup',
      'neon branches schema-diff production development',
    ],
  },
  databases: {
    desc: 'Manage databases on a branch.',
    examples: ['neon databases create --name analytics'],
  },
  roles: { desc: 'Manage Postgres roles.', examples: ['neon roles create --name app_user'] },
  operations: { desc: 'Inspect async operations.', examples: ['neon operations list'] },
  'connection-string': {
    desc: 'Print a connection URI for a branch/role/db.',
    examples: ['neon connection-string main', 'neon connection-string main --pooled --prisma'],
  },
  psql: {
    desc: 'Open a SQL session (embedded psql fallback built in).',
    examples: ['neon psql main -- -c "SELECT 1"'],
  },
  config: {
    desc: 'Drive a branch from a neon.ts policy.',
    examples: ['neon config apply'],
  },
  deploy: {
    desc: 'Alias for config apply; reconciles the policy.',
    examples: ['neon deploy'],
  },
  status: {
    desc: "Show the branch's live Neon state (alias of config status).",
    examples: ['neon status'],
  },
  dev: {
    desc: 'Run Neon Functions locally with hot reload + branch env.',
    examples: ['neon dev'],
  },
  functions: {
    desc: 'Deploy and manage Neon Functions on a branch.',
    examples: ['neon functions deploy api --src ./api.ts'],
  },
  buckets: {
    desc: 'Branch-scoped object storage and its objects.',
    examples: ['neon buckets create my-assets'],
  },
  'data-api': {
    desc: 'Manage the Neon Data API for a database.',
    examples: ['neon data-api create'],
  },
  'neon-auth': {
    desc: 'Manage Neon Auth on a branch.',
    examples: ['neon neon-auth enable'],
  },
  orgs: { desc: 'List organizations you belong to.', examples: ['neon orgs list'] },
  'ip-allow': {
    desc: 'Manage the project IP allowlist.',
    examples: ['neon ip-allow add 203.0.113.0/24'],
  },
  vpc: {
    desc: 'Manage VPC endpoints and project restrictions.',
    examples: ['neon vpc endpoint list'],
  },
};

export default META;
