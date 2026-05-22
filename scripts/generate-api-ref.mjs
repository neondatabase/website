#!/usr/bin/env node
// Generates per-operation JSON data files and agent-optimized markdown.
// Runs in CI — all inputs are publicly accessible.
//
// Usage: node scripts/generate-api-ref.mjs [spec-url]

import {
  writeFileSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  existsSync,
  rmSync,
  renameSync,
} from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { dereference } from '@scalar/openapi-parser';

import { computeDisplayOrder } from './lib/field-order-config.mjs';
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
import { toSdkMethodName } from '../src/utils/api-ref.mjs';

// Single source of truth for the neonctl global flag list.
// operation-shared.jsx imports the same JSON.
const CLI_GLOBAL_FLAGS_LIST = JSON.parse(
  readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), 'data/cli-global-flags.json'), 'utf8')
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
const DATA_ROOT = resolve(ROOT, 'src/data/api-ref');
const MD_ROOT = resolve(ROOT, 'public/md/docs/reference/api');
// Sibling temp dirs for atomic-swap: we write here, then renameSync onto the
// real paths only after the run validates. Same filesystem ensures rename is atomic.
const DATA_TMP = DATA_ROOT + '.next';
const MD_TMP = MD_ROOT + '.next';
const LLMS_ROOT = resolve(ROOT, 'public/docs/reference/api');
const NAV_YAML_PATH = resolve(ROOT, 'content/docs/api-navigation.yaml');
const API_DOCS_DIR = resolve(ROOT, 'content/api-docs');

const SPEC_URL = process.argv[2] || 'https://neon.com/api_spec/release/v2.json';
const METHODS = ['get', 'post', 'put', 'patch', 'delete'];

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
      enrichedProp.items = { ...flat.items, properties: enrichSchemaProperties(flat.items.properties, depth + 1) };
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
      ? '?' +
        requiredQuery
          .map((p) => `${p.name}=${encodeURIComponent(p.example ?? p.name)}`)
          .join('&')
      : '';

  const url = `https://console.neon.tech/api/v2${urlPath}${queryString}`;

  const parts = [`curl "${url}"`];
  if (upper !== 'GET') parts.push(`  -X ${upper}`);
  parts.push(`  -H "Authorization: Bearer $NEON_API_KEY"`);

  const bodyExample = requestBody ? getRequestBodyExample(requestBody) : null;
  if (bodyExample !== null) {
    parts.push(`  -H "Content-Type: application/json"`);
    parts.push(`  -d '${JSON.stringify(bodyExample).replace(/'/g, "'\\''")}'`);
  }

  return parts.join(' \\\n');
}

export function toTypescriptExample(operationId, parameters) {
  const sdkMethod = toSdkMethodName(operationId);
  const pathParams = parameters.filter((p) => p.in === 'path' && p.required);
  const requiredQueryParams = parameters.filter((p) => p.in === 'query' && p.required);
  const allRequired = [...pathParams, ...requiredQueryParams];

  const args =
    allRequired.length === 0
      ? '{}'
      : `{ ${allRequired
          .map((p) => {
            if (p.in === 'path') return `${p.name}: process.env.${p.name.toUpperCase()}`;
            const val = p.example != null ? JSON.stringify(p.example) : `process.env.${p.name.toUpperCase()}`;
            return `${p.name}: ${val}`;
          })
          .join(', ')} }`;

  return [
    `import { createApiClient } from '@neondatabase/api-client';`,
    ``,
    `const api = createApiClient({ apiKey: process.env.NEON_API_KEY });`,
    `const { data } = await api.${sdkMethod}(${args});`,
  ].join('\n');
}

function renderPropsMarkdown(lines, props, requiredFields, depth) {
  if (depth > 4) return;
  const indent = '  '.repeat(depth);
  for (const [name, prop] of Object.entries(props)) {
    const req = requiredFields.includes(name) ? 'required' : 'optional';
    const type = prop.type ?? (prop.allOf ? 'object' : 'any');
    const modifiers = [req];
    if (prop.deprecated) modifiers.push('deprecated');
    if (prop.format) modifiers.push(`format: ${prop.format}`);
    lines.push(`${indent}- \`${name}\` (${type}, ${modifiers.join(', ')})`);
    if (prop.description) {
      lines.push(`${indent}  ${prop.description.split('\n')[0]}`);
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
      const childRequired =
        type === 'array' ? (prop.items?.required ?? []) : (prop.required ?? []);
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
  lines.push((op.description || op.summary).split('\n')[0]);
  lines.push('');

  if (op.parameters?.length > 0) {
    lines.push('### Parameters');
    lines.push('');
    for (const p of op.parameters) {
      const req = p.required ? 'required' : 'optional';
      lines.push(`- \`${p.name}\` (${p.type ?? 'string'}, ${p.in}, ${req})`);
      if (p.description) lines.push(`  ${p.description.split('\n')[0]}`);
      if (p.default !== undefined && p.default !== null) lines.push(`  Default: \`${p.default}\``);
    }
    lines.push('');
  }

  if (op.requestBody) {
    lines.push('### Request body');
    lines.push('');
    renderPropsMarkdown(lines, op.requestBody.properties || {}, op.requestBody.requiredFields || [], 0);
    if (op.examples?.bodyExample) {
      lines.push('');
      lines.push('```json');
      lines.push(JSON.stringify(op.examples.bodyExample, null, 2));
      lines.push('```');
    }
    lines.push('');
  }

  if (op.response) {
    lines.push(`### Response (${op.response.status})`);
    lines.push('');
    if (op.response.example) {
      const exStr = JSON.stringify(op.response.example, null, 2);
      if (exStr.split('\n').length <= 40) {
        lines.push('```json');
        lines.push(exStr);
        lines.push('```');
      } else {
        lines.push('_Response too large to inline. Fetch individual operation for full example._');
      }
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
  lines.push(op.examples.curl);
  lines.push('```');
  lines.push('');
  lines.push('```typescript');
  lines.push(op.examples.typescript);
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
      lines.push(`**${err.status}** — ${err.description.split('\n')[0]}`);
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
function toFullMarkdownEntry(op) {
  const lines = [];

  lines.push(`## ${op.summary} · ${op.method} ${op.path}`);
  lines.push('');
  lines.push(`*${op.operationId}*`);
  lines.push('');
  lines.push((op.description || op.summary).split('\n')[0]);
  lines.push('');

  if (op.parameters?.length > 0) {
    lines.push('### Parameters');
    lines.push('');
    for (const p of op.parameters) {
      const req = p.required ? 'required' : 'optional';
      lines.push(`- \`${p.name}\` (${p.type ?? 'string'}, ${p.in}, ${req})`);
      if (p.description) lines.push(`  ${p.description.split('\n')[0]}`);
      if (p.default !== undefined && p.default !== null) lines.push(`  Default: \`${p.default}\``);
    }
    lines.push('');
  }

  if (op.requestBody) {
    lines.push('### Request body');
    lines.push('');
    renderPropsMarkdown(lines, op.requestBody.properties || {}, op.requestBody.requiredFields || [], 0);
    if (op.examples?.bodyExample) {
      lines.push('');
      lines.push('```json');
      lines.push(JSON.stringify(op.examples.bodyExample, null, 2));
      lines.push('```');
    }
    lines.push('');
  }

  if (op.response) {
    lines.push(`### Response (${op.response.status})`);
    lines.push('');
    if (op.response.example) {
      const exStr = JSON.stringify(op.response.example, null, 2);
      if (exStr.split('\n').length <= 40) {
        lines.push('```json');
        lines.push(exStr);
        lines.push('```');
      } else {
        lines.push('_Response too large to inline._');
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
  lines.push(op.examples.curl);
  lines.push('```');
  lines.push('');

  lines.push('### TypeScript SDK');
  lines.push('');
  lines.push('```typescript');
  lines.push(op.examples.typescript);
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
const TAG_CONFIG = loadTagConfig();

// ---------------------------------------------------------------------------
// Agent index generators — one per interface
// ---------------------------------------------------------------------------

const NEON_BASE = 'https://neon.com';

function opMdUrl(op) {
  return `${NEON_BASE}/md/docs/reference/api/${op.tag}/${op.id}.md`;
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
    'Auth: Bearer token — `Authorization: Bearer $NEON_API_KEY`',
    '',
    'Neon interface-specific LLMS files:',
    `- [Full reference](${NEON_BASE}/docs/reference/api/llms-full.txt)`,
    `- [REST](${NEON_BASE}/docs/reference/api/llms-api.txt)`,
    `- [CLI](${NEON_BASE}/docs/reference/api/llms-cli.txt)`,
    `- [SDK](${NEON_BASE}/docs/reference/api/llms-sdk.txt)`,
    `- [MCP](${NEON_BASE}/docs/reference/api/llms-mcp.txt)`,
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

function generateApiTxt(tagOps) {
  const lines = [
    '# Neon REST API',
    '',
    'Base URL: https://console.neon.tech/api/v2',
    'Auth: `Authorization: Bearer $NEON_API_KEY`',
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

function generateCliTxt(tagOps) {
  const lines = [
    '# Neon CLI',
    '',
    'Install: `npm install -g neon`',
    'Auth: `neon auth login`',
    '',
  ];

  for (const tag of orderedTagList(tagOps)) {
    const ops = tagOps[tag].filter((op) => op.cli?.command);
    if (!ops.length) continue;
    lines.push(`## ${TAG_CONFIG.display[tag] || tag}`);
    lines.push('');
    for (const op of ops) {
      lines.push(`- [${op.summary}](${opMdUrl(op)}) \`${op.cli.command}\``);
    }
    lines.push('');
  }

  return lines.join('\n').trimEnd() + '\n';
}

function generateMcpTxt(tagOps) {
  const lines = [
    '# Neon MCP Tools',
    '',
    'Server: `@neondatabase/mcp-server-neon`',
    '',
  ];

  for (const tag of orderedTagList(tagOps)) {
    const ops = tagOps[tag].filter((op) => op.mcp?.tool);
    if (!ops.length) continue;
    lines.push(`## ${TAG_CONFIG.display[tag] || tag}`);
    lines.push('');
    for (const op of ops) {
      const reqArgs = op.mcp.arguments?.filter((a) => a.required).map((a) => a.name) ?? [];
      const argHint = reqArgs.length ? ` (${reqArgs.join(', ')})` : '';
      lines.push(`- \`${op.mcp.tool}\`${argHint} — ${op.summary} [→](${opMdUrl(op)})`);
    }
    lines.push('');
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
    'Auth: Bearer token — `Authorization: Bearer $NEON_API_KEY`',
    '',
    'Interface-specific indexes:',
    `- [Full reference](${NEON_BASE}/docs/reference/api/llms-full.txt)`,
    `- [REST](${NEON_BASE}/docs/reference/api/llms-api.txt)`,
    `- [CLI](${NEON_BASE}/docs/reference/api/llms-cli.txt)`,
    `- [SDK](${NEON_BASE}/docs/reference/api/llms-sdk.txt)`,
    `- [MCP](${NEON_BASE}/docs/reference/api/llms-mcp.txt)`,
    '',
  ];

  for (const tag of orderedTagList(tagOps)) {
    const displayName = TAG_CONFIG.display[tag] || tag;
    const tagUrl = `${NEON_BASE}/docs/reference/api/${tag}.md`;
    lines.push(`## ${displayName}`);
    lines.push('');
    lines.push(`Full reference: [${tag}.md](${tagUrl})`);
    lines.push('');
    for (const op of tagOps[tag]) {
      lines.push(`- [${op.summary}](${opMdUrl(op)}) \`${op.method} ${op.path}\``);
    }
    lines.push('');
  }

  return lines.join('\n').trimEnd() + '\n';
}

function generateSdkTxt(tagOps) {
  const lines = [
    '# Neon TypeScript SDK',
    '',
    'Package: `@neondatabase/api-client`',
    '',
    '```typescript',
    "import { createApiClient } from '@neondatabase/api-client';",
    'const api = createApiClient({ apiKey: process.env.NEON_API_KEY });',
    '```',
    '',
  ];

  for (const tag of orderedTagList(tagOps)) {
    lines.push(`## ${TAG_CONFIG.display[tag] || tag}`);
    lines.push('');
    for (const op of tagOps[tag]) {
      const sdkMethod = toSdkMethodName(op.operationId);
      lines.push(`- \`api.${sdkMethod}()\` — ${op.summary} [→](${opMdUrl(op)})`);
    }
    lines.push('');
  }

  return lines.join('\n').trimEnd() + '\n';
}

// Known outer-tag names in MCP tool descriptions. KEEP IN SYNC with
// MCP_BLOCK_LABELS in src/components/pages/doc/api-operation/operation-mcp.jsx.
// `example` is special-cased in the renderer (extracted as a code block,
// not a labeled section) and so doesn't need a label entry but DOES need
// to be in this allow-set.
const KNOWN_MCP_TAGS = new Set([
  'workflow',
  'key_features',
  'interactive_behavior',
  'returns',
  'important_notes',
  'supported_operations',
  'security',
  'instructions',
  'error_handling',
  'next_steps',
  'use_case',
  'do_not_include',
  'hint',
  'hints',
  'response_instructions',
  'example',
]);

// Return distinct outer-tag names from all MCP tool descriptions that are
// NOT in KNOWN_MCP_TAGS. Same regex as parseMcpDescription so we catch
// whatever the renderer would surface. Build fails when this is non-empty
// so new upstream tags become a deliberate (small) decision: add to the
// allow-set + give a label, or update the renderer to special-case.
export function findUnknownMcpTags(mcpToolDefs) {
  const outerRe = /<([a-z_]+)>/g;
  const seen = new Set();
  for (const def of Object.values(mcpToolDefs)) {
    if (!def?.description) continue;
    let m;
    while ((m = outerRe.exec(def.description)) !== null) {
      if (!KNOWN_MCP_TAGS.has(m[1])) seen.add(m[1]);
    }
  }
  return [...seen].sort();
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

// Derive the set of param names that are session-identity globals — IDs
// that semantically refer to the same resource across operations (project_id,
// org_id, etc.) and should share a single sessionStorage value on the client.
// Rule: name ends in `_id` or `_name` AND appears as a parameter on ≥2
// distinct operations. The ≥2 threshold filters out one-off param names that
// have nothing to "cross-page" to.
//
// Hand-curating this list rotted: it had `api_key_id` and `jwks_id` (each
// appears on only 1 op, so the cross-page label did nothing) and missed
// `oauth_provider_id`, `auth_user_id`, `member_id`, `key_id`, `db_name`.

// Spec-side walker. Used at main() start so the set is available during the
// op-build loop (buildCliFlags + the bodyGlobals walker both need it).
export function computeCrossPageParamSet(schema) {
  const opsPerParam = new Map();
  for (const [, pathItem] of Object.entries(schema.paths ?? {})) {
    for (const method of METHODS) {
      const op = pathItem[method];
      if (!op?.operationId) continue;
      const allParams = mergeParams(pathItem.parameters, op.parameters);
      for (const p of allParams) {
        if (!p.name) continue;
        if (!opsPerParam.has(p.name)) opsPerParam.set(p.name, new Set());
        opsPerParam.get(p.name).add(op.operationId);
      }
    }
  }
  return new Set(
    [...opsPerParam.entries()]
      .filter(([name, ops]) => /(_id|_name)$/.test(name) && ops.size >= 2)
      .map(([name]) => name)
  );
}

// Backward-compat wrapper — kept so the existing test + JSON write don't
// drift. New code should use computeCrossPageParamSet(schema) directly so
// the result is available before the op loop.
export function deriveCrossPageParams(allOps) {
  const opsPerParam = new Map();
  for (const op of allOps) {
    for (const p of op.parameters ?? []) {
      if (!opsPerParam.has(p.name)) opsPerParam.set(p.name, new Set());
      opsPerParam.get(p.name).add(op.operationId);
    }
  }
  return [...opsPerParam.entries()]
    .filter(([name, ops]) => /(_id|_name)$/.test(name) && ops.size >= 2)
    .map(([name]) => name)
    .sort();
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
      if (op.deprecated) lines.push(`      tag: deprecated`);
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
  const parts = commandStr.replace(/^neon\s+/, '').split(/\s+/).filter((p) => !/^[<[-]/.test(p));
  let node = cliSchema;
  const accumulated = {};
  for (const part of parts) {
    node = node.commands?.[part];
    if (!node) break;
    Object.assign(accumulated, node.options ?? {});
  }
  return accumulated;
}

// Walks the enriched body `properties` and collects { path, global } entries
// for every leaf whose name matches a session-identity global.
// Paths containing `[]` (arrays of objects) are excluded — typing in row 0
// of an array should not auto-fill row 1, so they stay per-op. Depth-capped
// at 10 to mirror the existing enrichSchemaProperties guard.
export function collectBodyGlobals(properties, crossPageParams, prefix = '', depth = 0) {
  if (!properties || depth > 10) return [];
  const out = [];
  for (const [name, prop] of Object.entries(properties)) {
    const path = prefix ? `${prefix}.${name}` : name;
    if (prop.type === 'object' && prop.properties) {
      out.push(...collectBodyGlobals(prop.properties, crossPageParams, path, depth + 1));
    } else if (prop.type === 'array' && prop.items?.properties) {
      out.push(
        ...collectBodyGlobals(prop.items.properties, crossPageParams, `${path}[]`, depth + 1)
      );
    } else if (!path.includes('[]') && crossPageParams?.has(name)) {
      out.push({ path, global: name });
    }
  }
  return out;
}

// Derive tag-slug → bare-id resolution (idMeaning) from tag-config.json +
// the live crossPageParams set rather than hand-curating.
// Candidate = `bareId` override when set, else `${specName}_id`.
// The crossPageParams membership check is the safety net: if a candidate
// isn't a real global (e.g. spec rename), the mapping silently drops
// instead of producing dead annotations.
//
// Called once from main() after crossPageParams is computed.
function buildTagToBareId(crossPageParams) {
  const map = {};
  for (const t of TAG_CONFIG.raw.tags) {
    const candidate = t.bareId ?? `${t.specName}_id`;
    if (crossPageParams.has(candidate)) map[t.slug] = candidate;
  }
  return map;
}

// Build the flags array for an operation by merging command-level options
// with global options, excluding hidden flags. Two heuristic mappings:
//   - apiEquiv: kebab-case flag name maps to a snake_case OP PARAMETER name
//     (path or query). Drives the API↔CLI hover hint today.
//   - globalEquiv: kebab-case flag name maps to a snake_case session-global ID
//     Independent of apiEquiv — e.g. createProject's --org-id has
//     no apiEquiv (org_id is a body field there) but has globalEquiv: 'org_id'
//     so the runtime can route flag edits through the shared paramStore.
export function buildCliFlags(operationId, commandStr, cliSchema, paramProps, crossPageParams) {
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
      const globalEquiv = crossPageParams?.has(snake) ? snake : null;
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
      if (globalEquiv) flag.globalEquiv = globalEquiv;
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
    uncoveredPathParams = paramProps.filter(
      (p) => p.in === 'path' && !coveredByFlags.has(p.name)
    );
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
      schema.displayOrder = computeDisplayOrder(operationId, schema.properties, schema.required ?? [], childPath);
      annotateSchemaOrder(operationId, schema.properties, schema.required ?? [], childPath, depth + 1);
    } else if (schema.type === 'array' && schema.items?.type === 'object' && schema.items.properties) {
      schema.items.displayOrder = computeDisplayOrder(operationId, schema.items.properties, schema.items.required ?? [], childPath);
      annotateSchemaOrder(operationId, schema.items.properties, schema.items.required ?? [], childPath, depth + 1);
    }
  }
  // Return the computed order so callers can use it
  return order;
}

function buildOperationData(pathStr, pathItem, op, method, cliCoverage, mcpCoverage, consoleBreadcrumbs, cliSchema, mcpToolDefs, cliTableOutput, responseExamples, specRaw, crossPageParams, tagToBareId) {
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
    requestBodyData = {
      required: op.requestBody.required ?? false,
      properties: enrichedProps,
      requiredFields: bodyRequiredFields,
      displayOrder: computeDisplayOrder(op.operationId, enrichedProps, bodyRequiredFields, 'requestBody'),
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
      ? (baseDescription ? `${baseDescription}\n\n${responseOneOfNote}` : responseOneOfNote)
      : baseDescription;
    const respProperties = enrichSchemaProperties(schema?.properties ?? null);
    const respRequiredFields = schema?.required ?? [];
    annotateSchemaOrder(op.operationId, respProperties, respRequiredFields, 'response');
    responseData = {
      status,
      description: respDescription,
      descriptionHtml: respDescription ? descriptionToHtml(respDescription) : null,
      example: responseExamples[op.operationId] ?? example ?? null,
      properties: respProperties,
      requiredFields: respRequiredFields,
      displayOrder: computeDisplayOrder(op.operationId, respProperties, respRequiredFields, 'response'),
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
  const tsExample = toTypescriptExample(op.operationId, paramProps);
  const breadcrumb = consoleBreadcrumbs[op.operationId] ?? null;

  // Structured CLI object
  const cliCoverageEntry = cliCoverage[op.operationId] ?? null;
  let cliData = null;
  if (typeof cliCoverageEntry === 'string') {
    const { command: enrichedCommand, positionals } = resolveCliPositionals(cliCoverageEntry, cliSchema, paramProps);
    const flags = buildCliFlags(op.operationId, enrichedCommand, cliSchema, paramProps, crossPageParams);
    cliData = { command: enrichedCommand, flags, positionals };
  } else if (cliCoverageEntry?.commands) {
    const commands = cliCoverageEntry.commands.map(({ cmd, covers }) => {
      const { command: enrichedCommand, positionals } = resolveCliPositionals(cmd, cliSchema, paramProps);
      const flags = buildCliFlags(op.operationId, enrichedCommand, cliSchema, paramProps, crossPageParams);
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

  // Session-identity annotations consumed by the client at render time.
  // bodyGlobals: leaf body paths that map to a shared global ID.
  // idMeaning: per-op resolution for the bare `id` body field (e.g. branches
  // op → branch_id) — set even when no body field is `id` today, since the
  // client checks at runtime per-leaf and only applies the mapping then.
  const bodyGlobals = collectBodyGlobals(requestBodyData?.properties, crossPageParams);
  const idMeaning = tagToBareId?.[tagSlug] ?? null;

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
    },
    cli: cliData,
    mcp: mcpData,
    console: { breadcrumb },
    bodyGlobals,
    idMeaning,
  };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  process.stderr.write(`Fetching spec from ${SPEC_URL}...\n`);
  const specRes = await fetch(SPEC_URL);
  if (!specRes.ok) throw new Error(`Spec fetch failed: ${specRes.status} ${specRes.statusText}`);
  const specRaw = await specRes.json();

  process.stderr.write('Dereferencing...\n');
  const { schema } = await dereference(specRaw);

  // Validate tag config against the live spec — catches new upstream tags
  // before they render as untagged. Static validation already ran at module
  // load; this adds the cross-spec check.
  loadTagConfig(schema);

  // Compute session-identity globals from the spec before the
  // op-build loop so buildCliFlags + the bodyGlobals walker both see it.
  const crossPageParams = computeCrossPageParamSet(schema);
  // Derive tag-slug → bare-id map from tag-config + the live
  // crossPageParams set.
  const tagToBareId = buildTagToBareId(crossPageParams);

  // Write into sibling temp dirs; if anything throws or opCount === 0 we never
  // touch the real DATA_ROOT/MD_ROOT, so stale-but-valid output survives a
  // broken run instead of being replaced by nothing.
  rmSync(DATA_TMP, { recursive: true, force: true });
  rmSync(MD_TMP, { recursive: true, force: true });
  mkdirSync(DATA_TMP, { recursive: true });
  mkdirSync(MD_TMP, { recursive: true });

  // Load coverage and enrichment data
  const dataDir = resolve(ROOT, 'scripts/data');
  const loadJson = (name) => {
    const p = resolve(dataDir, name);
    return existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : {};
  };
  const cliCoverage = loadJson('cli-coverage.json');
  const mcpCoverage = loadJson('mcp-coverage.json');
  const consoleBreadcrumbs = loadJson('console-breadcrumbs.json');
  const mcpToolDefs = loadJson('mcp-tool-definitions.json');
  const cliTableOutput = loadJson('cli-table-output.json');
  const responseExamples = loadJson('response-examples.json');

  // neonctl schema — for structured CLI flag data
  const cliSchemaPath = resolve(ROOT, 'scripts/docs-checks/neonctl/schema.json');
  const cliSchema = existsSync(cliSchemaPath) ? JSON.parse(readFileSync(cliSchemaPath, 'utf8')) : null;

  process.stderr.write(`CLI coverage: ${Object.keys(cliCoverage).length} ops\n`);
  process.stderr.write(`MCP coverage: ${Object.keys(mcpCoverage).length} ops\n`);
  process.stderr.write(`MCP tool definitions: ${Object.keys(mcpToolDefs).length} tools\n`);
  process.stderr.write(`neonctl schema: ${cliSchema ? `v${cliSchema.neonctlVersion}` : 'not found'}\n`);
  process.stderr.write(`Console breadcrumbs: ${Object.keys(consoleBreadcrumbs).length} ops\n`);
  process.stderr.write(`CLI table output examples: ${Object.keys(cliTableOutput).length} ops\n`);
  process.stderr.write(`Response examples override: ${Object.keys(responseExamples).length} ops\n`);

  // Tripwire: any new outer-tag in upstream MCP descriptions must be
  // explicitly registered in both KNOWN_MCP_TAGS (here) AND MCP_BLOCK_LABELS
  // (operation-mcp.jsx). Otherwise the docs site renders the block with a
  // generated fallback label (defensive) but the maintainer never learns.
  const unknownMcpTags = findUnknownMcpTags(mcpToolDefs);
  if (unknownMcpTags.length > 0) {
    throw new Error(
      `[mcp-tags] new MCP description tag(s) upstream: ${unknownMcpTags.join(', ')}. ` +
        `Add to KNOWN_MCP_TAGS in scripts/generate-api-ref.mjs AND give each a label ` +
        `in MCP_BLOCK_LABELS in src/components/pages/doc/api-operation/operation-mcp.jsx.`
    );
  }

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
        specRaw,
        crossPageParams,
        tagToBareId,
      );

      opData.specIndex = opCount;

      const jsonDir = resolve(DATA_TMP, opData.tag);
      mkdirSync(jsonDir, { recursive: true });
      writeFileSync(
        resolve(jsonDir, `${opData.id}.json`),
        JSON.stringify(opData, null, 2) + '\n'
      );

      const mdDir = resolve(MD_TMP, opData.tag);
      mkdirSync(mdDir, { recursive: true });
      writeFileSync(resolve(mdDir, `${opData.id}.md`), toPerOpMarkdown(opData));

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
  mkdirSync(LLMS_ROOT, { recursive: true });
  const LLMS_GENERATORS = [
    ['llms.txt', generateLlmsTxt],
    ['llms-api.txt', generateApiTxt],
    ['llms-cli.txt', generateCliTxt],
    ['llms-mcp.txt', generateMcpTxt],
    ['llms-sdk.txt', generateSdkTxt],
  ];
  for (const [file, gen] of LLMS_GENERATORS) {
    writeFileSync(resolve(LLMS_ROOT, file), gen(tagOps));
  }

  // api.md — top-level index served at /docs/reference/api.md
  writeFileSync(resolve(ROOT, 'public/md/docs/reference/api.md'), generateApiMd(tagOps));

  // llms-full.txt — complete reference, no frontmatter, one H2 per operation
  const llmsFullHeader = [
    '# Neon Management API — Full Reference',
    '',
    'Base URL: https://console.neon.tech/api/v2',
    'Auth: Bearer token — `Authorization: Bearer $NEON_API_KEY`',
    '',
  ].join('\n');
  writeFileSync(
    resolve(LLMS_ROOT, 'llms-full.txt'),
    llmsFullHeader + '\n---\n\n' + allOps.map(toFullMarkdownEntry).join('\n\n---\n\n') + '\n'
  );

  // Per-tag {tag}.md (served via /docs/reference/api/{tag}.md → rewrite → /md/...)
  for (const [tag, ops] of Object.entries(tagOps)) {
    const tagTitle = TAG_CONFIG.display[tag] || ops[0]?.tagDisplay || tag;
    const introPath = resolve(API_DOCS_DIR, `${tag}.md`);
    const intro = existsSync(introPath) ? readFileSync(introPath, 'utf-8').trim() : null;
    const header = intro
      ? `# ${tagTitle}\n\n${intro}\n`
      : `# ${tagTitle}\n\nNeon Management API — ${tagTitle} endpoints.\n`;
    writeFileSync(
      resolve(MD_TMP, `${tag}.md`),
      header + '\n---\n\n' + ops.map((op) => toAgentMarkdown(op)).join('\n---\n\n')
    );
  }

  // Non-tag docs in content/api-docs/ (e.g. getting-started.md) — copy with title header
  let extraDocCount = 0;
  for (const file of readdirSync(API_DOCS_DIR).filter((f) => f.endsWith('.md'))) {
    const base = file.slice(0, -3);
    if (tagOps[base]) continue;
    const title = base.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    const content = readFileSync(resolve(API_DOCS_DIR, file), 'utf-8').trim();
    writeFileSync(resolve(MD_TMP, file), `# ${title}\n\n${content}\n`);
    extraDocCount++;
  }

  // cross-page-params.json — derived session-identity globals consumed by
  // the client-side store (src/components/pages/doc/api-operation/store.js).
  // Written to DATA_TMP so it survives the atomic swap below.
  writeFileSync(
    resolve(DATA_TMP, 'cross-page-params.json'),
    JSON.stringify(deriveCrossPageParams(allOps), null, 2) + '\n'
  );

  // Atomic swap — only now do we touch the real DATA_ROOT/MD_ROOT.
  rmSync(DATA_ROOT, { recursive: true, force: true });
  rmSync(MD_ROOT, { recursive: true, force: true });
  renameSync(DATA_TMP, DATA_ROOT);
  renameSync(MD_TMP, MD_ROOT);

  // Navigation YAML (committed — drives sidebar structure)
  writeFileSync(NAV_YAML_PATH, toNavYaml(allOps));

  process.stderr.write(`Written:\n`);
  process.stderr.write(`  ${DATA_ROOT}/{tag}/{slug}.json (${opCount} files)\n`);
  process.stderr.write(`  ${MD_ROOT}/{tag}/{slug}.md (${opCount} files)\n`);
  process.stderr.write(`  public/md/docs/reference/api.md\n`);
  process.stderr.write(`  ${LLMS_ROOT}/llms.txt\n`);
  process.stderr.write(`  ${LLMS_ROOT}/llms-{api,cli,mcp,sdk}.txt\n`);
  process.stderr.write(`  ${LLMS_ROOT}/llms-full.txt\n`);
  process.stderr.write(`  ${MD_ROOT}/{tag}.md (${Object.keys(tagOps).length} files)\n`);
  if (extraDocCount > 0) process.stderr.write(`  ${MD_ROOT}/[extra docs] (${extraDocCount} files)\n`);
  process.stderr.write(`  ${NAV_YAML_PATH}\n`);
}

export { main, buildOperationData };

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    process.stderr.write(`Error: ${err.message}\n`);
    process.exit(1);
  });
}
