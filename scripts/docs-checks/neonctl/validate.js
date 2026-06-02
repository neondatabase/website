// Cross-references extracted neonctl invocations against the committed
// schema.json (generated from neonctl's TypeScript source by
// `generate-schema.js`) and reports:
//
//   - Missing commands:   path that neonctl doesn't recognize
//   - Unknown options:    --flag not present on the resolved command
//   - Bad choice values:  value not in the option's choices list
//
// Writes a Markdown report (default: ~/docs-reviews/neonctl-doc-validation.md)
// and exits non-zero on any error.

const fs = require('fs');
const os = require('os');
const path = require('path');

const { extract, DEFAULT_ROOT } = require('./extract-examples.js');
const { loadSchema, resolvePath, resolveValidOptions } = require('./schema.js');

function isPlaceholder(token) {
  if (!token) return false;
  if (/^<[^>]+>$/.test(token)) return true;
  if (/^\[[^\]]+\]$/.test(token)) return true;
  if (/^\$\{[^}]+\}$/.test(token)) return true;
  if (/^\$[A-Z_][A-Z0-9_]*$/.test(token)) return true;
  if (/^[A-Z][A-Z0-9_-]+$/.test(token)) return true;
  return false;
}

function validateInvocation(invocation, { schema }) {
  const errors = [];
  const { argv, file, line, raw } = invocation;

  // `completion` is emitted by yargs at runtime but not declared as a
  // regular subcommand in the source tree. Skip validation.
  if (argv[0] === 'completion') return errors;

  // Lone top-level flags (`neon --help`, `neon --version`).
  if (argv.length > 0 && argv[0].startsWith('-')) {
    const validForms = resolveValidOptions(schema, []);
    return checkOptions(argv, { validForms, cmdPath: [], file, line, raw });
  }

  const { node, path: cmdPath, remaining } = resolvePath(schema, argv);
  if (!node) {
    errors.push({
      kind: 'missing-command',
      file,
      line,
      raw,
      message: `Unknown neonctl command: \`${argv[0] || '(none)'}\``,
    });
    return errors;
  }

  const validForms = resolveValidOptions(schema, cmdPath);
  errors.push(...checkOptions(remaining, { validForms, cmdPath, file, line, raw }));
  return errors;
}

function checkOptions(tokens, { validForms, cmdPath, file, line, raw }) {
  const errors = [];
  const cmdDisplay = cmdPath.length ? `neonctl ${cmdPath.join(' ')}` : 'neonctl';
  for (let i = 0; i < tokens.length; i += 1) {
    const tok = tokens[i];
    if (tok === '--') break;
    if (!tok.startsWith('-')) continue;
    if (/^-\d/.test(tok)) continue; // Negative number value.
    const entry = validForms.get(tok);
    if (!entry) {
      errors.push({
        kind: 'unknown-option',
        file,
        line,
        raw,
        message: `Unknown option \`${tok}\` for \`${cmdDisplay}\``,
      });
      continue;
    }
    // Choice value check.
    const { spec } = entry;
    if (spec.choices && spec.type !== 'boolean') {
      const next = tokens[i + 1];
      if (next !== undefined && !next.startsWith('-')) {
        if (!isPlaceholder(next) && !spec.choices.includes(next)) {
          errors.push({
            kind: 'bad-choice',
            file,
            line,
            raw,
            message: `Value \`${next}\` for \`${tok}\` is not in {${spec.choices.join(', ')}} for \`${cmdDisplay}\``,
          });
        }
        i += 1;
      }
    }
  }
  return errors;
}

function validate({ root = DEFAULT_ROOT, schema } = {}) {
  const s = schema || loadSchema();
  const invocations = extract({ root });
  const errors = [];
  for (const inv of invocations) {
    errors.push(...validateInvocation(inv, { schema: s }));
  }
  return { invocations, errors, schema: s };
}

function formatReport({ invocations, errors, schema }) {
  const grouped = {
    'missing-command': [],
    'unknown-option': [],
    'bad-choice': [],
  };
  for (const err of errors) grouped[err.kind].push(err);

  const lines = [];
  lines.push('# neonctl docs validation report');
  lines.push('');
  lines.push(
    `Scanned \`${invocations.length}\` \`neonctl\`/\`neon\` invocations across \`content/docs/**/*.md\`.`
  );
  if (schema && schema.neonctlVersion) {
    lines.push('');
    lines.push(
      `Validated against \`neonctl ${schema.neonctlVersion}\` (from committed \`schema.json\`).`
    );
  }
  lines.push('');
  lines.push(
    `Errors: ${errors.length} (missing commands: ${grouped['missing-command'].length}, unknown options: ${grouped['unknown-option'].length}, bad choice values: ${grouped['bad-choice'].length})`
  );
  lines.push('');

  const sectionTitle = {
    'missing-command': 'Missing commands',
    'unknown-option': 'Unknown options',
    'bad-choice': 'Bad choice values',
  };

  for (const kind of ['missing-command', 'unknown-option', 'bad-choice']) {
    const bucket = grouped[kind];
    if (bucket.length === 0) continue;
    lines.push(`## ${sectionTitle[kind]}`);
    lines.push('');
    const byFile = new Map();
    for (const err of bucket) {
      if (!byFile.has(err.file)) byFile.set(err.file, []);
      byFile.get(err.file).push(err);
    }
    const sortedFiles = [...byFile.keys()].sort();
    for (const file of sortedFiles) {
      const rel = path.relative(process.cwd(), file);
      lines.push(`### \`${rel}\``);
      lines.push('');
      for (const err of byFile.get(file)) {
        lines.push(`- [L${err.line}](${rel}#L${err.line}) — ${err.message}`);
        lines.push(`  - \`${err.raw.trim()}\``);
      }
      lines.push('');
    }
  }

  if (errors.length === 0) {
    lines.push('All invocations validated successfully.');
    lines.push('');
  }
  return lines.join('\n');
}

function main() {
  const args = process.argv.slice(2);
  const opts = { out: null, root: DEFAULT_ROOT, quiet: false };
  for (let i = 0; i < args.length; i += 1) {
    const a = args[i];
    if (a === '--out') {
      opts.out = args[i + 1];
      i += 1;
    } else if (a === '--root') {
      opts.root = args[i + 1];
      i += 1;
    } else if (a === '--quiet') {
      opts.quiet = true;
    } else if (a === '--help' || a === '-h') {
      console.log(
        'Usage: node scripts/docs-checks/neonctl/validate.js [--root <dir>] [--out <file>] [--quiet]'
      );
      process.exit(0);
    }
  }

  const outPath = opts.out || path.join(os.homedir(), 'docs-reviews', 'neonctl-doc-validation.md');

  const result = validate({ root: opts.root });
  const report = formatReport(result);

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, report);

  if (!opts.quiet) {
    const { errors, invocations, schema } = result;
    console.log(
      `Checked ${invocations.length} invocations against neonctl ${schema.neonctlVersion}: ${errors.length} error${errors.length === 1 ? '' : 's'}.`
    );
    console.log(`Report: ${outPath}`);
    if (errors.length > 0) {
      for (const err of errors.slice(0, 15)) {
        const rel = path.relative(process.cwd(), err.file);
        console.log(`  ${rel}:${err.line}  ${err.message}`);
      }
      if (errors.length > 15) {
        console.log(`  … ${errors.length - 15} more (see report).`);
      }
    }
  }

  if (result.errors.length > 0) process.exit(1);
}

module.exports = {
  validate,
  validateInvocation,
  formatReport,
  isPlaceholder,
};

if (require.main === module) main();
