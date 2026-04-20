#!/usr/bin/env node

// QA tool for verifying markdown URL serving behavior against a live domain.
//
// Usage: node scripts/test-markdown-urls.js <base-url> [options]
// Options: --verbose, --json, --filter <pattern>, --generate
// Example: node scripts/test-markdown-urls.js https://neon.com
//          node scripts/test-markdown-urls.js http://localhost:3000 --verbose
//          node scripts/test-markdown-urls.js http://localhost:3000 --generate
//          node scripts/test-markdown-urls.js http://localhost:3000 --filter "changelog"
//
// Generating public/md/ locally (so localhost matches production for /md/... fetches)
// ---------------------------------------------------------------------------
// Middleware serves markdown by fetching URLs like /md/changelog/2026-04-03.md, which
// map to files under public/md/. Those files are produced from content/ by the LLM
// markdown pipeline — they are not all committed, and `npm run dev` does not regenerate
// them automatically (only prebuild icons + pricing run before dev).
//
// If tests such as "Changelog entry /docs/changelog/YYYY-MM-DD" fail on localhost with
// agent-404 or 404 for the .md URL, regenerate public/md/ first — or pass --generate
// to this script so it runs the postbuild markdown chain before the HTTP checks:
//
//   node src/scripts/copy-md-content.js
//
// That is the same step as in npm's postbuild (after `next build`). copy-md-content.js
// alone is enough to populate public/md/docs/, public/md/changelog/, etc. for this QA
// script's /md/... checks.
//
// Generating docs/llms.txt (and llms-full.txt)
// ---------------------------------------------------------------------------
// The table-of-contents index at /docs/llms.txt is not created by copy-md-content.js.
// To refresh it locally (writes public/docs/llms.txt):
//
//   node src/scripts/generate-llms-index.js
//
// For the single large bundle (public/docs/llms-full.txt), same postbuild order:
//
//   node src/scripts/generate-llms-full.js
//
// This QA script only sanity-checks that llms.txt is non-empty and mentions Neon; it does
// not require you to run these unless you care about those files matching latest content.
//
// Full production-like asset generation: npm run build  (postbuild runs copy-md-content,
// generate-llms-index, generate-llms-full, then sitemaps)
//
// Optional: --generate runs copy-md-content + generate-llms-index + generate-llms-full
// before HTTP checks (same order as postbuild, minus sitemaps).
//
// Coverage notes (intentional limits of this QA tool)
// ---------------------------------------------------------------------------
// - Matches isAIAgentRequest() in src/utils/ai-agent-detection.js: we test text/markdown,
//   text/plain, application/json (no text/html in Accept), axios UA, and Claude UA — not
//   every UA pattern (got, perplexity, etc.) or application/xml Accept alone.
// - Root / and /home: only spot-check that markdown is not served for negotiated requests;
//   login redirects are not exercised.
// - Legacy /llms/*.txt: one known redirect only; unmapped paths fall through to 404 (not tested).
// - Changelog entry date is pinned; update if that file is removed from content/changelog/.
// - Top-level hub .md URLs (/guides.md, /branching.md): dot-md tests require markdown 404
//   (md-404). Fails on hosts without middleware + rewrite fixes for those paths.

const { spawnSync } = require('child_process');
const path = require('path');

function parseCli(argv) {
  const out = {
    baseUrl: null,
    verbose: false,
    json: false,
    filter: null,
    generate: false,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--verbose') out.verbose = true;
    else if (a === '--json') out.json = true;
    else if (a === '--generate') out.generate = true;
    else if (a === '--filter') {
      out.filter = argv[i + 1];
      if (!out.filter) {
        console.error('--filter requires a value');
        process.exit(1);
      }
      i += 1;
    } else if (a.startsWith('http://') || a.startsWith('https://')) {
      if (!out.baseUrl) out.baseUrl = a;
    } else if (a.startsWith('--')) {
      console.error(`Unknown option: ${a}`);
      process.exit(1);
    } else {
      console.error(`Unexpected argument: ${a}`);
      process.exit(1);
    }
  }
  return out;
}

const cli = parseCli(process.argv.slice(2));

if (!cli.baseUrl) {
  console.error('Usage: node scripts/test-markdown-urls.js <base-url> [options]');
  console.error('Options:');
  console.error('  --verbose              More detail on failures');
  console.error('  --json                 Machine-readable summary');
  console.error('  --filter <pattern>     Run only matching tests');
  console.error('  --generate             Run copy-md + llms index + llms-full, then test');
  console.error('Examples:');
  console.error('  node scripts/test-markdown-urls.js https://neon.com');
  console.error('  node scripts/test-markdown-urls.js http://localhost:3000 --generate');
  console.error('  node scripts/test-markdown-urls.js http://localhost:3000 --generate --verbose');
  process.exit(1);
}

const BASE_URL = cli.baseUrl;
const VERBOSE = cli.verbose;
const JSON_OUTPUT = cli.json;
const FILTER = cli.filter;

const REPO_ROOT = path.join(__dirname, '..');

function runAssetGenerators() {
  const scripts = [
    'src/scripts/copy-md-content.js',
    'src/scripts/generate-llms-index.js',
    'src/scripts/generate-llms-full.js',
  ];

  console.log(`\n\x1b[36mRunning asset generators (postbuild markdown / llms chain)\x1b[0m\n`);

  for (const rel of scripts) {
    const scriptPath = path.join(REPO_ROOT, rel);
    console.log(`  → node ${rel}`);
    const result = spawnSync(process.execPath, [scriptPath], {
      cwd: REPO_ROOT,
      stdio: 'inherit',
    });
    if (result.status !== 0) {
      console.error(`\nAsset step failed: ${rel} (exit ${result.status})`);
      process.exit(result.status ?? 1);
    }
  }
  console.log('');
}

const BROWSER_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const AGENT_UA = 'Claude/1.0';

// ---------------------------------------------------------------------------
// Request mode presets
// ---------------------------------------------------------------------------

const modes = {
  browser: { 'User-Agent': BROWSER_UA, Accept: 'text/html,application/xhtml+xml,*/*' },
  'accept-md': { 'User-Agent': BROWSER_UA, Accept: 'text/markdown, text/html, */*' },
  'agent-ua': { 'User-Agent': AGENT_UA, Accept: 'text/html' },
  'dot-md': { 'User-Agent': BROWSER_UA, Accept: 'text/html,application/xhtml+xml,*/*' },
  /** isAIAgentRequest: prefersNonHtml — no text/html in Accept */
  'accept-plain': { 'User-Agent': BROWSER_UA, Accept: 'text/plain' },
  /** isAIAgentRequest: prefersNonHtml */
  'accept-json': { 'User-Agent': BROWSER_UA, Accept: 'application/json' },
  /** isAIAgentRequest: axios (Claude Code HTTP client) */
  'agent-axios': { 'User-Agent': 'axios/1.8.4', Accept: 'text/html' },
};

// ---------------------------------------------------------------------------
// Assertion helpers
// ---------------------------------------------------------------------------

function expectStatus(actual, expected) {
  if (typeof expected === 'number')
    return actual === expected ? null : `status ${actual} !== ${expected}`;
  if (expected === '2xx') return actual >= 200 && actual < 300 ? null : `status ${actual} not 2xx`;
  if (expected === '4xx') return actual >= 400 && actual < 500 ? null : `status ${actual} not 4xx`;
  return null;
}

function expectContentType(actual, pattern) {
  if (!actual) return `Content-Type missing, expected to contain "${pattern}"`;
  return actual.includes(pattern) ? null : `Content-Type "${actual}" does not contain "${pattern}"`;
}

function expectHeader(headers, name, pattern) {
  const val = headers.get(name);
  if (!val) return `header ${name} missing`;
  if (pattern instanceof RegExp)
    return pattern.test(val) ? null : `header ${name}="${val}" does not match ${pattern}`;
  return val.includes(pattern) ? null : `header ${name}="${val}" does not contain "${pattern}"`;
}

function expectBodyContains(body, substring, caseInsensitive = false) {
  const haystack = caseInsensitive ? body.toLowerCase() : body;
  const needle = caseInsensitive ? substring.toLowerCase() : substring;
  return haystack.includes(needle) ? null : `body does not contain "${substring}"`;
}

function expectMarkdownBody(body) {
  const trimmed = body.trimStart();
  if (trimmed.startsWith('<'))
    return `body looks like HTML, not markdown (starts with "${trimmed.slice(0, 30)}…")`;
  if (trimmed.length === 0) return 'body is empty';
  return null;
}

function expectHtmlBody(body) {
  const trimmed = body.trimStart();
  if (!trimmed.startsWith('<'))
    return `body does not look like HTML (starts with "${trimmed.slice(0, 30)}…")`;
  return null;
}

function expectBodyNotEmpty(body) {
  return body.trim().length > 0 ? null : 'body is empty';
}

// ---------------------------------------------------------------------------
// Test case definitions
// ---------------------------------------------------------------------------

function buildTests() {
  const tests = [];

  // Helper to add a test
  const add = (category, path, mode, assertions, { spotCheck, note } = {}) => {
    tests.push({ category, path, mode, assertions, spotCheck, note });
  };

  // ── 1. Content routes with markdown (happy path) ──────────────────────

  const contentRoutes = [
    { path: '/docs/introduction', spotWord: 'Neon' },
    { path: '/postgresql/tutorial', spotWord: null },
    { path: '/guides/neon-sst', spotWord: null },
    { path: '/branching/introduction', spotWord: null },
    { path: '/programs/agents', spotWord: null },
    { path: '/use-cases/ai-agents', spotWord: null },
  ];

  for (const { path, spotWord } of contentRoutes) {
    add('Content route', path, 'browser', [
      (r) => expectStatus(r.status, 200),
      (r) => expectContentType(r.contentType, 'text/html'),
      (r) => expectHtmlBody(r.body),
    ]);

    add(
      'Content route',
      path,
      'accept-md',
      [
        (r) => expectStatus(r.status, 200),
        (r) => expectContentType(r.contentType, 'text/markdown'),
        (r) => expectMarkdownBody(r.body),
        (r) => expectHeader(r.headers, 'x-content-source', 'markdown'),
        (r) => expectHeader(r.headers, 'x-llms-txt', '/docs/llms.txt'),
        (r) => expectHeader(r.headers, 'link', '/docs/llms.txt'),
        (r) => expectHeader(r.headers, 'x-robots-tag', 'noindex'),
        (r) => expectHeader(r.headers, 'cache-control', 'public'),
        (r) => expectHeader(r.headers, 'vary', 'Accept'),
      ],
      { spotCheck: spotWord ? (r) => expectBodyContains(r.body, spotWord, true) : null }
    );

    add(
      'Content route',
      path,
      'agent-ua',
      [
        (r) => expectStatus(r.status, 200),
        (r) => expectContentType(r.contentType, 'text/markdown'),
        (r) => expectMarkdownBody(r.body),
        (r) => expectHeader(r.headers, 'x-content-source', 'markdown'),
      ],
      { spotCheck: spotWord ? (r) => expectBodyContains(r.body, spotWord, true) : null }
    );

    add('Content route', path, 'dot-md', [
      (r) => expectStatus(r.status, 200),
      (r) => expectContentType(r.contentType, 'text/markdown'),
      (r) => expectMarkdownBody(r.body),
      (r) => expectHeader(r.headers, 'x-content-source', 'markdown'),
    ]);
  }

  // isAIAgentRequest alternate triggers (see ai-agent-detection.js)
  add(
    'Agent detection',
    '/docs/introduction',
    'accept-plain',
    [
      (r) => expectStatus(r.status, 200),
      (r) => expectContentType(r.contentType, 'text/markdown'),
      (r) => expectMarkdownBody(r.body),
      (r) => expectHeader(r.headers, 'x-content-source', 'markdown'),
    ],
    { note: 'Accept: text/plain (prefersNonHtml)' }
  );

  add(
    'Agent detection',
    '/docs/introduction',
    'accept-json',
    [
      (r) => expectStatus(r.status, 200),
      (r) => expectContentType(r.contentType, 'text/markdown'),
      (r) => expectMarkdownBody(r.body),
      (r) => expectHeader(r.headers, 'x-content-source', 'markdown'),
    ],
    { note: 'Accept: application/json without text/html' }
  );

  add(
    'Agent detection',
    '/docs/introduction',
    'agent-axios',
    [
      (r) => expectStatus(r.status, 200),
      (r) => expectContentType(r.contentType, 'text/markdown'),
      (r) => expectMarkdownBody(r.body),
      (r) => expectHeader(r.headers, 'x-content-source', 'markdown'),
    ],
    { note: 'axios User-Agent (Claude Code)' }
  );

  // Explicit .md in URL + Accept: text/markdown (distinct from dot-md which uses HTML Accept)
  add(
    'Content route',
    '/docs/introduction.md',
    'accept-md',
    [
      (r) => expectStatus(r.status, 200),
      (r) => expectContentType(r.contentType, 'text/markdown'),
      (r) => expectMarkdownBody(r.body),
      (r) => expectHeader(r.headers, 'x-content-source', 'markdown'),
    ],
    { spotCheck: (r) => expectBodyContains(r.body, 'Neon', true), note: 'negotiated .md URL' }
  );

  // ── 2. Excluded index routes ──────────────────────────────────────────

  const excludedRoutes = [
    { path: '/guides', hasDotMd: true },
    { path: '/branching', hasDotMd: true },
    { path: '/use-cases/multi-tb', hasDotMd: false },
    { path: '/use-cases/serverless-apps', hasDotMd: false },
  ];

  for (const { path, hasDotMd } of excludedRoutes) {
    add('Excluded route', path, 'browser', [
      (r) => expectStatus(r.status, 200),
      (r) => expectContentType(r.contentType, 'text/html'),
      (r) => expectHtmlBody(r.body),
    ]);

    add(
      'Excluded route',
      path,
      'accept-md',
      [
        (r) => expectStatus(r.status, 200),
        (r) => expectContentType(r.contentType, 'text/html'),
        (r) => expectHtmlBody(r.body),
      ],
      { note: 'should return HTML even for markdown Accept' }
    );

    add(
      'Excluded route',
      path,
      'agent-ua',
      [
        (r) => expectStatus(r.status, 200),
        (r) => expectContentType(r.contentType, 'text/html'),
        (r) => expectHtmlBody(r.body),
      ],
      { note: 'should return HTML even for AI agent' }
    );

    if (hasDotMd) {
      // No index file at public/md/guides.md etc.; expect same contract as other .md 404s
      // (requires top-level .md routing — see PR #4735).
      add(
        'Excluded route',
        path,
        'dot-md',
        [
          (r) => expectStatus(r.status, 404),
          (r) => expectContentType(r.contentType, 'text/markdown'),
          (r) => expectBodyContains(r.body, 'Page Not Found'),
          (r) => expectBodyContains(r.body, '/docs/llms.txt'),
          (r) => expectHeader(r.headers, 'x-content-source', 'md-404'),
        ],
        { note: 'hub index .md → markdown 404 (not Vercel HTML 404)' }
      );
    }
  }

  // ── 3. Custom markdown paths ──────────────────────────────────────────

  // /pricing — spot-check uses "Scale" (plan name on real page); "pricing" can appear on 404s via URL/title
  add('Custom path', '/pricing', 'browser', [
    (r) => expectStatus(r.status, 200),
    (r) => expectContentType(r.contentType, 'text/html'),
    (r) => expectHtmlBody(r.body),
  ]);

  add(
    'Custom path',
    '/pricing',
    'accept-md',
    [
      (r) => expectStatus(r.status, 200),
      (r) => expectContentType(r.contentType, 'text/markdown'),
      (r) => expectMarkdownBody(r.body),
      (r) => expectHeader(r.headers, 'x-content-source', 'markdown'),
    ],
    { spotCheck: (r) => expectBodyContains(r.body, 'Scale', true) }
  );

  add(
    'Custom path',
    '/pricing',
    'agent-ua',
    [
      (r) => expectStatus(r.status, 200),
      (r) => expectContentType(r.contentType, 'text/markdown'),
      (r) => expectMarkdownBody(r.body),
    ],
    { spotCheck: (r) => expectBodyContains(r.body, 'Scale', true) }
  );

  // /pricing.md is a static file in public/ (served as text/markdown; not middleware-negotiated)
  add(
    'Custom path',
    '/pricing.md',
    'browser',
    [
      (r) => expectStatus(r.status, 200),
      (r) => expectContentType(r.contentType, 'text/markdown'),
      (r) => expectMarkdownBody(r.body),
    ],
    { spotCheck: (r) => expectBodyContains(r.body, 'Scale', true), note: 'static file in public/' }
  );

  // /docs/changelog
  add('Custom path', '/docs/changelog', 'browser', [
    (r) => expectStatus(r.status, 200),
    (r) => expectContentType(r.contentType, 'text/html'),
    (r) => expectHtmlBody(r.body),
  ]);

  add(
    'Custom path',
    '/docs/changelog',
    'accept-md',
    [
      (r) => expectStatus(r.status, 200),
      (r) => expectContentType(r.contentType, 'text/markdown'),
      (r) => expectMarkdownBody(r.body),
      (r) => expectHeader(r.headers, 'x-content-source', 'markdown'),
    ],
    { spotCheck: (r) => expectBodyContains(r.body, 'changelog', true) }
  );

  add(
    'Custom path',
    '/docs/changelog',
    'agent-ua',
    [
      (r) => expectStatus(r.status, 200),
      (r) => expectContentType(r.contentType, 'text/markdown'),
      (r) => expectMarkdownBody(r.body),
    ],
    { spotCheck: (r) => expectBodyContains(r.body, 'changelog', true) }
  );

  add(
    'Custom path',
    '/docs/changelog',
    'dot-md',
    [
      (r) => expectStatus(r.status, 200),
      (r) => expectContentType(r.contentType, 'text/markdown'),
      (r) => expectMarkdownBody(r.body),
    ],
    { spotCheck: (r) => expectBodyContains(r.body, 'changelog', true) }
  );

  // ── 4. Static doc prefixes (pass-through) ─────────────────────────────

  const staticMdPath = '/docs/ai/skills/neon-postgres/references/neon-serverless.md';

  add(
    'Static .md',
    staticMdPath,
    'browser',
    [(r) => expectStatus(r.status, 200), (r) => expectBodyNotEmpty(r.body)],
    {
      spotCheck: (r) => expectBodyContains(r.body, 'neon', true),
      note: 'static file, not rewritten',
    }
  );

  add(
    'Static .md',
    staticMdPath,
    'accept-md',
    [(r) => expectStatus(r.status, 200), (r) => expectBodyNotEmpty(r.body)],
    {
      spotCheck: (r) => expectBodyContains(r.body, 'neon', true),
      note: 'should pass through unchanged',
    }
  );

  add(
    'Static .md',
    staticMdPath,
    'agent-ua',
    [(r) => expectStatus(r.status, 200), (r) => expectBodyNotEmpty(r.body)],
    {
      spotCheck: (r) => expectBodyContains(r.body, 'neon', true),
      note: 'should pass through unchanged',
    }
  );

  // ── 5. 404 behavior ───────────────────────────────────────────────────

  const fake404Path = '/docs/non-existent-page-xyz-qa-test';

  add(
    '404 handling',
    fake404Path,
    'browser',
    [(r) => expectContentType(r.contentType, 'text/html'), (r) => expectHtmlBody(r.body)],
    { note: 'browser sees HTML 404 page' }
  );

  add('404 handling', fake404Path, 'accept-md', [
    (r) => expectStatus(r.status, 404),
    (r) => expectContentType(r.contentType, 'text/markdown'),
    (r) => expectBodyContains(r.body, 'Page Not Found'),
    (r) => expectBodyContains(r.body, '/docs/llms.txt'),
    (r) => expectBodyContains(r.body, '/docs/llms-full.txt'),
    (r) => expectHeader(r.headers, 'x-content-source', 'agent-404'),
    (r) => expectHeader(r.headers, 'cache-control', /max-age=60/),
  ]);

  add('404 handling', fake404Path, 'agent-ua', [
    (r) => expectStatus(r.status, 404),
    (r) => expectContentType(r.contentType, 'text/markdown'),
    (r) => expectBodyContains(r.body, 'Page Not Found'),
    (r) => expectHeader(r.headers, 'x-content-source', 'agent-404'),
  ]);

  add('404 handling', fake404Path, 'dot-md', [
    (r) => expectStatus(r.status, 404),
    (r) => expectContentType(r.contentType, 'text/markdown'),
    (r) => expectBodyContains(r.body, 'Page Not Found'),
    (r) => expectHeader(r.headers, 'x-content-source', 'md-404'),
  ]);

  // ── 6. Legacy /llms/ redirects ────────────────────────────────────────

  add(
    'Legacy redirect',
    '/llms/introduction.txt',
    'browser',
    [
      (r) => expectStatus(r.status, 301),
      (r) => expectHeader(r.headers, 'location', '/docs/introduction.md'),
    ],
    { note: 'redirect to .md URL' }
  );

  // ── 7. llms.txt files ─────────────────────────────────────────────────

  add(
    'LLMs txt',
    '/docs/llms.txt',
    'browser',
    [(r) => expectStatus(r.status, 200), (r) => expectBodyNotEmpty(r.body)],
    { spotCheck: (r) => expectBodyContains(r.body, 'neon', true) }
  );

  add(
    'LLMs txt',
    '/docs/llms-full.txt',
    'browser',
    [(r) => expectStatus(r.status, 200), (r) => expectBodyNotEmpty(r.body)],
    { spotCheck: (r) => expectBodyContains(r.body, 'neon', true) }
  );

  // ── 8. RSS exclusion ──────────────────────────────────────────────────

  add(
    'RSS exclusion',
    '/guides/rss.xml',
    'agent-ua',
    [
      (r) => {
        if (r.contentType && r.contentType.includes('text/markdown'))
          return 'served markdown for RSS feed';
        return null;
      },
    ],
    { note: 'should NOT serve markdown' }
  );

  // ── 9. Non-content routes ─────────────────────────────────────────────

  add(
    'Non-docs route',
    '/',
    'accept-md',
    [
      (r) => {
        if (r.headers.get('x-content-source') === 'markdown')
          return 'root URL must not use docs markdown pipeline';
        return null;
      },
    ],
    { note: 'homepage is not a CONTENT_ROUTE' }
  );

  const nonContentRoutes = ['/about', '/blog'];

  for (const path of nonContentRoutes) {
    add(
      'Non-content route',
      path,
      'accept-md',
      [
        (r) => {
          const src = r.headers.get('x-content-source');
          if (src === 'markdown') return 'non-content route returned x-content-source: markdown';
          return null;
        },
      ],
      { note: 'should not serve markdown' }
    );

    add(
      'Non-content route',
      path,
      'agent-ua',
      [
        (r) => {
          const src = r.headers.get('x-content-source');
          if (src === 'markdown') return 'non-content route returned x-content-source: markdown';
          return null;
        },
      ],
      { note: 'should not serve markdown' }
    );
  }

  // ── 9b. Blog post (not a docs content route; stays HTML for agents / Accept: markdown)
  // Example: https://neon.com/blog/prewarming

  const blogPostPath = '/blog/prewarming';

  add(
    'Blog post',
    blogPostPath,
    'browser',
    [
      (r) => expectStatus(r.status, 200),
      (r) => expectContentType(r.contentType, 'text/html'),
      (r) => expectHtmlBody(r.body),
    ],
    {
      spotCheck: (r) => expectBodyContains(r.body, 'Prewarming', true),
      note: 'engineering blog article',
    }
  );

  add(
    'Blog post',
    blogPostPath,
    'accept-md',
    [
      (r) => expectStatus(r.status, 200),
      (r) => expectContentType(r.contentType, 'text/html'),
      (r) => expectHtmlBody(r.body),
      (r) => {
        const src = r.headers.get('x-content-source');
        if (src === 'markdown') return 'blog post returned x-content-source: markdown';
        return null;
      },
    ],
    {
      spotCheck: (r) => expectBodyContains(r.body, 'Prewarming', true),
      note: 'Accept: markdown must not serve docs markdown',
    }
  );

  add(
    'Blog post',
    blogPostPath,
    'agent-ua',
    [
      (r) => expectStatus(r.status, 200),
      (r) => expectContentType(r.contentType, 'text/html'),
      (r) => expectHtmlBody(r.body),
      (r) => {
        const src = r.headers.get('x-content-source');
        if (src === 'markdown') return 'blog post returned x-content-source: markdown';
        return null;
      },
    ],
    {
      spotCheck: (r) => expectBodyContains(r.body, 'Prewarming', true),
      note: 'AI UA must not get docs markdown',
    }
  );

  // ── 10. Individual changelog entry (file must exist under public/md/changelog/ — run --generate)
  // ---------------------------------------------------------------------------

  add('Changelog entry', '/docs/changelog/2026-04-03', 'accept-md', [
    (r) => expectStatus(r.status, 200),
    (r) => expectContentType(r.contentType, 'text/markdown'),
    (r) => expectMarkdownBody(r.body),
    (r) => expectHeader(r.headers, 'x-content-source', 'markdown'),
  ]);

  add('Changelog entry', '/docs/changelog/2026-04-03', 'dot-md', [
    (r) => expectStatus(r.status, 200),
    (r) => expectContentType(r.contentType, 'text/markdown'),
    (r) => expectMarkdownBody(r.body),
  ]);

  // ── 11. Content route doc headers on HTML responses ───────────────────

  add(
    'Doc headers on HTML',
    '/docs/introduction',
    'browser',
    [(r) => expectHeader(r.headers, 'x-llms-txt', '/docs/llms.txt')],
    { note: 'HTML content routes should still have X-LLMs-Txt' }
  );

  return tests;
}

// ---------------------------------------------------------------------------
// Runner
// ---------------------------------------------------------------------------

async function fetchWithRedirectCheck(url, headers) {
  const res = await fetch(url, {
    headers,
    redirect: 'manual',
  });
  const body = await res.text();
  return {
    status: res.status,
    headers: res.headers,
    contentType: res.headers.get('content-type') || '',
    body,
  };
}

function resolveUrl(basePath, mode) {
  if (mode === 'dot-md') {
    const clean = basePath.replace(/\/$/, '');
    return clean.endsWith('.md') ? clean : `${clean}.md`;
  }
  return basePath;
}

function formatLabel(test) {
  return `${test.category} ${test.path} (${test.mode})`;
}

async function runTests() {
  const allTests = buildTests();
  const filtered = FILTER
    ? allTests.filter((t) => formatLabel(t).toLowerCase().includes(FILTER.toLowerCase()))
    : allTests;

  if (filtered.length === 0) {
    console.error(`No tests match filter "${FILTER}"`);
    process.exit(1);
  }

  console.log(`\nMarkdown URL QA — ${BASE_URL}`);
  console.log(`Running ${filtered.length} tests${FILTER ? ` (filter: "${FILTER}")` : ''}…\n`);

  const results = [];
  let passed = 0;
  let failed = 0;

  for (const test of filtered) {
    const label = formatLabel(test);
    const url = `${BASE_URL.replace(/\/$/, '')}${resolveUrl(test.path, test.mode)}`;
    const hdrs = modes[test.mode] || modes.browser;

    let result;
    try {
      result = await fetchWithRedirectCheck(url, hdrs);
    } catch (err) {
      const msg = `fetch error: ${err.message}`;
      failed++;
      results.push({ label, pass: false, errors: [msg], url, note: test.note });
      console.log(`  \x1b[31m✗\x1b[0m ${label}`);
      if (VERBOSE) console.log(`    ${msg}\n    URL: ${url}`);
      continue;
    }

    const errors = [];

    for (const assertion of test.assertions) {
      const err = assertion(result);
      if (err) errors.push(err);
    }

    if (test.spotCheck) {
      const spotErr = test.spotCheck(result);
      if (spotErr) errors.push(`[spot-check] ${spotErr}`);
    }

    if (errors.length === 0) {
      passed++;
      results.push({ label, pass: true, url, note: test.note });
      console.log(`  \x1b[32m✓\x1b[0m ${label}`);
    } else {
      failed++;
      results.push({
        label,
        pass: false,
        errors,
        url,
        note: test.note,
        status: result.status,
        contentType: result.contentType,
      });
      console.log(`  \x1b[31m✗\x1b[0m ${label}`);
      if (VERBOSE || !JSON_OUTPUT) {
        for (const e of errors) console.log(`    → ${e}`);
        if (VERBOSE) {
          console.log(`    URL: ${url}`);
          console.log(`    Status: ${result.status}  Content-Type: ${result.contentType}`);
          console.log(
            `    Body preview: ${result.body.trimStart().slice(0, 120).replace(/\n/g, '\\n')}…`
          );
        }
      }
    }

    // Small delay between requests
    await new Promise((r) => setTimeout(r, 50));
  }

  // ── Summary ─────────────────────────────────────────────────────────

  console.log('\n' + '─'.repeat(60));
  console.log(
    `Results: \x1b[32m${passed} passed\x1b[0m, \x1b[${failed > 0 ? '31' : '32'}m${failed} failed\x1b[0m, ${passed + failed} total`
  );

  if (failed > 0) {
    console.log('\nFailed tests:');
    for (const r of results.filter((r) => !r.pass)) {
      console.log(`  \x1b[31m✗\x1b[0m ${r.label}`);
      for (const e of r.errors) console.log(`    → ${e}`);
    }
  }

  if (JSON_OUTPUT) {
    console.log(
      '\n' +
        JSON.stringify(
          { baseUrl: BASE_URL, passed, failed, total: passed + failed, results },
          null,
          2
        )
    );
  }

  console.log('');
  process.exit(failed > 0 ? 1 : 0);
}

async function main() {
  if (cli.generate) {
    runAssetGenerators();
  }
  await runTests();
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(2);
});
