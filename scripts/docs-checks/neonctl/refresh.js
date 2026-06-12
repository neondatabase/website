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

    const after = JSON.parse(fs.readFileSync(SCHEMA_PATH, 'utf8'));
    const { added, removed } = diffSchemas(before, after);
    console.log('');
    if (added.length === 0 && removed.length === 0) {
      console.log('No command or option changes.');
    } else {
      if (added.length) console.log(`Added (${added.length}):\n  ${added.join('\n  ')}`);
      if (removed.length) console.log(`Removed (${removed.length}):\n  ${removed.join('\n  ')}`);
      console.log('\nNew commands need doc pages + navigation entries; removed ones need cleanup.');
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

module.exports = { diffSchemas, flatten };

if (require.main === module) {
  main().catch((err) => {
    console.error(err.message || err);
    process.exit(1);
  });
}
