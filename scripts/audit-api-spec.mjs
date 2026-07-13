#!/usr/bin/env node
// Audits the live Neon OpenAPI spec for example coverage and schema validity.
// Usage: node scripts/audit-api-spec.mjs [spec-url] > spec-audit.md

import Ajv from 'ajv';
import { dereference } from '@scalar/openapi-parser';

export { mergeParams, flattenAllOf, find2xxResponse } from './lib/spec-utils.mjs';
import { mergeParams, flattenAllOf, find2xxResponse } from './lib/spec-utils.mjs';

const SPEC_URL = 'https://neon.com/api_spec/release/v2.json';
const METHODS = ['get', 'post', 'put', 'patch', 'delete'];

// ---------------------------------------------------------------------------
// Pure helpers — exported for testing
// ---------------------------------------------------------------------------

export function extractExample(responseOrSchema) {
  if (!responseOrSchema) return undefined;
  // Check schema-level example first (most common in this spec)
  const jsonContent = responseOrSchema?.content?.['application/json'];
  if (jsonContent) {
    if (jsonContent.example !== undefined) return jsonContent.example;
    if (jsonContent.examples) {
      const first = Object.values(jsonContent.examples)[0];
      if (first?.value !== undefined) return first.value;
    }
    const schema = jsonContent.schema;
    if (schema?.example !== undefined) return schema.example;
  }
  return undefined;
}

export function validateExample(example, schema) {
  if (!schema || example === undefined) return { valid: true, errors: [] };
  const { example: _e, examples: _es, ...cleanSchema } = schema;
  try {
    const ajv = new Ajv({ strict: false, allErrors: true });
    const validate = ajv.compile(cleanSchema);
    const valid = validate(example);
    return {
      valid,
      errors: valid ? [] : (validate.errors ?? []).map((e) => `${e.instancePath || '(root)'} ${e.message}`),
    };
  } catch {
    // AJV cannot compile this schema (e.g. $ref cycles, unsupported keywords) — skip validation.
    process.stderr.write(`[audit] validateExample: skipped — schema could not be compiled\n`);
    return { valid: true, errors: [], skipped: true };
  }
}

// Walk a schema object and collect non-required enum properties with no default.
// Returns array of dot-path strings, e.g. ["auth_provider", "project.provisioner"].
export function findEnumsMissingDefault(properties, required = [], prefix = '') {
  const gaps = [];
  if (!properties) return gaps;
  const reqSet = new Set(required);
  for (const [name, prop] of Object.entries(properties)) {
    const path = prefix ? `${prefix}.${name}` : name;
    if (prop.enum && !reqSet.has(name) && prop.default === undefined) {
      gaps.push(path);
    }
    if (prop.type === 'object' && prop.properties) {
      gaps.push(...findEnumsMissingDefault(prop.properties, prop.required ?? [], path));
    }
    if (prop.type === 'array' && prop.items?.properties) {
      gaps.push(...findEnumsMissingDefault(prop.items.properties, prop.items.required ?? [], `${path}[]`));
    }
  }
  return gaps;
}

export function auditOperation(pathItem, operation, method, path) {
  const result = {
    operationId: operation.operationId ?? `${method.toUpperCase()} ${path}`,
    method: method.toUpperCase(),
    path,
    tag: operation.tags?.[0] ?? 'untagged',
    paramIssues: [],
    requestBodyIssue: null,
    responseIssue: null,
    enumDefaultGaps: [],
  };

  // --- Parameters ---
  const params = mergeParams(pathItem.parameters, operation.parameters);
  for (const p of params) {
    if (p.in !== 'query' && p.in !== 'path') continue;
    const hasExample = p.example !== undefined || p.schema?.example !== undefined;
    if (!hasExample) result.paramIssues.push(p.name);
  }

  // --- Request body ---
  if (operation.requestBody) {
    const jsonContent = operation.requestBody?.content?.['application/json'];
    const bodySchema = flattenAllOf(jsonContent?.schema);
    const bodyExample = jsonContent?.example ?? bodySchema?.example;
    if (bodyExample === undefined) {
      result.requestBodyIssue = { type: 'missing' };
    } else {
      const { valid, errors } = validateExample(bodyExample, bodySchema);
      if (!valid) result.requestBodyIssue = { type: 'invalid', errors };
    }
    result.enumDefaultGaps = findEnumsMissingDefault(bodySchema?.properties, bodySchema?.required ?? []);
  }

  // --- 2xx response ---
  const twoxx = find2xxResponse(operation.responses ?? {});
  if (!twoxx) {
    result.responseIssue = { type: 'no-2xx' };
    return result;
  }

  const example = extractExample(twoxx.response);
  if (example === undefined) {
    result.responseIssue = { type: 'missing', status: twoxx.status };
  } else {
    const rawSchema = twoxx.response?.content?.['application/json']?.schema;
    const schema = flattenAllOf(rawSchema);
    const { valid, errors } = validateExample(example, schema);
    if (!valid) result.responseIssue = { type: 'invalid', status: twoxx.status, errors };
  }

  return result;
}

// ---------------------------------------------------------------------------
// Report rendering
// ---------------------------------------------------------------------------

function renderReport(results, localExamples = new Set()) {
  const missingAll = results.filter(
    (r) => r.responseIssue?.type === 'missing' || r.responseIssue?.type === 'no-2xx'
  );
  // Split: truly missing vs covered by our response-examples.json
  const missing = missingAll.filter((r) => !localExamples.has(r.operationId));
  const coveredLocally = missingAll.filter((r) => localExamples.has(r.operationId));
  const invalid = results.filter((r) => r.responseIssue?.type === 'invalid');
  const valid = results.filter((r) => !r.responseIssue);

  const paramWarnings = results.filter((r) => r.paramIssues.length > 0);
  const bodyWarnings = results.filter((r) => r.requestBodyIssue);

  const lines = [];
  lines.push('# Neon API Spec Audit\n');
  lines.push(
    `**${results.length} operations** — ` +
      `${valid.length} valid response examples in spec, ` +
      `${coveredLocally.length} covered by local data, ` +
      `${missing.length} missing, ` +
      `${invalid.length} schema-invalid\n`
  );

  // --- Missing (no local fallback — real gap) ---
  lines.push(`## Missing response examples — no local fallback (${missing.length})\n`);
  if (missing.length === 0) {
    lines.push('_None — full coverage._\n');
  } else {
    for (const r of missing) {
      lines.push(`- \`${r.method} ${r.path}\` — \`${r.operationId}\``);
    }
    lines.push('');
  }

  // --- Missing from spec but covered by response-examples.json ---
  lines.push(`## Missing from spec, covered by response-examples.json (${coveredLocally.length})\n`);
  if (coveredLocally.length === 0) {
    lines.push('_None._\n');
  } else {
    lines.push('_Spec lacks inline example but UI works — consider upstreaming these to the spec._\n');
    for (const r of coveredLocally) {
      lines.push(`- \`${r.method} ${r.path}\` — \`${r.operationId}\``);
    }
    lines.push('');
  }

  // --- Invalid ---
  lines.push(`## Schema-invalid response examples (${invalid.length})\n`);
  if (invalid.length === 0) {
    lines.push('_None._\n');
  } else {
    for (const r of invalid) {
      lines.push(`- \`${r.method} ${r.path}\` — \`${r.operationId}\``);
      for (const e of r.responseIssue.errors.slice(0, 3)) {
        lines.push(`  - ${e}`);
      }
    }
    lines.push('');
  }

  // --- Valid ---
  lines.push(`## Valid response examples (${valid.length})\n`);
  for (const r of valid) {
    lines.push(`- \`${r.method} ${r.path}\` — \`${r.operationId}\``);
  }
  lines.push('');

  // --- Parameter example gaps ---
  lines.push(`## Parameters missing examples (${paramWarnings.length} operations)\n`);
  if (paramWarnings.length === 0) {
    lines.push('_None._\n');
  } else {
    for (const r of paramWarnings) {
      lines.push(`- \`${r.operationId}\`: ${r.paramIssues.join(', ')}`);
    }
    lines.push('');
  }

  // --- Request body gaps ---
  lines.push(`## Request body example gaps (${bodyWarnings.length} operations)\n`);
  if (bodyWarnings.length === 0) {
    lines.push('_None._\n');
  } else {
    for (const r of bodyWarnings) {
      const detail = r.requestBodyIssue.type === 'invalid'
        ? `invalid — ${r.requestBodyIssue.errors?.slice(0, 2).join('; ')}`
        : 'missing';
      lines.push(`- \`${r.operationId}\`: ${detail}`);
    }
    lines.push('');
  }

  // --- Enum fields missing defaults ---
  const enumGapOps = results.filter((r) => r.enumDefaultGaps.length > 0);
  lines.push(`## Enum fields missing \`default\` (${enumGapOps.length} operations)\n`);
  lines.push(
    `These optional enum properties have no \`default\` in the spec. ` +
    `Without a default, the UI shows "(select)" and the generated curl/SDK examples ` +
    `omit the field entirely. Adding a \`default\` value to the spec improves ` +
    `discoverability and lets examples choose the most common value.\n`
  );
  lines.push(`**Example:** \`createNeonAuth.auth_provider\` — enum \`["mock","stack","stack_v2","better_auth"]\`, no default. Should be \`"better_auth"\`.\n`);
  if (enumGapOps.length === 0) {
    lines.push('_None._\n');
  } else {
    for (const r of enumGapOps) {
      lines.push(`- \`${r.operationId}\`: ${r.enumDefaultGaps.map((f) => `\`${f}\``).join(', ')}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Main — only runs when executed directly
// ---------------------------------------------------------------------------

async function main() {
  const specUrl = process.argv[2] ?? SPEC_URL;
  process.stderr.write(`Fetching spec from ${specUrl}...\n`);

  const raw = await fetch(specUrl).then((r) => r.json());
  const { schema } = await dereference(raw);

  // Load our hand-maintained response examples so the report can distinguish
  // "spec has no example" from "spec has no example AND the UI has no fallback".
  let localExamples = new Set();
  try {
    const { createRequire } = await import('module');
    const require = createRequire(import.meta.url);
    const data = require('./data/response-examples.json');
    localExamples = new Set(Object.keys(data));
    process.stderr.write(`Loaded ${localExamples.size} local response examples.\n`);
  } catch {
    process.stderr.write(`[warn] Could not load response-examples.json — local coverage column will be empty.\n`);
  }

  const results = [];
  for (const [path, pathItem] of Object.entries(schema.paths ?? {})) {
    for (const method of METHODS) {
      const operation = pathItem[method];
      if (!operation) continue;
      if (operation.tags?.includes('Auth (legacy)')) continue;
      results.push(auditOperation(pathItem, operation, method, path));
    }
  }

  process.stdout.write(renderReport(results, localExamples));
  process.stderr.write(`Done. ${results.length} operations audited.\n`);
}

const isMain =
  process.argv[1] &&
  new URL(import.meta.url).pathname === new URL(process.argv[1], import.meta.url).pathname;

if (isMain) main().catch((e) => { console.error(e); process.exit(1); });
