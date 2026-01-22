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

// Convert URL path to markdown file path
// Example: /docs/introduction -> /md/docs/introduction.md (maps to public/md/)
export function getMarkdownPath(pathname) {
  const path = pathname.slice(1).replace(/\/$/, ''); // Remove leading and trailing slashes

  // Early return for excluded routes and files
  const isExcluded =
    EXCLUDED_ROUTES.some((route) => path === route) ||
    EXCLUDED_FILES.some((file) => pathname.endsWith(file));

  if (isExcluded) return null;

  // Find the matching route
  const matchedRoute = Object.keys(CONTENT_ROUTES).find(
    (route) => path === route || path.startsWith(`${route}/`)
  );

  if (!matchedRoute) return null;

  // Get the content directory path from CONTENT_ROUTES and convert to public path
  // Example: content/docs -> /md/docs
  const contentPath = CONTENT_ROUTES[matchedRoute];
  const publicPath = contentPath.replace('content/', '/md/');

  // Extract slug after the matched route
  const slug = path === matchedRoute ? '' : path.replace(`${matchedRoute}/`, '');

  // Build the full public path: /md/{directory}/{slug}.md
  return slug ? `${publicPath}/${slug}.md` : `${publicPath}.md`;
}
