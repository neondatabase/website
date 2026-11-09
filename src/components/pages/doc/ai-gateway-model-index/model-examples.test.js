import { describe, expect, it } from 'vitest';

import capabilities from '../../../../app/models/capabilities.json';
import { resolveModel } from '../../../../app/models/resolve';
import modelsData from '../../../../app/models.json/data.json';

import { getAvailableModes, getInitialMode, getLanguagesForMode } from './model-examples';

const getExamplesByMode = (modelId) => ({
  text: resolveModel(modelsData, capabilities, modelId, 'chat')?.examples ?? [],
  image: resolveModel(modelsData, capabilities, modelId, 'image-generation')?.examples ?? [],
});

describe('AI Gateway model examples', () => {
  it('renders every Responses-compatible language for Codex models', () => {
    const languages = getLanguagesForMode(getExamplesByMode('gpt-5-3-codex'), 'text');

    expect(languages.map(({ key }) => key)).toEqual(['aisdk', 'mastra', 'ts', 'python', 'curl']);
    expect(languages.every(({ code }) => !code.includes('chat.completions'))).toBe(true);
    expect(languages.every(({ code }) => !code.includes('/v1/chat/completions'))).toBe(true);
    expect(languages.find(({ key }) => key === 'ts')?.code).toContain('client.responses.create');
  });

  it.each(['gpt-oss-20b', 'gpt-oss-120b', 'qwen35-122b-a10b'])(
    'renders OpenAI SDK examples for conforming %s',
    (id) => {
      const languages = getLanguagesForMode(getExamplesByMode(id), 'text');

      expect(languages.map(({ key }) => key)).toEqual(['aisdk', 'mastra', 'ts', 'python', 'curl']);
      expect(languages.find(({ key }) => key === 'mastra')?.code).toContain(`model: "neon/${id}"`);
      expect(languages.find(({ key }) => key === 'curl')?.code).toContain('/v1/chat/completions');
    }
  );

  it('renders OpenAI SDK examples for conforming Gemini', () => {
    const languages = getLanguagesForMode(getExamplesByMode('gemini-3-5-flash'), 'text');

    expect(languages.map(({ key }) => key)).toEqual(['aisdk', 'mastra', 'ts', 'python', 'curl']);
    expect(languages.find(({ key }) => key === 'mastra')?.code).toContain(
      'model: "neon/gemini-3-5-flash"'
    );
    expect(languages.find(({ key }) => key === 'curl')?.code).toContain('/v1/chat/completions');
    expect(languages.find(({ key }) => key === 'curl')?.code).not.toContain('/gemini/v1beta');
  });

  it('keeps only supported image-generation languages', () => {
    expect(
      getLanguagesForMode(getExamplesByMode('gpt-5-4'), 'image').map(({ key }) => key)
    ).toEqual(['aisdk', 'mastra', 'ts', 'python']);
  });

  it('returns no examples for an unknown model id', () => {
    const examplesByMode = getExamplesByMode('no-such-model');

    expect(examplesByMode).toEqual({ text: [], image: [] });
    expect(getLanguagesForMode(examplesByMode, 'text')).toEqual([]);
  });

  it('selects the first available mode when the requested mode is unavailable', () => {
    const imageOnly = { text: [], image: [{ key: 'ts' }] };

    expect(getAvailableModes(imageOnly)).toEqual(['image']);
    expect(getInitialMode(imageOnly)).toBe('image');
    expect(getInitialMode(imageOnly, 'text')).toBe('image');
    expect(getInitialMode(imageOnly, 'image')).toBe('image');
  });

  it('falls back to text when no code examples are available', () => {
    expect(getAvailableModes({ text: [], image: [] })).toEqual([]);
    expect(getInitialMode({ text: [], image: [] }, 'image')).toBe('text');
  });

  it('renders TypeScript/Python/cURL only for an embedding model — no AI SDK or Mastra yet', () => {
    const languages = getLanguagesForMode(
      {
        embeddings: resolveModel(modelsData, capabilities, 'gte-large-en', 'embeddings')?.examples,
      },
      'embeddings'
    );

    expect(languages.map(({ key }) => key)).toEqual(['ts', 'python', 'curl']);
    expect(languages.find(({ key }) => key === 'ts')?.code).toContain('client.embeddings.create');
    expect(languages.every(({ code }) => code.includes('encoding_format'))).toBe(true);
  });
});
