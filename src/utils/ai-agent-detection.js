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
  ];

  const hasAIAgentUserAgent = aiAgentPatterns.some((pattern) =>
    userAgent.toLowerCase().includes(pattern)
  );

  return requestsMarkdown || prefersNonHtml || hasAIAgentUserAgent;
}

// Paths where the generic CONTENT_ROUTES resolver produces the wrong markdown
// path (or no path at all). Maps directly to the correct static file in public/.
const CUSTOM_MARKDOWN_PATHS = {
  pricing: '/pricing.md',
  'docs/changelog': '/md/docs/changelog.md',
};

// Paths under content routes that are static files in public/ (not generated into public/md/).
// The middleware should pass these through so Next.js serves them directly.
const STATIC_DOC_PREFIXES = ['docs/ai/'];

// Convert URL path to markdown file path
// Example: /docs/introduction -> /md/docs/introduction.md (maps to public/md/)
export function getMarkdownPath(pathname) {
  const path = pathname.slice(1).replace(/\/$/, ''); // Remove leading and trailing slashes

  // Early return for excluded routes and files
  const isExcluded =
    EXCLUDED_ROUTES.some((route) => path === route) ||
    EXCLUDED_FILES.some((file) => pathname.endsWith(file));

  if (isExcluded) return null;

  if (STATIC_DOC_PREFIXES.some((prefix) => path.startsWith(prefix))) return null;

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
  const publicPath = contentPath.replace('content/', '/md/');

  // Extract slug after the matched route
  const slug = normalized === matchedRoute ? '' : path.replace(`${matchedRoute}/`, '');
  const mdSlug = slug.endsWith('.md') ? slug : `${slug}.md`;

  // Build the full public path: /md/{directory}/{slug}.md
  return slug ? `${publicPath}/${mdSlug}` : `${publicPath}.md`;
}

export function buildAgent404Response(pathname) {
  return `# Page Not Found

\`${pathname}\` does not exist in Neon documentation.

Find what you need:

- [All Neon documentation](/docs/llms.txt): Table of contents for all Neon docs
- [Full documentation text](/docs/llms-full.txt): Complete Neon docs in one file
- [Neon API reference](/docs/reference/api-reference.md): API endpoints and usage
`;
}
