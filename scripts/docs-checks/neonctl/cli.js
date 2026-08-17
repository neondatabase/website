// One entry point for the Neon CLI docs pipeline. Routes to the individual
// scripts so `package.json` has a single `cli-docs` script and the whole
// workflow is discoverable from one place:
//
//   npm run cli-docs                 # print this help
//   npm run cli-docs -- refresh      # fetch latest neonctl, regen schema, diff, test
//   npm run cli-docs -- schema --src <path>   # regen schema.json from a CLI checkout
//   npm run cli-docs -- scaffold <name> --group <group-id>   # wire a new command
//   npm run cli-docs -- check        # run the coverage + generation tests
//   npm run cli-docs -- preview      # emit markdown fragments to fragments/ (dev only)
//   npm run cli-docs -- verify-dynamic  # cross-check dynamic subcommands vs local `neon --help`
//
// Each subcommand forwards its remaining args to the underlying script with
// stdio inherited, so per-script flags (--src, --group, ...) work unchanged.
// The schema is the source of truth; see README.md for the full model.

const { spawnSync } = require('child_process');
const path = require('path');

const HERE = __dirname;
const ROOT = path.join(HERE, '..', '..', '..');

const SUBCOMMANDS = {
  refresh: {
    summary: 'Fetch the latest neonctl release, regenerate schema.json, print a diff, run tests.',
    run: (args) => node(path.join(HERE, 'refresh.js'), args),
  },
  schema: {
    summary: 'Regenerate schema.json from a CLI source checkout. Requires --src <path>.',
    run: (args) => node(path.join(HERE, 'generate-schema.js'), args),
  },
  scaffold: {
    summary: 'Wire a new command: group mapping + doc page + nav entry. <name> --group <group-id>.',
    run: (args) => node(path.join(HERE, 'scaffold-command.js'), args),
  },
  check: {
    summary: 'Run the coverage + generation test suite (schema/pages/nav invariants).',
    // Run the locally-installed vitest bin through node — same `node <script>`
    // shape as the other subcommands, and no npx install prompt on a clean box.
    run: () =>
      node(path.join(ROOT, 'node_modules', '.bin', 'vitest'), [
        'run',
        'scripts/docs-checks/neonctl/__tests__/',
      ]),
  },
  preview: {
    summary: 'Emit every rendered markdown fragment to fragments/ for local preview (dev only).',
    run: (args) => node(path.join(HERE, 'generate-docs.js'), args),
  },
  'verify-dynamic': {
    summary:
      'Cross-check dynamically-generated subcommands against a matching-version local `neon --help`.',
    run: (args) => node(path.join(HERE, 'verify-dynamic.js'), args),
  },
};

function node(script, args) {
  return spawnSync('node', [script, ...args], { stdio: 'inherit', cwd: ROOT });
}

function printHelp() {
  console.log('Neon CLI docs pipeline. Usage:\n');
  console.log('  npm run cli-docs -- <subcommand> [args]\n');
  const width = Math.max(...Object.keys(SUBCOMMANDS).map((s) => s.length));
  for (const [name, { summary }] of Object.entries(SUBCOMMANDS)) {
    console.log(`  ${name.padEnd(width)}  ${summary}`);
  }
  console.log('\nExamples:');
  console.log('  npm run cli-docs -- refresh');
  console.log('  npm run cli-docs -- scaffold api --group network');
  console.log('  npm run cli-docs -- schema --src ~/git/neon-pkgs/packages/cli');
}

function main() {
  const [sub, ...args] = process.argv.slice(2);
  if (!sub || sub === 'help' || sub === '--help' || sub === '-h') {
    printHelp();
    process.exit(0);
  }
  const command = SUBCOMMANDS[sub];
  if (!command) {
    console.error(`Unknown subcommand "${sub}".\n`);
    printHelp();
    process.exit(1);
  }
  const result = command.run(args);
  // spawnSync sets .error (and null .status) when the process fails to launch;
  // don't let that masquerade as success.
  if (result && result.error) {
    console.error(result.error.message);
    process.exit(1);
  }
  process.exit(result && typeof result.status === 'number' ? result.status : 0);
}

main();
