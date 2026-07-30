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

  it('uses model-specific Gemini examples and install commands', () => {
    const languages = getLanguagesForMode(getExamplesByMode('gemini-3-5-flash'), 'text');

    expect(languages.map(({ key }) => key)).toEqual(['aisdk', 'mastra', 'curl']);
    expect(languages.find(({ key }) => key === 'mastra')?.install).toBe(
      'npm i @mastra/core ai @neondatabase/ai-sdk-provider'
    );
    expect(languages.find(({ key }) => key === 'curl')?.code).toContain(
      '/ai-gateway/gemini/v1beta/models/gemini-3-5-flash:generateContent'
    );
  });

  it('keeps only supported image-generation languages', () => {
    expect(
      getLanguagesForMode(getExamplesByMode('gpt-5-4'), 'image').map(({ key }) => key)
    ).toEqual(['aisdk', 'ts', 'python']);
  });

  it('returns no examples for catalogued models without measured capabilities', () => {
    const examplesByMode = getExamplesByMode('gpt-5-2-codex');

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
});
