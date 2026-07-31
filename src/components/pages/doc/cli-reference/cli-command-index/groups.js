// Editorial grouping for the CLI overview command index. The schema has no
// notion of groups; this is the one hand-maintained piece. When a new
// top-level command ships, add it here (the index throws at build time for
// unmapped commands so additions can't be forgotten).
const GROUPS = [
  { id: 'setup', title: 'Setup & context' },
  { id: 'core', title: 'Projects & branches' },
  { id: 'connect', title: 'Connect to Postgres' },
  { id: 'config', title: 'Config as code' },
  { id: 'surfaces', title: 'Functions, storage & data' },
  { id: 'network', title: 'Org & network' },
  { id: 'debugging', title: 'Debugging' },
];

const GROUP_OF = {
  auth: 'setup',
  init: 'setup',
  bootstrap: 'setup',
  link: 'setup',
  checkout: 'setup',
  'set-context': 'setup',
  me: 'setup',
  completion: 'setup',
  env: 'setup',
  projects: 'core',
  branches: 'core',
  databases: 'core',
  roles: 'core',
  operations: 'core',
  'connection-string': 'connect',
  psql: 'connect',
  config: 'config',
  deploy: 'config',
  status: 'config',
  dev: 'config',
  functions: 'surfaces',
  buckets: 'surfaces',
  'data-api': 'surfaces',
  'neon-auth': 'surfaces',
  orgs: 'network',
  'ip-allow': 'network',
  vpc: 'network',
  api: 'network',
  diff: 'core',
  snapshots: 'core',
  inspect: 'debugging',
};

// Commands documented as a section of another command's page instead of a
// standalone page. Empty now that deploy and status have their own pages;
// add an entry here for any future command that lives in another page's section.
const HREF_OVERRIDES = {};

export { GROUPS, GROUP_OF, HREF_OVERRIDES };
