// AI Agent Detection Utility
// Detects if a request is coming from an AI agent based on User-Agent header

import { CONTENT_ROUTES, EXCLUDED_ROUTES, EXCLUDED_FILES } from 'constants/content';

export function isAIAgentRequest(request) {
  const userAgent = request.headers.get('user-agent') || '';
  const accept = request.headers.get('accept') || '';

  // Primary detection: Accept header explicitly requests markdown or non-HTML formats
  const requestsMarkdown = accept.includes('text/markdown');
  const hasHtml = accept.includes('text/html');
  const prefersNonHtml =
    !hasHtml &&
    (accept.includes('application/json') ||
      accept.includes('text/plain') ||
      accept.includes('application/xml'));

  // Secondary detection: User-Agent patterns for known AI agents and their HTTP clients
  const aiAgentPatterns = [
    'chatgpt',
    'openai',
    'gpt',
    'claude',
    'anthropic',
    'cursor',
    'windsurf',
    'perplexity',
    'copilot',
    'ai-agent',
    'llm-agent',
    'axios', // Used by Claude Code
    'got', // Used by Cursor
    'curl', // Common CLI HTTP client used to fetch docs as markdown
  ];

  const hasAIAgentUserAgent = aiAgentPatterns.some((pattern) =>
    userAgent.toLowerCase().includes(pattern)
  );

  return requestsMarkdown || prefersNonHtml || hasAIAgentUserAgent;
}

// Paths where the generic CONTENT_ROUTES resolver produces the wrong markdown
// path (or no path at all). Maps directly to the correct static file in public/.
const CUSTOM_MARKDOWN_PATHS = {
  pricing: '/pricing.md', // Hand-written, served from public/pricing.md (no CONTENT_ROUTES entry)
  // Docs root aliases to the curated llms.txt rather than a generated page-listing.
  // Three places enforce this alias — keep them in sync if this changes:
  //   1. Here (getMarkdownPath — middleware serving for /docs and /docs.md agent requests)
  //   2. next.config.js beforeFiles rewrite: /docs.md → /docs/llms.txt (static/browser)
  //   3. process-md-for-llms.js ROUTES_ALIASED_TO_LLMS (skips generating public/md/docs.md)
  docs: '/docs/llms.txt',
  // Blog root aliases to the blog index. Two places enforce this alias — keep in sync:
  //   1. Here (getMarkdownPath — agent requests to /blog and /blog.md)
  //   2. next.config.js beforeFiles rewrite: /blog.md → /blog/llms.txt (static/browser)
  blog: '/blog/llms.txt',
  'docs/changelog': '/md/docs/changelog.md',
  // Human-facing endpoint index. The HTML route is a searchable UI, but its
  // agent-facing content should resolve to the canonical generated API index.
  'docs/reference/api/reference': '/md/docs/reference/api.md',
  // Legacy hand-maintained API reference path now resolves to the generated
  // canonical API reference markdown.
  'docs/reference/api-reference': '/md/docs/reference/api.md',
  'docs/skill.md': '/docs/ai/skills/neon-postgres/SKILL.md', // primary skill alias — update alongside next.config.js if primary changes (see config/skills.json)
};

// Paths that must bypass the middleware's markdown-serving logic entirely.
// Includes:
// - Static files in public/ not generated into public/md/ (docs/ai/skills/, docs/.well-known/)
// - Route handlers that accept non-GET requests (docs/mcp), where the middleware
//   would otherwise detect the non-HTML Accept header, try to serve /md/docs/mcp.md,
//   fail with 404, and return a markdown error before the route handler fires.
const STATIC_DOC_FILES = new Set([
  'docs/reference/api/llms.txt',
  'docs/reference/api/llms-full.txt',
]);
const STATIC_DOC_PREFIXES = ['docs/ai/skills/', 'docs/.well-known/', 'docs/mcp'];

// Convert URL path to markdown file path
// Example: /docs/introduction -> /md/docs/introduction.md (maps to public/md/)
export function getMarkdownPath(pathname) {
  const path = pathname.slice(1).replace(/\/$/, ''); // Remove leading and trailing slashes

  // Early return for excluded routes and files
  const isExcluded =
    EXCLUDED_ROUTES.some((route) => path === route) ||
    EXCLUDED_FILES.some((file) => pathname.endsWith(file));

  if (isExcluded) return null;

  if (STATIC_DOC_FILES.has(path) || STATIC_DOC_PREFIXES.some((prefix) => path.startsWith(prefix)))
    return null;

  // Normalize .md suffix so /branching.md matches the branching route
  const normalized = path.endsWith('.md') ? path.slice(0, -3) : path;

  if (CUSTOM_MARKDOWN_PATHS[path] || CUSTOM_MARKDOWN_PATHS[normalized])
    return CUSTOM_MARKDOWN_PATHS[path] || CUSTOM_MARKDOWN_PATHS[normalized];

  const matchedRoute = Object.keys(CONTENT_ROUTES).find(
    (route) => normalized === route || path.startsWith(`${route}/`)
  );

  if (!matchedRoute) return null;

  // Get the content directory path from CONTENT_ROUTES and convert to public path
  // Example: content/docs -> /md/docs
  const contentPath = CONTENT_ROUTES[matchedRoute];
  const publicPath = contentPath.replace(/^content(?:\/pages)?\//, '/md/');

  // Extract slug after the matched route
  const slug = normalized === matchedRoute ? '' : path.replace(`${matchedRoute}/`, '');
  const mdSlug = slug.endsWith('.md') ? slug : `${slug}.md`;

  // Build the full public path: /md/{directory}/{slug}.md
  return slug ? `${publicPath}/${mdSlug}` : `${publicPath}.md`;
}

const DEFAULT_404_LINKS = [
  {
    label: 'Neon docs index',
    href: '/docs/llms.txt',
    description: 'full table of contents, start here to find the right page',
  },
  {
    label: 'Neon REST API',
    href: '/docs/reference/api.md',
    description: 'all REST endpoints grouped by resource',
  },
  {
    label: 'Neon CLI',
    href: '/docs/cli.md',
    description: 'neonctl commands, options, and usage',
  },
];

export function buildAgent404Response(
  pathname,
  { extraLinks = [], context = 'Neon documentation' } = {}
) {
  const linkLines = [...extraLinks, ...DEFAULT_404_LINKS]
    .map(({ label, href, description }) => `- [${label}](${href}): ${description}`)
    .join('\n');
  return `# Page Not Found

\`${pathname}\` does not exist in ${context}.

Try the docs index to locate the correct URL, or use one of these references:

${linkLines}
`;
}
