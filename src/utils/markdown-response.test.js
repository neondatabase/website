import { describe, expect, it } from 'vitest';

import {
  MARKDOWN_CACHE_CONTROL,
  markdownNotFoundResponse,
  markdownResponse,
} from './markdown-response';

describe('markdownResponse', () => {
  it('sets the standard markdown headers', async () => {
    const response = markdownResponse('# Page');

    expect(response.status).toBe(200);
    expect(await response.text()).toBe('# Page');
    expect(response.headers.get('Content-Type')).toBe('text/markdown; charset=utf-8');
    expect(response.headers.get('Cache-Control')).toBe(MARKDOWN_CACHE_CONTROL);
    expect(response.headers.get('X-Content-Source')).toBe('markdown');
    expect(response.headers.get('X-Robots-Tag')).toBe('noindex');
  });

  it('accepts a status and source', () => {
    const response = markdownResponse('# Gone', { status: 404, source: 'md-404' });
    expect(response.status).toBe(404);
    expect(response.headers.get('X-Content-Source')).toBe('md-404');
  });
});

describe('markdownNotFoundResponse', () => {
  it('builds the agent 404 on the standard markdown headers', async () => {
    const response = markdownNotFoundResponse('/docs/missing.md', { source: 'agent-404' });

    expect(response.status).toBe(404);
    expect(await response.text()).toContain('/docs/missing.md');
    expect(response.headers.get('Cache-Control')).toBe(MARKDOWN_CACHE_CONTROL);
    expect(response.headers.get('X-Content-Source')).toBe('agent-404');
    expect(response.headers.get('X-LLMs-Txt')).toBe('/docs/llms.txt');
  });
});
