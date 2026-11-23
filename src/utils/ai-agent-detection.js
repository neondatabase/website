// AI Agent Detection Utility
// Detects if a request is coming from an AI agent based on User-Agent header

import {
  CONTENT_ROUTES,
  EXCLUDED_ROUTES,
  EXCLUDED_FILES,
  GENERATED_PAGE_MARKDOWN_PATHS,
} from 'constants/content';

// Broad User-Agent patterns for AI agents and the HTTP clients they use. Only
// decides who is served markdown (isAIAgentRequest); labeling reads uses the
// narrower, source-checked AI_AGENT_USER_AGENT_TOKENS instead.
const MARKDOWN_AGENT_USER_AGENT_PATTERNS = [
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

// The first token found in the User-Agent (case-insensitive), or undefined.
function findUserAgentToken(userAgent, tokens) {
  const ua = (userAgent || '').toLowerCase();
  return tokens.find((token) => ua.includes(token));
}

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

  // User-Agent sniffing only applies when the client doesn't explicitly accept HTML.
  // Some fetchers (ChatGPT web fetch) reject text/markdown, and search crawlers
  // (OAI-SearchBot, PerplexityBot) need indexable HTML, not noindex markdown.
  const hasAIAgentUserAgent =
    !hasHtml && Boolean(findUserAgentToken(userAgent, MARKDOWN_AGENT_USER_AGENT_PATTERNS));

  return requestsMarkdown || prefersNonHtml || hasAIAgentUserAgent;
}

// Named AI assistants and crawlers that announce themselves in the User-Agent.
// Used only to count reads, never to choose what to serve: these clients often
// send Accept: text/html, so isAIAgentRequest (correctly) serves them HTML, and
// they don't run the browser analytics script either. Lowercase substrings of
// the User-Agent header. robots.txt-only tokens (Google-Extended,
// Applebot-Extended) never appear in a User-Agent, so they aren't listed.
export const AI_AGENT_USER_AGENT_TOKENS = [
  // OpenAI: https://developers.openai.com/api/docs/bots
  'chatgpt-user',
  'oai-searchbot',
  'gptbot',
  // Anthropic: https://support.claude.com/en/articles/8896518 and /18234133
  'claude-user',
  'claude-searchbot',
  'claudebot',
  'claude-agent',
  // Perplexity: https://docs.perplexity.ai/guides/bots
  'perplexitybot',
  'perplexity-user',
  // Google: https://developers.google.com/crawling/docs/crawlers-fetchers
  'google-agent',
  'google-gemininotebook',
  'google-notebooklm',
  'google-cloudvertexbot',
  // Meta: https://developers.facebook.com/docs/sharing/webmasters/web-crawlers
  'meta-externalagent',
  'meta-externalfetcher',
  'meta-webindexer',
  // Mistral: https://docs.mistral.ai/robots (MistralAI-Index is a search
  // crawler on bots.fyi, so it's in SEARCH_CRAWLER_USER_AGENT_TOKENS)
  'mistralai-user',
  'mistralai-training',
  // Amazon: https://developer.amazon.com/amazonbot (Amzn-SearchBot is a
  // search crawler on bots.fyi, so it's in SEARCH_CRAWLER_USER_AGENT_TOKENS)
  'amazonbot',
  'amzn-user',
  // DuckDuckGo: https://duckduckgo.com/duckduckgo-help-pages/results/duckassistbot
  'duckassistbot',
  // AI crawlers listed by https://bots.fyi and
  // https://github.com/ai-robots-txt/ai.robots.txt whose operators don't
  // publish full User-Agent strings; matched on the published token.
  'anthropic-ai',
  'claude-web',
  'ai2bot',
  'bytespider',
  'ccbot',
  'cohere-ai',
  'deepseekbot',
  'diffbot',
  'facebookbot',
  'youbot',
];

export function isKnownAIAgentUserAgent(userAgent) {
  return Boolean(findUserAgentToken(userAgent, AI_AGENT_USER_AGENT_TOKENS));
}

// A browser's background request: a page script's fetch, which includes Next.js
// prefetches and router fetches. Browsers send Sec-Fetch-Mode on every request
// (`navigate` for a page load; `cors`, `no-cors` or `same-origin` otherwise),
// and clients that aren't browsers don't send it. This works in the proxy,
// unlike the rsc/next-router-* headers, which Next.js removes before it runs.
export function isBrowserBackgroundRequest(request) {
  const fetchMode = request.headers.get('sec-fetch-mode');
  return Boolean(fetchMode) && fetchMode !== 'navigate';
}

// Requests that aren't reads: Next.js router fetches (RSC payload requests from
// a <Link>, both prefetches and the fetch on click that precedes a full
// navigation), browser prefetches (speculation rules, link rel=prefetch), and
// the site's own .md fetches (NON_AGENT_FETCH_HEADERS). Counting them inflates
// stats: a <Link> to a page's own .md made every human visit look like an
// agent read.
//
// Next.js removes the rsc and next-router-* headers (and the _rsc query) before
// the proxy runs (FLIGHT_HEADERS in next/dist/server/web/adapter.js), so in the
// proxy router fetches are recognized by Sec-Fetch-Mode instead
// (isBrowserBackgroundRequest).
export function isNonReadRequest(request) {
  const headers = request.headers;
  if (headers.get('rsc') || headers.get('next-router-prefetch')) return true;
  if (isBrowserBackgroundRequest(request)) return true;
  const purpose = `${headers.get('sec-purpose') || ''} ${headers.get('purpose') || ''}`;
  return purpose.toLowerCase().includes('prefetch');
}

// A named AI agent by User-Agent, or any client that signs its requests with
// Web Bot Auth (RFC 9421 HTTP Message Signatures). ChatGPT agent sends a normal
// Chrome User-Agent and identifies itself only with
// `Signature-Agent: "https://chatgpt.com"`
// (https://help.openai.com/en/articles/11845367); browsers people use don't
// send this header.
export function isKnownAIAgentRequest(request) {
  return (
    isKnownAIAgentUserAgent(request.headers.get('user-agent')) ||
    Boolean(request.headers.get('signature-agent'))
  );
}

// Search engine crawlers: the bots tagged "Search Engine Crawler" with status
// Verified on https://bots.fyi/?tags=search_engine_crawler&status=verified,
// matched on the User-Agent token each operator documents. bots.fyi names
// differ from some User-Agents (Adsense is Mediapartners-Google).
export const SEARCH_CRAWLER_USER_AGENT_TOKENS = [
  // Google: https://developers.google.com/crawling/docs/crawlers-fetchers
  // (common and special-case crawlers)
  'googlebot',
  'googleother',
  'storebot-google',
  'adsbot-google',
  'mediapartners-google',
  'apis-google',
  // Bing: https://blogs.bing.com/webmaster/october-2019/Announcing-user-agent-change-for-Bing-crawler-bingbot
  'bingbot',
  // Apple: https://support.apple.com/en-us/119829
  'applebot',
  // Amazon: https://developer.amazon.com/amazonbot and https://adbot.amazon.com
  'amzn-searchbot',
  'amazonadbot',
  // Mistral: https://docs.mistral.ai/robots
  'mistralai-index',
  // DuckDuckGo: https://duckduckgo.com/duckduckgo-help-pages/results/duckduckbot
  'duckduckbot',
  // Baidu: https://www.baidu.com/search/robots_english.html
  'baiduspider',
  // Exa: https://crawler.exa.ai
  'exasearchbot',
  // Pinterest: https://help.pinterest.com/en/business/article/pinterestbot
  'pinterestbot',
  // Qwant: https://help.qwant.com/bot/
  'qwantbot',
  // Seekport: https://bot.seekport.com
  'seekportbot',
  // Seobility: https://www.seobility.net/en/faq/?category=website-crawling#aboutourbot
  'seobility',
  // Seznam: https://o-seznam.cz/napoveda/vyhledavani/en/seznambot-crawler/
  'seznambot',
  // Yahoo: https://help.yahoo.com/kb/SLN22600.html
  'yahoo! slurp',
  // On the bots.fyi list, but the operator's User-Agent docs couldn't be
  // loaded to confirm the string; matched on the bots.fyi name.
  'yandexbot',
  'petalbot',
  'adidxbot',
  // Also on the list but not matched, because the User-Agent token isn't
  // documented and likely differs from the bots.fyi name: Algolia, Amazon
  // Kendra, Google-Display-Ads-Bot, Jobs with GPT, naverbot, adsnaver.
];

export function isSearchCrawlerUserAgent(userAgent) {
  return Boolean(findUserAgentToken(userAgent, SEARCH_CRAWLER_USER_AGENT_TOKENS));
}

// A short, fixed label for diagnostics logs (agent_family): the matched token
// from the AI agent list, then the search crawler list, then the broad
// markdown patterns (curl, axios, ...), else 'other'. Never the raw User-Agent,
// which logs must not contain.
export function agentFamily(userAgent) {
  return (
    findUserAgentToken(userAgent, AI_AGENT_USER_AGENT_TOKENS) ||
    findUserAgentToken(userAgent, SEARCH_CRAWLER_USER_AGENT_TOKENS) ||
    findUserAgentToken(userAgent, MARKDOWN_AGENT_USER_AGENT_PATTERNS) ||
    'other'
  );
}

// Who read a page or file, for the pageview's llm_reader label:
// - agent: the request's headers identify a known AI agent (a token in
//   AI_AGENT_USER_AGENT_TOKENS, or a Web Bot Auth Signature-Agent header).
//   Asking for a .md or for markdown doesn't make a request an agent, and
//   neither does a generic client (curl, axios, python-requests).
// - search-crawler: the User-Agent names a verified search engine crawler
//   (SEARCH_CRAWLER_USER_AGENT_TOKENS). This is the crawler's claim; the proxy
//   doesn't check its IP.
// - human: a person in a browser tab (see isHumanBrowserNavigation)
// - unknown: everything else (generic HTTP clients, link unfurlers,
//   monitors, headless browsers). The raw User-Agent is sent with the
//   pageview, so dashboards can break these down further.
// This only labels reads. What a request is served (markdown or HTML) is
// decided separately by isAIAgentRequest.
export function classifyReader(request) {
  if (isKnownAIAgentRequest(request)) return 'agent';
  if (isSearchCrawlerUserAgent(request.headers.get('user-agent'))) return 'search-crawler';
  if (isHumanBrowserNavigation(request)) return 'human';
  return 'unknown';
}

// A person opening a URL in a browser tab: browsers send these Fetch Metadata
// headers on every top-level navigation (link click, typed URL, reload), and
// HTTP clients used by agents (curl, axios, fetch tools) don't. Headless and
// agent-driven browsers send them too, so exclude those.
export function isHumanBrowserNavigation(request) {
  const userAgent = request.headers.get('user-agent') || '';
  return (
    request.headers.get('sec-fetch-mode') === 'navigate' &&
    request.headers.get('sec-fetch-dest') === 'document' &&
    !/headless/i.test(userAgent) &&
    !isKnownAIAgentRequest(request)
  );
}

// Paths where the generic CONTENT_ROUTES resolver produces the wrong markdown
// path (or no path at all). Maps directly to the correct static file in public/.
const CUSTOM_MARKDOWN_PATHS = {
  ...GENERATED_PAGE_MARKDOWN_PATHS,
  // /auth.md is the existing Claimable Neon protocol, distinct from the /auth product page.
  'auth.md': '/auth.md',
  pricing: '/pricing.md', // Hand-written, served from public/pricing.md (no CONTENT_ROUTES entry)
  // /feedback.md aliases the Send feedback docs page (the agent feedback discovery URL).
  // Two places enforce this alias — keep in sync:
  //   1. Here (getMarkdownPath — agent requests, and keeps /feedback.md out of the markdown 404)
  //   2. next.config.js beforeFiles rewrite: /feedback.md → /md/docs/introduction/feedback.md
  'feedback.md': '/md/docs/introduction/feedback.md',
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

// Function Registry template pages read the live registry, so their markdown comes
// from route handlers under /md/functions/templates instead of build-time files.
const FUNCTION_TEMPLATES_PATH = /^functions\/templates(?:\/([a-z0-9][a-z0-9-]*))?$/;

export function getFunctionTemplatesMarkdownPath(normalizedPath) {
  const match = normalizedPath.match(FUNCTION_TEMPLATES_PATH);
  if (!match) return null;
  return match[1] ? `/md/functions/templates/${match[1]}` : '/md/functions/templates';
}

// Convert URL path to markdown file path
// Example: /docs/get-started -> /md/docs/get-started.md (maps to public/md/)
export function getMarkdownPath(pathname) {
  const path = pathname.slice(1).replace(/\/$/, ''); // Remove leading and trailing slashes

  // Homepage: '/' and '/home' both render the marketing homepage; serve the
  // hand-written public/index.md. (getMarkdownPath('/index.md') also lands here
  // via the CONTENT_ROUTES miss below returning null, so serve it explicitly.)
  if (path === '' || path === 'home' || path === 'index.md') return '/index.md';

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

  const functionTemplatesPath = getFunctionTemplatesMarkdownPath(normalized);
  if (functionTemplatesPath) return functionTemplatesPath;

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
    label: 'Neon docs sitemap',
    href: '/docs/sitemap.md',
    description: 'every docs page, grouped by the docs navigation',
  },
  {
    label: 'Neon REST API',
    href: '/docs/reference/api.md',
    description: 'all REST endpoints grouped by resource',
  },
  {
    label: 'Neon CLI',
    href: '/docs/cli.md',
    description: 'neon commands, options, and usage',
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
