#!/usr/bin/env node
// Audits the live Neon OpenAPI spec for example coverage and schema validity.
// Usage: node scripts/audit-api-spec.mjs [spec-url] [--verbose] > spec-audit.md
//   --verbose  expand the summarized sections (valid list, per-operation parameter gaps)

import Ajv from 'ajv';
import { dereference } from '@scalar/openapi-parser';

export { mergeParams, flattenAllOf, find2xxResponse } from './lib/spec-utils.mjs';
import { mergeParams, flattenAllOf, find2xxResponse } from './lib/spec-utils.mjs';
import { EXCLUDED_OPERATION_IDS } from './lib/excluded-operations.mjs';

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
    // logger:false silences Ajv's "unknown format 'date-time' ignored" warnings.
    // The spec uses OpenAPI formats (date-time, uuid, int32/int64, email) that
    // Ajv doesn't validate by default; we don't rely on Ajv's logger since we
    // read `validate.errors` directly, so drop the noise.
    const ajv = new Ajv({ strict: false, allErrors: true, logger: false });
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

// Bucket operations by response-example status. Exported so the report headline
// and the terminal summary share one source of truth.
export function summarize(results, localExamples = new Set()) {
  const missingAll = results.filter(
    (r) => r.responseIssue?.type === 'missing' || r.responseIssue?.type === 'no-2xx'
  );
  return {
    valid: results.filter((r) => !r.responseIssue),
    // Split "missing" into truly missing vs covered by our response-examples.json.
    coveredLocally: missingAll.filter((r) => localExamples.has(r.operationId)),
    missing: missingAll.filter((r) => !localExamples.has(r.operationId)),
    invalid: results.filter((r) => r.responseIssue?.type === 'invalid'),
  };
}

function renderReport(results, localExamples = new Set(), { verbose = false } = {}) {
  const { valid, coveredLocally, missing, invalid } = summarize(results, localExamples);

  const paramWarnings = results.filter((r) => r.paramIssues.length > 0);
  const bodyWarnings = results.filter((r) => r.requestBodyIssue);

  const lines = [];
  // No summary block here — the run's tally is printed to stderr at the end
  // (see main), where it stays readable after the report scrolls past or is
  // redirected to a file. The per-section counts below carry the detail.
  lines.push('# Neon API Spec Audit\n');

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
  if (verbose) {
    for (const r of valid) {
      lines.push(`- \`${r.method} ${r.path}\` — \`${r.operationId}\``);
    }
  } else {
    lines.push(
      `_${valid.length} operations have a valid response example in the spec. Run with \`--verbose\` to list them._`
    );
  }
  lines.push('');

  // --- Parameter example gaps ---
  // Count how many operations each parameter name lacks an example on, so the
  // default report is a short "which params to fix" summary rather than a list
  // of nearly every operation (path params like project_id recur everywhere).
  const paramFreq = new Map();
  for (const r of paramWarnings) {
    for (const name of r.paramIssues) {
      paramFreq.set(name, (paramFreq.get(name) ?? 0) + 1);
    }
  }
  const rankedParams = [...paramFreq.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  lines.push(
    `## Parameters missing examples (${paramWarnings.length} operations, ${paramFreq.size} distinct params)\n`
  );
  if (paramWarnings.length === 0) {
    lines.push('_None._\n');
  } else if (verbose) {
    for (const r of paramWarnings) {
      lines.push(`- \`${r.operationId}\`: ${r.paramIssues.join(', ')}`);
    }
    lines.push('');
  } else {
    lines.push(
      'Query and path parameters with no `example` in the spec. The generated docs fall back ' +
        'to a `$PARAM_NAME` placeholder, so they render but without a realistic value. Add ' +
        'examples in the spec to improve them. Ranked by operations affected:\n'
    );
    for (const [name, count] of rankedParams) {
      lines.push(`- \`${name}\` — ${count} ${count === 1 ? 'op' : 'ops'}`);
    }
    lines.push('\n_Run with `--verbose` for the full per-operation list._');
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
  const args = process.argv.slice(2);
  const verbose = args.includes('--verbose') || args.includes('-v');
  const specUrl = args.find((a) => !a.startsWith('-')) ?? SPEC_URL;
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
      // Match the generated API reference's scope so the audit reflects what
      // actually renders, not the raw spec. Only EXCLUDED_OPERATION_IDS are
      // hidden from the docs (shared with generate-api-ref.mjs); everything else
      // in the spec is documented — including Auth (legacy) — so it's audited.
      if (operation.operationId && EXCLUDED_OPERATION_IDS.has(operation.operationId)) continue;
      results.push(auditOperation(pathItem, operation, method, path));
    }
  }

  process.stdout.write(renderReport(results, localExamples, { verbose }));

  // Print the tally to stderr so it's the last thing shown in a terminal, and
  // stays visible even when the report on stdout is redirected to a file.
  const s = summarize(results, localExamples);
  const pad = (n) => String(n).padStart(3);
  process.stderr.write(
    `\n${results.length} operations audited for response-example coverage:\n` +
      `${pad(s.valid.length)}  have a valid response example in the spec\n` +
      `${pad(s.coveredLocally.length)}  have no spec example but are filled from local data (response-examples.json)\n` +
      `${pad(s.missing.length)}  have no response example anywhere — the real gaps\n` +
      `${pad(s.invalid.length)}  have a response example that fails schema validation\n`
  );
}

const isMain =
  process.argv[1] &&
  new URL(import.meta.url).pathname === new URL(process.argv[1], import.meta.url).pathname;

if (isMain) main().catch((e) => { console.error(e); process.exit(1); });
