import { createRequire } from 'module';

import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);

const {
  renderOptionsForPath,
  renderOptions,
  renderUsage,
  renderSubcommands,
  renderCommandIndex,
  renderGlobalOptions,
  resolveCommand,
} = require('../generate-docs.js');
const schema = require('../schema.json');

// These renderers feed both the CLI reference MDX components and the llms
// .md mirror; the assertions here pin the shared output contract.
describe('generate-docs rendering', () => {
  it('resolves nested command paths', () => {
    expect(resolveCommand(schema, ['branches', 'create'])).toBeTruthy();
    expect(resolveCommand(schema, ['neon-auth', 'oauth-provider', 'add'])).toBeTruthy();
    expect(resolveCommand(schema, ['nope'])).toBeNull();
  });

  it('renders an options table with the five-column header and no hidden options', () => {
    const table = renderOptions(resolveCommand(schema, ['branches', 'create']));
    expect(table).toContain('| Option | Description | Type | Default | Required |');
    expect(table).toContain('`--name`');
  });

  it('Required is explicit Yes/No and missing defaults render as an em dash', () => {
    const table = renderOptions(resolveCommand(schema, ['databases', 'create']));
    expect(table).toContain('| Yes |');
    expect(table).toContain('| No |');
    expect(table).toContain('| — |');
    expect(table).not.toContain('&check;');
  });

  it('commands with no visible options render nothing', () => {
    expect(renderOptions(resolveCommand(schema, ['auth']))).toBe('');
    expect(renderOptionsForPath(schema, ['auth'])).toBe('');
  });

  it('leaf tables include options inherited from parent commands', () => {
    const table = renderOptionsForPath(schema, ['branches', 'delete']);
    expect(table).toContain('`--project-id`');
    const own = renderOptionsForPath(schema, ['branches', 'create']);
    expect(own).toContain('`--name`'); // own options still present
    expect(own).toContain('`--project-id`'); // plus inherited
  });

  it('subcommand anchors honor anchorParts on nested pages', () => {
    const node = resolveCommand(schema, ['neon-auth', 'oauth-provider']);
    expect(renderSubcommands(node, ['oauth-provider'])).toContain('[add](#oauth-provider-add)');
    expect(renderSubcommands(node)).toContain('[add](#add)');
  });

  it('renders usage with positional brackets and the neonctl binary', () => {
    expect(
      renderUsage(resolveCommand(schema, ['functions', 'deploy']), ['functions', 'deploy'])
    ).toContain('neonctl functions deploy <slug>');
    expect(
      renderUsage(resolveCommand(schema, ['connection-string']), ['connection-string'])
    ).toContain('neonctl connection-string [branch]');
  });

  it('renders the global options table with defaults, aliases, and builtins', () => {
    const table = renderGlobalOptions(schema);
    expect(table).toContain('`--output`, `-o`');
    expect(table).toContain('`table`');
    expect(table).toContain('`--version`');
    expect(table).not.toContain('--api-host'); // hidden globals excluded upstream
  });

  it('renders a command index covering every top-level command', () => {
    const index = renderCommandIndex(schema);
    for (const name of Object.keys(schema.commands)) {
      expect(index).toContain(`### ${name}`);
    }
    // Nested subtrees are flattened into full invocations.
    expect(index).toContain('neonctl bucket object list');
  });

  it('escapes MDX-hostile characters outside inline code in table cells', () => {
    const index = renderCommandIndex(schema);
    // branches restore's describe contains raw <source> placeholders.
    expect(index).toContain('\\<source>');
  });

  it('multiline descriptions collapse into single table rows', () => {
    const table = renderOptions(resolveCommand(schema, ['projects', 'create']));
    for (const line of table.split('\n')) {
      expect(line.startsWith('|')).toBe(true);
    }
  });
});
