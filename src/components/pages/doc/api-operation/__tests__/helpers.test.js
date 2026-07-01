import { describe, it, expect } from 'vitest';

import {
  setPath,
  buildSmartJson,
  findBodyProp,
  formatParamsArg,
  splitMcpContent,
  parseMcpDescription,
  addWithAncestors,
  getLeafPaths,
  bareIdPaths,
  effectiveGlobalForLeaf,
  isCrossPageGlobal,
} from '../operation-client';

// These tests cover the pure helpers extracted from operation-client.jsx so the
// module split has a safety net. Inputs are intentionally
// representative of real spec/UI shapes — MCP fixtures are copied from
// scripts/data/mcp-tool-definitions.json so upstream-shape regressions trip
// the parser tests, not just our own typos.

// ── setPath ─────────────────────────────────────────────────────────────────

describe('setPath', () => {
  it('sets a top-level string value', () => {
    const o = {};
    setPath(o, 'name', 'foo');
    expect(o).toEqual({ name: 'foo' });
  });

  it('creates intermediate objects for dot paths', () => {
    const o = {};
    setPath(o, 'project.settings.region', 'us-east-2');
    expect(o).toEqual({ project: { settings: { region: 'us-east-2' } } });
  });

  it('coerces "true"/"false" strings to booleans', () => {
    const o = {};
    setPath(o, 'enabled', 'true');
    setPath(o, 'disabled', 'false');
    expect(o.enabled).toBe(true);
    expect(o.disabled).toBe(false);
  });

  it('coerces numeric strings to numbers', () => {
    const o = {};
    setPath(o, 'max', '42');
    setPath(o, 'ratio', '3.14');
    expect(o.max).toBe(42);
    expect(o.ratio).toBe(3.14);
  });

  it('preserves non-numeric, non-boolean strings as strings', () => {
    const o = {};
    setPath(o, 'name', 'rough-scene-12345678');
    expect(o.name).toBe('rough-scene-12345678');
  });

  it('preserves whitespace-only strings as strings (not zero)', () => {
    const o = {};
    setPath(o, 'note', '   ');
    expect(o.note).toBe('   ');
  });

  it('rejects __proto__ in path (prototype pollution guard)', () => {
    const o = {};
    setPath(o, '__proto__.polluted', 'yes');
    expect({}.polluted).toBeUndefined();
    expect(o).toEqual({});
  });

  it('rejects constructor in path', () => {
    const o = {};
    setPath(o, 'constructor.prototype.polluted', 'yes');
    expect({}.polluted).toBeUndefined();
  });

  it('rejects prototype in path', () => {
    const o = {};
    setPath(o, 'foo.prototype.polluted', 'yes');
    expect(o).toEqual({});
  });
});

// ── buildSmartJson ──────────────────────────────────────────────────────────

describe('buildSmartJson', () => {
  it('includes only required fields when no edits and no manual includes', () => {
    const tree = [
      { key: 'name', type: 'string', required: true, value: 'my-project' },
      { key: 'region', type: 'string', required: false, value: 'us-east-2' },
    ];
    expect(buildSmartJson(tree, {}, new Set())).toEqual({ name: 'my-project' });
  });

  it('includes manually-included optional fields with their schema value', () => {
    const tree = [
      { key: 'name', type: 'string', required: true, value: 'foo' },
      { key: 'region', type: 'string', required: false, value: 'us-east-2' },
    ];
    expect(buildSmartJson(tree, {}, new Set(['region']))).toEqual({
      name: 'foo',
      region: 'us-east-2',
    });
  });

  it('uses edited value when present, overriding schema default', () => {
    const tree = [{ key: 'name', type: 'string', required: true, value: 'default' }];
    expect(buildSmartJson(tree, { name: 'edited-value' }, new Set())).toEqual({
      name: 'edited-value',
    });
  });

  it('recurses into children for nested required objects', () => {
    const tree = [
      {
        key: 'project',
        required: true,
        children: [
          { key: 'name', type: 'string', required: true, value: 'my-project' },
          { key: 'region', type: 'string', required: false, value: 'us-east-2' },
        ],
      },
    ];
    expect(buildSmartJson(tree, {}, new Set())).toEqual({ project: { name: 'my-project' } });
  });

  it('emits null for an included field with no schema value', () => {
    const tree = [{ key: 'note', type: 'string', required: false }];
    expect(buildSmartJson(tree, {}, new Set(['note']))).toEqual({ note: null });
  });

  it('emits an edited nested value at the right path', () => {
    const tree = [
      {
        key: 'project',
        required: true,
        children: [{ key: 'name', type: 'string', required: true, value: 'default' }],
      },
    ];
    expect(buildSmartJson(tree, { 'project.name': 'edited' }, new Set())).toEqual({
      project: { name: 'edited' },
    });
  });

  it('skips a parent group when only the ancestor is included but no descendant is', () => {
    // The walk only recurses if the *parent* node is required/included/edited;
    // a parent marked included with all-optional children produces an empty object
    // (no leaf write).
    const tree = [
      {
        key: 'meta',
        required: false,
        children: [{ key: 'note', type: 'string', required: false }],
      },
    ];
    expect(buildSmartJson(tree, {}, new Set(['meta']))).toEqual({});
  });
});

// ── findBodyProp ────────────────────────────────────────────────────────────

describe('findBodyProp', () => {
  it('finds a top-level property', () => {
    const props = { name: { type: 'string' }, region: { type: 'string' } };
    expect(findBodyProp(props, 'name')).toEqual({ type: 'string' });
  });

  it('finds a nested property via DFS', () => {
    const props = {
      project: {
        type: 'object',
        properties: {
          settings: {
            type: 'object',
            properties: { region: { type: 'string', description: 'AWS region' } },
          },
        },
      },
    };
    expect(findBodyProp(props, 'region')).toEqual({
      type: 'string',
      description: 'AWS region',
    });
  });

  it('returns null when not found', () => {
    expect(findBodyProp({ foo: { type: 'string' } }, 'bar')).toBeNull();
  });

  it('returns null for null/undefined properties', () => {
    expect(findBodyProp(null, 'x')).toBeNull();
    expect(findBodyProp(undefined, 'x')).toBeNull();
  });

  it('returns the first match (top-level wins over nested with same name)', () => {
    const props = {
      name: { type: 'string', description: 'top-level' },
      project: {
        properties: { name: { type: 'string', description: 'nested' } },
      },
    };
    expect(findBodyProp(props, 'name').description).toBe('top-level');
  });
});

// ── formatParamsArg ─────────────────────────────────────────────────────────

describe('formatParamsArg', () => {
  it('returns {} for empty params', () => {
    expect(formatParamsArg({})).toBe('{}');
  });

  it('JSON-stringifies literal values', () => {
    expect(formatParamsArg({ name: 'foo', limit: 10 })).toBe('{ name: "foo", limit: 10 }');
  });

  it('emits process.env references unquoted', () => {
    expect(formatParamsArg({ project_id: 'process.env.PROJECT_ID' })).toBe(
      '{ project_id: process.env.PROJECT_ID }'
    );
  });

  it('mixes env refs and literals in one call', () => {
    expect(formatParamsArg({ project_id: 'process.env.PROJECT_ID', limit: 5 })).toBe(
      '{ project_id: process.env.PROJECT_ID, limit: 5 }'
    );
  });
});

// ── splitMcpContent ─────────────────────────────────────────────────────────

describe('splitMcpContent', () => {
  it('returns [] for empty input', () => {
    expect(splitMcpContent('')).toEqual([]);
    expect(splitMcpContent('   ')).toEqual([]);
  });

  it('returns a single para for prose with no markers', () => {
    expect(splitMcpContent('Plain prose with no markers.')).toEqual([
      { type: 'para', text: 'Plain prose with no markers.' },
    ]);
  });

  it('parses numbered items from real prepare_database_migration <workflow>', () => {
    // Real fixture: <workflow> block from prepare_database_migration in
    // scripts/data/mcp-tool-definitions.json.
    const real =
      '1. Creates a temporary branch 2. Applies the migration SQL in that branch 3. Returns migration details for verification';
    const items = splitMcpContent(real);
    expect(items).toEqual([
      { type: 'numbered', n: 1, text: 'Creates a temporary branch' },
      { type: 'numbered', n: 2, text: 'Applies the migration SQL in that branch' },
      { type: 'numbered', n: 3, text: 'Returns migration details for verification' },
    ]);
  });

  it('parses dash-prefixed bullets', () => {
    expect(splitMcpContent('- First item - Second item - Third item')).toEqual([
      { type: 'bullet', text: 'First item' },
      { type: 'bullet', text: 'Second item' },
      { type: 'bullet', text: 'Third item' },
    ]);
  });

  it('treats "para - bullet - bullet" as paragraph followed by bullets', () => {
    expect(splitMcpContent('Intro text - first - second')).toEqual([
      { type: 'para', text: 'Intro text' },
      { type: 'bullet', text: 'first' },
      { type: 'bullet', text: 'second' },
    ]);
  });

  it('attaches sub-bullets to a numbered parent', () => {
    expect(splitMcpContent('1. Parent - child a - child b')).toEqual([
      { type: 'numbered', n: 1, text: 'Parent' },
      { type: 'sub', text: 'child a' },
      { type: 'sub', text: 'child b' },
    ]);
  });

  it('ignores out-of-range numeric markers', () => {
    // 99. shouldn't be interpreted as a list marker (n > 20 filter)
    expect(splitMcpContent('Status code 99. is invalid')).toEqual([
      { type: 'para', text: 'Status code 99. is invalid' },
    ]);
  });
});

// ── parseMcpDescription ─────────────────────────────────────────────────────

describe('parseMcpDescription', () => {
  it('returns null for empty/falsy input', () => {
    expect(parseMcpDescription('')).toBeNull();
    expect(parseMcpDescription(null)).toBeNull();
    expect(parseMcpDescription(undefined)).toBeNull();
  });

  it('returns null when no XML-like outer tags exist (caller falls back to plain text)', () => {
    expect(parseMcpDescription('Just plain prose with no tags.')).toBeNull();
  });

  it('parses a single block with known label', () => {
    const segments = parseMcpDescription('<workflow> 1. Step one 2. Step two </workflow>');
    expect(segments).toEqual([
      {
        type: 'block',
        tag: 'workflow',
        label: 'Workflow',
        items: [
          { type: 'numbered', n: 1, text: 'Step one' },
          { type: 'numbered', n: 2, text: 'Step two' },
        ],
        code: null,
      },
    ]);
  });

  it('uses the configured label for known tags', () => {
    const segments = parseMcpDescription('<use_case> some text </use_case>');
    expect(segments).toHaveLength(1);
    expect(segments[0].tag).toBe('use_case');
    expect(segments[0].label).toBe('Use case');
  });

  it('falls back to capitalized tag name for unknown tags', () => {
    const segments = parseMcpDescription('<future_feature> text </future_feature>');
    expect(segments).toHaveLength(1);
    expect(segments[0].tag).toBe('future_feature');
    expect(segments[0].label).toBe('Future feature');
  });

  it('extracts <example> as a separate code block, removing it from items', () => {
    const segments = parseMcpDescription(
      '<workflow> Do this <example> SELECT 1; </example> then that </workflow>'
    );
    expect(segments[0].code).toBe('SELECT 1;');
    expect(segments[0].items.map((i) => i.text).join(' ')).not.toContain('SELECT 1');
  });

  it('handles multiple sequential blocks (real prepare_database_migration shape)', () => {
    // Trimmed version of real upstream description: <use_case> + <workflow> + <important_notes>.
    const real =
      '<use_case> Performs DB migrations. </use_case> <workflow> 1. Creates a temporary branch 2. Applies the migration SQL in that branch </workflow> <important_notes> After executing, you MUST test changes first. </important_notes>';
    const segments = parseMcpDescription(real);
    expect(segments).toHaveLength(3);
    expect(segments.map((s) => s.tag)).toEqual(['use_case', 'workflow', 'important_notes']);
    expect(segments[1].label).toBe('Workflow');
    expect(segments[2].label).toBe('Notes');
  });

  it('surfaces inter-block text as type: "text" segments', () => {
    const segments = parseMcpDescription('preamble <workflow> step </workflow> trailing prose');
    expect(segments[0]).toEqual({ type: 'text', content: 'preamble' });
    expect(segments[2]).toEqual({ type: 'text', content: 'trailing prose' });
  });
});

// ── addWithAncestors ────────────────────────────────────────────────────────

describe('addWithAncestors', () => {
  it('adds the leaf and every ancestor in dot-path order', () => {
    const s = new Set();
    addWithAncestors(s, 'project.settings.region');
    expect([...s]).toEqual(['project', 'project.settings', 'project.settings.region']);
  });

  it('handles a top-level path (only itself)', () => {
    const s = new Set();
    addWithAncestors(s, 'name');
    expect([...s]).toEqual(['name']);
  });

  it('preserves existing entries (idempotent)', () => {
    const s = new Set(['existing']);
    addWithAncestors(s, 'project.name');
    expect(s.has('existing')).toBe(true);
    expect(s.has('project')).toBe(true);
    expect(s.has('project.name')).toBe(true);
  });
});

// ── getLeafPaths ────────────────────────────────────────────────────────────

describe('getLeafPaths', () => {
  it('returns top-level leaf keys', () => {
    const tree = [{ key: 'name' }, { key: 'region' }];
    expect(getLeafPaths(tree)).toEqual(['name', 'region']);
  });

  it('descends into children and returns nested leaf paths', () => {
    const tree = [
      {
        key: 'project',
        children: [{ key: 'name' }, { key: 'settings', children: [{ key: 'region' }] }],
      },
    ];
    expect(getLeafPaths(tree)).toEqual(['project.name', 'project.settings.region']);
  });

  it('returns the parent itself when children is empty (treated as leaf)', () => {
    expect(getLeafPaths([{ key: 'opaque', children: [] }])).toEqual(['opaque']);
  });
});

// ── Cross-page session-identity globals ─────────────────────────────────────

describe('isCrossPageGlobal', () => {
  it('returns true for known cross-page IDs', () => {
    for (const name of ['project_id', 'org_id', 'branch_id', 'database_name']) {
      expect(isCrossPageGlobal(name)).toBe(true);
    }
  });

  it('returns false for unrelated names', () => {
    for (const name of ['limit', 'cursor', 'foo', 'bar']) {
      expect(isCrossPageGlobal(name)).toBe(false);
    }
  });

  it('the derived cross-page set includes the resource IDs we expect to roam', () => {
    // Generator derives the list from the live spec at generate-api-ref
    // time (see deriveCrossPageParams() in scripts/generate-api-ref.mjs).
    // This is a regression check: if the spec drops one of these IDs (or
    // the derivation rule changes) the test fails loudly so the resulting
    // cross-page UX gap doesn't slip in unnoticed.
    const mustBeCrossPage = [
      'project_id',
      'org_id',
      'branch_id',
      'endpoint_id',
      'role_name',
      'database_name',
      'vpc_endpoint_id',
      'snapshot_id',
      'region_id',
    ];
    for (const name of mustBeCrossPage) {
      expect(isCrossPageGlobal(name), `${name} must be cross-page`).toBe(true);
    }
  });
});

describe('bareIdPaths', () => {
  it('returns leaf paths whose final segment is exactly "id"', () => {
    const tree = [
      { key: 'id' },
      { key: 'project', children: [{ key: 'id' }, { key: 'name' }] },
      { key: 'project_id' }, // not bare 'id'
    ];
    expect(bareIdPaths(tree)).toEqual(['id', 'project.id']);
  });

  it('returns [] when no bare id leaves exist', () => {
    const tree = [{ key: 'name' }, { key: 'org_id' }];
    expect(bareIdPaths(tree)).toEqual([]);
  });
});

describe('effectiveGlobalForLeaf', () => {
  const bodyGlobals = [
    { path: 'project.org_id', global: 'org_id' },
    { path: 'project.region_id', global: 'region_id' },
  ];

  it('matches a bodyGlobals entry exactly by path', () => {
    expect(effectiveGlobalForLeaf('org_id', 'project.org_id', bodyGlobals, null)).toBe('org_id');
    expect(effectiveGlobalForLeaf('region_id', 'project.region_id', bodyGlobals, null)).toBe(
      'region_id'
    );
  });

  it('resolves bare `id` via idMeaning when leaf name === "id"', () => {
    expect(effectiveGlobalForLeaf('id', 'branch.id', null, 'branch_id')).toBe('branch_id');
  });

  it('rejects bare `id` when no idMeaning is set', () => {
    expect(effectiveGlobalForLeaf('id', 'branch.id', null, null)).toBeNull();
  });

  it('rejects non-id leaves even if idMeaning is set', () => {
    expect(effectiveGlobalForLeaf('name', 'branch.name', null, 'branch_id')).toBeNull();
  });

  it('honors the array carveout (paths with [] never unify)', () => {
    expect(
      effectiveGlobalForLeaf('project_id', 'branches[].project_id', bodyGlobals, null)
    ).toBeNull();
    expect(effectiveGlobalForLeaf('id', 'items[].id', null, 'branch_id')).toBeNull();
  });

  it('returns null when no match', () => {
    expect(effectiveGlobalForLeaf('name', 'project.name', bodyGlobals, null)).toBeNull();
  });
});

describe('buildSmartJson with session-identity globals', () => {
  const bodyTree = [
    {
      key: 'project',
      required: true,
      children: [
        { key: 'name', type: 'string', required: true, value: 'my-project' },
        { key: 'org_id', type: 'string', required: false },
      ],
    },
  ];
  const bodyGlobals = [{ path: 'project.org_id', global: 'org_id' }];

  // Real-world Neon resource IDs are non-numeric strings (e.g. `org-rough-
  // scene-12345678`) so test values match. setPath coerces numeric-looking
  // strings to numbers per the JSON-builder contract.
  it('uses paramStore value when leaf has a global mapping', () => {
    const out = buildSmartJson(bodyTree, {}, new Set(), { org_id: 'org-abc' }, bodyGlobals, null);
    expect(out).toEqual({ project: { name: 'my-project', org_id: 'org-abc' } });
  });

  it('falls through to per-op edit for non-globals', () => {
    const out = buildSmartJson(
      bodyTree,
      { 'project.name': 'edited' },
      new Set(),
      {},
      bodyGlobals,
      null
    );
    expect(out).toEqual({ project: { name: 'edited' } });
  });

  it('global value wins even when leaf has both an edit AND a global value', () => {
    const out = buildSmartJson(
      bodyTree,
      { 'project.org_id': 'local-stale' },
      new Set(),
      { org_id: 'org-fresh' },
      bodyGlobals,
      null
    );
    expect(out.project.org_id).toBe('org-fresh');
  });

  it('global value makes the field appear "included" even without explicit include', () => {
    // A non-empty global counts as included — the value should
    // surface in the JSON output without needing the user to tick the box.
    const out = buildSmartJson(bodyTree, {}, new Set(), { org_id: 'org-xyz' }, bodyGlobals, null);
    expect(out.project.org_id).toBe('org-xyz');
  });

  it('omits a global field when paramStore has no value for it', () => {
    const out = buildSmartJson(bodyTree, {}, new Set(), {}, bodyGlobals, null);
    expect(out.project).toEqual({ name: 'my-project' });
    expect(out.project.org_id).toBeUndefined();
  });

  it('idMeaning fills bare-id body leaves at any depth', () => {
    const branchTree = [{ key: 'id', type: 'string', required: false }];
    const out = buildSmartJson(
      branchTree,
      {},
      new Set(),
      { branch_id: 'br-abc' },
      null,
      'branch_id'
    );
    expect(out).toEqual({ id: 'br-abc' });
  });
});
