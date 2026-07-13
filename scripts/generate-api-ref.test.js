import { existsSync, readFileSync, rmSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import {
  toSlug,
  toTagSlug,
  toSdkMethodName,
  mergeParams,
  flattenAllOf,
  flattenOneOf,
  find2xxResponse,
  getRequestBodyExample,
  toCurlExample,
  toTypescriptExample,
  toLlmsTxtLine,
  toAgentMarkdown,
  toFullMarkdownEntry,
  generateLlmsFull,
  toNavYaml,
  stripMarkdownLinks,
  descriptionToHtml,
  appendCliPositionals,
  buildCliFlags,
  resolveCliPositionals,
  main,
  buildOperationData,
  resolveLocalRef,
  discriminatorLabelsFromRaw,
  getRawSchemaAt,
  buildRepresentativeExamples,
} from './generate-api-ref.mjs';
import { FIELD_ORDER, computeDisplayOrder } from './lib/field-order-config.mjs';

const TEST_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const readJsonFixture = (relativePath) =>
  JSON.parse(readFileSync(resolve(TEST_ROOT, relativePath), 'utf8'));

function coverageCommands(entry) {
  if (!entry) return [];
  if (typeof entry === 'string') return [entry];
  return (entry.commands ?? []).map(({ cmd }) => cmd);
}

function resolveCoverageCommand(schema, command) {
  const tokens = command
    .replace(/^neon\s+/, '')
    .split(/\s+/)
    .filter(Boolean);
  let node = null;
  let commands = schema.commands;
  const path = [];
  for (const token of tokens) {
    if (token.startsWith('-') || token.startsWith('<') || token.startsWith('[')) break;
    if (!commands?.[token]) return { node: null, path, unresolved: token };
    node = commands[token];
    path.push(token);
    commands = node.commands;
  }
  return { node, path };
}

// ---------------------------------------------------------------------------
// toSlug
// ---------------------------------------------------------------------------

describe('toSlug', () => {
  it('converts simple camelCase', () => {
    expect(toSlug('listProjects')).toBe('list-projects');
  });

  it('converts multi-word camelCase', () => {
    expect(toSlug('createProjectBranch')).toBe('create-project-branch');
  });

  it('handles trailing acronym', () => {
    expect(toSlug('getProjectJWKS')).toBe('get-project-jwks');
  });

  it('handles mid-word acronym', () => {
    expect(toSlug('listOrganizationVPCEndpoints')).toBe('list-organization-vpc-endpoints');
  });

  it('handles DataAPI tag acronym', () => {
    expect(toSlug('getProjectBranchDataAPI')).toBe('get-project-branch-data-api');
  });
});

// ---------------------------------------------------------------------------
// toTagSlug
// ---------------------------------------------------------------------------

describe('toTagSlug', () => {
  it('lowercases simple tag', () => {
    expect(toTagSlug('Project')).toBe('project');
  });

  it('handles spaces', () => {
    expect(toTagSlug('API Key')).toBe('api-key');
  });

  it('handles parens and spaces', () => {
    expect(toTagSlug('Auth (legacy)')).toBe('auth-legacy');
  });

  it('handles DataAPI', () => {
    expect(toTagSlug('DataAPI')).toBe('dataapi');
  });

  it('already plural stays as-is', () => {
    expect(toTagSlug('Organizations')).toBe('organizations');
  });
});

// ---------------------------------------------------------------------------
// toSdkMethodName
// ---------------------------------------------------------------------------

describe('toSdkMethodName', () => {
  it('leaves simple camelCase unchanged', () => {
    expect(toSdkMethodName('listProjects')).toBe('listProjects');
  });

  it('titlecases trailing acronym', () => {
    expect(toSdkMethodName('getProjectJWKS')).toBe('getProjectJwks');
  });

  it('titlecases mid-word acronym', () => {
    expect(toSdkMethodName('listOrganizationVPCEndpoints')).toBe('listOrganizationVpcEndpoints');
  });

  it('titlecases DataAPI', () => {
    expect(toSdkMethodName('getProjectBranchDataAPI')).toBe('getProjectBranchDataApi');
  });

  it('leaves non-acronym unchanged', () => {
    expect(toSdkMethodName('createProject')).toBe('createProject');
  });
});

// ---------------------------------------------------------------------------
// mergeParams
// ---------------------------------------------------------------------------

describe('mergeParams', () => {
  const pathParam = { name: 'project_id', in: 'path', required: true };
  const opParam = { name: 'limit', in: 'query', required: false };
  const opOverride = { name: 'project_id', in: 'path', required: true, description: 'override' };

  it('combines path-level and op-level params', () => {
    const result = mergeParams([pathParam], [opParam]);
    expect(result).toHaveLength(2);
  });

  it('op-level param overrides path-level param with same name+in', () => {
    const result = mergeParams([pathParam], [opOverride]);
    expect(result).toHaveLength(1);
    expect(result[0].description).toBe('override');
  });

  it('handles empty arrays', () => {
    expect(mergeParams([], [])).toEqual([]);
    expect(mergeParams([pathParam], [])).toHaveLength(1);
    expect(mergeParams([], [opParam])).toHaveLength(1);
  });

  it('handles undefined', () => {
    expect(mergeParams(undefined, undefined)).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// flattenAllOf
// ---------------------------------------------------------------------------

describe('flattenAllOf', () => {
  it('returns schema unchanged if no allOf', () => {
    const s = { type: 'object', properties: { id: { type: 'string' } } };
    expect(flattenAllOf(s)).toBe(s);
  });

  it('merges properties from allOf members', () => {
    const s = {
      allOf: [
        { properties: { id: { type: 'string' }, name: { type: 'string' } }, required: ['id'] },
        { properties: { cursor: { type: 'string' } } },
      ],
    };
    const result = flattenAllOf(s);
    expect(result.properties).toHaveProperty('id');
    expect(result.properties).toHaveProperty('name');
    expect(result.properties).toHaveProperty('cursor');
    expect(result.required).toContain('id');
  });

  it('handles members with no required', () => {
    const s = {
      allOf: [{ properties: { a: {} } }, { properties: { b: {} } }],
    };
    expect(() => flattenAllOf(s)).not.toThrow();
    expect(flattenAllOf(s).required).toEqual([]);
  });

  it('deduplicates required fields from overlapping allOf members', () => {
    const s = {
      allOf: [
        { properties: { id: { type: 'string' } }, required: ['id'] },
        { properties: { name: { type: 'string' } }, required: ['id', 'name'] },
      ],
    };
    const result = flattenAllOf(s);
    const idCount = result.required.filter((f) => f === 'id').length;
    expect(idCount).toBe(1);
    expect(result.required).toContain('name');
  });

  it('handles null/undefined', () => {
    expect(flattenAllOf(null)).toBeNull();
    expect(flattenAllOf(undefined)).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// flattenOneOf
// ---------------------------------------------------------------------------

describe('flattenOneOf', () => {
  it('returns null when no oneOf/anyOf is present', () => {
    expect(flattenOneOf(null)).toBeNull();
    expect(flattenOneOf(undefined)).toBeNull();
    expect(flattenOneOf({ type: 'object', properties: { id: { type: 'string' } } })).toBeNull();
  });

  it('returns null when schema already has top-level properties', () => {
    const s = {
      properties: { id: { type: 'string' } },
      oneOf: [{ properties: { extra: { type: 'string' } } }],
    };
    expect(flattenOneOf(s)).toBeNull();
  });

  it('picks the variant with the most properties as primary', () => {
    const s = {
      oneOf: [
        { type: 'object', properties: { a: {}, b: {} }, required: ['a'] },
        {
          type: 'object',
          properties: { x: {}, y: {}, z: {}, w: {} },
          required: ['x', 'y'],
        },
      ],
    };
    const result = flattenOneOf(s);
    expect(Object.keys(result.schema.properties)).toEqual(['x', 'y', 'z', 'w']);
    expect(result.schema.required).toEqual(['x', 'y']);
  });

  it('builds a note describing the alternative variant with the discriminator key', () => {
    const s = {
      discriminator: {
        propertyName: 'type',
        mapping: {
          standard: '#/components/schemas/StandardEmailServer',
          shared: '#/components/schemas/SharedEmailServer',
        },
      },
      oneOf: [
        {
          type: 'object',
          properties: {
            host: {},
            port: {},
            username: {},
            password: {},
            sender_email: {},
            sender_name: {},
          },
          required: ['host', 'port', 'username', 'password', 'sender_email', 'sender_name'],
        },
        {
          type: 'object',
          properties: { sender_email: {}, sender_name: {} },
        },
      ],
    };
    const result = flattenOneOf(s, { discriminatorLabels: ['standard', 'shared'] });
    expect(result.primaryLabel).toBe('standard');
    expect(result.note).toContain('`type: shared`');
    expect(result.note).toContain('all fields optional');
  });

  it('falls back to variantN labels when none can be derived', () => {
    const s = {
      oneOf: [
        { type: 'object', properties: { a: {}, b: {} } },
        { type: 'object', properties: { c: {} }, required: ['c'] },
      ],
    };
    const result = flattenOneOf(s);
    expect(result.primaryLabel).toBe('variant1');
    expect(result.note).toContain('variant2');
    expect(result.note).toContain('`c` required');
  });

  it('skips variants without properties so partial specs do not crash', () => {
    const s = {
      oneOf: [{ type: 'string' }, { type: 'object', properties: { id: {} }, required: ['id'] }],
    };
    const result = flattenOneOf(s);
    expect(Object.keys(result.schema.properties)).toEqual(['id']);
  });

  // S1: cloning isolation — mutating the returned schema must not poison the
  // dereferenced spec, since the same component schema is shared by every
  // operation that references it.
  it('shallow-clones properties and required so callers cannot mutate the input', () => {
    const original = {
      oneOf: [
        {
          type: 'object',
          properties: { a: { type: 'string' }, b: { type: 'number' } },
          required: ['a'],
        },
      ],
    };
    const result = flattenOneOf(original);
    result.schema.properties.c = { type: 'boolean' };
    result.schema.required.push('c');
    expect(original.oneOf[0].properties).toEqual({
      a: { type: 'string' },
      b: { type: 'number' },
    });
    expect(original.oneOf[0].required).toEqual(['a']);
  });

  it('returns note: null when there are no alternates', () => {
    const result = flattenOneOf({
      oneOf: [{ type: 'object', properties: { only: {} } }],
    });
    expect(result.note).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// spec-utils helpers (S3) — resolveLocalRef / discriminatorLabelsFromRaw / getRawSchemaAt
// ---------------------------------------------------------------------------

describe('resolveLocalRef', () => {
  const spec = {
    components: { schemas: { Foo: { type: 'object', properties: { id: {} } } } },
  };

  it('resolves a valid local $ref', () => {
    expect(resolveLocalRef(spec, '#/components/schemas/Foo')).toEqual({
      type: 'object',
      properties: { id: {} },
    });
  });

  it('returns null for non-local or missing refs', () => {
    expect(resolveLocalRef(spec, 'https://example.com/schema.json')).toBeNull();
    expect(resolveLocalRef(spec, '#/components/schemas/Missing')).toBeNull();
    expect(resolveLocalRef(spec, null)).toBeNull();
  });
});

describe('discriminatorLabelsFromRaw', () => {
  it('returns null when there is no discriminator mapping', () => {
    const spec = {};
    expect(
      discriminatorLabelsFromRaw(spec, {
        oneOf: [{ type: 'object', properties: {} }],
      })
    ).toBeNull();
  });

  it('extracts labels from discriminator.mapping aligned to the oneOf order', () => {
    const spec = {
      components: {
        schemas: {
          Wrap: {
            discriminator: {
              propertyName: 'type',
              mapping: {
                std: '#/components/schemas/Std',
                shr: '#/components/schemas/Shr',
              },
            },
            oneOf: [{ $ref: '#/components/schemas/Std' }, { $ref: '#/components/schemas/Shr' }],
          },
        },
      },
    };
    const result = discriminatorLabelsFromRaw(spec, { $ref: '#/components/schemas/Wrap' });
    expect(result).toEqual(['std', 'shr']);
  });

  // S4: caps follow-ref depth and detects cycles. A self-referencing $ref
  // used to make the function loop forever; now it bails out cleanly.
  it('does not loop on $ref cycles', () => {
    const spec = {
      components: { schemas: { Loop: { $ref: '#/components/schemas/Loop' } } },
    };
    expect(discriminatorLabelsFromRaw(spec, { $ref: '#/components/schemas/Loop' })).toBeNull();
  });
});

describe('getRawSchemaAt', () => {
  const spec = {
    paths: {
      '/foo': {
        get: {
          responses: {
            200: { content: { 'application/json': { schema: { type: 'object' } } } },
          },
        },
      },
    },
  };

  it('returns the response schema for a valid path/method/status', () => {
    expect(getRawSchemaAt(spec, '/foo', 'get', 'response', '200')).toEqual({
      type: 'object',
    });
  });

  it('returns null when the op or location is absent in the spec', () => {
    expect(getRawSchemaAt(spec, '/missing', 'get', 'response', '200')).toBeNull();
    expect(getRawSchemaAt(spec, '/foo', 'get', 'request')).toBeNull();
  });

  // S5: catches caller typos early instead of silently returning null.
  it('throws on an unknown location', () => {
    expect(() => getRawSchemaAt(spec, '/foo', 'get', 'requeststttt')).toThrow(/unknown location/);
  });
});

// ---------------------------------------------------------------------------
// stripMarkdownLinks
// ---------------------------------------------------------------------------

describe('stripMarkdownLinks', () => {
  it('strips inline links leaving label text', () => {
    expect(stripMarkdownLinks('See [Manage projects](https://neon.tech/docs) for details.')).toBe(
      'See Manage projects for details.'
    );
  });

  it('leaves plain text unchanged', () => {
    expect(stripMarkdownLinks('No links here.')).toBe('No links here.');
  });

  it('handles multiple links', () => {
    expect(stripMarkdownLinks('[A](http://a.com) and [B](http://b.com)')).toBe('A and B');
  });

  it('does not strip bare URLs', () => {
    expect(stripMarkdownLinks('Visit https://neon.tech for more.')).toBe(
      'Visit https://neon.tech for more.'
    );
  });

  // Known limitation, documented at the function site: the simple regex
  // doesn't handle a literal `]` inside the label. Locking the current
  // behavior so we notice if a refactor changes it.
  it('leaves nested ] inside label unchanged (known limitation)', () => {
    const input = '[outer [inner] label](http://x.com)';
    expect(stripMarkdownLinks(input)).toBe(input);
  });
});

// ---------------------------------------------------------------------------
// find2xxResponse
// ---------------------------------------------------------------------------

describe('find2xxResponse', () => {
  it('finds 200 response', () => {
    const r = find2xxResponse({ 200: { description: 'OK' }, default: {} });
    expect(r).toEqual({ status: '200', response: { description: 'OK' } });
  });

  it('finds 201 when no 200', () => {
    const r = find2xxResponse({ 201: { description: 'Created' }, default: {} });
    expect(r).toEqual({ status: '201', response: { description: 'Created' } });
  });

  it('prefers 200 over 201', () => {
    const r = find2xxResponse({ 200: { description: 'OK' }, 201: { description: 'Created' } });
    expect(r.status).toBe('200');
  });

  it('returns null if no 2xx', () => {
    expect(find2xxResponse({ default: {} })).toBeNull();
    expect(find2xxResponse({})).toBeNull();
  });

  it('handles undefined', () => {
    expect(find2xxResponse(undefined)).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// getRequestBodyExample
// ---------------------------------------------------------------------------

describe('getRequestBodyExample', () => {
  it('gets value from examples object', () => {
    const body = {
      content: {
        'application/json': {
          examples: { ex: { value: { project: { name: 'test' } } } },
        },
      },
    };
    expect(getRequestBodyExample(body)).toEqual({ project: { name: 'test' } });
  });

  it('gets value from example field', () => {
    const body = {
      content: { 'application/json': { example: { name: 'test' } } },
    };
    expect(getRequestBodyExample(body)).toEqual({ name: 'test' });
  });

  it('returns null when no content', () => {
    expect(getRequestBodyExample(null)).toBeNull();
    expect(getRequestBodyExample({})).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// toCurlExample
// ---------------------------------------------------------------------------

describe('toCurlExample', () => {
  it('generates GET with no body', () => {
    const result = toCurlExample('GET', '/projects', [], null);
    expect(result).toContain('curl "https://console.neon.tech/api/v2/projects"');
    expect(result).toContain('-H "Authorization: Bearer $NEON_API_KEY"');
    expect(result).not.toContain('-X GET');
  });

  it('includes -X for non-GET methods', () => {
    const result = toCurlExample('POST', '/projects', [], null);
    expect(result).toContain('-X POST');
  });

  it('replaces path params with env var style', () => {
    const result = toCurlExample('GET', '/projects/{project_id}', [], null);
    expect(result).toContain('$PROJECT_ID');
    expect(result).not.toContain('{project_id}');
  });

  it('includes body and content-type for POST with example', () => {
    const body = {
      content: {
        'application/json': {
          examples: { ex: { value: { project: { name: 'test' } } } },
        },
      },
    };
    const result = toCurlExample('POST', '/projects', [], body);
    expect(result).toContain('-H "Content-Type: application/json"');
    expect(result).toContain('-d \'{"project":{"name":"test"}}\'');
  });

  it('no Content-Type header when no request body example', () => {
    const result = toCurlExample('DELETE', '/projects/{project_id}', [], null);
    expect(result).not.toContain('Content-Type');
  });

  it('appends required query params to URL using example value', () => {
    const params = [
      { name: 'database_name', in: 'query', required: true, example: 'neondb' },
      { name: 'role_name', in: 'query', required: true, example: 'neondb_owner' },
    ];
    const result = toCurlExample('GET', '/projects/{project_id}/connection_uri', params, null);
    expect(result).toContain('?database_name=neondb&role_name=neondb_owner');
  });

  it('uses env-style placeholders when no example exists for a required query param', () => {
    const params = [{ name: 'foo', in: 'query', required: true, example: null }];
    const result = toCurlExample('GET', '/some/path', params, null);
    expect(result).toContain('?foo=$FOO');
  });

  it('does not add query string for optional query params', () => {
    const params = [{ name: 'limit', in: 'query', required: false, example: 10 }];
    const result = toCurlExample('GET', '/projects', params, null);
    expect(result).not.toContain('?');
  });
});

// ---------------------------------------------------------------------------
// toTypescriptExample
// ---------------------------------------------------------------------------

describe('toTypescriptExample', () => {
  it('generates call with no path params', () => {
    const result = toTypescriptExample('listProjects', []);
    expect(result).toContain("import { createNeonClient, raw } from '@neon/sdk';");
    expect(result).toContain('raw.listProjects({');
    expect(result).toContain('client: neon.client');
  });

  it('generates call with path params', () => {
    const params = [{ name: 'project_id', in: 'path', required: true }];
    const result = toTypescriptExample('getProject', params);
    expect(result).toContain('raw.getProject({');
    expect(result).toContain('path: {');
    expect(result).toContain('project_id: process.env.PROJECT_ID');
  });

  it('applies SDK method name transformation', () => {
    const result = toTypescriptExample('getProjectJWKS', []);
    expect(result).toContain('raw.getProjectJwks({');
  });

  it('skips optional query params in the call args', () => {
    const params = [{ name: 'limit', in: 'query', required: false, example: null }];
    const result = toTypescriptExample('listProjects', params);
    expect(result).toContain('raw.listProjects({');
    expect(result).not.toContain('query:');
  });

  it('includes required query params with example value', () => {
    const params = [
      { name: 'project_id', in: 'path', required: true, example: null },
      { name: 'database_name', in: 'query', required: true, example: 'neondb' },
      { name: 'role_name', in: 'query', required: true, example: 'neondb_owner' },
    ];
    const result = toTypescriptExample('getConnectionUri', params);
    expect(result).toContain('raw.getConnectionUri({');
    expect(result).toContain('project_id: process.env.PROJECT_ID');
    expect(result).toContain('query: {');
    expect(result).toContain('database_name: "neondb"');
    expect(result).toContain('role_name: "neondb_owner"');
  });

  it('passes path params before the request body for path-only body calls', () => {
    const params = [{ name: 'project_id', in: 'path', required: true, example: null }];
    const result = toTypescriptExample('updateProject', params, {
      content: {
        'application/json': {
          schema: {},
          example: { project: { name: 'renamed-project' } },
        },
      },
    });

    expect(result).toContain('raw.updateProject({');
    expect(result).toContain('project_id: process.env.PROJECT_ID');
    expect(result).toContain('body: {\n    project: {');
  });

  it('preserves boolean query examples', () => {
    const params = [
      { name: 'include_deleted', in: 'query', required: true, type: 'boolean', example: true },
    ];
    const result = toTypescriptExample('listProjects', params);
    expect(result).toContain('include_deleted: true');
  });

  it('uses env var for required query param without example', () => {
    const params = [{ name: 'foo', in: 'query', required: true, example: null }];
    const result = toTypescriptExample('someOp', params);
    expect(result).toContain('foo: process.env.FOO');
  });

  it('passes request body as the first SDK argument when there are no path params', () => {
    const result = toTypescriptExample('createProject', [], {
      content: {
        'application/json': {
          schema: {},
          example: { project: { name: 'my-db' } },
        },
      },
    });

    expect(result).toContain('raw.createProject({');
    expect(result).toContain('body: {\n    project: {');
    expect(result).not.toContain('path:');
  });
});

// ---------------------------------------------------------------------------
// buildRepresentativeExamples
// ---------------------------------------------------------------------------

describe('buildRepresentativeExamples', () => {
  it('builds representative curl, TypeScript, and body from seed values', () => {
    const operation = {
      operationId: 'createProject',
      method: 'POST',
      path: '/projects',
      parameters: [],
    };
    const seed = {
      'project.name': 'my-production-db',
      'project.region_id': 'aws-us-east-2',
      'project.pg_version': 17,
    };

    const examples = buildRepresentativeExamples(operation, seed, null);

    expect(examples.body).toEqual({
      project: {
        name: 'my-production-db',
        region_id: 'aws-us-east-2',
        pg_version: 17,
      },
    });
    expect(examples.curl).toContain('-d \'{"project":{"name":"my-production-db"');
    expect(examples.curl).toContain('"pg_version":17');
    expect(examples.typescript).toContain('raw.createProject({');
    expect(examples.typescript).toContain('name: "my-production-db"');
  });

  it('falls back to the existing body example when seed is absent', () => {
    const operation = {
      operationId: 'createProject',
      method: 'POST',
      path: '/projects',
      parameters: [],
    };
    const bodyExample = { project: { name: 'from-spec' } };

    expect(buildRepresentativeExamples(operation, null, bodyExample).body).toEqual(bodyExample);
  });

  it('uses env-style placeholders for required path params in representative curl', () => {
    const operation = {
      operationId: 'updateProject',
      method: 'PATCH',
      path: '/projects/{project_id}',
      parameters: [{ name: 'project_id', in: 'path', required: true }],
    };

    const examples = buildRepresentativeExamples(operation, { 'project.name': 'my-db' }, null);

    expect(examples.curl).toContain('/projects/$PROJECT_ID"');
    expect(examples.curl).not.toContain('/projects/{project_id}');
    expect(examples.curl).not.toContain('/projects/%24PROJECT_ID');
    expect(examples.typescript).toContain('raw.updateProject({');
    expect(examples.typescript).toContain('project_id: process.env.PROJECT_ID');
  });

  it('ignores prototype-affecting seed paths', () => {
    const operation = {
      operationId: 'createProject',
      method: 'POST',
      path: '/projects',
      parameters: [],
    };

    const examples = buildRepresentativeExamples(
      operation,
      { 'project.name': 'my-db', '__proto__.polluted': true, 'constructor.prototype.bad': true },
      null
    );

    expect(examples.body).toEqual({ project: { name: 'my-db' } });
    expect({}.polluted).toBeUndefined();
    expect({}.bad).toBeUndefined();
  });

  it('redacts password-shaped keys and normalizes connection strings', () => {
    const examples = buildRepresentativeExamples(
      {
        operationId: 'createRole',
        method: 'POST',
        path: '/projects/{project_id}/roles',
        parameters: [],
      },
      {
        'role.password': 'AbC123dEf',
        'role.connection_uri':
          'postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname',
      },
      null
    );

    expect(examples.body.role.password).toBe('<password>');
    expect(examples.body.role.connection_uri).toContain('[password]');
    expect(examples.body.role.connection_uri).toContain('sslmode=require');
    expect(examples.body.role.connection_uri).toContain('channel_binding=require');
    expect(examples.curl).not.toContain('AbC123dEf');
  });
});

// ---------------------------------------------------------------------------
// toLlmsTxtLine
// ---------------------------------------------------------------------------

describe('toLlmsTxtLine', () => {
  const op = {
    method: 'GET',
    path: '/projects',
    summary: 'List projects',
    tag: 'projects',
    id: 'list-projects',
  };

  it('formats correctly', () => {
    expect(toLlmsTxtLine(op)).toBe(
      'GET /projects — List projects — /docs/reference/api/projects/list-projects'
    );
  });

  it('does not include interface tags', () => {
    const opWithAll = {
      ...op,
      cli: { command: 'neon projects list' },
      mcp: { tool: 'list_projects' },
      console: { breadcrumb: 'Projects' },
    };
    expect(toLlmsTxtLine(opWithAll)).not.toContain('[');
  });
});

// ---------------------------------------------------------------------------
// toAgentMarkdown
// ---------------------------------------------------------------------------

describe('toAgentMarkdown', () => {
  const op = {
    id: 'list-projects',
    operationId: 'listProjects',
    method: 'GET',
    path: '/projects',
    tag: 'projects',
    tagDisplay: 'Project',
    stability: null,
    summary: 'List projects',
    description: 'Retrieves a list of projects.',
    parameters: [
      {
        name: 'limit',
        type: 'integer',
        in: 'query',
        required: false,
        default: 10,
        description: 'Max results.',
      },
    ],
    requestBody: null,
    response: { status: '200', description: 'OK', example: null, properties: null },
    errors: [{ status: 'default', description: 'Error' }],
    examples: {
      curl: 'curl "https://console.neon.tech/api/v2/projects" \\\n  -H "Authorization: Bearer $NEON_API_KEY"',
      typescript: 'const { data } = await api.listProjects({});',
      bodyExample: null,
    },
    cli: { command: 'neon projects list' },
    mcp: { tool: 'list_projects' },
    console: { breadcrumb: 'Projects' },
  };

  it('starts with breadcrumb line', () => {
    const md = toAgentMarkdown(op);
    expect(md).toMatch(/^> API Reference \/ Project \/ List projects/);
  });

  it('includes METHOD path heading', () => {
    expect(toAgentMarkdown(op)).toContain('## GET /projects');
  });

  it('includes Parameters section', () => {
    const md = toAgentMarkdown(op);
    expect(md).toContain('### Parameters');
    expect(md).toContain('`limit`');
  });

  it('includes Code examples section', () => {
    const md = toAgentMarkdown(op);
    expect(md).toContain('### Code examples');
    expect(md).toContain('```bash');
    expect(md).toContain('```typescript');
  });

  it('preserves full multiline descriptions instead of truncating to the first line', () => {
    const md = toAgentMarkdown({
      ...op,
      description: 'First line.\nSecond line.',
      parameters: [{ ...op.parameters[0], description: 'Parameter first.\nParameter second.' }],
      errors: [{ status: 'default', description: 'Error first.\nError second.' }],
    });

    expect(md).toContain('First line.\nSecond line.');
    expect(md).toContain('Parameter first.\n  Parameter second.');
    expect(md).toContain('Error first.\nError second.');
  });

  it('inlines large response examples in per-operation markdown', () => {
    const largeExample = {
      project: Object.fromEntries(
        Array.from({ length: 45 }, (_, index) => [`field_${index}`, `value_${index}`])
      ),
    };
    const md = toAgentMarkdown({
      ...op,
      response: { status: '200', description: 'OK', example: largeExample, properties: null },
    });

    expect(md).not.toContain('Response too large');
    expect(md).not.toContain('Fetch individual operation');
    expect(md).toContain('"field_44": "value_44"');
  });

  it('uses representative request, curl, and TypeScript examples when available', () => {
    const md = toAgentMarkdown({
      ...op,
      requestBody: {
        properties: { project: { type: 'object', properties: { name: { type: 'string' } } } },
        requiredFields: ['project'],
      },
      examples: {
        ...op.examples,
        representative: {
          body: { project: { name: 'my-production-db' } },
          curl: 'curl "https://console.neon.tech/api/v2/projects" -d \'{"project":{"name":"my-production-db"}}\'',
          typescript:
            'const { data } = await api.createProject({ project: { name: "my-production-db" } });',
        },
      },
    });

    expect(md).toContain('"name": "my-production-db"');
    expect(md).toContain('api.createProject');
    expect(md).not.toContain('api.listProjects({})');
  });

  it('includes CLI block when cli is set', () => {
    expect(toAgentMarkdown(op)).toContain('neon projects list');
  });

  it('omits CLI block when cli is null', () => {
    const opNoCli = { ...op, cli: null };
    expect(toAgentMarkdown(opNoCli)).not.toContain('# neonctl');
  });

  it('includes MCP section when tool is set', () => {
    const md = toAgentMarkdown(op);
    expect(md).toContain('### MCP');
    expect(md).toContain('`list_projects`');
  });

  it('omits MCP section when tool is null', () => {
    const opNoMcp = { ...op, mcp: { tool: null } };
    expect(toAgentMarkdown(opNoMcp)).not.toContain('### MCP');
  });

  it('includes Console section when breadcrumb is set', () => {
    expect(toAgentMarkdown(op)).toContain('### Console');
    expect(toAgentMarkdown(op)).toContain('Projects');
  });

  it('omits Console section when breadcrumb is null', () => {
    const opNoConsole = { ...op, console: { breadcrumb: null } };
    expect(toAgentMarkdown(opNoConsole)).not.toContain('### Console');
  });
});

describe('toFullMarkdownEntry', () => {
  it('omits oversized response examples from aggregate LLM entries', () => {
    const md = toFullMarkdownEntry({
      operationId: 'getLargeThing',
      summary: 'Get a large thing',
      method: 'GET',
      path: '/large',
      description: 'Large response operation.',
      parameters: [],
      examples: {
        curl: 'curl "https://console.neon.tech/api/v2/large"',
        typescript: 'const { data } = await api.getLargeThing({});',
      },
      response: {
        status: '200',
        example: { data: 'x'.repeat(9000) },
      },
    });

    expect(md).toContain('Large response example omitted from the aggregate LLM file');
    expect(md).not.toContain('x'.repeat(9000));
  });
});

describe('generateLlmsFull', () => {
  it('builds the aggregate API reference file', () => {
    const md = generateLlmsFull({
      projects: [
        {
          operationId: 'listProjects',
          summary: 'List projects',
          method: 'GET',
          path: '/projects',
          description: 'Retrieves projects.',
          parameters: [],
          examples: {
            curl: 'curl "https://console.neon.tech/api/v2/projects"',
            typescript: 'const { data } = await api.listProjects({});',
          },
          response: { status: '200', description: 'OK', example: null, properties: null },
        },
      ],
    });

    expect(md).toContain('# Neon Management API - Full Reference');
    expect(md).toContain('https://neon.com/docs/reference/api/llms.txt');
    expect(md).toContain('# Projects');
    expect(md).toContain('## List projects · GET /projects');
    expect(md).toContain('const { data } = await api.listProjects({});');
  });
});

// ---------------------------------------------------------------------------
// toNavYaml
// ---------------------------------------------------------------------------

describe('toNavYaml', () => {
  const ops = [
    { tag: 'projects', tagDisplay: 'Project', summary: 'List projects', id: 'list-projects' },
    { tag: 'projects', tagDisplay: 'Project', summary: 'Create project', id: 'create-project' },
    { tag: 'branches', tagDisplay: 'Branch', summary: 'List branches', id: 'list-branches' },
    { tag: 'auth-legacy', tagDisplay: 'Auth (legacy)', summary: 'Get auth', id: 'get-auth' },
  ];

  it('starts with comment header', () => {
    expect(toNavYaml(ops)).toMatch(/^# Generated by/);
  });

  it('uses tag-config display names for known tags', () => {
    const yaml = toNavYaml(ops);
    expect(yaml).toContain('title: "Projects"');
    expect(yaml).toContain('title: "Branches"');
    expect(yaml).toContain('title: "Legacy Auth"');
  });

  it('puts auth-legacy last among known tags', () => {
    const yaml = toNavYaml(ops);
    const projectIdx = yaml.indexOf('title: "Projects"');
    const legacyIdx = yaml.indexOf('title: "Legacy Auth"');
    expect(legacyIdx).toBeGreaterThan(projectIdx);
  });

  it('emits correct slug format', () => {
    expect(toNavYaml(ops)).toContain('slug: reference/api/projects/list-projects');
  });

  it('quotes titles', () => {
    expect(toNavYaml(ops)).toContain('title: "List projects"');
  });

  it('escapes double quotes in titles', () => {
    const tricky = [
      { tag: 'projects', tagDisplay: 'Project', summary: 'Say "hello"', id: 'say-hello' },
    ];
    expect(toNavYaml(tricky)).toContain('\\"hello\\"');
  });

  it('handles unknown tags by appending after the configured tag order', () => {
    const withUnknown = [
      ...ops,
      { tag: 'custom', tagDisplay: 'Custom', summary: 'Do thing', id: 'do-thing' },
    ];
    const yaml = toNavYaml(withUnknown);
    expect(yaml).toContain('title: "Custom"');
    const legacyIdx = yaml.indexOf('title: "Legacy Auth"');
    const customIdx = yaml.indexOf('title: "Custom"');
    expect(customIdx).toBeGreaterThan(legacyIdx);
  });
});

// ---------------------------------------------------------------------------
// buildCliFlags
// ---------------------------------------------------------------------------
//
describe('buildCliFlags', () => {
  const cliSchema = {
    globalOptions: {},
    commands: {
      projects: {
        options: {},
        commands: {
          create: {
            options: {
              'org-id': { type: 'string', description: 'Org to own the project' },
              name: { type: 'string', description: 'Display name' },
            },
            commands: {},
          },
          list: {
            options: {
              'org-id': { type: 'string', description: 'Filter by org' },
              cursor: { type: 'string', description: 'Pagination cursor' },
            },
            commands: {},
          },
        },
      },
    },
  };

  it('sets apiEquiv when a CLI flag maps to an API parameter', () => {
    const paramProps = [{ name: 'org_id', in: 'query' }];
    const flags = buildCliFlags('neon projects list', cliSchema, paramProps);
    const orgFlag = flags.find((f) => f.name === 'org-id');
    expect(orgFlag.apiEquiv).toBe('org_id');
  });

  it('does not set apiEquiv when a CLI flag is only a request-body field', () => {
    const paramProps = [];
    const flags = buildCliFlags('neon projects create', cliSchema, paramProps);
    const orgFlag = flags.find((f) => f.name === 'org-id');
    expect(orgFlag.apiEquiv).toBeUndefined();
  });

  it('sets no mapping when the flag has no API parameter twin', () => {
    const paramProps = [];
    const flags = buildCliFlags('neon projects create', cliSchema, paramProps);
    const nameFlag = flags.find((f) => f.name === 'name');
    expect(nameFlag.apiEquiv).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// CLI coverage fixtures
// ---------------------------------------------------------------------------

describe('CLI coverage fixtures', () => {
  const cliCoverage = readJsonFixture('scripts/data/cli-coverage.json');
  const neonctlSchema = readJsonFixture('scripts/docs-checks/neonctl/schema.json');

  it('includes Neon Auth coverage for representative operations', () => {
    expect(cliCoverage.createNeonAuth).toBe('neon neon-auth enable');
    expect(cliCoverage.getNeonAuth).toBe('neon neon-auth status');
    expect(cliCoverage.createBranchNeonAuthNewUser).toBe('neon neon-auth user create');
    expect(coverageCommands(cliCoverage.updateNeonAuthAllowLocalhost)).toEqual([
      'neon neon-auth domain allow-localhost enable',
      'neon neon-auth domain allow-localhost disable',
    ]);
  });

  it('includes neon-auth in the committed neonctl schema', () => {
    expect(neonctlSchema.commands['neon-auth']).toBeTruthy();
    expect(resolveCoverageCommand(neonctlSchema, 'neon neon-auth enable').path).toEqual([
      'neon-auth',
      'enable',
    ]);
    expect(
      resolveCoverageCommand(neonctlSchema, 'neon neon-auth domain allow-localhost enable').path
    ).toEqual(['neon-auth', 'domain', 'allow-localhost', 'enable']);
  });

  it('uses schema-valid VPC CLI commands', () => {
    expect(cliCoverage.listProjectVPCEndpoints).toBe('neon vpc project list --project-id <id>');
    expect(cliCoverage.assignProjectVPCEndpoint).toBe(
      'neon vpc project restrict <vpc_endpoint_id> --project-id <id>'
    );
    expect(cliCoverage.deleteProjectVPCEndpoint).toBe(
      'neon vpc project remove <vpc_endpoint_id> --project-id <id>'
    );
    expect(cliCoverage.deleteOrganizationVPCEndpoint).toContain('neon vpc endpoint remove');
    expect(cliCoverage.getOrganizationVPCEndpointDetails).toContain('neon vpc endpoint status');
  });

  it('all cli-coverage commands resolve to a schema command', () => {
    for (const [operationId, entry] of Object.entries(cliCoverage)) {
      for (const command of coverageCommands(entry)) {
        const { node } = resolveCoverageCommand(neonctlSchema, command);
        expect(node, `${operationId}: ${command}`).toBeTruthy();
      }
    }
  });
});

// ---------------------------------------------------------------------------
// appendCliPositionals
// ---------------------------------------------------------------------------

describe('appendCliPositionals', () => {
  const projectIdParam = { name: 'project_id', in: 'path', required: true };

  const schema = {
    globalOptions: {},
    commands: {
      projects: {
        options: {},
        commands: {
          get: { positionals: ['id'], options: {}, commands: {} },
          list: { positionals: [], options: {}, commands: {} },
          delete: { positionals: ['id'], options: {}, commands: {} },
        },
      },
      branches: {
        options: { 'project-id': { type: 'string' } },
        commands: {
          get: { positionals: ['id|name'], options: {}, commands: {} },
        },
      },
    },
  };

  it('appends positional as <param_name> when uncovered path param exists', () => {
    const result = appendCliPositionals('neon projects get', schema, [projectIdParam]);
    expect(result).toBe('neon projects get <project_id>');
  });

  it('appends multiple positionals when multiple uncovered path params', () => {
    const params = [
      { name: 'project_id', in: 'path', required: true },
      { name: 'branch_id', in: 'path', required: true },
    ];
    const schemaTwo = {
      globalOptions: {},
      commands: {
        op: {
          options: {},
          commands: {
            run: { positionals: ['a', 'b'], options: {}, commands: {} },
          },
        },
      },
    };
    const result = appendCliPositionals('neon op run', schemaTwo, params);
    expect(result).toBe('neon op run <project_id> <branch_id>');
  });

  it('leaves command unchanged when positionals already present (< token)', () => {
    const result = appendCliPositionals('neon branches get <id|name>', schema, [projectIdParam]);
    expect(result).toBe('neon branches get <id|name>');
  });

  it('leaves command unchanged when positionals already present ([ token)', () => {
    const result = appendCliPositionals('neon op [opts]', schema, [projectIdParam]);
    expect(result).toBe('neon op [opts]');
  });

  it('leaves command unchanged when no positionals in schema', () => {
    const result = appendCliPositionals('neon projects list', schema, [projectIdParam]);
    expect(result).toBe('neon projects list');
  });

  it('leaves command unchanged when path param is already covered by a flag', () => {
    // branches get has project-id as an inherited flag option
    const result = appendCliPositionals('neon branches get', schema, [projectIdParam]);
    expect(result).toBe('neon branches get');
  });

  it('returns command unchanged when cliSchema is null', () => {
    const result = appendCliPositionals('neon projects get', null, [projectIdParam]);
    expect(result).toBe('neon projects get');
  });

  it('returns command unchanged when command path not found in schema', () => {
    const result = appendCliPositionals('neon unknown cmd', schema, [projectIdParam]);
    expect(result).toBe('neon unknown cmd');
  });
});

// ---------------------------------------------------------------------------
// resolveCliPositionals
// ---------------------------------------------------------------------------

describe('resolveCliPositionals', () => {
  const branchIdParam = { name: 'branch_id', in: 'path', required: true };
  const projectIdParam = { name: 'project_id', in: 'path', required: true };
  const roleNameParam = { name: 'role_name', in: 'path', required: true };

  const schema = {
    globalOptions: {},
    commands: {
      branches: {
        options: { 'project-id': { type: 'string' } },
        commands: {
          get: { positionals: ['id|name'], options: {}, commands: {} },
        },
      },
      roles: {
        options: {},
        commands: {
          get: {
            positionals: ['role'],
            options: { 'project-id': { type: 'string' } },
            commands: {},
          },
        },
      },
      projects: {
        options: {},
        commands: {
          get: { positionals: ['id'], options: {}, commands: {} },
        },
      },
      op: {
        options: {},
        commands: {
          run: { positionals: [], options: {}, commands: {} },
        },
      },
    },
  };

  it('maps standalone <id|name> token to branch_id for neon branches get', () => {
    // project_id is covered by --project-id flag; branch_id is uncovered → mapped to <id|name>
    const { command, positionals } = resolveCliPositionals('neon branches get <id|name>', schema, [
      projectIdParam,
      branchIdParam,
    ]);
    expect(command).toBe('neon branches get <id|name>');
    expect(positionals).toEqual([{ display: '<id|name>', apiEquiv: 'branch_id' }]);
  });

  it('treats <role> as standalone and <id> after --project-id as flag-embedded', () => {
    // neon roles get <role> --project-id <id>
    // <role> is standalone → apiEquiv: first uncovered path param by index
    // <id> follows --project-id → NOT standalone → not in positionals
    // In this schema, roles get has --project-id in its options, so project_id is covered.
    // paramProps order: [role_name, project_id] → uncovered = [role_name] → <role> maps to role_name
    const params = [roleNameParam, projectIdParam];
    const { command, positionals } = resolveCliPositionals(
      'neon roles get <role> --project-id <id>',
      schema,
      params
    );
    expect(command).toBe('neon roles get <role> --project-id <id>');
    expect(positionals).toHaveLength(1);
    expect(positionals[0].display).toBe('<role>');
    expect(positionals[0].apiEquiv).toBe('role_name');
  });

  it('auto-appends positional from schema and maps it to project_id', () => {
    // neon projects get has positionals: ['id'] in schema, no < in command → appended
    const { command, positionals } = resolveCliPositionals('neon projects get', schema, [
      projectIdParam,
    ]);
    expect(command).toBe('neon projects get <project_id>');
    expect(positionals).toEqual([{ display: '<project_id>', apiEquiv: 'project_id' }]);
  });

  it('returns empty positionals when command has no positional tokens', () => {
    const { command, positionals } = resolveCliPositionals('neon op run', schema, [projectIdParam]);
    expect(command).toBe('neon op run');
    expect(positionals).toEqual([]);
  });

  it('returns token with apiEquiv null when cliSchema is null', () => {
    // No schema → no coverage computation, apiEquiv is null
    const { command, positionals } = resolveCliPositionals('neon branches get <id|name>', null, [
      branchIdParam,
    ]);
    expect(command).toBe('neon branches get <id|name>');
    expect(positionals).toHaveLength(1);
    expect(positionals[0].display).toBe('<id|name>');
    expect(positionals[0].apiEquiv).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// descriptionToHtml — XSS prevention (M2)
// ---------------------------------------------------------------------------

// SAFETY INVARIANT: micromark must escape raw HTML and neutralize javascript:/data:
// URLs in markdown links. These tests lock the invariant against future regressions
// (e.g. accidentally enabling allowDangerousHtml or swapping the renderer).
describe('descriptionToHtml — XSS prevention', () => {
  it('escapes raw script tags', () => {
    const out = descriptionToHtml('<script>alert(1)</script>');
    expect(out).not.toContain('<script>');
    expect(out).toContain('&lt;script&gt;');
  });

  it('neutralizes javascript: URLs in markdown links', () => {
    const out = descriptionToHtml('[x](javascript:alert(1))');
    expect(out).toMatch(/href="(|#)"/);
    expect(out).not.toContain('javascript:');
  });

  it('neutralizes data: URLs in markdown links', () => {
    const out = descriptionToHtml('[x](data:text/html,<script>alert(1)</script>)');
    expect(out).toMatch(/href="(|#)"/);
    expect(out).not.toContain('data:');
  });

  it('escapes raw HTML so inline event handlers cannot execute', () => {
    const out = descriptionToHtml('<img src=x onerror=alert(1)>');
    // The literal "onerror" text may appear as escaped content, but the
    // surrounding angle brackets must be escaped so the browser never parses
    // it as a tag with an attribute.
    expect(out).not.toContain('<img');
    expect(out).toContain('&lt;img');
  });

  it('preserves safe markdown', () => {
    const out = descriptionToHtml('**bold** [link](https://example.com)');
    expect(out).toContain('<strong>bold</strong>');
    expect(out).toContain('href="https://example.com"');
  });
});

// ---------------------------------------------------------------------------
// FIELD_ORDER / computeDisplayOrder (m6)
// ---------------------------------------------------------------------------

describe('computeDisplayOrder', () => {
  // The manual editorial order in FIELD_ORDER must beat the heuristic so docs
  // authors can reorder fields without changing the spec.
  it('respects manual FIELD_ORDER override over heuristic scoring', () => {
    const properties = {
      branch: {},
      project: {},
      operations: {},
      connection_uris: {},
      roles: {},
      databases: {},
      endpoints: {},
    };
    const order = computeDisplayOrder('createProject', properties, [], 'response');
    expect(order).toEqual(FIELD_ORDER.createProject.response);
  });

  // Required fields jump to the top via the scorer (score 1000 vs all others).
  it('puts required fields first, then heuristic order, with timestamps last', () => {
    const properties = {
      created_at: {},
      id: {},
      name: {},
      description: {},
      project_id: {},
    };
    const order = computeDisplayOrder('listFoo', properties, ['project_id'], 'response');
    expect(order[0]).toBe('project_id');
    expect(order[order.length - 1]).toBe('created_at');
    // `id` outranks `name` by the scorer (70 vs 68).
    expect(order.indexOf('id')).toBeLessThan(order.indexOf('name'));
  });

  // Empty / unknown inputs must not crash.
  it('returns [] for null properties or no keys, and ignores unknown operationId / pathKey', () => {
    expect(computeDisplayOrder('x', null, [], 'response')).toEqual([]);
    expect(computeDisplayOrder('x', {}, [], 'response')).toEqual([]);
    // Unknown op falls back to heuristic — output must include every input key.
    const out = computeDisplayOrder('totallyNew', { foo: {}, bar: {} }, [], 'response');
    expect(out.sort()).toEqual(['bar', 'foo']);
  });
});

// ---------------------------------------------------------------------------
// buildOperationData — wiring (M6)
// ---------------------------------------------------------------------------

// Confirms buildOperationData ties together slug computation and the oneOf
// note appending. Direct unit tests on flattenOneOf already cover the note
// content; these tests verify the wiring into response.descriptionHtml.
describe('buildOperationData', () => {
  const callBuild = (specRaw, pathStr, method) => {
    const pathItem = specRaw.paths[pathStr];
    const op = pathItem[method];
    return buildOperationData(pathStr, pathItem, op, method, {}, {}, {}, null, {}, {}, {}, specRaw);
  };

  it('derives slug from operationId for a normal op (no oneOf note)', () => {
    const spec = {
      paths: {
        '/projects/{id}': {
          get: {
            operationId: 'getProject',
            tags: ['Project'],
            responses: {
              200: {
                description: 'Project found',
                content: {
                  'application/json': {
                    schema: { type: 'object', properties: { id: { type: 'string' } } },
                  },
                },
              },
            },
          },
        },
      },
    };
    const data = callBuild(spec, '/projects/{id}', 'get');
    expect(data.id).toBe('get-project');
    expect(data.operationId).toBe('getProject');
    expect(data.response).toBeTruthy();
    expect(data.response.description).toBe('Project found');
    expect(data.response.descriptionHtml).not.toContain('variant');
  });

  it('appends flattenOneOf note to response.descriptionHtml when schema is polymorphic', () => {
    const spec = {
      paths: {
        '/foo': {
          get: {
            operationId: 'getFoo',
            tags: ['Foo'],
            responses: {
              200: {
                description: 'OK',
                content: {
                  'application/json': {
                    schema: {
                      // variant1 has more properties so it wins primary;
                      // variant2 becomes the alternate documented in the note.
                      oneOf: [
                        {
                          type: 'object',
                          properties: { a: { type: 'string' }, b: { type: 'string' } },
                        },
                        {
                          type: 'object',
                          properties: { c: { type: 'string' } },
                          required: ['c'],
                        },
                      ],
                    },
                  },
                },
              },
            },
          },
        },
      },
    };
    const data = callBuild(spec, '/foo', 'get');
    // Note must appear in BOTH the plain description (used by llms.txt) and
    // the rendered HTML (used by the UI). The alternate variant is `variant2`
    // since `variant1` (2 props) wins the primary tiebreak.
    expect(data.response.description).toContain('variant2');
    expect(data.response.descriptionHtml).toContain('variant2');
    expect(data.response.descriptionHtml).toContain('<strong>Alternative shape:</strong>');
  });
});

// ---------------------------------------------------------------------------
// main() — empty spec safety (C1 + C2)
// ---------------------------------------------------------------------------

describe('main() — empty spec safety', () => {
  const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  const DATA_TMP = resolve(ROOT, 'src/data/api-ref.next');
  const MD_TMP = resolve(ROOT, 'public/md/docs/reference/api.next');
  const CACHE_TMP = resolve(ROOT, '.next/cache/api-reference-test/openapi-v2.json');
  const CACHE_TMP_DIR = dirname(CACHE_TMP);
  const originalCachePath = process.env.API_REF_SPEC_CACHE_PATH;

  const stubSpec = (paths) =>
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => ({
          openapi: '3.0.0',
          info: { title: 't', version: '0.0.0' },
          paths,
        }),
      })
    );

  beforeEach(() => {
    process.env.API_REF_SPEC_CACHE_PATH = CACHE_TMP;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    rmSync(DATA_TMP, { recursive: true, force: true });
    rmSync(MD_TMP, { recursive: true, force: true });
    rmSync(CACHE_TMP_DIR, { recursive: true, force: true });
    if (originalCachePath === undefined) {
      delete process.env.API_REF_SPEC_CACHE_PATH;
    } else {
      process.env.API_REF_SPEC_CACHE_PATH = originalCachePath;
    }
  });

  it('throws when spec has no operations, never touches DATA_ROOT/MD_ROOT', async () => {
    stubSpec({});
    await expect(main()).rejects.toThrow(/refusing to publish empty API reference/);
    expect(existsSync(CACHE_TMP)).toBe(false);
  });

  it('skips paths whose operation has no operationId (counts as 0, throws)', async () => {
    stubSpec({
      '/foo': { get: { tags: ['x'], responses: { 200: { description: 'OK' } } } },
    });
    await expect(main()).rejects.toThrow(/refusing to publish empty API reference/);
    expect(existsSync(CACHE_TMP)).toBe(false);
  });
});
