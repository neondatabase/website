import fs from 'fs';
import path from 'path';

import { describe, it, expect } from 'vitest';

import capabilities from './capabilities.json';

// The models page tells readers which models need array handling on chat completions.
// It is prose, so nothing regenerates it when capabilities.json changes.
const modelsDoc = fs.readFileSync(
  path.resolve(__dirname, '../../../content/docs/ai-gateway/models.md'),
  'utf-8'
);

const admonition = () => {
  const start = modelsDoc.indexOf('title="Content shape varies by model"');
  const end = modelsDoc.indexOf('</Admonition>', start);
  expect(start).toBeGreaterThan(-1);
  return modelsDoc.slice(start, end);
};

describe('"Content shape varies by model" in the AI Gateway models doc', () => {
  it('names exactly the models measured as array-content', () => {
    const servedIds = new Set(capabilities.models.map((m) => m.id));
    const named = [...admonition().matchAll(/`([a-z0-9-]+)`/g)]
      .map(([, id]) => id)
      .filter((id) => servedIds.has(id));
    const measured = capabilities.models.filter((m) => m.chat === 'array-content').map((m) => m.id);

    expect([...new Set(named)].sort()).toEqual(measured.sort());
  });

  it('points at the provider and the native endpoints', () => {
    const text = admonition();

    expect(text).toContain('@neon/ai-sdk-provider');
    expect(text).toContain('/docs/ai-gateway/anthropic-messages');
    expect(text).toContain('/docs/ai-gateway/gemini');
  });
});
