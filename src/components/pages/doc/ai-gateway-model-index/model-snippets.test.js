import { describe, expect, it } from 'vitest';

import { getLanguagesForModel } from './model-snippets';
import snippets from './snippets.json';

describe('getLanguagesForModel', () => {
  it('keeps all text languages for Chat Completions models', () => {
    expect(
      getLanguagesForModel({ isResponsesOnly: false }, 'text', snippets).map(({ key }) => key)
    ).toEqual(['aisdk', 'mastra', 'ts', 'python', 'curl']);
  });

  it('omits Chat Completions languages for Responses-only models', () => {
    const languages = getLanguagesForModel({ isResponsesOnly: true }, 'text', snippets);

    expect(languages.map(({ key }) => key)).toEqual(['aisdk']);
    expect(languages.every(({ code }) => !code.includes('chat.completions'))).toBe(true);
    expect(languages.every(({ code }) => !code.includes('/v1/chat/completions'))).toBe(true);
  });

  it('keeps image-generation languages for Responses-only models', () => {
    expect(
      getLanguagesForModel({ isResponsesOnly: true }, 'image', snippets).map(({ key }) => key)
    ).toEqual(['aisdk', 'ts', 'python']);
  });
});
