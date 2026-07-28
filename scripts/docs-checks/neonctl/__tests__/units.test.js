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
const { parseCommandFile, enumerateConstEntries } = require('../generate-schema.js');
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
