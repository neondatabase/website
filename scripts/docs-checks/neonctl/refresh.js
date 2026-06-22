// One-command maintenance for the neonctl docs pipeline. Run when a new
// neonctl version ships:
//
//   npm run refresh:cli-docs
//
// What it does:
//   1. Looks up the latest neonctl release tag on GitHub (no clone needed).
//   2. Downloads and extracts the release tarball to a temp directory.
//   3. Regenerates schema.json from it (generate-schema.js + overrides.json).
//   4. Prints a summary of command/option additions and removals vs the
//      previously committed schema.
//   5. Runs the validation + generation test suite.
//
// Review the schema.json diff, fix any new doc-example misses, and commit.
// Pages need no regeneration: the CLI reference components and the llms
// mirror render from schema.json at build time.

const { execSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const REPO = 'neondatabase/neonctl';
const SCHEMA_PATH = path.join(__dirname, 'schema.json');

// When the CLI ships a rename, docs may lag. List preferred names here:
//   key   = what the schema currently calls it (new primary)
//   value = what the docs expect (old primary, now an alias in schema)
// The refresh script will swap these so docs-facing tooling stays stable.
// Remove an entry once docs are updated to match the CLI's new name.
const PREFER_ALIAS = {
  function: 'functions', // neonctl 2.26.5 renamed functions→function; revert when docs catch up
};

async function latestTag() {
  const res = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`, {
    headers: { accept: 'application/vnd.github+json' },
  });
  if (!res.ok) throw new Error(`GitHub API ${res.status} fetching latest release`);
  const release = await res.json();
  if (!release.tag_name) throw new Error('Latest release has no tag_name');
  return release.tag_name;
}

async function downloadTarball(tag, destDir) {
  const url = `https://codeload.github.com/${REPO}/tar.gz/refs/tags/${tag}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Tarball download failed: ${res.status} for ${url}`);
  const tarPath = path.join(destDir, 'neonctl.tar.gz');
  fs.writeFileSync(tarPath, Buffer.from(await res.arrayBuffer()));
  execSync(`tar -xzf ${JSON.stringify(tarPath)} -C ${JSON.stringify(destDir)}`);
  const extracted = fs
    .readdirSync(destDir)
    .find((d) => d.startsWith('neonctl-') && fs.statSync(path.join(destDir, d)).isDirectory());
  if (!extracted) throw new Error('Could not find extracted neonctl directory');
  return path.join(destDir, extracted);
}

// Flattens a schema's command tree into "path --option" keys for diffing.
function flatten(schema) {
  const keys = new Set();
  const walk = (commands, prefix) => {
    for (const [name, node] of Object.entries(commands || {})) {
      const cmdPath = prefix ? `${prefix} ${name}` : name;
      keys.add(cmdPath);
      for (const [opt, spec] of Object.entries(node.options || {})) {
        if (!spec.hidden) keys.add(`${cmdPath} --${opt}`);
      }
      walk(node.commands, cmdPath);
    }
  };
  walk(schema.commands, '');
  return keys;
}

function diffSchemas(before, after) {
  const beforeKeys = flatten(before);
  const afterKeys = flatten(after);
  const added = [...afterKeys].filter((k) => !beforeKeys.has(k));
  const removed = [...beforeKeys].filter((k) => !afterKeys.has(k));
  return { added, removed };
}

// Targeted checklists for added command keys (option keys contain " --").
// New top-level commands need the full page wiring; new subcommands usually
// need a section on the parent command's page (its <CliSubcommands> table
// links to a per-subcommand anchor that won't exist until someone adds it).
function newCommandNotes(added) {
  const commands = added.filter((k) => !k.includes('--'));
  const notes = [];
  for (const cmd of commands) {
    const [top, ...rest] = cmd.split(' ');
    if (rest.length === 0) {
      notes.push(
        `New top-level command "${top}" needs:\n` +
          `  - a GROUP_OF entry in src/components/pages/doc/cli-reference/cli-command-index/groups.js\n` +
          `  - a doc page at content/docs/cli/${top}.md\n` +
          `  - a navigation entry in content/docs/navigation.yaml (CLI section matching its group)`
      );
    } else if (!commands.includes(top)) {
      notes.push(
        `New subcommand "${cmd}": content/docs/cli/${top}.md likely needs a section for it\n` +
          `  (check its <CliSubcommands> table for a dangling anchor)`
      );
    }
  }
  return notes;
}

// For each PREFER_ALIAS entry, if the schema's primary key matches and the preferred
// name is listed as an alias, swap them so the docs-facing name stays primary.
function applyAliasPreferences(schema) {
  let commands = { ...schema.commands };
  let changed = false;
  for (const [schemaPrimary, docsPrimary] of Object.entries(PREFER_ALIAS)) {
    const node = commands[schemaPrimary];
    if (!node || !node.aliases?.includes(docsPrimary)) continue;
    commands[docsPrimary] = {
      ...node,
      aliases: node.aliases.map((a) => (a === docsPrimary ? schemaPrimary : a)),
    };
    delete commands[schemaPrimary];
    changed = true;
  }
  return changed ? { ...schema, commands } : schema;
}

async function main() {
  const before = JSON.parse(fs.readFileSync(SCHEMA_PATH, 'utf8'));
  console.log(`Committed schema: neonctl ${before.neonctlVersion}`);

  const tag = await latestTag();
  console.log(`Latest release:   neonctl ${tag.replace(/^v/, '')}`);

  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'neonctl-refresh-'));
  try {
    const src = await downloadTarball(tag, tmp);
    execSync(
      `node ${JSON.stringify(path.join(__dirname, 'generate-schema.js'))} --src ${JSON.stringify(src)}`,
      {
        stdio: 'inherit',
      }
    );

    const raw = JSON.parse(fs.readFileSync(SCHEMA_PATH, 'utf8'));
    const patched = applyAliasPreferences(raw);
    if (patched !== raw) {
      fs.writeFileSync(SCHEMA_PATH, JSON.stringify(patched, null, 2) + '\n');
      const swaps = Object.entries(PREFER_ALIAS)
        .filter(([k]) => raw.commands[k])
        .map(([k, v]) => `${k}→${v}`)
        .join(', ');
      console.log(`  (patched schema: swapped ${swaps} to preserve docs compatibility)`);
    }
    const after = patched;
    const { added, removed } = diffSchemas(before, after);
    console.log('');
    if (added.length === 0 && removed.length === 0) {
      console.log('No command or option changes.');
    } else {
      if (added.length) console.log(`Added (${added.length}):\n  ${added.join('\n  ')}`);
      if (removed.length) console.log(`Removed (${removed.length}):\n  ${removed.join('\n  ')}`);
      for (const note of newCommandNotes(added)) console.log(`\n${note}`);
      if (removed.length) console.log('\nRemoved commands need their doc pages cleaned up.');
      console.log(
        'If a changed command has curated copy in src/components/pages/doc/cli-reference/cli-command-index/meta.js,\n' +
          'review its desc/examples for semantic drift (the tests only catch syntactic breakage).'
      );
    }

    console.log('\nRunning validation...');
    execSync('npm run check:docs:neonctl', {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..', '..', '..'),
    });
    console.log('\nDone. Review the schema.json diff and commit.');
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

module.exports = { diffSchemas, flatten, newCommandNotes };

if (require.main === module) {
  main().catch((err) => {
    console.error(err.message || err);
    process.exit(1);
  });
}
