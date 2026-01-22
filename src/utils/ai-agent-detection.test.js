import { describe, it, expect } from 'vitest';

import { isAIAgentRequest, getMarkdownPath } from './ai-agent-detection';

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
    ];

    aiAgentPatterns.forEach((pattern) => {
      it(`should detect AI agent with User-Agent containing "${pattern}"`, () => {
        const req = createMockRequest(`Mozilla/5.0 ${pattern}/1.0`, 'text/html');
        expect(isAIAgentRequest(req)).toBe(true);
      });

      it(`should detect AI agent with User-Agent containing lowercase "${pattern.toLowerCase()}"`, () => {
        const req = createMockRequest(`Mozilla/5.0 ${pattern.toLowerCase()}/1.0`, 'text/html');
        expect(isAIAgentRequest(req)).toBe(true);
      });
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

    it('should detect AI agent with AI User-Agent even with HTML Accept', () => {
      const req = createMockRequest('Claude/1.0', 'text/html');
      expect(isAIAgentRequest(req)).toBe(true);
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
      expect(result).toBe('/md/pages/programs/agents.md');
    });

    it('should convert /use-cases/ai-agents to markdown path', () => {
      const result = getMarkdownPath('/use-cases/ai-agents');
      expect(result).toBe('/md/pages/use-cases/ai-agents.md');
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

    it('should exclude /docs/changelog', () => {
      const result = getMarkdownPath('/docs/changelog');
      expect(result).toBeNull();
    });

    it('should exclude /use-cases/multi-tb', () => {
      const result = getMarkdownPath('/use-cases/multi-tb');
      expect(result).toBeNull();
    });

    it('should exclude /use-cases/serverless-apps', () => {
      const result = getMarkdownPath('/use-cases/serverless-apps');
      expect(result).toBeNull();
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
  });

  describe('Invalid routes (should return null)', () => {
    it('should return null for non-matching routes like /about', () => {
      const result = getMarkdownPath('/about');
      expect(result).toBeNull();
    });

    it('should return null for root path /', () => {
      const result = getMarkdownPath('/');
      expect(result).toBeNull();
    });

    it('should return null for /pricing', () => {
      const result = getMarkdownPath('/pricing');
      expect(result).toBeNull();
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
  });
});
