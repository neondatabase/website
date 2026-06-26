import { describe, it, expect } from 'vitest';

import { buildCurl, buildCliCommand, toSdkMethodName } from '../src/utils/api-ref.mjs';

// ── toSdkMethodName ────────────────────────────────────────────────────────

describe('toSdkMethodName', () => {
  it('lowercases trailing acronym', () => {
    expect(toSdkMethodName('getVPC')).toBe('getVpc');
  });

  it('lowercases acronym followed by lowercase (keeps last char as word start)', () => {
    expect(toSdkMethodName('listVPCEndpoints')).toBe('listVpcEndpoints');
  });

  it('handles JWKS', () => {
    expect(toSdkMethodName('getJWKS')).toBe('getJwks');
  });

  it('leaves already-camelCase untouched', () => {
    expect(toSdkMethodName('getProject')).toBe('getProject');
  });

  it('handles URI in the middle', () => {
    expect(toSdkMethodName('buildURIPath')).toBe('buildUriPath');
  });
});

// ── buildCurl ──────────────────────────────────────────────────────────────

const minOp = (overrides = {}) => ({
  path: '/projects/{project_id}',
  method: 'GET',
  parameters: [],
  operationId: 'getProject',
  ...overrides,
});

describe('buildCurl', () => {
  it('substitutes path param', () => {
    const result = buildCurl(minOp(), { project_id: 'proj-123' }, new Set(), {});
    expect(result).toContain('/projects/proj-123');
  });

  it('URL-encodes path param values', () => {
    const result = buildCurl(minOp(), { project_id: 'my project' }, new Set(), {});
    expect(result).toContain('/projects/my%20project');
    expect(result).not.toContain('/projects/my project');
  });

  it('leaves placeholder when param not provided', () => {
    const result = buildCurl(minOp(), {}, new Set(), {});
    expect(result).toContain('{project_id}');
  });

  it('appends query params with encodeURIComponent', () => {
    const op = minOp({
      path: '/projects',
      parameters: [{ in: 'query', name: 'search', required: false }],
    });
    const result = buildCurl(op, { search: 'foo bar' }, new Set(['search']), {});
    expect(result).toContain('search=foo%20bar');
  });

  it('omits optional query param when not included', () => {
    const op = minOp({
      path: '/projects',
      parameters: [{ in: 'query', name: 'search', required: false }],
    });
    const result = buildCurl(op, {}, new Set(), {});
    expect(result).not.toContain('search');
  });

  it('includes required query param even without explicit value', () => {
    const op = minOp({
      path: '/projects',
      parameters: [{ in: 'query', name: 'q', required: true }],
    });
    const result = buildCurl(op, {}, new Set(), {});
    expect(result).toContain('q=$Q');
  });

  it('adds -X flag for non-GET methods', () => {
    const result = buildCurl(minOp({ method: 'POST' }), {}, new Set(), {});
    expect(result).toContain('-X POST');
  });

  it('omits -X flag for GET', () => {
    const result = buildCurl(minOp(), {}, new Set(), {});
    expect(result).not.toContain('-X GET');
  });

  it('adds body flags when bodyJson is non-empty', () => {
    const result = buildCurl(minOp({ method: 'POST' }), {}, new Set(), { name: 'test' });
    expect(result).toContain('Content-Type: application/json');
    expect(result).toContain('"name":"test"');
  });

  it('omits body flags when bodyJson is empty', () => {
    const result = buildCurl(minOp({ method: 'POST' }), {}, new Set(), {});
    expect(result).not.toContain('Content-Type');
  });
});

// ── buildCliCommand ────────────────────────────────────────────────────────

describe('buildCliCommand', () => {
  it('returns base command when no flags apply', () => {
    expect(buildCliCommand('neon projects get', [], [], {}, new Set(), {})).toBe(
      'neon projects get'
    );
  });

  it('appends a required string flag', () => {
    const flags = [{ name: 'project-id', type: 'string', required: true }];
    const result = buildCliCommand('neon branches list', [], flags, {}, new Set(), {});
    expect(result).toContain('--project-id');
  });

  it('uses cliEdits value for a flag', () => {
    const flags = [{ name: 'project-id', type: 'string', required: false }];
    const result = buildCliCommand(
      'neon branches list',
      [],
      flags,
      { 'project-id': 'proj-abc' },
      new Set(),
      {}
    );
    expect(result).toContain('--project-id proj-abc');
  });

  it('omits optional flag not in cliEdits or cliIncluded', () => {
    const flags = [{ name: 'output', type: 'string', required: false }];
    const result = buildCliCommand('neon projects list', [], flags, {}, new Set(), {});
    expect(result).not.toContain('--output');
  });

  it('includes optional flag when in cliIncluded and has a value', () => {
    const flags = [{ name: 'output', type: 'string', required: false, default: 'table' }];
    const result = buildCliCommand('neon projects list', [], flags, {}, new Set(['output']), {});
    expect(result).toContain('--output table');
  });

  it('omits string flag that is included but has no value', () => {
    const flags = [{ name: 'output', type: 'string', required: false }];
    const result = buildCliCommand('neon projects list', [], flags, {}, new Set(['output']), {});
    expect(result).not.toContain('--output');
  });

  it('appends boolean flag as --name (no value) when included', () => {
    const flags = [{ name: 'no-color', type: 'boolean', required: false }];
    const result = buildCliCommand(
      'neon projects list',
      [],
      flags,
      { 'no-color': 'true' },
      new Set(),
      {}
    );
    expect(result).toContain('--no-color');
    expect(result).not.toContain('--no-color true');
  });

  it('omits boolean flag when not in cliEdits or cliIncluded', () => {
    const flags = [{ name: 'no-color', type: 'boolean', required: false }];
    const result = buildCliCommand('neon projects list', [], flags, {}, new Set(), {});
    expect(result).not.toContain('--no-color');
  });

  it('substitutes positional placeholder from cliEdits', () => {
    const positionals = [{ display: '<project_id>', apiEquiv: 'project_id' }];
    const result = buildCliCommand(
      'neon projects get <project_id>',
      positionals,
      [],
      { project_id: 'proj-xyz' },
      new Set(),
      {}
    );
    expect(result).toBe('neon projects get proj-xyz');
  });

  it('substitutes positional placeholder from paramValues', () => {
    const positionals = [{ display: '<project_id>', apiEquiv: 'project_id' }];
    const result = buildCliCommand(
      'neon projects get <project_id>',
      positionals,
      [],
      {},
      new Set(),
      { project_id: 'proj-from-params' }
    );
    expect(result).toBe('neon projects get proj-from-params');
  });

  it('wraps flags onto multiple lines when more than 2', () => {
    const flags = [
      { name: 'project-id', type: 'string', required: true },
      { name: 'branch-id', type: 'string', required: true },
      { name: 'output', type: 'string', required: false },
    ];
    const result = buildCliCommand(
      'neon endpoints list',
      [],
      flags,
      { output: 'json' },
      new Set(),
      {}
    );
    expect(result).toContain('\\\n');
  });

  it('keeps single line when 1-2 flags', () => {
    const flags = [{ name: 'project-id', type: 'string', required: true }];
    const result = buildCliCommand('neon branches list', [], flags, {}, new Set(), {});
    expect(result).not.toContain('\\\n');
  });
});
