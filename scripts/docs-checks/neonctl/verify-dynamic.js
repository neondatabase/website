// Cross-checks the dynamically-generated subcommands in schema.json against a
// locally-installed `neon` binary's `--help` output. This is an independent
// derivation path: schema.json builds these leaves by reading a const from the
// neonctl TypeScript source (see applyDynamicCommands in generate-schema.js),
// while this check reads them from the built CLI's help. If the two disagree,
// the source-driven config has drifted from what the CLI actually ships.
//
//   npm run cli-docs -- verify-dynamic
//
// The check is local/manual, not part of CI: it needs the `neon` binary
// installed, which CI boxes may not have. It also REQUIRES the installed
// binary to match schema.json's pinned neonctlVersion — a mismatched version
// would report spurious drift (the CLI added/removed leaves the pinned schema
// hasn't caught up to). On a version mismatch it skips with a clear message
// rather than failing.

const { execFileSync, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Guard against shell metacharacters before interpolating into execSync. The
// bin comes from --bin and command paths from dynamic-commands.json, so this
// is defense-in-depth, not untrusted input.
function assertShellSafe(token) {
  if (!/^[A-Za-z0-9._-]+$/.test(token)) {
    throw new Error(`Refusing to run: unsafe token ${JSON.stringify(token)}`);
  }
  return token;
}

const SCHEMA_PATH = path.join(__dirname, 'schema.json');
const CONFIG_PATH = path.join(__dirname, 'dynamic-commands.json');

// Which binary to probe. `neon` and `neonctl` are the same package; prefer
// `neon` (the documented name) and let --bin override for odd setups.
function parseArgs(argv) {
  const out = { bin: 'neon' };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--bin') {
      out.bin = argv[i + 1];
      i += 1;
    }
  }
  return out;
}

function installedVersion(bin) {
  try {
    return execFileSync(bin, ['--version'], { encoding: 'utf8' }).trim();
  } catch {
    return null;
  }
}

// Parse the leaf subcommand names out of `neon <path> --help`. yargs lists
// each subcommand on its own line as `<bin> <path> <leaf>` under "Commands:".
// We take the token right after the full command path.
//
// The CLI writes help straight to the terminal, bypassing execFile's piped
// stdout (captured output comes back empty). A shell invocation with
// `2>&1 </dev/null` reliably captures it; tokens are validated first so the
// interpolation is safe.
function leavesFromHelp(bin, cmdPath) {
  const pathParts = cmdPath.split('.');
  assertShellSafe(bin);
  pathParts.forEach(assertShellSafe);
  let help;
  try {
    help = execSync(`${bin} ${pathParts.join(' ')} --help 2>&1 </dev/null`, {
      encoding: 'utf8',
    });
  } catch (err) {
    // yargs exits non-zero for some help invocations but still prints the
    // help; fall back to whatever it emitted.
    help = (err.stdout && err.stdout.toString()) || '';
  }
  const prefix = `${bin} ${pathParts.join(' ')} `;
  const leaves = new Set();
  for (const line of help.split('\n')) {
    const trimmed = line.trimEnd();
    if (!trimmed.startsWith(prefix)) continue;
    const rest = trimmed.slice(prefix.length).trim();
    // A leaf line is just the subcommand name (possibly with a trailing
    // positional/option hint); take the first token, and skip lines that are
    // really the parent's own usage (`<sub-command>`) or option hints.
    const name = rest.split(/\s+/)[0];
    if (!name || name.startsWith('<') || name.startsWith('[') || name.startsWith('-')) continue;
    leaves.add(name);
  }
  return leaves;
}

// Walk a dotted command path (`inspect.db`) into the schema and return its
// child command names.
function leavesFromSchema(schema, cmdPath) {
  let node = { commands: schema.commands };
  for (const part of cmdPath.split('.')) {
    node = node.commands && node.commands[part];
    if (!node) return null;
  }
  return new Set(Object.keys(node.commands || {}));
}

function main() {
  const { bin } = parseArgs(process.argv.slice(2));
  const schema = JSON.parse(fs.readFileSync(SCHEMA_PATH, 'utf8'));
  const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));

  const version = installedVersion(bin);
  if (!version) {
    console.log(
      `SKIP: \`${bin}\` is not installed or not runnable. This check needs the CLI ` +
        `locally.\n  Install it with: npm i -g neonctl`
    );
    process.exit(0);
  }
  if (version !== schema.neonctlVersion) {
    console.log(
      `SKIP: installed ${bin} is ${version}, but schema.json is pinned to ` +
        `${schema.neonctlVersion}.\n  Versions must match to compare leaves — a mismatch ` +
        `reports spurious drift.\n  Align them (\`npm i -g neonctl@${schema.neonctlVersion}\` ` +
        `or \`npm run cli-docs -- refresh\`) and re-run.`
    );
    process.exit(0);
  }

  let failed = false;
  for (const cmdPath of Object.keys(config.commands || {})) {
    const schemaLeaves = leavesFromSchema(schema, cmdPath);
    if (!schemaLeaves) {
      console.error(`FAIL: "${cmdPath}" not found in schema.json.`);
      failed = true;
      continue;
    }
    const helpLeaves = leavesFromHelp(bin, cmdPath);
    const missingFromSchema = [...helpLeaves].filter((l) => !schemaLeaves.has(l));
    const extraInSchema = [...schemaLeaves].filter((l) => !helpLeaves.has(l));
    const label = cmdPath.replace(/\./g, ' ');
    if (missingFromSchema.length === 0 && extraInSchema.length === 0) {
      console.log(`OK: ${bin} ${label} — ${schemaLeaves.size} leaves match --help.`);
      continue;
    }
    failed = true;
    console.error(`FAIL: ${bin} ${label} leaves disagree with --help:`);
    if (missingFromSchema.length) {
      console.error(`  in --help but missing from schema: ${missingFromSchema.join(', ')}`);
    }
    if (extraInSchema.length) {
      console.error(`  in schema but not in --help: ${extraInSchema.join(', ')}`);
    }
    console.error(
      `  Regenerate: npm run cli-docs -- refresh (or fix dynamic-commands.json if the ` +
        `enumerated const moved).`
    );
  }
  process.exit(failed ? 1 : 0);
}

module.exports = { leavesFromHelp, leavesFromSchema };

if (require.main === module) main();
