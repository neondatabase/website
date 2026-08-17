import { describe, it, expect } from 'vitest';

import {
  parseConfiguratorCategories,
  parseDocsTableCategories,
  describeDrift,
} from './check-mcp-categories-sync.mjs';

describe('parseConfiguratorCategories', () => {
  it('reads ids from the SCOPE_CATEGORIES literal in source order', () => {
    const source = [
      "const AUTH_MODES = [{ id: 'oauth', label: 'OAuth' }];",
      'const SCOPE_CATEGORIES = [',
      "  { id: 'projects', label: 'Projects', description: 'Create and manage projects' },",
      "  { id: 'observability', label: 'Observability', description: 'Query logs' },",
      "  { id: 'docs', label: 'Docs', description: 'Search and fetch docs' },",
      '];',
      'const SCOPE_IDS = SCOPE_CATEGORIES.map((scope) => scope.id);',
    ].join('\n');

    expect(parseConfiguratorCategories(source)).toEqual(['projects', 'observability', 'docs']);
  });

  it('throws when the array literal is gone (renamed or restructured)', () => {
    expect(() => parseConfiguratorCategories('const OTHER = [];')).toThrow(/SCOPE_CATEGORIES/);
  });
});

describe('parseDocsTableCategories', () => {
  const markdown = [
    '## Something else',
    '',
    '| Category | What |',
    '| --- | --- |',
    '| Not a real (`ignored`) | row before the heading |',
    '',
    '## Available tools',
    '',
    'Tools are grouped into categories.',
    '',
    '| Category | What it enables |',
    '| --- | --- |',
    '| Project management (`projects`) | List, create, describe projects |',
    '| Managed Better Auth (`neon_auth`) | Set up app authentication |',
    '| Observability (`observability`) | Query logs |',
    '',
    'Search and navigation tools are available by default.',
  ].join('\n');

  it('reads slugs from the Available tools table in row order', () => {
    expect(parseDocsTableCategories(markdown)).toEqual(['projects', 'neon_auth', 'observability']);
  });

  it('ignores tables that appear before the Available tools heading', () => {
    expect(parseDocsTableCategories(markdown)).not.toContain('ignored');
  });

  it('throws when the heading is missing', () => {
    expect(() => parseDocsTableCategories('# Nothing here')).toThrow(/Available tools/);
  });

  it('throws when the table has no backticked slugs', () => {
    const noSlugs = ['## Available tools', '', '| Category |', '| --- |', '| Projects |'].join(
      '\n'
    );
    expect(() => parseDocsTableCategories(noSlugs)).toThrow(/no `category` slugs/);
  });
});

describe('describeDrift', () => {
  const labels = { actualLabel: 'config generator', expectedLabel: 'MCP server' };

  it('returns null when both lists match exactly', () => {
    expect(describeDrift({ actual: ['a', 'b'], expected: ['a', 'b'], ...labels })).toBeNull();
  });

  it('reports a category the server has that the local list lacks', () => {
    const drift = describeDrift({
      actual: ['projects', 'docs'],
      expected: ['projects', 'observability', 'docs'],
      ...labels,
    });
    expect(drift).toContain('missing from config generator: observability');
  });

  it('reports a category the local list has that the server dropped', () => {
    const drift = describeDrift({
      actual: ['projects', 'performance'],
      expected: ['projects'],
      ...labels,
    });
    expect(drift).toContain('present in config generator but not MCP server: performance');
  });

  it('treats a reordered but otherwise equal list as drift', () => {
    const drift = describeDrift({ actual: ['b', 'a'], expected: ['a', 'b'], ...labels });
    expect(drift).toContain('same categories, different order');
  });
});
