import { describe, expect, it } from 'vitest';

import capabilities from '../../../../app/models/capabilities.json';
import modelsData from '../../../../app/models.json/data.json';

import { buildRows } from './model-rows';

const rows = buildRows(modelsData.neon, capabilities);

describe('AI Gateway model rows', () => {
  it('derives image support and endpoints from measured capabilities', () => {
    const row = rows.find(({ id }) => id === 'gpt-5-4');

    expect(row.isImageCapable).toBe(true);
    expect(row.endpoints).toEqual(['chat/completions', 'openai/responses']);
  });

  it('uses only the measured Responses endpoint for Codex models', () => {
    const row = rows.find(({ id }) => id === 'gpt-5-3-codex');

    expect(row.endpoints).toEqual(['openai/responses']);
  });

  it('does not advertise endpoints for models without measured capabilities', () => {
    const row = rows.find(({ id }) => id === 'gpt-5-2-codex');

    expect(row.hasMeasuredCapabilities).toBe(false);
    expect(row.isImageCapable).toBe(false);
    expect(row.endpoints).toEqual([]);
  });
});
