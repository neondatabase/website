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

  // The catalog is allowed to run ahead of what a branch is entitled to serve, so a
  // model can be listed with no measured capabilities. Built from a synthetic catalog
  // because the real one currently has no such model.
  it('does not advertise endpoints for models without measured capabilities', () => {
    const [row] = buildRows(
      { models: { 'unprobed-model': { id: 'unprobed-model', name: 'Unprobed Model' } } },
      { models: [] }
    );

    expect(row.hasMeasuredCapabilities).toBe(false);
    expect(row.isImageCapable).toBe(false);
    expect(row.endpoints).toEqual([]);
  });

  it('labels Grok as xAI and includes the Responses endpoint', () => {
    const row = rows.find(({ id }) => id === 'grok-4-6');

    expect(row.provider).toBe('xai');
    expect(row.providerName).toBe('xAI');
    expect(row.endpoints).toEqual(['chat/completions', 'openai/responses']);
  });
});
