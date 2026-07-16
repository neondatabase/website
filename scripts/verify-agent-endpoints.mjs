#!/usr/bin/env node
/**
 * Unified verifier for Neon's agent / discovery endpoints.
 *
 * Reads the catalog (config/agent-endpoints.yaml) and, for every entry, runs
 * the validator named in its `validator` field. Each validator checks that the
 * served payload BOTH matches its governing spec AND is up to date with the
 * spec-agnostic source of truth (src/constants/agent-discovery.js). Model
 * catalog verification (/models.json vs models.dev) is folded in here too, so a
 * single command / CI job covers every discovery surface.
 *
 * The run never stops at the first failure: it collects every check across all
 * endpoints and prints exactly what failed and why, then exits non-zero if any
 * check failed.
 *
 * Usage:
 *   node scripts/verify-agent-endpoints.mjs               # offline (PR gate)
 *   node scripts/verify-agent-endpoints.mjs --live        # + fetch neon.com and run models.dev sync
 *   node scripts/verify-agent-endpoints.mjs --live --base https://preview.example.com
 *   node scripts/verify-agent-endpoints.mjs --json        # machine-readable
 */

import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

import Ajv from 'ajv';
import { load as loadYaml } from 'js-yaml';

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const args = process.argv.slice(2);
const LIVE = args.includes('--live');
const JSON_MODE = args.includes('--json');
const BASE_URL = (() => {
  const i = args.indexOf('--base');
  return i !== -1 && args[i + 1] ? args[i + 1].replace(/\/$/, '') : 'https://neon.com';
})();

const CATALOG_PATH = path.join(ROOT, 'config/agent-endpoints.yaml');
const SOT_PATH = path.join(ROOT, 'src/constants/agent-discovery.js');
const SKILLS_DIR = path.join(ROOT, 'public/docs/ai/skills');
const AGENT_SKILLS_SCHEMA = 'https://schemas.agentskills.io/discovery/0.2.0/schema.json';

const ajv = new Ajv({ allErrors: true, strict: false });

// ── small helpers ────────────────────────────────────────────────────────────

const ok = (name, detail) => ({ name, ok: true, detail });
const fail = (name, detail) => ({ name, ok: false, detail });

function schemaCheck(specName, schema, data) {
  const validate = ajv.compile(schema);
  if (validate(data)) return ok(`schema (${specName})`);
  const msg = (validate.errors || [])
    .map((e) => `${e.instancePath || '(root)'} ${e.message}`)
    .join('; ');
  return fail(`schema (${specName})`, msg);
}

function equalsCheck(name, actual, expected) {
  return actual === expected
    ? ok(name, actual)
    : fail(name, `expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
}

function isUrl(value) {
  try {
    return Boolean(new URL(value));
  } catch {
    return false;
  }
}

function readJson(relPath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relPath), 'utf-8'));
}

async function fetchServed(servedPath) {
  const url = `${BASE_URL}${servedPath}`;
  const res = await fetch(url, { headers: { Accept: '*/*' } });
  const body = await res.text();
  return { url, status: res.status, contentType: res.headers.get('content-type') || '', body };
}

// Obtain the offline payload for an entry (builder output or committed file).
function offlinePayload(entry, sot) {
  if (entry.check === 'builder') {
    const build = sot[entry.builder];
    if (typeof build !== 'function') {
      throw new Error(`builder "${entry.builder}" not exported from constants/agent-discovery`);
    }
    return build();
  }
  if (entry.check === 'file') return readJson(entry.file);
  return null; // live-only
}

// ── per-spec validators ───────────────────────────────────────────────────────
// Each returns an array of check results. `sot` is the source-of-truth module.

const SCHEMAS = {
  mcpServerCard: {
    type: 'object',
    required: ['url', 'authentication'],
    properties: {
      url: { type: 'string' },
      endpoint: { type: 'string' },
      authentication: {
        type: 'object',
        required: ['type'],
        properties: { type: { type: 'string' }, authorization_server: { type: 'string' } },
      },
      serverInfo: { type: 'object' },
      capabilities: { type: 'object' },
    },
  },
  apiCatalog: {
    type: 'object',
    required: ['linkset'],
    properties: {
      linkset: {
        type: 'array',
        minItems: 1,
        items: {
          type: 'object',
          required: ['anchor'],
          properties: {
            anchor: { type: 'string' },
            'service-desc': {
              type: 'array',
              items: {
                type: 'object',
                required: ['href'],
                properties: { href: { type: 'string' }, type: { type: 'string' } },
              },
            },
            'service-doc': {
              type: 'array',
              items: { type: 'object', required: ['href'], properties: { href: { type: 'string' } } },
            },
          },
        },
      },
    },
  },
  agentSkillsIndex: {
    type: 'object',
    required: ['$schema', 'skills'],
    properties: {
      $schema: { type: 'string' },
      skills: {
        type: 'array',
        minItems: 1,
        items: {
          type: 'object',
          required: ['name', 'type', 'description', 'url', 'digest'],
          properties: {
            name: { type: 'string' },
            type: { type: 'string' },
            description: { type: 'string' },
            url: { type: 'string' },
            digest: { type: 'string', pattern: '^sha256:[a-f0-9]{64}$' },
          },
        },
      },
    },
  },
  aiCatalog: {
    type: 'object',
    required: ['specVersion', 'host', 'entries'],
    properties: {
      specVersion: { type: 'string' },
      host: { type: 'object', required: ['identifier'], properties: { identifier: { type: 'string' } } },
      entries: {
        type: 'array',
        minItems: 1,
        items: { type: 'object', required: ['identifier', 'type', 'url'] },
      },
    },
  },
  modelsJson: {
    type: 'object',
    required: ['neon'],
    properties: {
      neon: {
        type: 'object',
        required: ['models'],
        properties: {
          models: {
            type: 'object',
            minProperties: 1,
            additionalProperties: {
              type: 'object',
              required: ['name'],
              properties: { name: { type: 'string' } },
            },
          },
        },
      },
    },
  },
  openapi: {
    type: 'object',
    required: ['openapi', 'info'],
    properties: {
      openapi: { type: 'string' },
      info: { type: 'object', required: ['title'], properties: { title: { type: 'string' } } },
    },
  },
};

const VALIDATORS = {
  'mcp-server-card'(payload, entry, sot) {
    const checks = [schemaCheck(entry.spec.name, SCHEMAS.mcpServerCard, payload)];
    checks.push(equalsCheck('url matches SoT connectUrl', payload.url, sot.MCP_SERVER.connectUrl));
    checks.push(
      equalsCheck(
        'authorization_server matches SoT',
        payload.authentication?.authorization_server,
        sot.MCP_SERVER.authorizationServer
      )
    );
    checks.push(payload.url && isUrl(payload.url) ? ok('url is a valid URL') : fail('url is a valid URL', payload.url));
    return checks;
  },

  'api-catalog'(payload, entry, sot) {
    const checks = [schemaCheck(entry.spec.name, SCHEMAS.apiCatalog, payload)];
    const link = payload.linkset?.[0] || {};
    checks.push(equalsCheck('anchor matches SoT baseUrl', link.anchor, sot.NEON_API.baseUrl));
    checks.push(
      equalsCheck(
        'service-desc href matches SoT openApiSpecUrl',
        link['service-desc']?.[0]?.href,
        sot.NEON_API.openApiSpecUrl
      )
    );
    checks.push(
      equalsCheck('service-doc href matches SoT docsUrl', link['service-doc']?.[0]?.href, sot.NEON_API.docsUrl)
    );
    return checks;
  },

  'agent-skills-index'(payload, entry) {
    const checks = [schemaCheck(entry.spec.name, SCHEMAS.agentSkillsIndex, payload)];
    checks.push(equalsCheck('$schema is agentskills 0.2.0', payload.$schema, AGENT_SKILLS_SCHEMA));
    // Up-to-date: every listed digest must match the current SKILL.md bytes.
    for (const skill of payload.skills || []) {
      const skillPath = path.join(SKILLS_DIR, skill.name, 'SKILL.md');
      if (!fs.existsSync(skillPath)) {
        checks.push(fail(`digest up to date: ${skill.name}`, `missing SKILL.md at ${path.relative(ROOT, skillPath)}`));
        continue;
      }
      const digest = 'sha256:' + crypto.createHash('sha256').update(fs.readFileSync(skillPath)).digest('hex');
      checks.push(
        digest === skill.digest
          ? ok(`digest up to date: ${skill.name}`)
          : fail(
              `digest up to date: ${skill.name}`,
              `index digest is stale — run \`npm run generate:skills\` (indexed ${skill.digest.slice(0, 19)}…, actual ${digest.slice(0, 19)}…)`
            )
      );
    }
    return checks;
  },

  'ai-catalog'(payload, entry, sot) {
    const checks = [schemaCheck(entry.spec.name, SCHEMAS.aiCatalog, payload)];
    const mcpEntry = (payload.entries || []).find((e) => e.type === 'application/mcp-server-card+json');
    checks.push(
      mcpEntry
        ? equalsCheck('MCP entry url matches SoT cardUrl', mcpEntry.url, sot.MCP_SERVER.cardUrl)
        : fail('MCP entry present', 'no application/mcp-server-card+json entry')
    );
    // Cross-file: catalog skills must match the agent-skills index skills.
    try {
      const skillsIndex = readJson('public/.well-known/agent-skills/index.json');
      const indexNames = new Set((skillsIndex.skills || []).map((s) => s.name));
      const catalogSkillNames = (payload.entries || [])
        .filter((e) => e.type === 'application/agent-skills+md')
        .map((e) => e.identifier.split(':').pop());
      const mismatched = catalogSkillNames.filter((n) => !indexNames.has(n));
      checks.push(
        mismatched.length === 0
          ? ok('skills consistent with agent-skills index')
          : fail(
              'skills consistent with agent-skills index',
              `not in index: ${mismatched.join(', ')} — run \`npm run generate:skills\``
            )
      );
    } catch (err) {
      checks.push(fail('skills consistent with agent-skills index', err.message));
    }
    return checks;
  },

  'models-json'(payload, entry, sot, { live }) {
    const checks = [schemaCheck(entry.spec.name, SCHEMAS.modelsJson, payload)];
    if (live && entry.liveSync) {
      const res = spawnSync('node', [path.join(ROOT, entry.liveSync), '--ci'], {
        cwd: ROOT,
        encoding: 'utf-8',
      });
      const output = `${res.stdout || ''}${res.stderr || ''}`.trim();
      if (res.status === 0) {
        checks.push(ok('in sync with models.dev', output.split('\n').pop()));
      } else if (res.status === 1) {
        checks.push(fail('in sync with models.dev', `catalog drift — ${output}`));
      } else {
        checks.push(fail('in sync with models.dev', `sync check errored (exit ${res.status}) — ${output}`));
      }
    }
    return checks;
  },

  'llms-txt'(payload, entry, sot, { live, liveBody }) {
    if (!live) return [ok('generator present (checked live)', entry.generator)];
    const checks = [];
    checks.push(liveBody && liveBody.length > 0 ? ok('non-empty') : fail('non-empty', 'empty body'));
    checks.push(/neon/i.test(liveBody || '') ? ok('mentions Neon') : fail('mentions Neon', 'no "Neon" found'));
    return checks;
  },

  openapi(payload, entry, sot, { live, liveJson }) {
    if (!live) {
      // Offline: the spec is served via a rewrite; assert the rewrite is declared.
      const cfg = fs.readFileSync(path.join(ROOT, entry.rewriteFile), 'utf-8');
      return [
        cfg.includes("source: '/openapi.json'")
          ? ok('rewrite declared in next.config.js')
          : fail('rewrite declared in next.config.js', "no source: '/openapi.json' rewrite found"),
      ];
    }
    if (!liveJson) return [fail(`schema (${entry.spec.name})`, 'response was not valid JSON')];
    return [schemaCheck(entry.spec.name, SCHEMAS.openapi, liveJson)];
  },
};

// ── run one entry ─────────────────────────────────────────────────────────────

async function runEntry(entry, sot) {
  const checks = [];

  // For builder-backed routes, assert the route actually delegates to the builder
  // (guards against someone re-hardcoding values in the route file).
  if (entry.check === 'builder' && entry.routeFile) {
    const src = fs.readFileSync(path.join(ROOT, entry.routeFile), 'utf-8');
    checks.push(
      src.includes(entry.builder)
        ? ok('route delegates to SoT builder', entry.builder)
        : fail('route delegates to SoT builder', `${entry.routeFile} does not reference ${entry.builder}`)
    );
  }

  // Live fetch context (used by several validators + content-type check).
  let live = { live: LIVE, liveBody: null, liveJson: null };
  if (LIVE) {
    try {
      const served = await fetchServed(entry.servedPath);
      live.liveBody = served.body;
      try {
        live.liveJson = JSON.parse(served.body);
      } catch {
        live.liveJson = null;
      }
      checks.push(
        served.status === 200
          ? ok('served 200', `${served.url}`)
          : fail('served 200', `${served.url} -> ${served.status}`)
      );
      if (entry.contentType) {
        checks.push(
          served.contentType.includes(entry.contentType.split(';')[0])
            ? ok('content-type', served.contentType)
            : fail('content-type', `expected ${entry.contentType}, got ${served.contentType || '(none)'}`)
        );
      }
    } catch (err) {
      checks.push(fail('served 200', `${BASE_URL}${entry.servedPath} -> ${err.message}`));
    }
  }

  const validator = VALIDATORS[entry.validator];
  if (!validator) {
    checks.push(fail('validator exists', `no validator "${entry.validator}"`));
    return checks;
  }

  try {
    const payload = offlinePayload(entry, sot);
    checks.push(...validator(payload, entry, sot, live));
  } catch (err) {
    checks.push(fail('validate', err.message));
  }

  return checks;
}

// ── main ──────────────────────────────────────────────────────────────────────

async function main() {
  const catalog = loadYaml(fs.readFileSync(CATALOG_PATH, 'utf-8'));
  const sot = require(SOT_PATH);

  const results = [];
  for (const entry of catalog.endpoints) {
    const checks = await runEntry(entry, sot);
    results.push({ entry, checks, ok: checks.every((c) => c.ok) });
  }

  if (JSON_MODE) {
    console.log(JSON.stringify({ mode: LIVE ? 'live' : 'offline', base: BASE_URL, results }, null, 2));
    process.exit(results.every((r) => r.ok) ? 0 : 1);
  }

  console.log(`\nAgent-discovery verification  (mode: ${LIVE ? `live ${BASE_URL}` : 'offline'})\n`);

  let passedEntries = 0;
  let totalChecks = 0;
  let failedChecks = 0;

  for (const { entry, checks, ok: entryOk } of results) {
    if (entryOk) passedEntries += 1;
    console.log(`${entryOk ? 'PASS' : 'FAIL'}  ${entry.id.padEnd(22)} ${entry.name}`);
    for (const c of checks) {
      totalChecks += 1;
      if (!c.ok) failedChecks += 1;
      const mark = c.ok ? '  ✓' : '  ✗';
      console.log(`${mark} ${c.name}${c.detail && (!c.ok || c.detail !== true) ? `  ${c.detail}` : ''}`);
    }
    if (!entryOk) {
      console.log(`      spec: ${entry.spec.name} → ${entry.spec.url}`);
      if (entry.generator) console.log(`      regenerate: node ${entry.generator}`);
    }
    console.log('');
  }

  console.log('─'.repeat(60));
  console.log(
    `${passedEntries}/${results.length} endpoints passed  (${totalChecks - failedChecks}/${totalChecks} checks)\n`
  );

  process.exit(failedChecks > 0 ? 1 : 0);
}

main()
  .then(() => {})
  .catch((err) => {
    console.error('Verifier crashed:', err.stack || err.message);
    process.exit(2);
  });
