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
const {
  parseCommandFile,
  enumerateConstEntries,
  inheritParentOptions,
} = require('../generate-schema.js');
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

describe('parseCommandFile: array: true options', () => {
  it('normalizes `array: true` to type "array"', () => {
    const file = writeTempSource(`
      import type yargs from "yargs";
      export const command = "docs";
      export const describe = "Search the docs";
      export const builder = (argv: yargs.Argv) =>
        argv.options({
          category: { describe: "Category (repeatable)", type: "string", array: true },
          agent: { describe: "Agent (repeatable)", type: "array" },
        });
    `);
    const parsed = parseCommandFile(file, new Map());
    expect(parsed.options.category.type).toBe('array');
    expect(parsed.options.agent.type).toBe('array');
  });
});

describe('parseCommandFile: string and number literal consts', () => {
  it('resolves describes, defaults, and examples held in module-level consts', () => {
    const file = writeTempSource(`
      import type yargs from "yargs";
      const MAX_LIMIT = 40;
      const DEFAULT_LIMIT = 10;
      const SEARCH_DESCRIBE = "Search neon.com";
      export const command = "docs";
      export const describe = "Search the docs";
      export const builder = (argv: yargs.Argv) =>
        argv.command("search <query>", SEARCH_DESCRIBE, (yargs) =>
          yargs
            .options({
              limit: {
                describe: \`Maximum number of results (1-\${MAX_LIMIT})\`,
                type: "number",
                default: DEFAULT_LIMIT,
              },
            })
            .example('$0 docs search "reset a branch"', SEARCH_DESCRIBE),
        );
    `);
    const parsed = parseCommandFile(file, new Map());
    const search = parsed.commands.search;
    // Without literal-const pooling the describe is dropped, the default
    // leaks as the raw identifier (defaultText: "DEFAULT_LIMIT"), and the
    // example description comes out empty.
    expect(search.describe).toBe('Search neon.com');
    expect(search.options.limit.describe).toBe('Maximum number of results (1-40)');
    expect(search.options.limit.default).toBe(10);
    expect(search.options.limit.defaultText).toBeUndefined();
    expect(search.examples[0].description).toBe('Search neon.com');
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

describe('parseCommandFile: enum-member arrays and template-literal consts', () => {
  it('resolves choices and describes built from Enum.Member arrays', () => {
    // neon_auth.ts at neon 8.14.0: arrays of NeonAuthOauthProviderId members,
    // joined into describes, one of them through a template-literal const.
    // In source the enum lives in utils/api_enums.ts, which buildSchema pools.
    const file = writeTempSource(`
      import type yargs from "yargs";
      const ProviderId = { Google: "google", Apple: "apple" } as const;
      const SUPPORTED = [ProviderId.Google, ProviderId.Apple] as const;
      const NO_SHARED = [ProviderId.Apple] as const;
      const NOTE = \`\${NO_SHARED.join(" and ")} always need your own credentials\`;
      export const command = "auth";
      export const describe = "Manage auth";
      export const builder = (argv: yargs.Argv) =>
        argv.command("provider", \`Manage providers (\${SUPPORTED.join(", ")})\`, (yargs) =>
          yargs.command("add", "Add a provider", (yargs) =>
            yargs.options({
              "provider-id": { describe: "Provider ID", type: "string", choices: SUPPORTED },
              "client-id": { describe: \`Client ID; \${NOTE}.\`, type: "string" },
            }),
          ),
        );
    `);
    const parsed = parseCommandFile(file, new Map());
    const provider = parsed.commands.provider;
    // Without enum-member resolution all three are dropped silently.
    expect(provider.describe).toBe('Manage providers (google, apple)');
    expect(provider.commands.add.options['provider-id'].choices).toEqual(['google', 'apple']);
    expect(provider.commands.add.options['client-id'].describe).toBe(
      'Client ID; apple always need your own credentials.'
    );
  });
});

describe('parseCommandFile: curried builderFor(usage) builders', () => {
  // neon-pkgs #1022 changed databases, roles, psql, connection-string, and
  // computes to export `builderFor(usage)` so postgres.ts can re-mount them.
  const ROLES_SOURCE = `
    import type yargs from "yargs";
    export const command = "roles";
    export const aliases = ["role"];
    export const describe = "Manage roles";
    export const builderFor = (usage: string) => (argv: yargs.Argv) =>
      argv
        .usage(\`$0 \${usage} <sub-command> [options]\`)
        .options({ "project-id": { describe: "Project ID", type: "string" } })
        .command("list", "List roles", (yargs) => yargs, () => {});
    export const builder = builderFor("roles");
  `;

  it('walks the inner builder with usage bound to the argument', () => {
    const parsed = parseCommandFile(writeTempSource(ROLES_SOURCE), new Map());
    expect(parsed.usage).toBe('$0 roles <sub-command> [options]');
    expect(Object.keys(parsed.options)).toEqual(['project-id']);
    expect(Object.keys(parsed.commands)).toEqual(['list']);
  });

  it('resolves a namespace-imported module mounted with .command(nested(x))', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'neonctl-units-'));
    fs.writeFileSync(path.join(dir, 'roles.ts'), ROLES_SOURCE);
    const group = path.join(dir, 'postgres.ts');
    fs.writeFileSync(
      group,
      `
      import type yargs from "yargs";
      import * as roles from "./roles.js";
      const nested = (group) => ({
        command: group.command,
        builder: group.builderFor(\`postgres \${group.command.split(" ")[0]}\`),
      });
      export const command = "postgres";
      export const aliases = ["pg"];
      export const describe = "Manage Postgres";
      export const builder = (argv: yargs.Argv) =>
        argv.usage("$0 postgres <sub-command> [options]").command(nested(roles));
    `
    );
    const parsed = parseCommandFile(group, new Map());
    const nestedRoles = parsed.commands.roles;
    expect(nestedRoles).toBeDefined();
    expect(nestedRoles.aliases).toEqual(['role']);
    expect(nestedRoles.describe).toBe('Manage roles');
    expect(nestedRoles.usage).toBe('$0 postgres roles <sub-command> [options]');
    expect(Object.keys(nestedRoles.commands)).toEqual(['list']);
  });

  it('resolves a module mounted with .command(x.command, x.describe, x.builder)', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'neonctl-units-'));
    fs.writeFileSync(
      path.join(dir, 'loki.ts'),
      `
      import type yargs from "yargs";
      export const command = "loki [query]";
      export const describe = "Call the Loki read API";
      export const builder = (argv: yargs.Argv) =>
        argv
          .usage("$0 logs loki [query] [options]")
          .positional("query", { describe: "LogQL expression", type: "string" })
          .options({ since: { describe: "Lookback window", type: "string" } });
    `
    );
    const group = path.join(dir, 'logs.ts');
    fs.writeFileSync(
      group,
      `
      import type yargs from "yargs";
      import * as loki from "./loki.js";
      export const command = "logs";
      export const describe = "Query branch logs";
      export const builder = (argv: yargs.Argv) =>
        argv
          .usage("$0 logs <sub-command> [options]")
          .command("fields", "List log fields", (y) => y)
          .command(loki.command, loki.describe, loki.builder, (args) => loki.handler(args));
    `
    );
    const parsed = parseCommandFile(group, new Map());
    expect(Object.keys(parsed.commands)).toEqual(['fields', 'loki']);
    const sub = parsed.commands.loki;
    expect(sub.describe).toBe('Call the Loki read API');
    expect(sub.usage).toBe('$0 logs loki [query] [options]');
    expect(sub.positionals.map((p) => [p.name, p.describe])).toEqual([
      ['query', 'LogQL expression'],
    ]);
    expect(Object.keys(sub.options)).toEqual(['since']);
  });

  it('follows a builder imported by name into its own file', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'neonctl-units-'));
    fs.writeFileSync(
      path.join(dir, 'subscribe.ts'),
      `
      import type yargs from "yargs";
      const LABEL = "Show raw rows and changes events";
      export const builder = (argv: yargs.Argv) =>
        argv
          .usage('$0 realtime subscribe "<query>" [options]')
          .positional("query", { describe: "SELECT query to subscribe to", type: "string" })
          .options({
            changes: { describe: LABEL, type: "boolean", default: false },
            debug: { describe: "Show full database error details", type: "boolean", default: false },
          })
          .example('$0 realtime subscribe "SELECT 1"', "Subscribe");
    `
    );
    const group = path.join(dir, 'realtime.ts');
    fs.writeFileSync(
      group,
      `
      import type yargs from "yargs";
      import { builder as subscribeBuilder, handler as subscribeHandler } from "./subscribe.js";
      export const command = "realtime";
      export const describe = "Manage Neon Realtime";
      export const builder = (argv: yargs.Argv) =>
        argv
          .usage("$0 realtime <sub-command> [options]")
          .command("subscribe <query>", "Subscribe to a live query", subscribeBuilder, subscribeHandler);
    `
    );
    const sub = parseCommandFile(group, new Map()).commands.subscribe;
    expect(sub.describe).toBe('Subscribe to a live query');
    expect(sub.usage).toBe('$0 realtime subscribe "<query>" [options]');
    expect(sub.positionals.map((p) => [p.name, p.describe])).toEqual([
      ['query', 'SELECT query to subscribe to'],
    ]);
    expect(Object.keys(sub.options)).toEqual(['changes', 'debug']);
    expect(sub.options.changes.describe).toBe('Show raw rows and changes events');
    expect(sub.examples).toEqual([
      { command: '$0 realtime subscribe "SELECT 1"', description: 'Subscribe' },
    ]);
  });
});

describe('parseCommandFile: modules that mount each other', () => {
  it('stops instead of recursing forever', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'neonctl-units-'));
    const mod = (name, other) => `
      import type yargs from "yargs";
      import * as other from "./${other}.js";
      export const command = "${name}";
      export const describe = "${name}";
      export const builder = (argv: yargs.Argv) => argv.command(other);
    `;
    fs.writeFileSync(path.join(dir, 'a.ts'), mod('a', 'b'));
    fs.writeFileSync(path.join(dir, 'b.ts'), mod('b', 'a'));
    const parsed = parseCommandFile(path.join(dir, 'a.ts'), new Map());
    expect(Object.keys(parsed.commands)).toEqual(['b']);
    expect(parsed.commands.b.commands).toEqual({});
  });
});

describe('parseCommandFile: shorthand describe from an option factory', () => {
  it('resolves `{ describe }` bound to the factory argument', () => {
    const file = writeTempSource(`
      import type yargs from "yargs";
      const roleOption = (describe: string) =>
        ({ role: { describe, type: "string", choices: ["admin", "member"] } }) as const;
      export const command = "orgs";
      export const describe = "Manage organizations";
      export const builder = (argv: yargs.Argv) =>
        argv.command("update", "Change a role", (yargs) =>
          yargs.options(roleOption("The new organization role"))
        );
    `);
    const parsed = parseCommandFile(file, new Map());
    const role = parsed.commands.update.options.role;
    expect(role.describe).toBe('The new organization role');
    expect(role.choices).toEqual(['admin', 'member']);
  });

  it("doesn't take the module's own describe for an unbound shorthand", () => {
    const file = writeTempSource(`
      import type yargs from "yargs";
      export const command = "orgs";
      export const describe = "Manage organizations";
      export const builder = (argv: yargs.Argv) =>
        argv.command("update", "Change a role", (yargs) =>
          yargs.options({ role: { describe, type: "string" } })
        );
    `);
    const parsed = parseCommandFile(file, new Map());
    expect(parsed.commands.update.options.role.describe).toBeUndefined();
  });
});
