#!/usr/bin/env node
// Generates per-operation JSON data files and agent-optimized markdown.
// Runs in CI — all inputs are publicly accessible.
//
// Usage: node scripts/generate-api-ref.mjs [spec-url]

import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { dereference } from '@scalar/openapi-parser';

import { computeDisplayOrder } from './lib/field-order-config.mjs';
import { computeFieldGroups } from './lib/field-group-config.mjs';
import {
  commitApiRefOutput,
  createApiRefPaths,
  loadApiRefSidecars,
  prepareApiRefOutput,
  writeApiIndexMarkdown,
  writeExtraApiDocs,
  writeLlmsIndex,
  writeNavigationYaml,
  writeOperationOutput,
  writeRunSummary,
  writeTagMarkdownFiles,
} from './lib/api-ref-output.mjs';
import {
  DEFAULT_SPEC_CACHE_TTL_MS,
  defaultSpecCachePath,
  loadOpenApiSpec,
  writeOpenApiSpecCache,
} from './lib/openapi-spec-source.mjs';
import { validateFieldGroups } from './validate-field-groups.mjs';
import {
  mergeParams,
  flattenAllOf,
  flattenOneOf,
  find2xxResponse,
  getRequestBodyExample,
  stripMarkdownLinks,
  descriptionToHtml,
  resolveLocalRef,
  discriminatorLabelsFromRaw,
  getRawSchemaAt,
} from './lib/spec-utils.mjs';
import { loadTagConfig } from './lib/tag-config.mjs';
import { buildTs, toSdkMethodName } from '../src/utils/api-ref.mjs';

// Single source of truth for neonctl global flags that should not count as
// API-specific flag mappings.
const CLI_GLOBAL_FLAGS_LIST = JSON.parse(
  readFileSync(
    resolve(dirname(fileURLToPath(import.meta.url)), 'data/cli-global-flags.json'),
    'utf8'
  )
);

// Re-export the same names so consumers (notably tests) can pull them from
// the generator entry point without importing the helper modules directly.
export {
  mergeParams,
  flattenAllOf,
  flattenOneOf,
  find2xxResponse,
  getRequestBodyExample,
  stripMarkdownLinks,
  descriptionToHtml,
  toSdkMethodName,
  resolveLocalRef,
  discriminatorLabelsFromRaw,
  getRawSchemaAt,
};

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PATHS = createApiRefPaths(ROOT);

const SPEC_URL = process.argv[2] || 'https://neon.com/api_spec/release/v2.json';
const METHODS = ['get', 'post', 'put', 'patch', 'delete'];

function getSpecCacheConfig() {
  const cachePath = process.env.API_REF_SPEC_CACHE_PATH || defaultSpecCachePath(ROOT);
  const ttlMs = Number(process.env.API_REF_SPEC_CACHE_TTL_MS || DEFAULT_SPEC_CACHE_TTL_MS);
  if (!Number.isFinite(ttlMs) || ttlMs < 0) {
    throw new Error('API_REF_SPEC_CACHE_TTL_MS must be a non-negative number');
  }
  return { cachePath, ttlMs };
}

// ---------------------------------------------------------------------------
// Pure transformation functions — exported for testing
// ---------------------------------------------------------------------------

export function toSlug(operationId) {
  return operationId
    .replace(/([a-z\d])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

export function toTagSlug(tag) {
  return tag
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// ---------------------------------------------------------------------------
// Generator-specific pure functions
// ---------------------------------------------------------------------------

export function buildDetails(prop) {
  const description = prop.description?.trim() || null;
  const example =
    prop.example !== undefined
      ? typeof prop.example === 'object' && prop.example !== null
        ? JSON.stringify(prop.example, null, 2)
        : String(prop.example)
      : null;
  const values = prop.enum ? prop.enum.map(String) : null;
  if (description === null && example === null && values === null) return null;
  const descriptionHtml = description ? descriptionToHtml(description) : null;
  return { description, descriptionHtml, example, values };
}

export function enrichSchemaProperties(properties, depth = 0) {
  if (!properties || depth > 10) return properties;
  const enriched = {};
  for (const [name, prop] of Object.entries(properties)) {
    const flat = flattenAllOf(prop) ?? prop;
    const details = buildDetails(flat);
    const enrichedProp = { ...flat, ...(details ? { details } : {}) };
    if (flat.type === 'object' && flat.properties) {
      enrichedProp.properties = enrichSchemaProperties(flat.properties, depth + 1);
    }
    if (flat.type === 'array' && flat.items?.properties) {
      enrichedProp.items = {
        ...flat.items,
        properties: enrichSchemaProperties(flat.items.properties, depth + 1),
      };
    }
    enriched[name] = enrichedProp;
  }
  return enriched;
}

export function toCurlExample(method, path, parameters, requestBody) {
  const upper = method.toUpperCase();
  const urlPath = path.replace(/\{([^}]+)\}/g, (_, name) => `$${name.toUpperCase()}`);

  const requiredQuery = parameters.filter((p) => p.in === 'query' && p.required);
  const queryString =
    requiredQuery.length > 0
      ? '?' + requiredQuery.map((p) => `${p.name}=${requiredQueryValueForCurl(p)}`).join('&')
      : '';

  const url = `https://console.neon.tech/api/v2${urlPath}${queryString}`;

  const parts = [`curl "${url}"`];
  if (upper !== 'GET') parts.push(`  -X ${upper}`);
  parts.push(`  -H "Authorization: Bearer $NEON_API_KEY"`);

  const bodyExample = requestBody ? getRequestBodyExample(requestBody) : null;
  if (bodyExample !== null) {
    parts.push(`  -H "Content-Type: application/json"`);
    parts.push(`  -d '${safeJsonStringify(bodyExample).replace(/'/g, "'\\''")}'`);
  }

  return parts.join(' \\\n');
}

export function toTypescriptExample(operationId, parameters, requestBody = null) {
  const bodyExample = requestBody ? sanitizeExample(getRequestBodyExample(requestBody) ?? {}) : {};
  const paramValues = {};
  for (const p of parameters) {
    if (p.example !== undefined && p.example !== null) paramValues[p.name] = p.example;
  }
  return buildTs({ operationId, parameters }, paramValues, new Set(), bodyExample);
}

function setDotted(target, path, value) {
  const parts = path.split('.');
  if (
    parts.some((part) => part === '__proto__' || part === 'prototype' || part === 'constructor')
  ) {
    return;
  }
  let cursor = target;
  for (const part of parts.slice(0, -1)) {
    if (!cursor[part] || typeof cursor[part] !== 'object' || Array.isArray(cursor[part])) {
      cursor[part] = {};
    }
    cursor = cursor[part];
  }
  cursor[parts[parts.length - 1]] = value;
}

const SENSITIVE_KEY_RE = /(password|passwd|secret|api[_-]?key|token)/i;
const CONNECTION_STRING_RE = /^postgres(?:ql)?:\/\/[^@]+@[^/]+\/[^?\s]+(?:\?[^ \s]*)?$/i;
const MAX_LLMS_FULL_RESPONSE_EXAMPLE_CHARS = 8000;

function normalizeConnectionString(value) {
  try {
    const url = new URL(value);
    if (!['postgres:', 'postgresql:'].includes(url.protocol)) return value;
    if (!url.searchParams.has('sslmode')) url.searchParams.set('sslmode', 'require');
    if (!url.searchParams.has('channel_binding'))
      url.searchParams.set('channel_binding', 'require');
    const query = url.searchParams.toString();
    return `${url.protocol}//[user]:[password]@${url.host}${url.pathname}${query ? `?${query}` : ''}`;
  } catch {
    return value;
  }
}

export function sanitizeExample(value, key = '') {
  if (Array.isArray(value)) return value.map((item) => sanitizeExample(item, key));
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([childKey, childValue]) => [
        childKey,
        sanitizeExample(childValue, childKey),
      ])
    );
  }
  if (typeof value !== 'string') return value;
  if (SENSITIVE_KEY_RE.test(key)) return `<${key}>`;
  if (CONNECTION_STRING_RE.test(value)) return normalizeConnectionString(value);
  return value;
}

function safeJsonStringify(value, space) {
  return JSON.stringify(sanitizeExample(value), null, space);
}

function requiredQueryValueForCurl(param) {
  if (param.example === undefined || param.example === null) return `$${param.name.toUpperCase()}`;
  return encodeURIComponent(String(sanitizeExample(param.example, param.name)));
}

export function buildRepresentativeExamples(operation, seed, bodyExample) {
  let body = bodyExample ?? null;
  if (seed && Object.keys(seed).length > 0) {
    body = {};
    for (const [path, value] of Object.entries(seed)) {
      setDotted(body, path, value);
    }
  }

  if (!body) return null;

  body = sanitizeExample(body);
  const params = {};
  const included = new Set();
  return {
    body,
    curl: toCurlFromBody(operation, body),
    typescript: buildTs(operation, params, included, body),
  };
}

function toCurlFromBody(operation, bodyJson) {
  const urlPath = operation.path.replace(/\{([^}]+)\}/g, (_, name) => `$${name.toUpperCase()}`);
  const requiredQuery = (operation.parameters ?? []).filter((p) => p.in === 'query' && p.required);
  const queryString =
    requiredQuery.length > 0
      ? '?' + requiredQuery.map((p) => `${p.name}=${requiredQueryValueForCurl(p)}`).join('&')
      : '';

  const parts = [`curl "https://console.neon.tech/api/v2${urlPath}${queryString}"`];
  if (operation.method !== 'GET') parts.push(`  -X ${operation.method}`);
  parts.push(`  -H "Authorization: Bearer $NEON_API_KEY"`);
  if (bodyJson && Object.keys(bodyJson).length > 0) {
    parts.push(`  -H "Content-Type: application/json"`);
    parts.push(`  -d '${safeJsonStringify(bodyJson).replace(/'/g, "'\\''")}'`);
  }
  return parts.join(' \\\n');
}

function pushText(lines, text, indent = '') {
  if (!text) return;
  for (const line of String(text).split('\n')) {
    lines.push(`${indent}${line}`);
  }
}

function renderPropsMarkdown(lines, props, requiredFields, depth) {
  const indent = '  '.repeat(depth);
  for (const [name, prop] of Object.entries(props)) {
    const req = requiredFields.includes(name) ? 'required' : 'optional';
    const type = prop.type ?? (prop.allOf ? 'object' : 'any');
    const modifiers = [req];
    if (prop.deprecated) modifiers.push('deprecated');
    if (prop.format) modifiers.push(`format: ${prop.format}`);
    lines.push(`${indent}- \`${name}\` (${type}, ${modifiers.join(', ')})`);
    if (prop.description) {
      pushText(lines, prop.description, `${indent}  `);
    }
    if (prop.enum) {
      lines.push(`${indent}  Possible values: ${prop.enum.map((v) => `\`${v}\``).join(', ')}`);
    }
    if (prop.default !== undefined && prop.default !== null) {
      lines.push(`${indent}  Default: \`${prop.default}\``);
    }

    const childProps =
      type === 'object' && prop.properties
        ? prop.properties
        : type === 'array' && prop.items?.properties
          ? prop.items.properties
          : null;
    if (childProps) {
      const childRequired = type === 'array' ? (prop.items?.required ?? []) : (prop.required ?? []);
      renderPropsMarkdown(lines, childProps, childRequired, depth + 1);
    }
  }
}

export function toLlmsTxtLine(op) {
  return `${op.method} ${op.path} — ${op.summary} — /docs/reference/api/${op.tag}/${op.id}`;
}

export function toAgentMarkdown(op) {
  const lines = [];

  // Breadcrumb navigation context
  const tagDisplay = op.tagDisplay || op.tag;
  lines.push(`> API Reference / ${tagDisplay} / ${op.summary}`);
  lines.push('');

  lines.push(`## ${op.method} ${op.path}`);
  lines.push('');
  pushText(lines, op.description || op.summary);
  lines.push('');

  if (op.parameters?.length > 0) {
    lines.push('### Parameters');
    lines.push('');
    for (const p of op.parameters) {
      const req = p.required ? 'required' : 'optional';
      lines.push(`- \`${p.name}\` (${p.type ?? 'string'}, ${p.in}, ${req})`);
      pushText(lines, p.description, '  ');
      if (p.default !== undefined && p.default !== null) lines.push(`  Default: \`${p.default}\``);
    }
    lines.push('');
  }

  if (op.requestBody) {
    lines.push('### Request body');
    lines.push('');
    renderPropsMarkdown(
      lines,
      op.requestBody.properties || {},
      op.requestBody.requiredFields || [],
      0
    );
    const requestExample = op.examples?.representative?.body ?? op.examples?.bodyExample;
    if (requestExample) {
      lines.push('');
      lines.push('```json');
      lines.push(safeJsonStringify(requestExample, 2));
      lines.push('```');
    }
    lines.push('');
  }

  if (op.response) {
    lines.push(`### Response (${op.response.status})`);
    lines.push('');
    if (op.response.example) {
      const exStr = safeJsonStringify(op.response.example, 2);
      lines.push('```json');
      lines.push(exStr);
      lines.push('```');
    } else if (op.response.properties) {
      renderPropsMarkdown(lines, op.response.properties, [], 0);
    } else {
      lines.push(op.response.description || '');
    }
    lines.push('');
  }

  lines.push('### Code examples');
  lines.push('');
  lines.push('```bash');
  lines.push(op.examples?.representative?.curl ?? op.examples.curl);
  lines.push('```');
  lines.push('');
  lines.push('```typescript');
  lines.push(op.examples?.representative?.typescript ?? op.examples.typescript);
  lines.push('```');
  lines.push('');
  if (op.cli?.command) {
    lines.push('```bash');
    lines.push('# neonctl');
    lines.push(op.cli.command);
    lines.push('```');
    lines.push('');
  }

  if (op.mcp?.tool) {
    lines.push('### MCP');
    lines.push('');
    lines.push(`Tool: \`${op.mcp.tool}\``);
    if (op.mcp.description) {
      lines.push('');
      lines.push(op.mcp.description);
    }
    if (op.mcp.arguments?.length > 0) {
      lines.push('');
      for (const a of op.mcp.arguments) {
        const req = a.required ? 'required' : 'optional';
        const meta = [a.type ?? 'string', req];
        if (a.default !== undefined) meta.push(`default: ${a.default}`);
        lines.push(`- \`${a.name}\` (${meta.join(', ')})`);
        if (a.description) lines.push(`  ${a.description}`);
      }
    }
    lines.push('');
  }

  if (op.console?.breadcrumb) {
    lines.push('### Console');
    lines.push('');
    lines.push(`Console path: ${op.console.breadcrumb}`);
    lines.push('');
  }

  if (op.errors?.length > 0) {
    lines.push('### Errors');
    lines.push('');
    for (const err of op.errors) {
      lines.push(`**${err.status}**`);
      pushText(lines, err.description, '');
      if (err.properties) {
        renderPropsMarkdown(lines, err.properties, err.required ?? [], 0);
      }
      lines.push('');
    }
  }

  return lines.join('\n').trimEnd() + '\n';
}

// Per-op .md files — YAML frontmatter prepended to toAgentMarkdown content.
// The frontmatter provides machine-readable metadata for tools that index these files directly.
function toPerOpMarkdown(op) {
  const interfaces = ['api', 'sdk'];
  if (op.cli?.command || op.cli?.commands?.length) interfaces.push('cli');
  if (op.mcp?.tool) interfaces.push('mcp');
  if (op.console?.breadcrumb) interfaces.push('console');
  const frontmatter = [
    '---',
    `operationId: ${JSON.stringify(op.operationId)}`,
    `method: ${JSON.stringify(op.method)}`,
    `path: ${JSON.stringify(op.path)}`,
    `tag: ${JSON.stringify(op.tag)}`,
    ...(op.stability ? [`stability: ${JSON.stringify(op.stability)}`] : []),
    `interfaces: [${interfaces.map((s) => JSON.stringify(s)).join(', ')}]`,
    '---',
    '',
  ].join('\n');
  return frontmatter + toAgentMarkdown(op);
}

// Used only for llms-full.txt — no breadcrumb, H2 heading for easy scanning in a large file.
export function toFullMarkdownEntry(op) {
  const lines = [];

  lines.push(`## ${op.summary} · ${op.method} ${op.path}`);
  lines.push('');
  lines.push(`*${op.operationId}*`);
  lines.push('');
  pushText(lines, op.description || op.summary);
  lines.push('');

  if (op.parameters?.length > 0) {
    lines.push('### Parameters');
    lines.push('');
    for (const p of op.parameters) {
      const req = p.required ? 'required' : 'optional';
      lines.push(`- \`${p.name}\` (${p.type ?? 'string'}, ${p.in}, ${req})`);
      pushText(lines, p.description, '  ');
      if (p.default !== undefined && p.default !== null) lines.push(`  Default: \`${p.default}\``);
    }
    lines.push('');
  }

  if (op.requestBody) {
    lines.push('### Request body');
    lines.push('');
    renderPropsMarkdown(
      lines,
      op.requestBody.properties || {},
      op.requestBody.requiredFields || [],
      0
    );
    const requestExample = op.examples?.representative?.body ?? op.examples?.bodyExample;
    if (requestExample) {
      lines.push('');
      lines.push('```json');
      lines.push(safeJsonStringify(requestExample, 2));
      lines.push('```');
    }
    lines.push('');
  }

  if (op.response) {
    lines.push(`### Response (${op.response.status})`);
    lines.push('');
    if (op.response.example) {
      const exStr = safeJsonStringify(op.response.example, 2);
      if (exStr.length > MAX_LLMS_FULL_RESPONSE_EXAMPLE_CHARS) {
        lines.push(
          `Large response example omitted from the aggregate LLM file (${exStr.length} characters). Fetch the per-operation markdown for the full example.`
        );
      } else {
        lines.push('```json');
        lines.push(exStr);
        lines.push('```');
      }
    } else if (op.response.properties) {
      renderPropsMarkdown(lines, op.response.properties, [], 0);
    } else {
      lines.push(op.response.description || '');
    }
    lines.push('');
  }

  lines.push('### curl');
  lines.push('');
  lines.push('```bash');
  lines.push(op.examples?.representative?.curl ?? op.examples.curl);
  lines.push('```');
  lines.push('');

  lines.push('### TypeScript SDK');
  lines.push('');
  lines.push('```typescript');
  lines.push(op.examples?.representative?.typescript ?? op.examples.typescript);
  lines.push('```');
  lines.push('');

  if (op.cli?.command) {
    lines.push('### CLI');
    lines.push('');
    lines.push('```bash');
    lines.push(op.cli.command);
    lines.push('```');
    lines.push('');
  }

  if (op.mcp?.tool) {
    lines.push('### MCP');
    lines.push('');
    lines.push(`Tool: \`${op.mcp.tool}\``);
    if (op.mcp.arguments?.length > 0) {
      lines.push('');
      for (const a of op.mcp.arguments) {
        const req = a.required ? 'required' : 'optional';
        const meta = [a.type ?? 'string', req];
        if (a.default !== undefined) meta.push(`default: ${a.default}`);
        lines.push(`- \`${a.name}\` (${meta.join(', ')})`);
        if (a.description) lines.push(`  ${a.description}`);
      }
    }
    lines.push('');
  }

  return lines.join('\n').trimEnd();
}

// ---------------------------------------------------------------------------
// Navigation YAML generation
// ---------------------------------------------------------------------------

// Tag metadata — single source of truth lives in scripts/data/tag-config.json,
// loaded once at module init. The legacy inline TAG_OVERRIDE / TAG_SLUG_URL /
// TAG_CONFIG.display constants + tag-order.json + tag-groups.json all came
// from there. main() re-loads with the spec for cross-validation.
let TAG_CONFIG = loadTagConfig();

// ---------------------------------------------------------------------------
// Agent index generators — one per interface
// ---------------------------------------------------------------------------

const NEON_BASE = 'https://neon.com';

function opMdUrl(op) {
  return `${NEON_BASE}/docs/reference/api/${op.tag}/${op.id}.md`;
}

function orderedTagList(tagOps) {
  return [
    ...TAG_CONFIG.tagOrder.filter((t) => tagOps[t]?.length),
    ...Object.keys(tagOps).filter((t) => !TAG_CONFIG.tagOrder.includes(t) && tagOps[t]?.length),
  ];
}

function generateLlmsTxt(tagOps) {
  const lines = [
    '# Neon Management API',
    '',
    'Base URL: https://console.neon.tech/api/v2',
    'Auth: `Authorization: Bearer $NEON_API_KEY`',
    '',
    'Neon interface-specific indexes:',
    `- [API endpoint index](${NEON_BASE}/docs/reference/api.md): all endpoints grouped by resource, each with curl and SDK examples`,
    `- [Neon CLI](${NEON_BASE}/docs/cli.md): Neon CLI commands, options, and usage`,
    `- [OpenAPI spec](${NEON_BASE}/api_spec/release/v2.json): machine-readable schemas for request/response validation and codegen`,
    '',
  ];

  for (const tag of orderedTagList(tagOps)) {
    lines.push(`## ${TAG_CONFIG.display[tag] || tag}`);
    lines.push('');
    for (const op of tagOps[tag]) {
      lines.push(`- [${op.summary}](${opMdUrl(op)}) \`${op.method} ${op.path}\``);
    }
    lines.push('');
  }

  return lines.join('\n').trimEnd() + '\n';
}

export function generateLlmsFull(tagOps) {
  const lines = [
    '# Neon Management API - Full Reference',
    '',
    `> This file contains the full Neon Management API reference. For a table of contents, see ${NEON_BASE}/docs/reference/api/llms.txt`,
    `> For the canonical API overview, see ${NEON_BASE}/docs/reference/api.md`,
    '',
    'Base URL: https://console.neon.tech/api/v2',
    'Auth: `Authorization: Bearer $NEON_API_KEY`',
    '',
  ];

  for (const tag of orderedTagList(tagOps)) {
    lines.push(`# ${TAG_CONFIG.display[tag] || tag}`);
    lines.push('');
    for (const op of tagOps[tag]) {
      lines.push(toFullMarkdownEntry(op));
      lines.push('');
    }
  }

  return lines.join('\n').trimEnd() + '\n';
}

// Top-level api.md — served at /docs/reference/api.md via rewrite → /md/docs/reference/api.md
// Richer than llms.txt: each section links to its per-tag full .md file before listing individual ops.
function generateApiMd(tagOps) {
  const lines = [
    '# Neon API Reference',
    '',
    'Base URL: https://console.neon.tech/api/v2',
    'Auth: `Authorization: Bearer $NEON_API_KEY`',
    '',
    'Interface-specific indexes:',
    `- [API endpoint index](${NEON_BASE}/docs/reference/api.md): all endpoints grouped by resource, each with curl and SDK examples`,
    `- [Neon CLI](${NEON_BASE}/docs/cli.md): Neon CLI commands, options, and usage`,
    `- [OpenAPI spec](${NEON_BASE}/api_spec/release/v2.json): machine-readable schemas for request/response validation and codegen`,
    '',
  ];

  for (const tag of orderedTagList(tagOps)) {
    const displayName = TAG_CONFIG.display[tag] || tag;
    const tagUrl = `${NEON_BASE}/docs/reference/api/${tag}.md`;
    lines.push(`## ${displayName}`);
    lines.push('');
    lines.push(`[All ${tag} endpoints](${tagUrl})`);
    lines.push('');
    for (const op of tagOps[tag]) {
      lines.push(`- [${op.summary}](${opMdUrl(op)}) \`${op.method} ${op.path}\``);
    }
    lines.push('');
  }

  return lines.join('\n').trimEnd() + '\n';
}

// Global CLI flags carried by every neonctl command (--help, --api-key,
// etc.). Single source of truth lives in scripts/data/cli-global-flags.json;
// operation-shared.jsx imports the same file so the generator + UI can't
// drift.
const GLOBAL_CLI_FLAGS = new Set(CLI_GLOBAL_FLAGS_LIST);

// Return operationIds with CLI coverage where the kebab→snake heuristic in
// buildCliFlags failed to map any non-global flag to its API param twin.
// Exclusions (skip the warning):
//   - operation has 0 non-global flags (nothing to map)
//   - operation has 0 API params (heuristic compares against params)
//   - operation is pure-positional (>=1 positional AND 0 non-global flags)
// Returns an empty array when everything is healthy.
export function findOpsWithNoFlagMappings(allOps) {
  const unmapped = [];
  for (const op of allOps) {
    if (!op.cli?.command) continue; // multi-cmd ops have flags per-cmd; out of scope
    if (!op.parameters?.length) continue;
    const nonGlobal = (op.cli.flags ?? []).filter((f) => !GLOBAL_CLI_FLAGS.has(f.name));
    if (nonGlobal.length === 0) continue; // nothing to map
    const mapped = nonGlobal.filter((f) => f.apiEquiv);
    if (mapped.length === 0) unmapped.push(op.operationId);
  }
  return unmapped;
}

export function toNavYaml(allOps) {
  const byTag = {};
  for (const op of allOps) {
    if (!byTag[op.tag]) byTag[op.tag] = [];
    byTag[op.tag].push(op);
  }

  const tagSlugs = [
    ...TAG_CONFIG.tagOrder.filter((t) => byTag[t]),
    ...Object.keys(byTag).filter((t) => !TAG_CONFIG.tagOrder.includes(t)),
  ];

  const lines = ['# Generated by scripts/generate-api-ref.mjs — do not edit by hand'];
  for (const tag of tagSlugs) {
    const ops = byTag[tag];
    const sectionName = TAG_CONFIG.display[tag] || ops[0]?.tagDisplay || tag;
    lines.push(`- title: ${JSON.stringify(sectionName)}`);
    lines.push(`  slug: reference/api/${tag}`);
    lines.push('  items:');
    const sorted = [...ops].sort((a, b) => (a.deprecated ? 1 : 0) - (b.deprecated ? 1 : 0));
    for (const op of sorted) {
      lines.push(`    - title: ${JSON.stringify(op.summary)}`);
      lines.push(`      slug: reference/api/${op.tag}/${op.id}`);
      lines.push(`      method: ${op.method}`);
      if (op.deprecated) {
        lines.push(`      tag: deprecated`);
        lines.push(`      tagTheme: orange`);
      }
    }
  }
  return lines.join('\n') + '\n';
}

// ---------------------------------------------------------------------------
// Operation data builder
// ---------------------------------------------------------------------------

// Walk the command path and collect options from every ancestor + the leaf.
// This ensures parent-level options (e.g. `--project-id` on `branches`) are
// inherited by subcommands that don't redeclare them (e.g. `branches list`).
function collectCliPathOptions(commandStr, cliSchema) {
  if (!cliSchema) return {};
  const parts = commandStr
    .replace(/^neon\s+/, '')
    .split(/\s+/)
    .filter((p) => !/^[<[-]/.test(p));
  let node = cliSchema;
  const accumulated = {};
  for (const part of parts) {
    node = node.commands?.[part];
    if (!node) break;
    Object.assign(accumulated, node.options ?? {});
  }
  return accumulated;
}

// Build the flags array for an operation by merging command-level options
// with global options, excluding hidden flags. Heuristic mapping:
//   - apiEquiv: kebab-case flag name maps to a snake_case OP PARAMETER name
//     (path or query). Drives the API↔CLI hover hint today.
export function buildCliFlags(commandStr, cliSchema, paramProps) {
  if (!cliSchema) return [];
  const globalOpts = cliSchema.globalOptions ?? {};
  const cmdOpts = collectCliPathOptions(commandStr, cliSchema);
  const allOpts = { ...globalOpts, ...cmdOpts };

  const paramNames = new Set(paramProps.map((p) => p.name));
  const kebabToSnake = (s) => s.replace(/-/g, '_');

  return Object.entries(allOpts)
    .filter(([, v]) => !v.hidden)
    .map(([name, spec]) => {
      const snake = kebabToSnake(name);
      const apiEquiv = paramNames.has(snake) ? snake : null;
      const flag = {
        name,
        type: spec.type === 'unknown' ? 'string' : (spec.type ?? 'string'),
        required: spec.required ?? false,
      };
      if (spec.alias) flag.alias = Array.isArray(spec.alias) ? spec.alias[0] : spec.alias;
      if (spec.description) {
        flag.description = spec.description;
        flag.descriptionHtml = descriptionToHtml(spec.description);
      }
      if (spec.choices) flag.enum = spec.choices;
      if (spec.default !== undefined) flag.default = spec.default;
      if (apiEquiv) flag.apiEquiv = apiEquiv;
      return flag;
    });
}

// Append positional arguments to a CLI command string when the CLI schema
// defines positionals and those path params are not already covered by flags
// or present in the command string. Commands that already contain < or [ are
// left untouched (their positionals were declared explicitly in cli-coverage.json).
export function appendCliPositionals(commandStr, cliSchema, paramProps) {
  if (!cliSchema) return commandStr;
  if (/</.test(commandStr) || /\[/.test(commandStr)) return commandStr;

  const parts = commandStr.replace(/^neon\s+/, '').split(/\s+/);
  let node = cliSchema;
  for (const part of parts) {
    node = node.commands?.[part];
    if (!node) return commandStr;
  }

  const positionals = node.positionals ?? [];
  if (positionals.length === 0) return commandStr;

  const cmdOpts = collectCliPathOptions(commandStr, cliSchema);
  const globalOpts = cliSchema.globalOptions ?? {};
  const coveredByFlags = new Set(
    Object.keys({ ...globalOpts, ...cmdOpts }).map((k) => k.replace(/-/g, '_'))
  );

  const uncoveredPathParams = paramProps.filter(
    (p) => p.in === 'path' && !coveredByFlags.has(p.name)
  );

  if (uncoveredPathParams.length === 0) return commandStr;

  const args = positionals
    .slice(0, uncoveredPathParams.length)
    .map((_, i) => `<${uncoveredPathParams[i].name}>`);

  return `${commandStr} ${args.join(' ')}`;
}

// Resolve positional tokens in a CLI command string, mapping each standalone
// positional to the API path parameter it corresponds to by index.
// Returns { command: string, positionals: [{display, apiEquiv}] }
export function resolveCliPositionals(commandStr, cliSchema, paramProps) {
  const enrichedCommand = appendCliPositionals(commandStr, cliSchema, paramProps);

  // Find all <...> tokens and classify each as standalone or flag-embedded
  const words = enrichedCommand.split(/\s+/);
  const standaloneTokens = [];
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    if (/^<[^>]+>$/.test(word)) {
      const prev = i > 0 ? words[i - 1] : '';
      if (!prev.startsWith('--')) {
        standaloneTokens.push(word);
      }
    }
  }

  if (standaloneTokens.length === 0) {
    return { command: enrichedCommand, positionals: [] };
  }

  // Compute uncovered path params (same logic as appendCliPositionals)
  let uncoveredPathParams = [];
  if (cliSchema) {
    const cmdOpts = collectCliPathOptions(enrichedCommand, cliSchema);
    const globalOpts = cliSchema.globalOptions ?? {};
    const coveredByFlags = new Set(
      Object.keys({ ...globalOpts, ...cmdOpts }).map((k) => k.replace(/-/g, '_'))
    );
    uncoveredPathParams = paramProps.filter((p) => p.in === 'path' && !coveredByFlags.has(p.name));
  }

  const positionals = standaloneTokens.map((token, i) => ({
    display: token,
    apiEquiv: uncoveredPathParams[i]?.name ?? null,
  }));

  return { command: enrichedCommand, positionals };
}

// Recursively annotate a properties map with displayOrder on each nested
// object/array-of-object schema, using the dot-path config key system.
// Mutates the properties in place (they are already copies made during enrichment).
function annotateSchemaOrder(operationId, properties, requiredFields, pathKey, depth = 0) {
  if (!properties || depth > 10) return;
  const order = computeDisplayOrder(operationId, properties, requiredFields, pathKey);
  // Walk each property and recurse into object/array-of-object children
  for (const [name, schema] of Object.entries(properties)) {
    const childPath = `${pathKey}.${name}`;
    if (schema.type === 'object' && schema.properties) {
      schema.displayOrder = computeDisplayOrder(
        operationId,
        schema.properties,
        schema.required ?? [],
        childPath
      );
      annotateSchemaOrder(
        operationId,
        schema.properties,
        schema.required ?? [],
        childPath,
        depth + 1
      );
    } else if (
      schema.type === 'array' &&
      schema.items?.type === 'object' &&
      schema.items.properties
    ) {
      schema.items.displayOrder = computeDisplayOrder(
        operationId,
        schema.items.properties,
        schema.items.required ?? [],
        childPath
      );
      annotateSchemaOrder(
        operationId,
        schema.items.properties,
        schema.items.required ?? [],
        childPath,
        depth + 1
      );
    }
  }
  // Return the computed order so callers can use it
  return order;
}

function buildOperationData(
  pathStr,
  pathItem,
  op,
  method,
  cliCoverage,
  mcpCoverage,
  consoleBreadcrumbs,
  cliSchema,
  mcpToolDefs,
  cliTableOutput,
  responseExamples,
  specRaw
) {
  const tag = op.tags?.[0] || 'Other';
  const tagSlugRaw = toTagSlug(tag);
  const tagSlug =
    TAG_CONFIG.operationOverrides[op.operationId] ??
    TAG_CONFIG.specToSlug[tagSlugRaw] ??
    tagSlugRaw;
  const slug = toSlug(op.operationId);

  const allParams = mergeParams(pathItem.parameters, op.parameters);
  const paramProps = allParams
    .filter((p) => p.name && p.in)
    .map((p) => ({
      name: p.name,
      type: p.schema?.type ?? null,
      in: p.in,
      required: !!p.required,
      description: p.description ?? null,
      descriptionHtml: p.description ? descriptionToHtml(p.description) : null,
      default: p.schema?.default ?? null,
      example: p.example ?? p.schema?.example ?? null,
    }));

  // Request body
  const bodyExample = op.requestBody ? getRequestBodyExample(op.requestBody) : null;
  let requestBodyData = null;
  if (op.requestBody) {
    const bodyContent = op.requestBody.content?.['application/json'];
    const derefSchema = bodyContent?.schema;
    let schema = derefSchema?.allOf ? flattenAllOf(derefSchema) : derefSchema;
    if (schema && !schema.properties && (schema.oneOf || schema.anyOf)) {
      const rawBodySchema = getRawSchemaAt(specRaw, pathStr, method, 'request');
      const labels = discriminatorLabelsFromRaw(specRaw, rawBodySchema);
      const flat = flattenOneOf(schema, { discriminatorLabels: labels });
      // The request body has no description rendering in the current UI, so
      // the note is surfaced only on the response side. For PATCH ops whose
      // request and response share the same polymorphic schema (the only
      // case in the spec today), the response note covers both.
      if (flat) schema = flat.schema;
    }
    const enrichedProps = enrichSchemaProperties(schema?.properties ?? {});
    const bodyRequiredFields = schema?.required ?? [];
    annotateSchemaOrder(op.operationId, enrichedProps, bodyRequiredFields, 'requestBody');
    const bodyDisplayOrder = computeDisplayOrder(
      op.operationId,
      enrichedProps,
      bodyRequiredFields,
      'requestBody'
    );
    // Editorial grouping of request-body fields into display sections. Null
    // when this op isn't opted in (field-group-config.mjs) — the UI then
    // renders the existing flat tree. Spec-derived structure/order/deprecation
    // are untouched; only section assignment is editorial.
    const {
      sections: bodySections,
      seed: bodySeed,
      labels: bodyLabels,
    } = computeFieldGroups(op.operationId, enrichedProps, {
      displayOrder: bodyDisplayOrder,
      requiredFields: bodyRequiredFields,
    });
    requestBodyData = {
      required: op.requestBody.required ?? false,
      properties: enrichedProps,
      requiredFields: bodyRequiredFields,
      displayOrder: bodyDisplayOrder,
      sections: bodySections,
      seed: bodySeed,
      labels: bodyLabels,
    };
  }

  // 2xx response
  const r2xx = find2xxResponse(op.responses);
  let responseData = null;
  let responseOneOfNote = null;
  if (r2xx) {
    const { status, response: resp } = r2xx;
    const respContent = resp.content?.['application/json'];
    const derefSchema = respContent?.schema;
    let schema = derefSchema?.allOf ? flattenAllOf(derefSchema) : derefSchema;
    if (schema && !schema.properties && (schema.oneOf || schema.anyOf)) {
      const rawRespSchema = getRawSchemaAt(specRaw, pathStr, method, 'response', status);
      const labels = discriminatorLabelsFromRaw(specRaw, rawRespSchema);
      const flat = flattenOneOf(schema, { discriminatorLabels: labels });
      if (flat) {
        schema = flat.schema;
        responseOneOfNote = flat.note;
      }
    }
    const example = respContent?.examples
      ? Object.values(respContent.examples)[0]?.value
      : (respContent?.example ?? null);
    // When the schema is polymorphic, append the alternative-variant note to
    // the response description. `response.descriptionHtml` renders directly
    // above the Schema/Example tabs, so the note lands next to the schema
    // it's annotating rather than at the top of the page.
    const baseDescription = resp.description ?? null;
    const respDescription = responseOneOfNote
      ? baseDescription
        ? `${baseDescription}\n\n${responseOneOfNote}`
        : responseOneOfNote
      : baseDescription;
    const respProperties = enrichSchemaProperties(schema?.properties ?? null);
    const respRequiredFields = schema?.required ?? [];
    annotateSchemaOrder(op.operationId, respProperties, respRequiredFields, 'response');
    responseData = {
      status,
      description: respDescription,
      descriptionHtml: respDescription ? descriptionToHtml(respDescription) : null,
      example: sanitizeExample(responseExamples[op.operationId] ?? example ?? null),
      properties: respProperties,
      requiredFields: respRequiredFields,
      displayOrder: computeDisplayOrder(
        op.operationId,
        respProperties,
        respRequiredFields,
        'response'
      ),
    };
  }

  // Error codes
  const errors = Object.keys(op.responses ?? {})
    .filter((k) => k === 'default' || parseInt(k, 10) >= 400)
    .map((k) => {
      const errResp = op.responses[k];
      const errSchema = errResp?.content?.['application/json']?.schema;
      const errDescription = errResp?.description ?? 'Error';
      return {
        status: k,
        description: errDescription,
        descriptionHtml: descriptionToHtml(errDescription),
        properties: errSchema?.properties ?? null,
        required: errSchema?.required ?? [],
      };
    });

  const curlExample = toCurlExample(method.toUpperCase(), pathStr, paramProps, op.requestBody);
  const tsExample = toTypescriptExample(op.operationId, paramProps, op.requestBody);
  const representativeExamples = buildRepresentativeExamples(
    {
      operationId: op.operationId,
      method: method.toUpperCase(),
      path: pathStr,
      parameters: paramProps,
    },
    requestBodyData?.seed,
    bodyExample
  );
  const breadcrumb = consoleBreadcrumbs[op.operationId] ?? null;

  // Structured CLI object
  const cliCoverageEntry = cliCoverage[op.operationId] ?? null;
  let cliData = null;
  if (typeof cliCoverageEntry === 'string') {
    const { command: enrichedCommand, positionals } = resolveCliPositionals(
      cliCoverageEntry,
      cliSchema,
      paramProps
    );
    const flags = buildCliFlags(enrichedCommand, cliSchema, paramProps);
    cliData = { command: enrichedCommand, flags, positionals };
  } else if (cliCoverageEntry?.commands) {
    const commands = cliCoverageEntry.commands.map(({ cmd, covers }) => {
      const { command: enrichedCommand, positionals } = resolveCliPositionals(
        cmd,
        cliSchema,
        paramProps
      );
      const flags = buildCliFlags(enrichedCommand, cliSchema, paramProps);
      return { command: enrichedCommand, covers, flags, positionals };
    });
    cliData = { commands, uncovered: cliCoverageEntry.uncovered ?? [] };
  }
  if (cliData && cliTableOutput[op.operationId]) {
    cliData.tableOutput = cliTableOutput[op.operationId];
  }

  // Structured MCP object
  const mcpTool = mcpCoverage[op.operationId] ?? null;
  let mcpData = { tool: mcpTool };
  if (mcpTool && mcpToolDefs?.[mcpTool]) {
    const def = mcpToolDefs[mcpTool];
    mcpData = { tool: mcpTool, description: def.description, arguments: def.arguments };
  }

  return {
    id: slug,
    operationId: op.operationId,
    method: method.toUpperCase(),
    path: pathStr,
    tag: tagSlug,
    tagDisplay: TAG_CONFIG.display[tagSlug] ?? tag,
    stability: op['x-stability-level'] ?? null,
    deprecated: op.deprecated ?? false,
    sunset: op['x-sunset'] ?? null,
    summary: op.summary ?? '',
    description: op.description ?? op.summary ?? '',
    descriptionHtml: descriptionToHtml(op.description ?? op.summary ?? ''),
    auth: { scheme: 'bearer', required: true },
    parameters: paramProps,
    requestBody: requestBodyData,
    response: responseData,
    errors,
    examples: {
      curl: curlExample,
      typescript: tsExample,
      bodyExample,
      representative: representativeExamples,
    },
    cli: cliData,
    mcp: mcpData,
    console: { breadcrumb },
  };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const { cachePath, ttlMs } = getSpecCacheConfig();
  const { spec: specRaw, cacheCandidate } = await loadOpenApiSpec({
    specUrl: SPEC_URL,
    cachePath,
    ttlMs,
  });

  process.stderr.write('Dereferencing...\n');
  const { schema } = await dereference(specRaw);

  // Extend tag config against the live spec — auto-injects minimal entries for
  // any new upstream tags and warns. Static validation already ran at module
  // load; this adds the cross-spec check and updates TAG_CONFIG in place.
  TAG_CONFIG = loadTagConfig(schema);

  // Write into sibling temp dirs; if anything throws or opCount === 0 we never
  // touch the real output dirs, so stale-but-valid output survives a
  // broken run instead of being replaced by nothing.
  prepareApiRefOutput(PATHS);

  const {
    cliCoverage,
    mcpCoverage,
    consoleBreadcrumbs,
    mcpToolDefs,
    cliTableOutput,
    responseExamples,
    cliSchema,
  } = loadApiRefSidecars(PATHS);

  process.stderr.write(`CLI coverage: ${Object.keys(cliCoverage).length} ops\n`);
  process.stderr.write(`MCP coverage: ${Object.keys(mcpCoverage).length} ops\n`);
  process.stderr.write(`MCP tool definitions: ${Object.keys(mcpToolDefs).length} tools\n`);
  process.stderr.write(
    `neonctl schema: ${cliSchema ? `v${cliSchema.neonctlVersion}` : 'not found'}\n`
  );
  process.stderr.write(`Console breadcrumbs: ${Object.keys(consoleBreadcrumbs).length} ops\n`);
  process.stderr.write(`CLI table output examples: ${Object.keys(cliTableOutput).length} ops\n`);
  process.stderr.write(`Response examples override: ${Object.keys(responseExamples).length} ops\n`);

  const allOps = [];
  const tagOps = {};

  let opCount = 0;
  for (const [pathStr, pathItem] of Object.entries(schema.paths ?? {})) {
    for (const method of METHODS) {
      const op = pathItem[method];
      if (!op?.operationId) continue;

      const opData = buildOperationData(
        pathStr,
        pathItem,
        op,
        method,
        cliCoverage,
        mcpCoverage,
        consoleBreadcrumbs,
        cliSchema,
        mcpToolDefs,
        cliTableOutput,
        responseExamples,
        specRaw
      );

      opData.specIndex = opCount;

      writeOperationOutput(PATHS, opData, toPerOpMarkdown(opData));

      allOps.push(opData);
      if (!tagOps[opData.tag]) tagOps[opData.tag] = [];
      tagOps[opData.tag].push(opData);
      opCount++;
    }
  }

  process.stderr.write(`Generated ${opCount} operations.\n`);

  // Tripwire: surface ops where the kebab→snake CLI-flag heuristic mapped
  // ZERO non-global flags to API params. Either a new flag naming convention
  // in neonctl OR a positional-only command (excluded). Not fail-hard —
  // heuristic warnings are advisory; review on bumps.
  const unmappedFlagOps = findOpsWithNoFlagMappings(allOps);
  if (unmappedFlagOps.length > 0) {
    process.stderr.write(
      `[cli-flags] WARNING: ${unmappedFlagOps.length} op(s) with CLI coverage have ZERO API↔flag mappings (review if these aren't pure-positional): ${unmappedFlagOps.join(', ')}\n`
    );
  }

  if (opCount === 0) {
    throw new Error(
      'No operations generated from spec — refusing to publish empty API reference. ' +
        'Check that schema.paths is non-empty and operations have operationIds.'
    );
  }

  // llms index files. Adding a new interface means one new generator function
  // (e.g. generatePythonSdkTxt) plus one entry in this registry — no other
  // call sites to update.
  const LLMS_GENERATORS = [
    ['llms.txt', generateLlmsTxt],
    ['llms-full.txt', generateLlmsFull],
  ];
  for (const [file, gen] of LLMS_GENERATORS) {
    writeLlmsIndex(PATHS, file, gen(tagOps));
  }

  // api.md — top-level index served at /docs/reference/api.md
  writeApiIndexMarkdown(PATHS, generateApiMd(tagOps));

  // Per-tag {tag}.md (served via /docs/reference/api/{tag}.md → rewrite → /md/...)
  writeTagMarkdownFiles(PATHS, tagOps, TAG_CONFIG.display, toAgentMarkdown);

  // Non-tag docs in content/api-docs/ (e.g. getting-started.md) — copy with title header
  const extraDocCount = writeExtraApiDocs(PATHS, tagOps);

  // Request-body grouping audit — WARN-ONLY here so a spec republish never
  // breaks the build (new fields render in "Other"; renamed/removed configured
  // refs still surface via "Other"). `npm run audit:field-groups` runs the same
  // check strictly for CI / the maintenance agent.
  validateFieldGroups(allOps);

  // Atomic swap — only now do we touch the real output dirs.
  commitApiRefOutput(PATHS);

  // Navigation YAML (committed — drives sidebar structure)
  writeNavigationYaml(PATHS, toNavYaml(allOps));

  writeRunSummary(PATHS, {
    opCount,
    tagCount: Object.keys(tagOps).length,
    extraDocCount,
  });

  if (cacheCandidate) {
    writeOpenApiSpecCache(cacheCandidate);
  }
}

export { main, buildOperationData };

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    process.stderr.write(`Error: ${err.message}\n`);
    process.exit(1);
  });
}
