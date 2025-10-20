// AI Agent Detection Utility
// Detects if a request is coming from an AI agent based on User-Agent header

import { CONTENT_PAGES } from 'constants/content';

export function isAIAgentRequest(request) {
  const userAgent = request.headers.get('user-agent') || '';
  const accept = request.headers.get('accept') || '';

  // Primary detection: Accept header doesn't include text/html
  const acceptsHtml = accept.includes('text/html');

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
    'bot',
    'axios', // Common HTTP client used by AI agents
  ];

  const hasAIAgentUserAgent = aiAgentPatterns.some((pattern) =>
    userAgent.toLowerCase().includes(pattern)
  );

  return !acceptsHtml || hasAIAgentUserAgent;
}

// Convert URL path to markdown file path
// Example: /docs/introduction -> content/docs/introduction.md
export function getMarkdownPath(pathname) {
  const [, section, ...rest] = pathname.split('/');
  const slug = rest.join('/');
  const contentFolder = CONTENT_PAGES[section];

  if (contentFolder && slug) {
    return `${contentFolder}/${slug}.md`;
  }

  return null;
}
