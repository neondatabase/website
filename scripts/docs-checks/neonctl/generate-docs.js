// Markdown renderers for the Neon CLI reference, driven by `schema.json`
// (produced by generate-schema.js). Two consumers import these functions so
// the rendered content can never diverge:
//
//   - src/components/pages/doc/cli-reference — MDX server components
//     (<CliUsage/>, <CliOptions/>, <CliSubcommands/>, <CliGlobalOptions/>,
//     <CliCommandIndex/>) render them into doc pages at build time
//   - src/scripts/process-md-for-llms.js — expands the same components in
//     the agent-facing .md mirror
//
// Running this file directly (`npm run gen:docs:neonctl`) emits every
// fragment to fragments/ as a local preview of what the components render.
//
// The binary is documented as `neon`; `$0` in yargs usage strings is
// rendered as `neon`. (The package ships both `neon` and `neonctl` bins;
// docs standardize on `neon`.)

const fs = require('fs');
const path = require('path');

const SCHEMA_PATH = path.join(__dirname, 'schema.json');
const FRAGMENTS_DIR = path.join(__dirname, 'fragments');
const BINARY = 'neon';

function loadSchema() {
  return JSON.parse(fs.readFileSync(SCHEMA_PATH, 'utf8'));
}

// Resolves a space-separated command path ("branches create",
// "neon-auth oauth-provider add") to a schema node.
function resolveCommand(schema, parts) {
  let node = null;
  let pool = schema.commands;
  for (const part of parts) {
    node = pool && pool[part];
    if (!node) return null;
    pool = node.commands;
  }
  return node;
}

function escapeCell(text) {
  const flattened = String(text)
    .replace(/\s*\n\s*/g, ' ')
    .trim();
  // Escape `|` (table delimiter) and `<`/`{` (parsed as JSX/expressions by
  // MDX — describe strings contain placeholders like `<source>`), but never
  // inside inline-code spans, where backticks already protect them and a
  // backslash would render literally.
  return flattened
    .split(/(`[^`]*`)/)
    .map((segment, i) => (i % 2 === 1 ? segment : segment.replace(/[|<{]/g, '\\$&')))
    .join('');
}

function formatOptionName(name, spec) {
  const aliases = [];
  if (spec.alias) {
    for (const a of Array.isArray(spec.alias) ? spec.alias : [spec.alias]) {
      aliases.push(a.length === 1 ? `-${a}` : `--${a}`);
    }
  }
  return [`\`--${name}\``, ...aliases.map((a) => `\`${a}\``)].join(', ');
}

function formatDefault(spec) {
  if ('default' in spec) {
    if (Array.isArray(spec.default)) return `\`${spec.default.join(',')}\``;
    if (spec.default === '') return '`""`';
    return `\`${spec.default}\``;
  }
  if (spec.defaultText) return escapeCell(spec.defaultText);
  // An em dash reads as "no fixed default" — a blank cell reads as missing
  // data, to humans and to agents parsing the raw table.
  return '—';
}

function renderOptions(node) {
  const entries = Object.entries(node.options || {}).filter(([, spec]) => !spec.hidden);
  if (entries.length === 0) return '';
  const rows = entries.map(([name, spec]) => {
    let desc = spec.describe ? escapeCell(spec.describe) : '';
    if (spec.choices && desc && !/possible values|supported values/i.test(desc)) {
      desc += ` Possible values: ${spec.choices.map((c) => `\`${c}\``).join(', ')}`;
    } else if (spec.choices && !desc) {
      desc = `Possible values: ${spec.choices.map((c) => `\`${c}\``).join(', ')}`;
    }
    const type = spec.type && spec.type !== 'unknown' ? spec.type : '';
    // Explicit Yes/No: a blank or symbol cell is ambiguous when the table
    // is read as raw text.
    const required = spec.required ? 'Yes' : 'No';
    return `| ${formatOptionName(name, spec)} | ${desc} | ${type} | ${formatDefault(spec)} | ${required} |`;
  });
  return [
    '| Option | Description | Type | Default | Required |',
    '| ------ | ----------- | ---- | ------- | :------: |',
    ...rows,
  ].join('\n');
}

// Options table for a command path, including options inherited from
// parent commands (yargs passes parent .options() down to leaves; a table
// showing only a leaf's own options understates what it accepts —
// `branches delete` takes the parent's `--project-id`). Own options come
// first, then ancestors nearest-first; a leaf redefinition wins. Returns
// '' when nothing applies beyond the global options: the section then
// renders no table at all, and the synopsis without it is the signal.
function renderOptionsForPath(schema, parts) {
  const merged = {};
  const chain = [];
  let pool = schema.commands;
  for (const part of parts) {
    const node = pool && pool[part];
    if (!node) return '';
    chain.push(node);
    pool = node.commands;
  }
  for (const node of chain.reverse()) {
    for (const [name, spec] of Object.entries(node.options || {})) {
      if (!spec.hidden && !(name in merged)) merged[name] = spec;
    }
  }
  return renderOptions({ options: merged });
}

// Renders a positional as it appears in a synopsis: `<id>` required,
// `[branch]` optional, `[ips...]` variadic.
function formatPositional(pos) {
  const name = `${pos.name}${pos.variadic ? '...' : ''}`;
  return pos.required ? `<${name}>` : `[${name}]`;
}

function renderUsage(node, parts) {
  let usage;
  if (node.usage) {
    usage = node.usage.replace(/\$0/g, BINARY);
  } else {
    const positionals = (node.positionals || []).map(formatPositional).join(' ');
    const hasSubs = Object.keys(node.commands || {}).length > 0;
    usage = [BINARY, ...parts, hasSubs ? '<sub-command>' : positionals, '[options]']
      .filter(Boolean)
      .join(' ');
  }
  return ['```bash', usage, '```'].join('\n');
}

// `anchorParts` prefixes anchors for nested pages: on the neon-auth page,
// the oauth-provider group's `add` row must link to `#oauth-provider-add`,
// not `#add` (which a sibling group may also use).
function renderSubcommands(node, anchorParts = []) {
  const entries = Object.entries(node.commands || {});
  if (entries.length === 0) return '';
  const links = entries.map(([name]) => {
    const anchor = [...anchorParts, name]
      .join('-')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-');
    return `[${name}](#${anchor})`;
  });
  // One inline sentence, not a table: each linked section carries its own
  // description, so a Description column only duplicated them.
  return `Subcommands: ${links.join(', ')}`;
}

// The overview page's full command tree: one H3 per top-level command with
// aliases and description, plus a table of every subcommand. An agent that
// fetches this single section understands the entire CLI surface.
function renderCommandIndex(schema) {
  const blocks = [];
  for (const [name, cmd] of Object.entries(schema.commands)) {
    const aliasNote =
      cmd.aliases && cmd.aliases.length
        ? ` (alias: ${cmd.aliases.map((a) => `\`${a}\``).join(', ')})`
        : '';
    const lines = [`### ${name}${aliasNote}`, ''];
    if (cmd.describe) lines.push(`${cmd.describe}.`.replace(/\.\.$/, '.'), '');
    const flatten = (node, prefix) => {
      const rows = [];
      for (const [subName, sub] of Object.entries(node.commands || {})) {
        const invocation = [
          BINARY,
          ...prefix,
          subName,
          ...(sub.positionals || []).map(formatPositional),
        ].join(' ');
        if (Object.keys(sub.commands || {}).length > 0) {
          rows.push(...flatten(sub, [...prefix, subName]));
        } else {
          // Pipes in positionals (`<id|name>`) split GFM table cells even
          // inside code spans; escape them within the cell.
          const cell = `\`${invocation}\``.replace(/\|/g, '\\|');
          rows.push(`| ${cell} | ${sub.describe ? escapeCell(sub.describe) : ''} |`);
        }
      }
      return rows;
    };
    const rows = flatten(cmd, [name]);
    if (rows.length > 0) {
      lines.push('| Subcommand | Description |', '| ---------- | ----------- |', ...rows);
    } else {
      const invocation = [BINARY, name, ...(cmd.positionals || []).map(formatPositional)].join(' ');
      lines.push(`Usage: \`${invocation} [options]\``);
    }
    blocks.push(lines.join('\n'));
  }
  return blocks.join('\n\n');
}

function renderGlobalOptions(schema) {
  return renderOptions({ options: schema.globalOptions });
}

// Emits every possible fragment to FRAGMENTS_DIR for preview/design work,
// without touching content files.
function emitFragments(schema) {
  fs.rmSync(FRAGMENTS_DIR, { recursive: true, force: true });
  fs.mkdirSync(FRAGMENTS_DIR, { recursive: true });
  const emit = (name, body) => {
    if (body) fs.writeFileSync(path.join(FRAGMENTS_DIR, `${name}.md`), `${body}\n`);
  };
  emit('command-index', renderCommandIndex(schema));
  emit('global-options', renderGlobalOptions(schema));
  const walk = (commands, prefix) => {
    for (const [name, node] of Object.entries(commands)) {
      const parts = [...prefix, name];
      const slug = parts.join('-');
      const sections = [renderUsage(node, parts)];
      const subs = renderSubcommands(node);
      if (subs) sections.push(subs);
      const opts = renderOptions(node);
      if (opts) sections.push(opts);
      emit(slug, sections.join('\n\n'));
      walk(node.commands || {}, parts);
    }
  };
  walk(schema.commands, []);
  const count = fs.readdirSync(FRAGMENTS_DIR).length;
  console.log(`Wrote ${count} fragments to ${FRAGMENTS_DIR}`);
}

function main() {
  emitFragments(loadSchema());
}

module.exports = {
  renderOptionsForPath,
  renderOptions,
  renderUsage,
  renderSubcommands,
  renderCommandIndex,
  renderGlobalOptions,
  resolveCommand,
};

if (require.main === module) main();
