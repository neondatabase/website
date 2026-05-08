#!/usr/bin/env node

// QA tool for verifying agent-readiness endpoints against a live site.
//
// Simulates an AI agent arriving at neon.com and probing all agent-facing
// discovery paths: MCP server descriptors, skill.md, and agent-skills index.
//
// Usage: node scripts/check-agent-endpoints.js [base-url]
// Example: node scripts/check-agent-endpoints.js http://localhost:3000
//          node scripts/check-agent-endpoints.js https://neon.com
//
// Exit codes:
//   0 — all checks passed
//   1 — one or more checks failed

const BASE_URL = process.argv[2] || 'http://localhost:3000';

const CHECKS = [
  {
    name: '/mcp — MCP server descriptor at site root',
    path: '/mcp',
    validate(status, body) {
      if (status !== 200) return `expected 200, got ${status}`;
      let json;
      try {
        json = JSON.parse(body);
      } catch {
        return 'response is not valid JSON';
      }
      if (!json.$schema) return 'missing $schema field';
      if (!json.remotes?.[0]?.url) return 'missing remotes[0].url';
      return null;
    },
    summarize(body) {
      try {
        const j = JSON.parse(body);
        return `name=${j.name}  url=${j.remotes?.[0]?.url}`;
      } catch {
        return '';
      }
    },
  },
  {
    name: '/docs/mcp — docs-scoped MCP descriptor (GET)',
    path: '/docs/mcp',
    validate(status, body) {
      if (status !== 200) return `expected 200, got ${status}`;
      let json;
      try {
        json = JSON.parse(body);
      } catch {
        return 'response is not valid JSON';
      }
      if (!json.$schema) return 'missing $schema field';
      if (!json.remotes?.[0]?.url) return 'missing remotes[0].url';
      if (!json.remotes[0].url.includes('?category=docs'))
        return `remotes[0].url should include ?category=docs (got ${json.remotes[0].url})`;
      if (json.remotes[0].headers)
        return 'remotes[0].headers should be absent — this endpoint is unauthenticated';
      return null;
    },
    summarize(body) {
      try {
        const j = JSON.parse(body);
        return `name=${j.name}  url=${j.remotes?.[0]?.url}`;
      } catch {
        return '';
      }
    },
  },
  {
    name: '/docs/mcp — MCP initialize POST (proxy to unauthenticated docs endpoint)',
    path: '/docs/mcp',
    method: 'POST',
    requestBody: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2025-03-26',
        capabilities: {},
        clientInfo: { name: 'check-agent-endpoints', version: '1.0' },
      },
    }),
    requestHeaders: {
      'Content-Type': 'application/json',
      Accept: 'application/json, text/event-stream',
    },
    validate(status, body) {
      if (status !== 200)
        return `expected 200, got ${status} — MCP server PR may not be merged yet`;
      const dataLine = body.split('\n').find((l) => l.startsWith('data: '));
      if (!dataLine) return 'no SSE data line in response';
      let parsed;
      try {
        parsed = JSON.parse(dataLine.slice(6));
      } catch {
        return 'SSE data line is not valid JSON';
      }
      if (!parsed.result?.serverInfo) return 'missing result.serverInfo in initialize response';
      return null;
    },
    summarize(body) {
      const dataLine = body.split('\n').find((l) => l.startsWith('data: '));
      if (!dataLine) return '';
      try {
        const d = JSON.parse(dataLine.slice(6));
        return `serverInfo=${JSON.stringify(d.result?.serverInfo)}`;
      } catch {
        return '';
      }
    },
  },
  {
    name: '/skill.md — product skill at site root',
    path: '/skill.md',
    validate(status, body) {
      if (status !== 200) return `expected 200, got ${status}`;
      if (!body.includes('name:')) return 'missing frontmatter name: field';
      if (!body.includes('description:')) return 'missing frontmatter description: field';
      return null;
    },
    summarize(body) {
      const nameLine = body.split('\n').find((l) => l.startsWith('name:'));
      return nameLine ? nameLine.trim() : '';
    },
  },
  {
    name: '/.well-known/agent-skills/index.json — skills discovery manifest',
    path: '/.well-known/agent-skills/index.json',
    validate(status, body) {
      if (status !== 200) return `expected 200, got ${status}`;
      let json;
      try {
        json = JSON.parse(body);
      } catch {
        return 'response is not valid JSON';
      }
      if (!json.$schema) return 'missing $schema field';
      if (!Array.isArray(json.skills) || json.skills.length === 0)
        return 'skills array is empty or missing';
      const skill = json.skills[0];
      if (!skill.name) return 'skills[0].name missing';
      if (!skill.url) return 'skills[0].url missing';
      if (!skill.digest) return 'skills[0].digest missing';
      return null;
    },
    summarize(body) {
      try {
        const j = JSON.parse(body);
        return `${j.skills.length} skill(s): ${j.skills.map((s) => s.name).join(', ')}`;
      } catch {
        return '';
      }
    },
  },
  {
    name: '/.well-known/agent-skills/neon-postgres/SKILL.md — skill file resolves',
    path: '/.well-known/agent-skills/neon-postgres/SKILL.md',
    validate(status, body) {
      if (status !== 200) return `expected 200, got ${status}`;
      if (!body.includes('name: neon-postgres')) return 'skill name mismatch';
      return null;
    },
    summarize(body) {
      const desc = body.split('\n').find((l) => l.startsWith('description:'));
      return desc ? desc.slice(0, 80).trim() : '';
    },
  },
  {
    name: '/docs/skill.md — skill at /docs/ path (Mintlify-style checkers)',
    path: '/docs/skill.md',
    validate(status, body) {
      if (status !== 200) return `expected 200, got ${status}`;
      if (!body.includes('name: neon-postgres')) return 'skill name mismatch';
      return null;
    },
    summarize(body) {
      const nameLine = body.split('\n').find((l) => l.startsWith('name:'));
      return nameLine ? nameLine.trim() : '';
    },
  },
  {
    name: '/docs/.well-known/agent-skills/index.json — skills discovery at /docs/ path',
    path: '/docs/.well-known/agent-skills/index.json',
    validate(status, body) {
      if (status !== 200) return `expected 200, got ${status}`;
      let json;
      try {
        json = JSON.parse(body);
      } catch {
        return 'response is not valid JSON';
      }
      if (!json.skills?.[0]?.name) return 'skills[0].name missing';
      return null;
    },
    summarize(body) {
      try {
        const j = JSON.parse(body);
        return `${j.skills.length} skill(s): ${j.skills.map((s) => s.name).join(', ')}`;
      } catch {
        return '';
      }
    },
  },
];

async function fetchCheck(url, { method = 'GET', body = undefined, headers = {} } = {}) {
  const res = await fetch(url, { method, body, headers });
  const responseBody = await res.text();
  return { status: res.status, body: responseBody };
}

async function run() {
  console.log(`\nAgent endpoint check: ${BASE_URL}\n`);
  console.log('Acting as an agent arriving at neon.com and probing discovery paths...\n');

  let passed = 0;
  let failed = 0;

  for (const check of CHECKS) {
    const url = `${BASE_URL}${check.path}`;
    let status, body;
    try {
      ({ status, body } = await fetchCheck(url, {
        method: check.method ?? 'GET',
        body: check.requestBody,
        headers: check.requestHeaders ?? {},
      }));
    } catch (err) {
      console.log(`  FAIL  ${check.name}`);
      console.log(`        fetch error: ${err.message}\n`);
      failed++;
      continue;
    }

    const error = check.validate(status, body);
    if (error) {
      console.log(`  FAIL  ${check.name}`);
      console.log(`        ${error}\n`);
      failed++;
    } else {
      const summary = check.summarize(body);
      console.log(`  PASS  ${check.name}`);
      if (summary) console.log(`        ${summary}`);
      console.log();
      passed++;
    }
  }

  console.log(`─────────────────────────────────────`);
  console.log(`${passed} passed, ${failed} failed\n`);
  process.exit(failed > 0 ? 1 : 0);
}

run().catch((err) => {
  console.error('Unexpected error:', err.message);
  process.exit(1);
});
