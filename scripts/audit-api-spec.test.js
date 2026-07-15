import { describe, it, expect } from 'vitest';

import {
  mergeParams,
  flattenAllOf,
  find2xxResponse,
  extractExample,
  validateExample,
  auditOperation,
  findEnumsMissingDefault,
} from './audit-api-spec.mjs';

// ---------------------------------------------------------------------------
// mergeParams
// ---------------------------------------------------------------------------

describe('mergeParams', () => {
  it('returns operation params when path item has none', () => {
    const result = mergeParams([], [{ name: 'project_id', in: 'path' }]);
    expect(result).toEqual([{ name: 'project_id', in: 'path' }]);
  });

  it('merges path-level and operation-level params', () => {
    const pathParams = [{ name: 'project_id', in: 'path' }];
    const opParams = [{ name: 'limit', in: 'query' }];
    expect(mergeParams(pathParams, opParams)).toHaveLength(2);
  });

  it('operation-level param overrides path-level param with same name+in', () => {
    const pathParams = [{ name: 'project_id', in: 'path', description: 'old' }];
    const opParams = [{ name: 'project_id', in: 'path', description: 'new' }];
    const result = mergeParams(pathParams, opParams);
    expect(result).toHaveLength(1);
    expect(result[0].description).toBe('new');
  });

  it('does not override when name matches but in differs', () => {
    const pathParams = [{ name: 'id', in: 'path' }];
    const opParams = [{ name: 'id', in: 'query' }];
    expect(mergeParams(pathParams, opParams)).toHaveLength(2);
  });

  it('handles undefined inputs gracefully', () => {
    expect(mergeParams(undefined, undefined)).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// flattenAllOf
// ---------------------------------------------------------------------------

describe('flattenAllOf', () => {
  it('returns schema unchanged when no allOf', () => {
    const schema = { type: 'object', properties: { id: { type: 'string' } } };
    expect(flattenAllOf(schema)).toEqual(schema);
  });

  it('merges properties from all allOf members', () => {
    const schema = {
      allOf: [
        { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] },
        { properties: { name: { type: 'string' } }, required: ['name'] },
      ],
    };
    const flat = flattenAllOf(schema);
    expect(flat.properties).toHaveProperty('id');
    expect(flat.properties).toHaveProperty('name');
    expect(flat.required).toContain('id');
    expect(flat.required).toContain('name');
  });

  it('later allOf members overwrite earlier ones for same property key', () => {
    const schema = {
      allOf: [
        { properties: { id: { type: 'string' } } },
        { properties: { id: { type: 'integer' } } },
      ],
    };
    expect(flattenAllOf(schema).properties.id.type).toBe('integer');
  });

  it('returns null for null input', () => {
    expect(flattenAllOf(null)).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// find2xxResponse
// ---------------------------------------------------------------------------

describe('find2xxResponse', () => {
  it('finds 200 response', () => {
    const result = find2xxResponse({ 200: { description: 'ok' } });
    expect(result).toEqual({ status: '200', response: { description: 'ok' } });
  });

  it('finds 201 when no 200', () => {
    const result = find2xxResponse({ 201: { description: 'created' } });
    expect(result).toEqual({ status: '201', response: { description: 'created' } });
  });

  it('prefers 200 over 201', () => {
    const result = find2xxResponse({ 200: { description: 'ok' }, 201: { description: 'created' } });
    expect(result.status).toBe('200');
  });

  it('returns null when no 2xx response', () => {
    expect(find2xxResponse({ 400: { description: 'bad' } })).toBeNull();
  });

  it('returns null for empty responses', () => {
    expect(find2xxResponse({})).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// extractExample
// ---------------------------------------------------------------------------

describe('extractExample', () => {
  it('extracts example from content schema', () => {
    const response = {
      content: { 'application/json': { schema: { example: { id: '123' } } } },
    };
    expect(extractExample(response)).toEqual({ id: '123' });
  });

  it('extracts example from content-level example field', () => {
    const response = {
      content: { 'application/json': { example: { id: '456' } } },
    };
    expect(extractExample(response)).toEqual({ id: '456' });
  });

  it('returns undefined when no example', () => {
    const response = { content: { 'application/json': { schema: { type: 'object' } } } };
    expect(extractExample(response)).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// validateExample
// ---------------------------------------------------------------------------

describe('validateExample', () => {
  it('returns valid for a conforming example', () => {
    const schema = { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] };
    const { valid, errors } = validateExample({ id: 'abc' }, schema);
    expect(valid).toBe(true);
    expect(errors).toHaveLength(0);
  });

  it('returns invalid with errors for a non-conforming example', () => {
    const schema = { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] };
    const { valid, errors } = validateExample({ id: 123 }, schema);
    expect(valid).toBe(false);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('returns valid when no schema provided', () => {
    const { valid } = validateExample({ anything: true }, null);
    expect(valid).toBe(true);
  });

  it('returns valid when example is undefined', () => {
    const schema = { type: 'object' };
    const { valid } = validateExample(undefined, schema);
    expect(valid).toBe(true);
  });

  it('returns valid with skipped:true when schema cannot be compiled by AJV', () => {
    // AJV rejects schemas with unknown $vocabulary — simulates "too complex" path.
    const uncompilableSchema = { $schema: 'https://unknown-dialect/', type: 'object' };
    const result = validateExample({ id: 'x' }, uncompilableSchema);
    expect(result.valid).toBe(true);
    expect(result.skipped).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// findEnumsMissingDefault
// ---------------------------------------------------------------------------

describe('findEnumsMissingDefault', () => {
  it('flags an optional enum property with no default', () => {
    const props = { auth_provider: { type: 'string', enum: ['a', 'b'] } };
    expect(findEnumsMissingDefault(props, [])).toContain('auth_provider');
  });

  it('ignores a required enum property', () => {
    const props = { auth_provider: { type: 'string', enum: ['a', 'b'] } };
    expect(findEnumsMissingDefault(props, ['auth_provider'])).toHaveLength(0);
  });

  it('ignores an enum property that has a default', () => {
    const props = { auth_provider: { type: 'string', enum: ['a', 'b'], default: 'a' } };
    expect(findEnumsMissingDefault(props, [])).toHaveLength(0);
  });

  it('recurses into nested object properties', () => {
    const props = {
      settings: {
        type: 'object',
        properties: { level: { type: 'string', enum: ['low', 'high'] } },
      },
    };
    expect(findEnumsMissingDefault(props, [])).toContain('settings.level');
  });

  it('recurses into array item properties', () => {
    const props = {
      items: {
        type: 'array',
        items: { type: 'object', properties: { mode: { type: 'string', enum: ['x', 'y'] } } },
      },
    };
    expect(findEnumsMissingDefault(props, [])).toContain('items[].mode');
  });

  it('returns empty array for null input', () => {
    expect(findEnumsMissingDefault(null, [])).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// auditOperation (integration over the pure helpers)
// ---------------------------------------------------------------------------

const PATH_ITEM_EMPTY = { parameters: [] };

function makeOperation(overrides = {}) {
  return {
    operationId: 'listThings',
    tags: ['things'],
    parameters: [],
    responses: {
      200: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: { items: { type: 'array' } },
              example: { items: [] },
            },
          },
        },
      },
    },
    ...overrides,
  };
}

describe('auditOperation', () => {
  it('reports no issues for a well-formed operation', () => {
    const result = auditOperation(PATH_ITEM_EMPTY, makeOperation(), 'get', '/things');
    expect(result.responseIssue).toBeNull();
    expect(result.paramIssues).toHaveLength(0);
    expect(result.requestBodyIssue).toBeNull();
  });

  it('reports missing response example', () => {
    const op = makeOperation({
      responses: {
        200: { content: { 'application/json': { schema: { type: 'object' } } } },
      },
    });
    const result = auditOperation(PATH_ITEM_EMPTY, op, 'get', '/things');
    expect(result.responseIssue?.type).toBe('missing');
  });

  it('reports invalid response example', () => {
    const op = makeOperation({
      responses: {
        200: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: { count: { type: 'integer' } },
                required: ['count'],
                example: { count: 'not-a-number' },
              },
            },
          },
        },
      },
    });
    const result = auditOperation(PATH_ITEM_EMPTY, op, 'get', '/things');
    expect(result.responseIssue?.type).toBe('invalid');
  });

  it('reports no-2xx when responses object lacks 200/201', () => {
    const op = makeOperation({ responses: { 400: { description: 'bad' } } });
    const result = auditOperation(PATH_ITEM_EMPTY, op, 'get', '/things');
    expect(result.responseIssue?.type).toBe('no-2xx');
  });

  it('reports missing param example for query params without example', () => {
    const op = makeOperation({
      parameters: [{ name: 'limit', in: 'query', schema: { type: 'integer' } }],
    });
    const result = auditOperation(PATH_ITEM_EMPTY, op, 'get', '/things');
    expect(result.paramIssues).toContain('limit');
  });

  it('does not flag query param that has an example', () => {
    const op = makeOperation({
      parameters: [{ name: 'limit', in: 'query', example: 10 }],
    });
    const result = auditOperation(PATH_ITEM_EMPTY, op, 'get', '/things');
    expect(result.paramIssues).not.toContain('limit');
  });

  it('reports missing request body example', () => {
    const op = makeOperation({
      requestBody: {
        content: { 'application/json': { schema: { type: 'object' } } },
      },
    });
    const result = auditOperation(PATH_ITEM_EMPTY, op, 'post', '/things');
    expect(result.requestBodyIssue?.type).toBe('missing');
  });

  it('uses path-level params when operation has none', () => {
    const pathItem = {
      parameters: [{ name: 'project_id', in: 'path', example: 'proj-abc' }],
    };
    const op = makeOperation({ parameters: [] });
    const result = auditOperation(pathItem, op, 'get', '/projects/{project_id}');
    expect(result.paramIssues).not.toContain('project_id');
  });
});
