import { describe, expect, it, vi } from 'vitest';

import { buildCatalog, fetchAiGatewayModels, toCatalogEntry } from './ai-gateway-models.mjs';

// Trimmed from a real /v1/models listing item.
const GPT = {
  id: 'gpt-5-4',
  owned_by: 'openai',
  provider: 'databricks',
  name: 'GPT-5.4',
  family: 'gpt',
  model_type: 'language',
  release_date: '2026-03-05',
  knowledge_cutoff: '2025-08-31',
  context_length: 1050000,
  max_input_tokens: 922000,
  max_tokens: 128000,
  architecture: {
    input_modalities: ['text', 'image', 'file'],
    output_modalities: ['text', 'image'],
  },
  pricing: {
    prompt: '0.0000025',
    completion: '0.000015',
    input_cache_read: '0.00000025',
    overrides: [
      {
        min_prompt_tokens: 272000,
        prompt: '0.000005',
        completion: '0.0000225',
        input_cache_read: '0.0000005',
      },
    ],
  },
  reasoning_options: [{ type: 'effort', values: ['none', 'low', 'medium', 'high', 'xhigh'] }],
  features: {
    attachment: true,
    reasoning: true,
    tool_call: true,
    temperature: true,
    structured_output: true,
    open_weights: false,
  },
  enabled: true,
};

const EMBEDDING = {
  id: 'gte-large-en',
  owned_by: 'alibaba',
  name: 'GTE Large (En)',
  family: 'text-embedding',
  model_type: 'embedding',
  dimensions: 1024,
  release_date: '2023-07-27',
  architecture: { input_modalities: ['text'], output_modalities: ['embeddings'] },
  pricing: { prompt: '0.00000013', completion: '0' },
  reasoning_options: null,
  knowledge_cutoff: null,
  features: { open_weights: true, chat: false, embeddings: true },
};

describe('toCatalogEntry', () => {
  it('maps a listing item to a data.json entry', () => {
    expect(toCatalogEntry(GPT)).toEqual({
      id: 'gpt-5-4',
      name: 'GPT-5.4',
      provider: 'openai',
      family: 'gpt',
      released: true,
      attachment: true,
      reasoning: true,
      reasoning_options: [{ type: 'effort', values: ['none', 'low', 'medium', 'high', 'xhigh'] }],
      tool_call: true,
      temperature: true,
      structured_output: true,
      open_weights: false,
      knowledge: '2025-08-31',
      release_date: '2026-03-05',
      last_updated: '2026-03-05',
      modalities: { input: ['text', 'image', 'pdf'], output: ['text', 'image'] },
      limit: { context: 1050000, input: 922000, output: 128000 },
      cost: {
        input: 2.5,
        output: 15,
        cache_read: 0.25,
        tiers: [
          { input: 5, output: 22.5, cache_read: 0.5, tier: { type: 'context', size: 272000 } },
        ],
        context_over_200k: { input: 5, output: 22.5, cache_read: 0.5 },
      },
    });
  });

  it('carries last_updated and input_audio over from the committed entry', () => {
    const entry = toCatalogEntry(GPT, { last_updated: '2026-04-01', cost: { input_audio: 1.5 } });
    expect(entry.last_updated).toBe('2026-04-01');
    expect(entry.cost.input_audio).toBe(1.5);
    expect(Object.keys(entry.cost)).toEqual([
      'input',
      'output',
      'cache_read',
      'input_audio',
      'tiers',
      'context_over_200k',
    ]);
  });

  it('shifts USD-per-token strings to USD per 1M tokens exactly', () => {
    const item = {
      ...GPT,
      pricing: { prompt: '0.0000002', completion: '0.00000012', input_cache_read: '0.000000005' },
    };
    expect(toCatalogEntry(item).cost).toEqual({ input: 0.2, output: 0.12, cache_read: 0.005 });
  });
});

describe('buildCatalog', () => {
  it('keeps committed order, appends new models, and defaults last_updated to release_date', () => {
    const committed = {
      neon: {
        id: 'neon',
        name: 'Neon',
        models: {
          'gpt-5-4': { id: 'gpt-5-4', last_updated: '2026-04-01' },
          dropped: { id: 'dropped' },
        },
      },
    };
    const out = buildCatalog([EMBEDDING, GPT], committed);
    expect(out.neon.id).toBe('neon');
    expect(Object.keys(out.neon.models)).toEqual(['gpt-5-4', 'gte-large-en']);
    expect(out.neon.models['gpt-5-4'].last_updated).toBe('2026-04-01');
    expect(out.neon.models['gte-large-en']).toEqual({
      id: 'gte-large-en',
      name: 'GTE Large (En)',
      provider: 'alibaba',
      family: 'text-embedding',
      released: true,
      type: 'embedding',
      dimensions: 1024,
      open_weights: true,
      release_date: '2023-07-27',
      last_updated: '2023-07-27',
      cost: { input: 0.13 },
    });
  });
});

describe('fetchAiGatewayModels', () => {
  it('returns data[] with a bearer token and throws on non-2xx or network errors', async () => {
    const ok = vi
      .fn()
      .mockResolvedValue({ ok: true, status: 200, json: async () => ({ data: [GPT] }) });
    await expect(
      fetchAiGatewayModels({ baseUrl: 'https://gw.example/', token: 't', fetchImpl: ok })
    ).resolves.toEqual([GPT]);
    expect(ok.mock.calls[0][0]).toBe('https://gw.example/v1/models');
    expect(ok.mock.calls[0][1].headers.Authorization).toBe('Bearer t');

    const notOk = vi.fn().mockResolvedValue({ ok: false, status: 503, statusText: 'Unavailable' });
    await expect(
      fetchAiGatewayModels({ baseUrl: 'https://gw.example', token: 't', fetchImpl: notOk })
    ).rejects.toThrow(/503/);

    const down = vi.fn().mockRejectedValue(new Error('network down'));
    await expect(
      fetchAiGatewayModels({ baseUrl: 'https://gw.example', token: 't', fetchImpl: down })
    ).rejects.toThrow(/network down/);
  });
});
