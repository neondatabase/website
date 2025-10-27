// AI Agent Detection Utility
// Detects if a request is coming from an AI agent based on User-Agent header

import { CONTENT_ROUTES, EXCLUDED_ROUTES, EXCLUDED_FILES } from 'constants/content';

export function isAIAgentRequest(request) {
  const userAgent = request.headers.get('user-agent') || '';
  const accept = request.headers.get('accept') || '';

  // Primary detection: Accept header explicitly requests non-HTML formats
  const hasHtml = accept.includes('text/html');
  const prefersNonHtml =
    !hasHtml &&
    (accept.includes('application/json') ||
      accept.includes('text/plain') ||
      accept.includes('application/xml'));

  // Secondary detection: User-Agent patterns for known AI agents
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
  ];

  const hasAIAgentUserAgent = aiAgentPatterns.some((pattern) =>
    userAgent.toLowerCase().includes(pattern)
  );

  return prefersNonHtml || hasAIAgentUserAgent;
}

// Convert URL path to markdown file path
// Example: /docs/introduction -> content/docs/introduction.md
export function getMarkdownPath(pathname) {
  const path = pathname.slice(1);

  // Early return for excluded routes and files
  const isExcluded =
    EXCLUDED_ROUTES.some((route) => path === route) ||
    EXCLUDED_FILES.some((file) => pathname.endsWith(file));

  if (isExcluded) return null;

  // Find the matching route and extract slug
  const matchedRoute = Object.keys(CONTENT_ROUTES).find((route) => path.startsWith(`${route}/`));

  if (!matchedRoute) return null;

  const slug = path.replace(`${matchedRoute}/`, '');
  return `${CONTENT_ROUTES[matchedRoute]}/${slug}.md`;
}
