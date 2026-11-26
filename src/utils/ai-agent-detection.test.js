import { describe, it, expect } from 'vitest';

import {
  isAIAgentRequest,
  getMarkdownPath,
  buildAgent404Response,
  isKnownAIAgentRequest,
  isHumanBrowserNavigation,
  classifyReader,
  isSearchCrawlerUserAgent,
  isNamedFetcherUserAgent,
  agentFamily,
} from './ai-agent-detection';

describe('isAIAgentRequest', () => {
  // Helper to create mock request objects
  const createMockRequest = (userAgent = '', accept = '') => ({
    headers: new Map([
      ['user-agent', userAgent],
      ['accept', accept],
    ]),
  });

  describe('User-Agent detection', () => {
    const aiAgentPatterns = [
      'ChatGPT-User',
      'OpenAI',
      'GPT',
      'Claude',
      'Anthropic',
      'Cursor',
      'Windsurf',
      'Perplexity',
      'GitHub-Copilot',
      'ai-agent',
      'llm-agent',
      'axios',
      'got',
      'curl',
    ];

    aiAgentPatterns.forEach((pattern) => {
      it(`should detect AI agent with User-Agent containing "${pattern}"`, () => {
        const req = createMockRequest(`Mozilla/5.0 ${pattern}/1.0`, '*/*');
        expect(isAIAgentRequest(req)).toBe(true);
      });

      it(`should detect AI agent with User-Agent containing lowercase "${pattern.toLowerCase()}"`, () => {
        const req = createMockRequest(`Mozilla/5.0 ${pattern.toLowerCase()}/1.0`, '*/*');
        expect(isAIAgentRequest(req)).toBe(true);
      });

      it(`should not detect AI agent with User-Agent containing "${pattern}" when Accept includes text/html`, () => {
        const req = createMockRequest(
          `Mozilla/5.0 ${pattern}/1.0`,
          'text/html,application/xhtml+xml,*/*;q=0.8'
        );
        expect(isAIAgentRequest(req)).toBe(false);
      });
    });

    it('should detect AI agent with User-Agent and no Accept header', () => {
      const req = createMockRequest('curl/8.7.1', '');
      expect(isAIAgentRequest(req)).toBe(true);
    });

    it('should detect AI agent with User-Agent when Accept includes text/markdown and text/html', () => {
      const req = createMockRequest('Claude-User/1.0', 'text/markdown, text/html, */*');
      expect(isAIAgentRequest(req)).toBe(true);
    });

    it('should not detect regular browser User-Agent', () => {
      const req = createMockRequest(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'text/html'
      );
      expect(isAIAgentRequest(req)).toBe(false);
    });
  });

  describe('Accept header detection', () => {
    it('should detect AI agent when Accept includes text/markdown', () => {
      const req = createMockRequest('Mozilla/5.0', 'text/markdown');
      expect(isAIAgentRequest(req)).toBe(true);
    });

    it('should detect AI agent when Accept includes text/markdown with text/html', () => {
      const req = createMockRequest('Mozilla/5.0', 'text/markdown, text/html, */*');
      expect(isAIAgentRequest(req)).toBe(true);
    });

    it('should detect AI agent when Accept is text/plain without text/html', () => {
      const req = createMockRequest('Mozilla/5.0', 'text/plain');
      expect(isAIAgentRequest(req)).toBe(true);
    });

    it('should detect AI agent when Accept is application/json without text/html', () => {
      const req = createMockRequest('Mozilla/5.0', 'application/json');
      expect(isAIAgentRequest(req)).toBe(true);
    });

    it('should detect AI agent when Accept is application/xml without text/html', () => {
      const req = createMockRequest('Mozilla/5.0', 'application/xml');
      expect(isAIAgentRequest(req)).toBe(true);
    });

    it('should NOT detect AI agent when Accept includes text/html without markdown', () => {
      const req = createMockRequest('Mozilla/5.0', 'text/html,application/json');
      expect(isAIAgentRequest(req)).toBe(false);
    });

    it('should NOT detect AI agent when Accept is only text/html', () => {
      const req = createMockRequest('Mozilla/5.0', 'text/html');
      expect(isAIAgentRequest(req)).toBe(false);
    });

    it('should NOT detect AI agent with generic Accept header', () => {
      const req = createMockRequest('Mozilla/5.0', '*/*');
      expect(isAIAgentRequest(req)).toBe(false);
    });
  });

  describe('Combined detection', () => {
    it('should detect AI agent with both AI User-Agent and non-HTML Accept', () => {
      const req = createMockRequest('Claude/1.0', 'text/plain');
      expect(isAIAgentRequest(req)).toBe(true);
    });

    it('should NOT detect AI agent with AI User-Agent and HTML Accept', () => {
      const req = createMockRequest('Claude/1.0', 'text/html');
      expect(isAIAgentRequest(req)).toBe(false);
    });
  });

  describe('Real-world AI tools detection', () => {
    it('should detect Claude Code with axios User-Agent and text/markdown Accept', () => {
      const req = createMockRequest('axios/1.8.4', 'text/markdown, text/html, */*');
      expect(isAIAgentRequest(req)).toBe(true);
    });

    it('should detect Cursor with got User-Agent', () => {
      const req = createMockRequest('got (https://github.com/sindresorhus/got)', '*/*');
      expect(isAIAgentRequest(req)).toBe(true);
    });

    it('should detect any tool requesting text/markdown even with regular User-Agent', () => {
      const req = createMockRequest('Mozilla/5.0', 'text/markdown, */*');
      expect(isAIAgentRequest(req)).toBe(true);
    });
  });

  describe('Edge cases', () => {
    it('should handle missing User-Agent header', () => {
      const req = createMockRequest('', 'text/html');
      expect(isAIAgentRequest(req)).toBe(false);
    });

    it('should handle missing Accept header', () => {
      const req = createMockRequest('Mozilla/5.0', '');
      expect(isAIAgentRequest(req)).toBe(false);
    });

    it('should handle both headers missing', () => {
      const req = createMockRequest('', '');
      expect(isAIAgentRequest(req)).toBe(false);
    });
  });
});

describe('getMarkdownPath', () => {
  describe('Valid content routes', () => {
    it.each([
      ['/functions', '/md/functions.md'],
      ['/functions.md', '/md/functions.md'],
      ['/ai-gateway', '/md/ai-gateway.md'],
      ['/ai-gateway.md', '/md/ai-gateway.md'],
      ['/object-storage', '/md/object-storage.md'],
      ['/object-storage.md', '/md/object-storage.md'],
      ['/auth', '/md/auth-page.md'],
      ['/auth.md', '/auth.md'],
      ['/lakebase', '/md/lakebase.md'],
      ['/lakebase.md', '/md/lakebase.md'],
      ['/case-studies', '/md/case-studies.md'],
      ['/case-studies.md', '/md/case-studies.md'],
    ])('should resolve generated page %s to %s', (pagePath, markdownPath) => {
      expect(getMarkdownPath(pagePath)).toBe(markdownPath);
    });

    it('should alias /feedback.md to the Send feedback docs page mirror', () => {
      expect(getMarkdownPath('/feedback.md')).toBe('/md/docs/introduction/feedback.md');
      // Bare /feedback is a redirectFrom redirect to the docs page, not a markdown alias.
      expect(getMarkdownPath('/feedback')).toBeNull();
    });

    it('should convert /docs/introduction to markdown path', () => {
      const result = getMarkdownPath('/docs/introduction');
      expect(result).toBe('/md/docs/introduction.md');
    });

    it('should convert /postgresql/tutorial to markdown path', () => {
      const result = getMarkdownPath('/postgresql/tutorial');
      expect(result).toBe('/md/postgresql/tutorial.md');
    });

    it('should convert /guides/neon-sst to markdown path', () => {
      const result = getMarkdownPath('/guides/neon-sst');
      expect(result).toBe('/md/guides/neon-sst.md');
    });

    it('should convert /branching/introduction to markdown path', () => {
      const result = getMarkdownPath('/branching/introduction');
      expect(result).toBe('/md/branching/introduction.md');
    });

    it('should convert /programs/agents to markdown path', () => {
      const result = getMarkdownPath('/programs/agents');
      expect(result).toBe('/md/programs/agents.md');
    });

    it('should convert /use-cases/ai-agents to markdown path', () => {
      const result = getMarkdownPath('/use-cases/ai-agents');
      expect(result).toBe('/md/use-cases/ai-agents.md');
    });

    it('should handle nested docs paths', () => {
      const result = getMarkdownPath('/docs/guides/logical-replication');
      expect(result).toBe('/md/docs/guides/logical-replication.md');
    });
  });

  describe('Excluded routes (should return null)', () => {
    it('should exclude index page /guides', () => {
      const result = getMarkdownPath('/guides');
      expect(result).toBeNull();
    });

    it('should exclude index page /branching', () => {
      const result = getMarkdownPath('/branching');
      expect(result).toBeNull();
    });

    it('should alias /docs.md to the curated llms.txt index', () => {
      const result = getMarkdownPath('/docs.md');
      expect(result).toBe('/docs/llms.txt');
    });

    it('should alias bare /docs to the curated llms.txt index (agent / Accept: markdown)', () => {
      const result = getMarkdownPath('/docs');
      expect(result).toBe('/docs/llms.txt');
    });

    it('should not alias docs subpaths to llms.txt', () => {
      const result = getMarkdownPath('/docs/introduction');
      expect(result).toBe('/md/docs/introduction.md');
    });

    it('should resolve /docs/changelog to custom markdown path', () => {
      const result = getMarkdownPath('/docs/changelog');
      expect(result).toBe('/md/docs/changelog.md');
    });

    it('should resolve /docs/changelog.md to custom markdown path', () => {
      const result = getMarkdownPath('/docs/changelog.md');
      expect(result).toBe('/md/docs/changelog.md');
    });

    it('should resolve the API endpoint index route to the canonical API markdown', () => {
      const result = getMarkdownPath('/docs/reference/api/reference');
      expect(result).toBe('/md/docs/reference/api.md');
    });

    it('should resolve the API endpoint index .md route to the canonical API markdown', () => {
      const result = getMarkdownPath('/docs/reference/api/reference.md');
      expect(result).toBe('/md/docs/reference/api.md');
    });

    it('should resolve the legacy API reference route to the canonical API markdown', () => {
      const result = getMarkdownPath('/docs/reference/api-reference');
      expect(result).toBe('/md/docs/reference/api.md');
    });

    it('should resolve the legacy API reference .md route to the canonical API markdown', () => {
      const result = getMarkdownPath('/docs/reference/api-reference.md');
      expect(result).toBe('/md/docs/reference/api.md');
    });

    it('should resolve individual changelog entries to changelog content path', () => {
      const result = getMarkdownPath('/docs/changelog/2026-03-13');
      expect(result).toBe('/md/changelog/2026-03-13.md');
    });

    it.each([
      ['/use-cases/full-stack-apps', '/md/use-cases/full-stack-apps.md'],
      ['/use-cases/branching-workflows', '/md/use-cases/branching-workflows.md'],
      ['/use-cases/bursty-workloads', '/md/use-cases/bursty-workloads.md'],
      ['/use-cases/large-databases', '/md/use-cases/large-databases.md'],
    ])('should resolve %s to its markdown mirror', (path, expected) => {
      expect(getMarkdownPath(path)).toBe(expected);
    });
  });

  describe('Excluded files (should return null)', () => {
    it('should exclude RSS files like /guides/rss.xml', () => {
      const result = getMarkdownPath('/guides/rss.xml');
      expect(result).toBeNull();
    });

    it('should exclude RSS files like /docs/rss.xml', () => {
      const result = getMarkdownPath('/docs/rss.xml');
      expect(result).toBeNull();
    });

    it.each(['/docs/reference/api/llms.txt', '/docs/reference/api/llms-full.txt'])(
      'should pass through static API reference index files: %s',
      (path) => {
        const result = getMarkdownPath(path);
        expect(result).toBeNull();
      }
    );
  });

  describe('Invalid routes (should return null)', () => {
    it('should return null for non-matching routes like /about', () => {
      const result = getMarkdownPath('/about');
      expect(result).toBeNull();
    });

    it('should resolve /pricing to custom markdown path', () => {
      const result = getMarkdownPath('/pricing');
      expect(result).toBe('/pricing.md');
    });
  });

  describe('Homepage', () => {
    it('should resolve the root path / to /index.md', () => {
      expect(getMarkdownPath('/')).toBe('/index.md');
    });

    it('should resolve /home to /index.md (same marketing homepage)', () => {
      expect(getMarkdownPath('/home')).toBe('/index.md');
    });

    it('should resolve /index.md to itself', () => {
      expect(getMarkdownPath('/index.md')).toBe('/index.md');
    });
  });

  describe('Edge cases', () => {
    it('should handle paths with trailing slashes', () => {
      const result = getMarkdownPath('/docs/introduction/');
      expect(result).toBe('/md/docs/introduction.md');
    });

    it('should handle paths with special characters', () => {
      const result = getMarkdownPath('/docs/api-reference');
      expect(result).toBe('/md/docs/api-reference.md');
    });

    it('should not double .md when path already ends with .md', () => {
      const result = getMarkdownPath('/docs/introduction.md');
      expect(result).toBe('/md/docs/introduction.md');
    });

    it('should not double .md for nested paths ending with .md', () => {
      const result = getMarkdownPath('/docs/guides/logical-replication.md');
      expect(result).toBe('/md/docs/guides/logical-replication.md');
    });

    it('should map /branching.md to /md/branching.md (file may not exist)', () => {
      const result = getMarkdownPath('/branching.md');
      expect(result).toBe('/md/branching.md');
    });

    it('should map /guides.md to /md/guides.md (file may not exist)', () => {
      const result = getMarkdownPath('/guides.md');
      expect(result).toBe('/md/guides.md');
    });

    it('should map /postgresql.md to /md/postgresql.md (file may not exist)', () => {
      const result = getMarkdownPath('/postgresql.md');
      expect(result).toBe('/md/postgresql.md');
    });

    it('should map /programs.md to /md/programs.md', () => {
      const result = getMarkdownPath('/programs.md');
      expect(result).toBe('/md/programs.md');
    });
  });
});

describe('buildAgent404Response', () => {
  it('should include the pathname in the response', () => {
    const result = buildAgent404Response('/docs/manage/nonexistent-page');
    expect(result).toContain('`/docs/manage/nonexistent-page`');
  });

  it('should include links to llms.txt, api.md, and cli.md', () => {
    const result = buildAgent404Response('/docs/some-page');
    expect(result).toContain('/docs/llms.txt');
    expect(result).toContain('/docs/reference/api.md');
    expect(result).toContain('/docs/cli.md');
  });

  it('should include a link to the API reference', () => {
    const result = buildAgent404Response('/docs/some-page');
    expect(result).toContain('/docs/reference/api.md');
  });

  it('should work with deeply nested paths', () => {
    const result = buildAgent404Response('/docs/guides/deeply/nested/path');
    expect(result).toContain('`/docs/guides/deeply/nested/path`');
    expect(result).toContain('/docs/llms.txt');
  });
});

describe('isKnownAIAgentRequest', () => {
  const requestWith = (headers) => ({ headers: new Map(Object.entries(headers)) });
  const CHROME =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

  // User-Agent strings as published by each operator (see the source links in
  // AI_AGENT_USER_AGENT_TOKENS).
  it.each([
    'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; GPTBot/1.4; +https://openai.com/gptbot',
    'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ChatGPT-User/1.0; +https://openai.com/bot',
    'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; OAI-SearchBot/1.4; +https://openai.com/searchbot',
    `${CHROME} (compatible; Claude-Agent/1.0)`,
    'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; ClaudeBot/1.0; +claudebot@anthropic.com)',
    'Mozilla/5.0 (compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)',
    'Mozilla/5.0 (compatible; Perplexity-User/1.0; +https://perplexity.ai/perplexity-user)',
    `${CHROME} (compatible; Google-Agent; +https://developers.google.com/crawling/docs/crawlers-fetchers/google-agent)`,
    'meta-externalfetcher/1.1 (+https://developers.facebook.com/docs/sharing/webmasters/web-crawlers)',
    'meta-webindexer/1.1',
    'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; MistralAI-User/1.0; +https://docs.mistral.ai/robots)',
    'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Amzn-User/0.1) Chrome/131.0.0.0 Safari/537.36',
    'DuckAssistBot/1.2; (+http://duckduckgo.com/duckassistbot.html)',
  ])('recognizes %s', (userAgent) => {
    expect(isKnownAIAgentRequest(requestWith({ 'user-agent': userAgent }))).toBe(true);
  });

  it.each([
    CHROME,
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:132.0) Gecko/20100101 Firefox/132.0',
    `${CHROME} Edg/131.0.0.0`,
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1',
  ])('does not treat the browser %s as an AI agent', (userAgent) => {
    expect(isKnownAIAgentRequest(requestWith({ 'user-agent': userAgent }))).toBe(false);
  });

  it('recognizes ChatGPT agent, which uses a Chrome User-Agent and Web Bot Auth', () => {
    const chatgptAgent = requestWith({
      'user-agent': CHROME,
      'signature-agent': '"https://chatgpt.com"',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-dest': 'document',
    });
    expect(isKnownAIAgentRequest(chatgptAgent)).toBe(true);
    // It browses like a person, so it must not be counted as one.
    expect(isHumanBrowserNavigation(chatgptAgent)).toBe(false);
  });

  it('still treats a person browsing in Chrome as human', () => {
    expect(
      isHumanBrowserNavigation(
        requestWith({
          'user-agent': CHROME,
          'sec-fetch-mode': 'navigate',
          'sec-fetch-dest': 'document',
        })
      )
    ).toBe(true);
  });
});

describe('classifyReader', () => {
  const requestWith = (headers) => ({ headers: new Map(Object.entries(headers)) });
  const CHROME =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
  const navigation = { 'sec-fetch-mode': 'navigate', 'sec-fetch-dest': 'document' };

  it.each([
    ['a person in Chrome', { 'user-agent': CHROME, accept: 'text/html', ...navigation }, 'human'],
    [
      'ChatGPT-User',
      { 'user-agent': 'Mozilla/5.0 (compatible; ChatGPT-User/1.0)', accept: 'text/html' },
      'ai-assistant',
    ],
    [
      'ChatGPT agent (Signature-Agent)',
      { 'user-agent': CHROME, 'signature-agent': '"https://chatgpt.com"', ...navigation },
      'ai-assistant',
    ],
    // Generic clients and markdown requests aren't known AI agents by their headers.
    ['curl', { 'user-agent': 'curl/8.7.1', accept: '*/*' }, 'unknown'],
    ['a markdown request', { 'user-agent': 'Mozilla/5.0', accept: 'text/markdown' }, 'unknown'],
    [
      'Googlebot',
      {
        'user-agent':
          'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Googlebot/2.1; +http://www.google.com/bot.html) Chrome/131.0.0.0 Safari/537.36',
        accept: 'text/html',
      },
      'search-crawler',
    ],
    [
      'Applebot',
      {
        'user-agent':
          'Mozilla/5.0 (Macintosh) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15 (Applebot/0.1; +http://www.apple.com/go/applebot)',
        accept: 'text/html',
      },
      'search-crawler',
    ],
    ['python-requests', { 'user-agent': 'python-requests/2.32.3', accept: '*/*' }, 'unknown'],
    ['Wget', { 'user-agent': 'Wget/1.24.5', accept: '*/*' }, 'unknown'],
    ['a browser UA without navigation headers', { 'user-agent': CHROME, accept: '*/*' }, 'unknown'],
    ['a headless browser', { 'user-agent': 'HeadlessChrome/131.0', ...navigation }, 'unknown'],
  ])('labels %s as %s', (_label, headers, reader) => {
    expect(classifyReader(requestWith(headers))).toBe(reader);
  });
});

describe('isSearchCrawlerUserAgent', () => {
  // Example User-Agents from each operator's documentation (sources next to
  // SEARCH_CRAWLER_USER_AGENT_TOKENS).
  it.each([
    'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Googlebot/2.1; +http://www.google.com/bot.html) Chrome/131.0.0.0 Safari/537.36',
    'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GoogleOther) Chrome/131.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64; Storebot-Google/1.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    'AdsBot-Google (+http://www.google.com/adsbot.html)',
    'Mozilla/5.0 (compatible; Mediapartners-Google/2.1; +http://www.google.com/bot.html)',
    'APIs-Google (+https://developers.google.com/webmasters/APIs-Google.html)',
    'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm) Chrome/131.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15 (Applebot/0.1; +http://www.apple.com/go/applebot)',
    'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Amzn-SearchBot/0.1) Chrome/131.0.0.0 Safari/537.36',
    'Mozilla/5.0 (compatible; AmazonAdBot/1.0; +https://adbot.amazon.com)',
    'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; MistralAI-Index/1.0; +https://docs.mistral.ai/robots)',
    'DuckDuckBot/1.1; (+http://duckduckgo.com/duckduckbot.html)',
    'Mozilla/5.0 (compatible; ExaSearchBot/1.0; +https://crawler.exa.ai/)',
    'Mozilla/5.0 (compatible; Pinterestbot/1.0; +https://www.pinterest.com/bot.html)',
    'Mozilla/5.0 (compatible; Qwantbot/1.0_12345; +https://help.qwant.com/bot/)',
    'Mozilla/5.0 (compatible; SeekportBot; +https://bot.seekport.com)',
    'SeobilityBot (SEO Tool; https://www.seobility.net/sites/bot.html)',
    'Mozilla/5.0 (compatible; SeznamBot/4.0; +https://o-seznam.cz/napoveda/vyhledavani/en/seznambot-crawler/)',
    'Mozilla/5.0 (compatible; Yahoo! Slurp; http://help.yahoo.com/help/us/ysearch/slurp)',
  ])('recognizes %s', (userAgent) => {
    expect(isSearchCrawlerUserAgent(userAgent)).toBe(true);
  });

  it.each([
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; GPTBot/1.4; +https://openai.com/gptbot',
    'python-requests/2.32.3',
  ])('does not treat %s as a search crawler', (userAgent) => {
    expect(isSearchCrawlerUserAgent(userAgent)).toBe(false);
  });

  it('labels MistralAI-Index and Amzn-SearchBot as search crawlers, not AI readers', () => {
    const requestWith = (userAgent) => ({ headers: new Map([['user-agent', userAgent]]) });
    expect(
      classifyReader(
        requestWith(
          'Mozilla/5.0 (compatible; MistralAI-Index/1.0; +https://docs.mistral.ai/robots)'
        )
      )
    ).toBe('search-crawler');
    expect(classifyReader(requestWith('Mozilla/5.0 (compatible; Amzn-SearchBot/0.1)'))).toBe(
      'search-crawler'
    );
    expect(classifyReader(requestWith('Mozilla/5.0 (compatible; MistralAI-User/1.0)'))).toBe(
      'ai-assistant'
    );
  });
});

describe('agentFamily', () => {
  it.each([
    [
      'Mozilla/5.0 (compatible; Perplexity-User/1.0; +https://perplexity.ai/perplexity-user)',
      'perplexity-user',
    ],
    ['Mozilla/5.0 (compatible; Claude-Agent/1.0)', 'claude-agent'],
    ['Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)', 'googlebot'],
    ['curl/8.7.1', 'curl'],
    ['axios/1.7.2', 'axios'],
    ['python-requests/2.32.3', 'other'],
    ['', 'other'],
  ])('labels %s as %s', (userAgent, family) => {
    expect(agentFamily(userAgent)).toBe(family);
  });
});

describe('AI assistants vs AI crawlers', () => {
  const requestWith = (headers) => ({ headers: new Map(Object.entries(headers)) });
  const CHROME =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
  const navigation = { 'sec-fetch-mode': 'navigate', 'sec-fetch-dest': 'document' };

  // bots.fyi "User Initiated", or operator docs say the fetch is for a user's request.
  it.each([
    'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ChatGPT-User/1.0; +https://openai.com/bot',
    'Claude-User/1.0',
    `${CHROME} (compatible; Claude-Agent/1.0)`,
    'Mozilla/5.0 (compatible; Perplexity-User/1.0; +https://perplexity.ai/perplexity-user)',
    `${CHROME} (compatible; Google-Agent; +https://developers.google.com/crawling/docs/crawlers-fetchers/google-agent)`,
    `${CHROME} (compatible; Google-GeminiNotebook; +https://developers.google.com/crawling/docs/crawlers-fetchers/google-gemininotebook)`,
    'meta-externalfetcher/1.1 (+https://developers.facebook.com/docs/sharing/webmasters/web-crawlers)',
    'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; MistralAI-User/1.0; +https://docs.mistral.ai/robots)',
    'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Amzn-User/0.1) Chrome/131.0.0.0 Safari/537.36',
    'Mozilla/5.0 (compatible; ExaUser/1.0)',
    'Mozilla/5.0 (compatible; amazon-quick-on-behalf-of/1.0)',
  ])('labels %s as ai-assistant', (userAgent) => {
    expect(classifyReader(requestWith({ 'user-agent': userAgent }))).toBe('ai-assistant');
  });

  it.each([
    'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; GPTBot/1.4; +https://openai.com/gptbot',
    'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; OAI-SearchBot/1.4; +https://openai.com/searchbot',
    'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; ClaudeBot/1.0; +claudebot@anthropic.com)',
    'Mozilla/5.0 (compatible; Claude-SearchBot/1.0)',
    'Mozilla/5.0 (compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)',
    'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Amazonbot/0.1) Chrome/131.0.0.0 Safari/537.36',
    'meta-externalagent/1.1 (+https://developers.facebook.com/docs/sharing/webmasters/web-crawlers)',
    'CCBot/2.0 (https://commoncrawl.org/faq/)',
    'DuckAssistBot/1.2; (+http://duckduckgo.com/duckassistbot.html)',
    'Mozilla/5.0 (compatible; pkgseer/1.0)',
    'Mozilla/5.0 (compatible; inkeep-crawler/1.0)',
  ])('labels %s as ai-crawler', (userAgent) => {
    expect(classifyReader(requestWith({ 'user-agent': userAgent }))).toBe('ai-crawler');
  });

  it('labels ChatGPT agent (Signature-Agent: chatgpt.com) as ai-assistant', () => {
    expect(
      classifyReader(
        requestWith({
          'user-agent': CHROME,
          'signature-agent': '"https://chatgpt.com"',
          ...navigation,
        })
      )
    ).toBe('ai-assistant');
  });

  it("labels a Web Bot Auth signer it can't name as unknown, never human", () => {
    const signer = requestWith({
      'user-agent': CHROME,
      'signature-agent': '"https://bots.example.com"',
      ...navigation,
    });
    expect(classifyReader(signer)).toBe('unknown');
    expect(isHumanBrowserNavigation(signer)).toBe(false);
  });
});

describe('search crawlers that render pages in a browser', () => {
  const requestWith = (headers) => ({ headers: new Map(Object.entries(headers)) });
  const navigation = { 'sec-fetch-mode': 'navigate', 'sec-fetch-dest': 'document' };

  it.each([
    'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36 (compatible; Baiduspider-render/2.0; +http://www.baidu.com/search/spider.html)',
    'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Googlebot/2.1; +http://www.google.com/bot.html) Chrome/131.0.0.0 Safari/537.36',
    'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm) Chrome/131.0.0.0 Safari/537.36',
  ])('treats %s with navigation headers as a search crawler, not a person', (userAgent) => {
    const request = requestWith({ 'user-agent': userAgent, accept: 'text/html', ...navigation });
    expect(isHumanBrowserNavigation(request)).toBe(false);
    expect(classifyReader(request)).toBe('search-crawler');
  });
});

describe('isNamedFetcherUserAgent', () => {
  const CHROME =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

  it.each([
    // AI crawlers
    'Mozilla/5.0 (compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)',
    'Mozilla/5.0 (Linux; Android 5.0) AppleWebKit/537.36 (KHTML, like Gecko) Mobile Safari/537.36 (compatible; Bytespider; spider-feedback@bytedance.com)',
    'meta-externalagent/1.1 (+https://developers.facebook.com/docs/sharing/webmasters/web-crawlers)',
    // Search crawlers
    'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    // AI assistants that fetch pages
    'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ChatGPT-User/1.0; +https://openai.com/bot',
    'Claude-User/1.0',
    'Mozilla/5.0 (compatible; Perplexity-User/1.0; +https://perplexity.ai/perplexity-user)',
    'meta-externalfetcher/1.1 (+https://developers.facebook.com/docs/sharing/webmasters/web-crawlers)',
    'Mozilla/5.0 (compatible; amazon-quick-on-behalf-of/1.0)',
    // A fetcher token wins over a headless browser
    'Mozilla/5.0 (X11; Linux x86_64) HeadlessChrome/131.0 Safari/537.36 (compatible; ChatGPT-User/1.0)',
  ])('matches %s', (userAgent) => {
    expect(isNamedFetcherUserAgent(userAgent)).toBe(true);
  });

  // Browser agents run the browser script, so they're left to it.
  it.each([
    CHROME,
    `${CHROME} (compatible; Claude-Agent/1.0)`,
    `${CHROME} (compatible; Google-Agent; +https://developers.google.com/crawling/docs/crawlers-fetchers/google-agent)`,
    'Mozilla/5.0 (X11; Linux x86_64) HeadlessChrome/131.0 Safari/537.36',
    'curl/8.7.1',
    '',
  ])('does not match %s', (userAgent) => {
    expect(isNamedFetcherUserAgent(userAgent)).toBe(false);
  });
});
