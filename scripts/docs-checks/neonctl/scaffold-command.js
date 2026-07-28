// Scaffold the docs wiring for a new Neon CLI command. Run when
// `cli-docs -- refresh` reports a new top-level command (or the coverage test
// fails with an unmapped/undocumented command):
//
//   npm run cli-docs -- scaffold <name> --group <group-id>
//
// It performs the three manual steps the coverage invariants require:
//   1. adds a GROUP_OF entry in cli-command-index/groups.js
//   2. creates content/docs/cli/<name>.md from a template (leaf or parent,
//      seeded with the command's describe text and CLI components)
//   3. inserts a navigation.yaml entry under the matching CLI subgroup
//
// It reads the committed schema.json, so run a schema regen first (refresh
// or gen:schema) if the command isn't in the schema yet. The generated page
// is a starting point: fill in the prose, examples, and captured output.
// Idempotent per file — skips any step already done, so it is safe to rerun.

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..', '..');
const SCHEMA_PATH = path.join(__dirname, 'schema.json');
const GROUPS_PATH = path.join(
  ROOT,
  'src/components/pages/doc/cli-reference/cli-command-index/groups.js'
);
const NAV_PATH = path.join(ROOT, 'content/docs/navigation.yaml');
const CLI_DOCS_DIR = path.join(ROOT, 'content/docs/cli');

// group id -> exact navigation.yaml subgroup title. The titles differ from
// groups.js by design ("&" in the overview index vs "and" in the sidebar),
// so this editorial map is the seam between them. The group IDS, however, are
// NOT duplicated here — they are read from groups.js at runtime
// (groupIdsFromSource) and validated against these keys, so adding a group in
// one place without the other fails loudly instead of silently drifting.
const NAV_TITLE_BY_GROUP = {
  setup: 'Setup and context',
  core: 'Projects and branches',
  connect: 'Connect to Postgres',
  config: 'Config as code',
  surfaces: 'Functions, storage and data',
  network: 'Organizations and networking',
  debugging: 'Debugging',
};

// Extract group ids from the GROUPS array literal in groups.js, so the list of
// valid groups has a single source of truth. Matches `{ id: 'setup', title: ...`.
function groupIdsFromSource(src) {
  return [...src.matchAll(/\{\s*id:\s*'([^']+)'\s*,\s*title:/g)].map((m) => m[1]);
}

function parseArgs(argv) {
  const args = { name: null, group: null };
  const rest = argv.slice(2);
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i];
    if (a === '--group') {
      args.group = rest[++i];
    } else if (a.startsWith('--group=')) {
      args.group = a.slice('--group='.length);
    } else if (!a.startsWith('-') && !args.name) {
      args.name = a;
    }
  }
  return args;
}

function fail(msg) {
  console.error(`Error: ${msg}`);
  process.exit(1);
}

function loadSchema() {
  return JSON.parse(fs.readFileSync(SCHEMA_PATH, 'utf8'));
}

// --- groups.js -------------------------------------------------------------

function addGroupMapping(name, group) {
  const src = fs.readFileSync(GROUPS_PATH, 'utf8');
  const key = /^[a-z][a-z0-9-]*$/.test(name) ? name : `'${name}'`;
  if (new RegExp(`\\n\\s*'?${name}'?:\\s`).test(src)) {
    return { changed: false, note: `groups.js already maps "${name}"` };
  }
  // Match the GROUP_OF object body and append the new entry before its closing
  // brace. Anchoring on the object itself (not a neighbouring comment) keeps
  // this working if surrounding code is edited.
  const objRe = /(const GROUP_OF = \{[\s\S]*?)(\n\};)/;
  if (!objRe.test(src)) {
    fail('could not locate the GROUP_OF object in groups.js — add the mapping by hand');
  }
  const updated = src.replace(objRe, `$1\n  ${key}: '${group}',$2`);
  fs.writeFileSync(GROUPS_PATH, updated);
  return { changed: true, note: `groups.js: added ${key}: '${group}'` };
}

// --- doc page --------------------------------------------------------------

function pageTemplate(name, node) {
  const describe = (node.describe || '').replace(/\s+/g, ' ').trim();
  const subs = Object.keys(node.commands || {});
  const hasSubs = subs.length > 0;

  const fm = [
    '---',
    `title: 'Neon CLI command: ${name}'`,
    `subtitle: 'TODO: one-line subtitle for ${name}'`,
    'summary: >-',
    `  TODO: SEO summary for the \`neon ${name}\` command.` +
      (describe ? ` The CLI describes it as: ${describe}` : ''),
    'enableTableOfContents: true',
    '---',
    '',
  ].join('\n');

  // Intro is a stub for the author to rewrite. Quote the CLI's describe text
  // verbatim rather than splicing it into a sentence (which mangles grammar,
  // e.g. "The api command call any...").
  const intro = describe
    ? `TODO: intro for the \`${name}\` command. The CLI describes it as: "${describe}".`
    : `TODO: describe the \`${name}\` command.`;

  if (hasSubs) {
    const sections = subs
      .map((sub) => {
        const anchor = sub.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        return [
          `## neon ${name} ${sub} (#${anchor})`,
          '',
          `TODO: describe \`neon ${name} ${sub}\`.`,
          '',
          `<CliUsage command="${name} ${sub}" />`,
          '',
          `<CliOptions command="${name} ${sub}" />`,
          '',
          '```bash',
          `neon ${name} ${sub}`,
          '```',
        ].join('\n');
      })
      .join('\n\n');
    return `${fm}\n${intro}\n\n<CliSubcommands command="${name}" />\n\n${sections}\n`;
  }

  return (
    `${fm}\n${intro}\n\n` +
    `## Usage\n\n<CliUsage command="${name}" />\n\n` +
    `## Options\n\n<CliOptions command="${name}" />\n\n` +
    `## Examples\n\n\`\`\`bash\nneon ${name}\n\`\`\`\n`
  );
}

function createDocPage(name, node) {
  const file = path.join(CLI_DOCS_DIR, `${name}.md`);
  if (fs.existsSync(file)) {
    return { changed: false, note: `content/docs/cli/${name}.md already exists` };
  }
  fs.writeFileSync(file, pageTemplate(name, node));
  return { changed: true, note: `created content/docs/cli/${name}.md (fill in the TODOs)` };
}

// --- navigation.yaml -------------------------------------------------------

function addNavEntry(name, group) {
  const navTitle = NAV_TITLE_BY_GROUP[group];
  if (!navTitle) {
    fail(
      `no navigation subgroup mapped for group "${group}" — ` +
        `add it to NAV_TITLE_BY_GROUP in scaffold-command.js`
    );
  }
  const nav = fs.readFileSync(NAV_PATH, 'utf8');
  const slug = `cli/${name}`;
  if (nav.includes(`slug: ${slug}`)) {
    return { changed: false, note: `navigation.yaml already lists ${slug}` };
  }

  const lines = nav.split('\n');
  // Line-splice rather than a YAML round-trip (which would reformat/reorder the
  // whole 800-line nav). Assumes the CLI subgroup is a `- title: <navTitle>`
  // block whose `items:` is the next `items:` line and whose children are
  // indented two spaces under it — true for this file. If the structure drifts,
  // the exact-match lookups below fail loudly (fail()), so a bad insert can't
  // land silently; wire the entry by hand in that case.
  // Find the subgroup's `- title: <navTitle>` line, then its `items:` line,
  // and insert the new entry as the first child (matching that indentation).
  let titleIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === `- title: ${navTitle}`) {
      titleIdx = i;
      break;
    }
  }
  if (titleIdx === -1) {
    fail(`could not find CLI subgroup "- title: ${navTitle}" in navigation.yaml`);
  }
  let itemsIdx = -1;
  for (let i = titleIdx + 1; i < lines.length; i++) {
    if (lines[i].trim() === 'items:') {
      itemsIdx = i;
      break;
    }
    if (lines[i].trim().startsWith('- title:')) break; // next sibling — no items:
  }
  if (itemsIdx === -1) {
    fail(`could not find "items:" under "${navTitle}" in navigation.yaml`);
  }
  // Indentation of the first child = items: indent + 2 spaces, entries use
  // "- title:" at that depth. Derive from the existing next line if present.
  const itemsIndent = lines[itemsIdx].match(/^\s*/)[0];
  const childIndent = `${itemsIndent}  `;
  const entry = [`${childIndent}- title: ${name}`, `${childIndent}  slug: ${slug}`];
  lines.splice(itemsIdx + 1, 0, ...entry);
  fs.writeFileSync(NAV_PATH, lines.join('\n'));
  return { changed: true, note: `navigation.yaml: added ${slug} under "${navTitle}"` };
}

// --- main ------------------------------------------------------------------

function main() {
  const { name, group } = parseArgs(process.argv);
  if (!name || !group) {
    fail('usage: npm run cli-docs -- scaffold <name> --group <group-id>');
  }
  // Group ids come from groups.js (single source of truth); the nav-title map
  // must cover exactly them, or one was added without the other.
  const groupsSrc = fs.readFileSync(GROUPS_PATH, 'utf8');
  const validGroups = groupIdsFromSource(groupsSrc);
  const missingNavTitles = validGroups.filter((id) => !NAV_TITLE_BY_GROUP[id]);
  if (missingNavTitles.length) {
    fail(
      `groups.js defines group(s) with no navigation title: ${missingNavTitles.join(', ')}. ` +
        `Add them to NAV_TITLE_BY_GROUP in scaffold-command.js.`
    );
  }
  if (!validGroups.includes(group)) {
    fail(`unknown group "${group}". Valid groups: ${validGroups.join(', ')}`);
  }

  const schema = loadSchema();
  const node = schema.commands[name];
  if (!node) {
    fail(
      `command "${name}" is not in schema.json — regenerate the schema first ` +
        `(npm run cli-docs -- refresh, or cli-docs -- schema --src <path>)`
    );
  }

  // Scaffold assumes a standalone page at /docs/cli/<name>. A command listed in
  // HREF_OVERRIDES is documented inside another page's section instead, so a
  // generated page would be an orphan — bail and let the author wire it by hand.
  const hrefBlock = groupsSrc.match(/const HREF_OVERRIDES = \{([\s\S]*?)\}/);
  if (hrefBlock && new RegExp(`['"]?${name}['"]?\\s*:`).test(hrefBlock[1])) {
    fail(
      `command "${name}" has an HREF_OVERRIDES entry — it lives in another page's ` +
        `section, not a standalone page. Wire it by hand.`
    );
  }

  const results = [
    addGroupMapping(name, group),
    createDocPage(name, node),
    addNavEntry(name, group),
  ];

  console.log(`Scaffolded "${name}" (group: ${group}):\n`);
  for (const r of results) console.log(`  ${r.changed ? '✓' : '•'} ${r.note}`);
  console.log(
    `\nNext:\n` +
      `  1. Fill in the TODOs in content/docs/cli/${name}.md (subtitle, summary, prose, examples).\n` +
      `  2. Run: npm run cli-docs -- check`
  );
}

if (require.main === module) main();

module.exports = { addGroupMapping, createDocPage, addNavEntry, pageTemplate, NAV_TITLE_BY_GROUP };
