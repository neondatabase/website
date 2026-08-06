import { describe, it, expect } from 'vitest';

import { GET } from './route.js';

// The route reads `request.nextUrl`, which Next populates. A plain URL is enough here.
const request = (query = '') => ({ nextUrl: new URL(`https://neon.com/models${query}`) });
const body = async (res) => JSON.parse(await res.text());

describe('GET /models', () => {
  it('returns every served model with chat examples by default', async () => {
    const res = await GET(request());
    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('application/json');

    const payload = await body(res);
    expect(payload.use_case).toBe('chat');
    expect(payload.total).toBe(payload.models.length);
    expect(payload.models.length).toBeGreaterThan(0);
    expect(payload.probed_at).toEqual(expect.any(String));
  });

  it('scopes to a single model', async () => {
    const res = await GET(request('?model=gpt-5-4-mini'));
    const payload = await body(res);

    expect(res.status).toBe(200);
    expect(payload.model.id).toBe('gpt-5-4-mini');
    expect(payload.models).toBeUndefined();
  });

  it('404s an unknown model and lists the ones it serves', async () => {
    const res = await GET(request('?model=not-a-model'));
    const payload = await body(res);

    expect(res.status).toBe(404);
    expect(payload.error).toMatch(/not-a-model/);
    expect(payload.supported).toContain('gpt-5-4-mini');
  });

  it('400s an unknown use case', async () => {
    const res = await GET(request('?use_case=embeddings'));
    const payload = await body(res);

    expect(res.status).toBe(400);
    expect(payload.supported).toEqual(['chat', 'image-generation', 'web-search']);
  });

  describe('example selection follows measured capability, not model family', () => {
    it('omits the OpenAI SDK examples for a model that returns array content', async () => {
      const res = await GET(request('?model=gemini-3-5-flash'));
      const { model } = await body(res);
      const ids = model.examples.map((e) => e.id);

      expect(model.capabilities.chat).toBe('array-content');
      expect(ids).toContain('ai-sdk');
      // The OpenAI SDKs type `content` as a string, so an array silently misbehaves.
      expect(ids).not.toContain('typescript');
      expect(ids).not.toContain('python');
    });

    it('points cURL at the native dialect where one exists', async () => {
      const res = await GET(request('?model=gemini-3-5-flash'));
      const { model } = await body(res);
      const curl = model.examples.find((e) => e.id === 'curl');

      expect(curl.endpoint).toContain('/v1/gemini/v1beta');
      expect(curl.variantReason).toBeTruthy();
    });

    it('keeps cURL on chat completions for an array-content model with no native dialect', async () => {
      const res = await GET(request('?model=gpt-oss-20b'));
      const { model } = await body(res);
      const curl = model.examples.find((e) => e.id === 'curl');

      expect(model.capabilities.native_dialect).toBe('none');
      expect(curl.endpoint).toBe('/v1/chat/completions');
    });

    it('points cURL at Anthropic Messages for a Claude model that returns array content', async () => {
      const res = await GET(request('?model=claude-opus-5'));
      const { model } = await body(res);
      const ids = model.examples.map((e) => e.id);
      const curl = model.examples.find((e) => e.id === 'curl');

      // Only when it reasons, but the OpenAI SDKs cannot express "sometimes a string".
      expect(model.capabilities.chat).toBe('array-content');
      expect(ids).not.toContain('typescript');
      expect(ids).not.toContain('python');
      expect(curl.endpoint).toBe('/anthropic/v1/messages');
      expect(curl.variantReason).toBeTruthy();
    });

    it('keeps cURL on chat completions for a conforming Claude model', async () => {
      const res = await GET(request('?model=claude-haiku-4-5'));
      const { model } = await body(res);
      const curl = model.examples.find((e) => e.id === 'curl');

      // A native dialect alone is not a reason to leave the portable route.
      expect(model.capabilities.chat).toBe('conforms');
      expect(model.capabilities.native_dialect).toBe('anthropic');
      expect(curl.endpoint).toBe('/v1/chat/completions');
    });

    it('gives Mastra a provider instance when the neon/ string cannot work', async () => {
      const res = await GET(request('?model=gemini-3-5-flash'));
      const { model } = await body(res);
      const mastra = model.examples.find((e) => e.id === 'mastra');

      expect(mastra.dependencies).toContain('@neondatabase/ai-sdk-provider');
      expect(mastra.files[0].content).toContain('model: neon(');
    });

    it('uses the neon/ string for a conforming model', async () => {
      const res = await GET(request('?model=gpt-5-4-mini'));
      const { model } = await body(res);
      const mastra = model.examples.find((e) => e.id === 'mastra');

      expect(mastra.dependencies).toEqual(['@mastra/core']);
      expect(mastra.files[0].content).toContain('model: "neon/gpt-5-4-mini"');
    });

    it('routes codex through the Responses API', async () => {
      const res = await GET(request('?model=gpt-5-3-codex'));
      const { model } = await body(res);
      const ts = model.examples.find((e) => e.id === 'typescript');

      expect(model.capabilities.chat).toBe('not-served');
      expect(ts.endpoint).toBe('/openai/v1/responses');
      expect(ts.files[0].content).toContain('client.responses.create');
    });
  });

  describe('unsupported use cases', () => {
    it('explains why rather than returning examples that would fail', async () => {
      const res = await GET(request('?model=gemini-3-5-flash&use_case=web-search'));
      const { model } = await body(res);

      expect(model.examples).toEqual([]);
      expect(model.unsupported).toMatch(/web_search/);
    });

    it('returns image examples for a model that supports the tool', async () => {
      const res = await GET(request('?model=gpt-5-nano&use_case=image-generation'));
      const { model } = await body(res);

      expect(model.unsupported).toBeUndefined();
      expect(model.examples.map((e) => e.id)).toEqual(['ai-sdk', 'mastra', 'typescript', 'python']);
    });

    it('carries the provider-executed tool in the Mastra tool examples', async () => {
      for (const useCase of ['image-generation', 'web-search']) {
        const res = await GET(request(`?model=gpt-5-nano&use_case=${useCase}`));
        const { model } = await body(res);
        const mastra = model.examples.find((e) => e.id === 'mastra');

        // The tool factory lives in the provider package even though the model is a router string.
        expect(mastra.dependencies).toContain('@neondatabase/ai-sdk-provider');
        expect(mastra.files[0].content).toContain('model: "neon/gpt-5-nano"');
        expect(mastra.files[0].content).toContain('neon.tools.');
      }
    });
  });

  it('every example is self-describing enough to run', async () => {
    const res = await GET(request());
    const { models } = await body(res);

    for (const model of models) {
      for (const example of model.examples) {
        expect(example.files.length).toBeGreaterThan(0);
        expect(example.files[0].content.length).toBeGreaterThan(0);
        expect(example.envVars).toContain('NEON_AI_GATEWAY_TOKEN');
        expect(example.endpoint).toEqual(expect.any(String));
        expect(Array.isArray(example.dependencies)).toBe(true);
      }
    }
  });
});
