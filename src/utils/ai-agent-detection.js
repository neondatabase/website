// AI Agent Detection Utility
// Detects if a request is coming from an AI agent based on User-Agent header

import { CONTENT_PAGES } from 'constants/content';

export function isAIAgentRequest(request) {
  const userAgent = request.headers.get('user-agent') || '';

  // Common AI agent patterns
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
  ];

  // Check if User-Agent contains AI agent patterns
  return aiAgentPatterns.some((pattern) => userAgent.toLowerCase().includes(pattern));
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
