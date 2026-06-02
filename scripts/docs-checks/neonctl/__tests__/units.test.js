import { createRequire } from 'module';

import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);
const {
  tokenize,
  stripFrontmatter,
  joinBackslashContinuations,
  isLikelyCommand,
  buildTopLevelCommands,
} = require('../extract-examples.js');
const { loadSchema, resolvePath, resolveValidOptions } = require('../schema.js');

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
