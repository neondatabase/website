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
  auth: { desc: 'Browser OAuth; stores credentials locally.', examples: ['neonctl auth'] },
  init: {
    desc: 'Wire up MCP, agent skills, and editor (Cursor/VS Code/Claude).',
    examples: ['npx neonctl@latest init'],
  },
  link: {
    desc: 'Bind the directory to a project; writes .neon and pulls env.',
    examples: [
      'neonctl link',
      'neonctl link --org-id org-abc --project-id polished-snowflake-1234',
    ],
  },
  checkout: {
    desc: 'Pin a branch in .neon; auto-pulls its env vars.',
    examples: ['neonctl checkout feat/auth'],
  },
  env: {
    desc: "Write the branch's DATABASE_URL + Neon vars to .env.",
    examples: ['neonctl env pull'],
  },
  'set-context': {
    desc: 'Write org/project/branch context to .neon.',
    examples: ['neonctl set-context --project-id polished-snowflake-1234'],
  },
  me: { desc: 'Show the authenticated user.', examples: ['neonctl me'] },
  completion: { desc: 'Generate a shell completion script.' },
  projects: { desc: 'Manage projects.', examples: ['neonctl projects list'] },
  branches: {
    desc: 'Create, diff, reset, restore, and manage branches.',
    examples: [
      'neonctl branches create --name feat/auth --parent main',
      'neonctl branches restore main ^self@2024-05-06T10:00:00Z --preserve-under-name backup',
      'neonctl branches schema-diff production development',
    ],
  },
  databases: {
    desc: 'Manage databases on a branch.',
    examples: ['neonctl databases create --name analytics'],
  },
  roles: { desc: 'Manage Postgres roles.', examples: ['neonctl roles create --name app_user'] },
  operations: { desc: 'Inspect async operations.', examples: ['neonctl operations list'] },
  'connection-string': {
    desc: 'Print a connection URI for a branch/role/db.',
    examples: [
      'neonctl connection-string main',
      'neonctl connection-string main --pooled --prisma',
    ],
  },
  psql: {
    desc: 'Open a SQL session (embedded psql fallback built in).',
    examples: ['neonctl psql main -- -c "SELECT 1"'],
  },
  config: {
    desc: 'Drive a branch from a neon.ts policy.',
    examples: ['neonctl config apply'],
  },
  deploy: {
    desc: 'Alias for config apply; reconciles the policy.',
    examples: ['neonctl deploy'],
  },
  dev: {
    desc: 'Run Neon Functions locally with hot reload + branch env.',
    examples: ['neonctl dev'],
  },
  functions: {
    desc: 'Deploy and manage Neon Functions on a branch.',
    examples: ['neonctl functions deploy api --src ./api.ts'],
  },
  bucket: {
    desc: 'Branch-scoped object storage and its objects.',
    examples: ['neonctl bucket create my-assets'],
  },
  'data-api': {
    desc: 'Manage the Neon Data API for a database.',
    examples: ['neonctl data-api create'],
  },
  'neon-auth': {
    desc: 'Manage Neon Auth on a branch.',
    examples: ['neonctl neon-auth enable'],
  },
  orgs: { desc: 'List organizations you belong to.', examples: ['neonctl orgs list'] },
  'ip-allow': {
    desc: 'Manage the project IP allowlist.',
    examples: ['neonctl ip-allow add 203.0.113.0/24'],
  },
  vpc: {
    desc: 'Manage VPC endpoints and project restrictions.',
    examples: ['neonctl vpc endpoint list'],
  },
};

export default META;
