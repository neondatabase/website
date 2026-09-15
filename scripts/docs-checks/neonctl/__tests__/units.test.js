import { createRequire } from 'module';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);
const {
  extract,
  tokenize,
  stripFrontmatter,
  joinBackslashContinuations,
  isLikelyCommand,
  buildTopLevelCommands,
} = require('../extract-examples.js');
const { parseCommandFile, enumerateConstEntries, inheritParentOptions } = require('../generate-schema.js');
const { loadSchema, resolvePath, resolveValidOptions } = require('../schema.js');

// Writes `source` to a temp .ts file and returns its path, for exercising the
// TypeScript-source parser without a full neonctl checkout.
function writeTempSource(source) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'neonctl-units-'));
  const file = path.join(dir, 'sample.ts');
  fs.writeFileSync(file, source);
  return file;
}

describe('tokenize', () => {
  it('splits on whitespace', () => {
    expect(tokenize('branches create --name foo')).toEqual(['branches', 'create', '--name', 'foo']);
  });

  it('splits --key=value into two tokens', () => {
    expect(tokenize('connection-string --role-name=alice')).toEqual([
      'connection-string',
      '--role-name',
      'alice',
    ]);
  });

  it('respects single and double quotes', () => {
    expect(tokenize('foo "a b" \'c d\' bar')).toEqual(['foo', 'a b', 'c d', 'bar']);
  });

  it('keeps placeholders intact', () => {
    expect(tokenize('branches create --project-id <project-id> --name ${NAME}')).toEqual([
      'branches',
      'create',
      '--project-id',
      '<project-id>',
      '--name',
      '${NAME}',
    ]);
  });

  it('preserves empty quoted string as a token', () => {
    expect(tokenize('foo ""')).toEqual(['foo', '']);
  });

  it('handles escaped characters', () => {
    expect(tokenize('foo bar\\ baz')).toEqual(['foo', 'bar baz']);
  });
});

describe('stripFrontmatter', () => {
  it('strips a leading YAML frontmatter block', () => {
    const { body, offset } = stripFrontmatter('---\ntitle: Foo\n---\nhello\n');
    expect(body).toBe('hello\n');
    expect(offset).toBe(3);
  });

  it('leaves content without frontmatter untouched', () => {
    const { body, offset } = stripFrontmatter('# Heading\nhello\n');
    expect(body).toBe('# Heading\nhello\n');
    expect(offset).toBe(0);
  });

  it('does nothing when the block is unterminated', () => {
    const input = '---\ntitle: Foo\nhello\n';
    const { body, offset } = stripFrontmatter(input);
    expect(body).toBe(input);
    expect(offset).toBe(0);
  });
});

describe('joinBackslashContinuations', () => {
  it('collapses continued lines and reports the start line', () => {
    const out = joinBackslashContinuations([
      'neon branches create \\',
      '  --name foo \\',
      '  --project-id bar',
      'plain line',
    ]);
    expect(out).toEqual([
      { text: 'neon branches create  --name foo --project-id bar', line: 0 },
      { text: 'plain line', line: 3 },
    ]);
  });

  it('passes through non-continued lines unchanged', () => {
    const out = joinBackslashContinuations(['a', 'b']);
    expect(out).toEqual([
      { text: 'a', line: 0 },
      { text: 'b', line: 1 },
    ]);
  });
});

describe('isLikelyCommand', () => {
  const topLevel = new Set(['branches', 'projects']);

  it('returns false for empty argv', () => {
    expect(isLikelyCommand([])).toBe(false);
  });

  it('accepts options as a first token', () => {
    expect(isLikelyCommand(['--help'])).toBe(true);
  });

  it('strict mode only accepts known top-level commands', () => {
    expect(isLikelyCommand(['branches'], { strict: true, topLevel })).toBe(true);
    expect(isLikelyCommand(['bananas'], { strict: true, topLevel })).toBe(false);
  });

  it('non-strict mode accepts any kebab-case token', () => {
    expect(isLikelyCommand(['bananas'])).toBe(true);
    expect(isLikelyCommand(['Nope'])).toBe(false);
  });
});

describe('buildTopLevelCommands', () => {
  it('includes every top-level command and its aliases', () => {
    const schema = {
      commands: {
        branches: { aliases: ['branch'] },
        projects: { aliases: [] },
      },
    };
    const set = buildTopLevelCommands(schema);
    expect(set.has('branches')).toBe(true);
    expect(set.has('branch')).toBe(true);
    expect(set.has('projects')).toBe(true);
    expect(set.has('completion')).toBe(true);
  });
});

describe('extract', () => {
  it('skips generated blog content by default', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'neonctl-extract-'));
    try {
      fs.mkdirSync(path.join(root, 'blog'), { recursive: true });
      fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
      fs.writeFileSync(path.join(root, 'blog', 'post.md'), '```bash\nneonctl projects list\n```\n');
      fs.writeFileSync(path.join(root, 'docs', 'page.md'), '```bash\nneonctl branches list\n```\n');

      const invocations = extract({ root });

      expect(invocations.map((invocation) => path.relative(root, invocation.file))).toEqual([
        path.join('docs', 'page.md'),
      ]);
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });

  it('can include blog content when ignore is explicitly disabled', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'neonctl-extract-'));
    try {
      fs.mkdirSync(path.join(root, 'blog'), { recursive: true });
      fs.writeFileSync(path.join(root, 'blog', 'post.md'), '```bash\nneonctl projects list\n```\n');

      const invocations = extract({ root, ignore: [] });

      expect(invocations.map((invocation) => path.relative(root, invocation.file))).toEqual([
        path.join('blog', 'post.md'),
      ]);
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });
});

describe('resolvePath', () => {
  const schema = loadSchema();

  it('resolves a top-level alias to the canonical command', () => {
    const r = resolvePath(schema, ['branch', 'create']);
    expect(r.path).toEqual(['branches', 'create']);
    expect(r.remaining).toEqual([]);
  });

  it('stops at the deepest matching subcommand', () => {
    const r = resolvePath(schema, ['branches', 'create', '--name', 'foo']);
    expect(r.path).toEqual(['branches', 'create']);
    expect(r.remaining).toEqual(['--name', 'foo']);
  });

  it('returns null node for an unknown top-level command', () => {
    const r = resolvePath(schema, ['bananas', 'create']);
    expect(r.node).toBeNull();
    expect(r.remaining).toEqual(['bananas', 'create']);
  });

  it('handles empty argv', () => {
    const r = resolvePath(schema, []);
    expect(r.node).toBeNull();
    expect(r.path).toEqual([]);
  });

  it('does not consume long positional ids as subcommands', () => {
    const r = resolvePath(schema, ['vpc', 'endpoint', 'remove', 'vpce-1234567890abcdef0']);
    expect(r.path).toEqual(['vpc', 'endpoint', 'remove']);
    expect(r.remaining).toEqual(['vpce-1234567890abcdef0']);
  });

  it('is prototype-pollution safe', () => {
    expect(resolvePath(schema, ['__proto__']).node).toBeNull();
    expect(resolvePath(schema, ['constructor']).node).toBeNull();
  });
});

describe('resolveValidOptions', () => {
  const schema = loadSchema();

  it('includes global options at every depth', () => {
    const opts = resolveValidOptions(schema, ['branches', 'create']);
    expect(opts.has('--output')).toBe(true);
    expect(opts.has('--api-key')).toBe(true);
    expect(opts.has('--help')).toBe(true);
  });

  it('registers short aliases with a single dash', () => {
    const opts = resolveValidOptions(schema, []);
    expect(opts.has('-o')).toBe(true);
    const entry = opts.get('-o');
    expect(entry.name).toBe('output');
  });

  it('exposes --no-<name> for boolean options', () => {
    const opts = resolveValidOptions(schema, []);
    const maybe = [...opts.keys()].find((k) => k.startsWith('--no-'));
    expect(typeof maybe).toBe('string');
  });
});

describe('parseCommandFile: builder passed as a bare identifier', () => {
  it('walks a builder function referenced by name (like inspect db)', () => {
    const file = writeTempSource(`
      import type yargs from "yargs";
      export const command = "inspect";
      export const describe = "Inspect things";
      const dbBuilder = (argv: yargs.Argv) =>
        argv
          .usage("$0 inspect db <sub-command> [options]")
          .options({
            "project-id": { describe: "Project ID", type: "string" },
            "db-url": { describe: "Connection string", type: "string" },
          });
      export const builder = (argv: yargs.Argv) =>
        argv.command("db", "Run a diagnostic query", dbBuilder);
    `);
    const parsed = parseCommandFile(file, new Map());
    expect(parsed.name).toBe('inspect');
    const db = parsed.commands.db;
    expect(db).toBeDefined();
    // Options and usage from the identifier-resolved builder are captured.
    expect(Object.keys(db.options).sort()).toEqual(['db-url', 'project-id']);
    expect(db.usage).toBe('$0 inspect db <sub-command> [options]');
  });
});

describe('parseCommandFile: getCliName() in describe templates', () => {
  it('resolves `${getCliName()}` to "neon" instead of dropping the describe', () => {
    const file = writeTempSource(`
      import type yargs from "yargs";
      import { getCliName } from "../utils/cli_name";
      export const command = "link";
      export const describe = "Link a project";
      export const builder = (argv: yargs.Argv) =>
        argv.options({
          branch: {
            type: "string",
            describe:
              "Branch to pin. " +
              \`Pin it with \\\`\${getCliName()} checkout <branch>\\\`.\`,
          },
          link: {
            type: "boolean",
            describe: \`Run \\\`\${getCliName()} link\\\` after installing.\`,
          },
        });
    `);
    const parsed = parseCommandFile(file, new Map());
    // Without getCliName() resolution these describes would be dropped
    // entirely (neon-pkgs #361 switched them to templates).
    expect(parsed.options.branch.describe).toBe(
      'Branch to pin. Pin it with `neon checkout <branch>`.'
    );
    expect(parsed.options.link.describe).toBe('Run `neon link` after installing.');
  });
});

describe('enumerateConstEntries', () => {
  it('reads keys and describe from a const object literal', () => {
    const file = writeTempSource(`
      export const INSPECT_QUERIES = {
        "table-sizes": { describe: "Size of each table", sql: "SELECT 1" },
        "index-sizes": { describe: "Size of each index", sql: "SELECT 2" },
      } as const;
    `);
    const entries = enumerateConstEntries(file, 'INSPECT_QUERIES', 'describe');
    expect(entries).toEqual([
      { name: 'table-sizes', describe: 'Size of each table' },
      { name: 'index-sizes', describe: 'Size of each index' },
    ]);
  });

  it('returns null when the const is missing (so callers fail loudly)', () => {
    const file = writeTempSource(`export const SOMETHING_ELSE = {};`);
    expect(enumerateConstEntries(file, 'INSPECT_QUERIES', 'describe')).toBeNull();
  });

  it('returns null when the source file does not exist', () => {
    expect(enumerateConstEntries('/no/such/file.ts', 'X', 'describe')).toBeNull();
  });
});

describe('inheritParentOptions', () => {
  it('backfills a subcommand option from the same-named parent option (like skills update yes)', () => {
    // Mirrors skills.ts: the parent command declares `yes` fully, and the
    // `update` subcommand re-declares it with only a describe.
    const file = writeTempSource(`
      import type yargs from "yargs";
      export const command = "skills";
      export const describe = "Install skills";
      export const builder = (argv: yargs.Argv) =>
        argv
          .command("update", "Update skills", (y: yargs.Argv) =>
            y.options({ yes: { describe: "Skip the confirm prompt" } })
          )
          .options({
            yes: { alias: "y", type: "boolean", default: false, describe: "Skip prompts" },
            agent: { alias: "a", type: "array", describe: "Coding agent" },
          });
    `);
    const parsed = parseCommandFile(file, new Map());
    // Before inheritance the subcommand has only its own describe, and the
    // parser can't infer the type from the bare spec, so it's the `unknown`
    // sentinel with no alias.
    expect(parsed.commands.update.options.yes).toEqual({
      describe: 'Skip the confirm prompt',
      type: 'unknown',
    });

    inheritParentOptions(parsed, {});

    const yes = parsed.commands.update.options.yes;
    // Own describe wins; alias, type, and default are inherited from the parent.
    expect(yes.describe).toBe('Skip the confirm prompt');
    expect(yes.alias).toBe('y');
    expect(yes.type).toBe('boolean');
    expect(yes.default).toBe(false);
    // A parent option the subcommand never declared must NOT leak onto it.
    expect(parsed.commands.update.options.agent).toBeUndefined();
  });

  it('treats a local type "unknown" as a gap and never shares object references', () => {
    const inherited = {
      fmt: { type: 'string', choices: ['a', 'b'], describe: 'Parent format' },
    };
    const node = {
      // `fmt` re-declared with its own describe but an unresolved (unknown) type
      // and no choices.
      options: { fmt: { describe: 'Output format', type: 'unknown' } },
      commands: {},
    };
    inheritParentOptions(node, inherited);
    const fmt = node.options.fmt;
    expect(fmt.describe).toBe('Output format'); // own field kept
    expect(fmt.type).toBe('string'); // unknown filled from parent
    expect(fmt.choices).toEqual(['a', 'b']); // array inherited
    // The inherited array must be cloned, not shared.
    expect(fmt.choices).not.toBe(inherited.fmt.choices);
    fmt.choices.push('c');
    expect(inherited.fmt.choices).toEqual(['a', 'b']);
  });

  it('does not inherit a parent `hidden` flag onto a re-declaring child', () => {
    const node = {
      options: { debug: { describe: 'Debug output' } },
      commands: {},
    };
    inheritParentOptions(node, {
      debug: { type: 'boolean', hidden: true, describe: 'Parent debug' },
    });
    const debug = node.options.debug;
    expect(debug.type).toBe('boolean'); // type still inherited
    expect(debug.describe).toBe('Debug output'); // own field wins
    expect('hidden' in debug).toBe(false); // hidden is never inherited
  });

  it('cascades through nested subcommands with the nearest ancestor winning', () => {
    // grandparent declares `fmt` fully; the mid subcommand re-declares it with
    // its own alias; the leaf re-declares only a describe.
    const grandparent = {
      options: { fmt: { type: 'string', alias: 'x', default: 'gp', describe: 'gp fmt' } },
      commands: {
        mid: {
          options: { fmt: { alias: 'm', describe: 'mid fmt' } },
          commands: {
            leaf: { options: { fmt: { describe: 'leaf fmt' } }, commands: {} },
          },
        },
      },
    };
    inheritParentOptions(grandparent, {});

    // mid keeps its own alias/describe, inherits type + default from grandparent.
    expect(grandparent.commands.mid.options.fmt).toEqual({
      alias: 'm',
      describe: 'mid fmt',
      type: 'string',
      default: 'gp',
    });
    // leaf keeps its own describe; alias comes from the nearest ancestor (mid's
    // 'm', not grandparent's 'x'); grandparent's default still flows through.
    const leaf = grandparent.commands.mid.commands.leaf.options.fmt;
    expect(leaf.describe).toBe('leaf fmt');
    expect(leaf.alias).toBe('m');
    expect(leaf.type).toBe('string');
    expect(leaf.default).toBe('gp');
  });
});
