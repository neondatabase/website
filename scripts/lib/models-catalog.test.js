import fs from 'fs';
import path from 'path';

import { describe, expect, it } from 'vitest';

import { classifyDrift, validateCatalog } from './models-catalog.mjs';

const CATALOG = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../../src/app/models.json/data.json'), 'utf-8')
);

const model = (over = {}) => ({
  id: 'a',
  name: 'A',
  provider: 'openai',
  family: 'gpt',
  reasoning: false,
  ...over,
});

const catalog = (models) => ({
  neon: { id: 'neon', name: 'Neon', api: 'x', env: [], doc: 'x', models },
});

describe('classifyDrift', () => {
  it('reports no drift when the mirror matches', () => {
    const both = { a: model() };
    const drift = classifyDrift(both, { a: model() });

    expect(drift.inSync).toBe(true);
    expect(drift.hasSyncDebt).toBe(false);
    expect(drift.hasFault).toBe(false);
  });

  // The case this whole change exists for: we publish a model, the upstream PR
  // is still open. That is an in-flight change, not a fault.
  it('treats a model we publish and models.dev lacks as sync debt, not a fault', () => {
    const drift = classifyDrift({ a: model(), b: model({ id: 'b', name: 'B' }) }, { a: model() });

    expect(drift.awaitingUpstream).toEqual(['b']);
    expect(drift.hasSyncDebt).toBe(true);
    expect(drift.hasFault).toBe(false);
  });

  it('treats a model models.dev lists and we do not as a fault', () => {
    const drift = classifyDrift({ a: model() }, { a: model(), z: model({ id: 'z', name: 'Z' }) });

    expect(drift.missingFromWebsite).toEqual(['z']);
    expect(drift.hasFault).toBe(true);
  });

  // Direction is not inferable from a symmetric comparison — we may have
  // corrected a price, or the entry may have been edited upstream — so a field
  // difference is surfaced for review rather than failing the run.
  it('reports a differing field as sync debt and names both sides', () => {
    const drift = classifyDrift(
      { a: model({ cost: { input: 30 } }) },
      { a: model({ cost: { input: 3 } }) }
    );

    expect(drift.hasSyncDebt).toBe(true);
    expect(drift.hasFault).toBe(false);
    expect(drift.fieldDrift).toEqual([
      { id: 'a', fields: [{ field: 'cost', website: { input: 30 }, modelsDev: { input: 3 } }] },
    ]);
  });

  it('ignores fields outside the compared set', () => {
    const drift = classifyDrift(
      { a: model({ description: 'ours' }) },
      { a: model({ description: 'theirs', benchmarks: [] }) }
    );

    expect(drift.inSync).toBe(true);
  });

  it('ignores key order within a compared field', () => {
    const drift = classifyDrift(
      { a: model({ cost: { input: 1, output: 2 } }) },
      { a: model({ cost: { output: 2, input: 1 } }) }
    );

    expect(drift.inSync).toBe(true);
  });

  it('separates a fault from sync debt when both are present', () => {
    const drift = classifyDrift(
      { a: model(), b: model({ id: 'b', name: 'B' }) },
      { a: model(), z: model({ id: 'z', name: 'Z' }) }
    );

    expect(drift.awaitingUpstream).toEqual(['b']);
    expect(drift.missingFromWebsite).toEqual(['z']);
    expect(drift.hasFault).toBe(true);
  });
});

describe('validateCatalog', () => {
  it('accepts the catalog we actually publish', () => {
    expect(validateCatalog(CATALOG)).toEqual([]);
  });

  it('rejects a map key that disagrees with the model id', () => {
    const errors = validateCatalog(catalog({ 'gpt-5': model({ id: 'gpt-5-mini' }) }));

    expect(errors).toEqual([expect.stringContaining('expected gpt-5')]);
  });

  it.each([
    ['name', { name: '' }],
    ['provider', { provider: undefined }],
    ['family', { family: 42 }],
  ])('rejects a missing or malformed %s', (field, over) => {
    const errors = validateCatalog(catalog({ a: model(over) }));

    expect(errors).toEqual([expect.stringContaining(`a.${field}`)]);
  });

  it('rejects a non-boolean capability flag', () => {
    const errors = validateCatalog(catalog({ a: model({ tool_call: 'yes' }) }));

    expect(errors).toEqual([expect.stringContaining('a.tool_call must be a boolean')]);
  });

  it('rejects a malformed date', () => {
    const errors = validateCatalog(catalog({ a: model({ release_date: '07/2026' }) }));

    expect(errors).toEqual([expect.stringContaining('a.release_date must be YYYY-MM-DD')]);
  });

  it('rejects a non-positive limit', () => {
    const errors = validateCatalog(catalog({ a: model({ limit: { context: 0 } }) }));

    expect(errors).toEqual([expect.stringContaining('a.limit.context must be a positive integer')]);
  });

  it('rejects a negative or non-numeric price', () => {
    const errors = validateCatalog(catalog({ a: model({ cost: { input: -1, output: 'free' } }) }));

    expect(errors).toHaveLength(2);
    expect(errors.join(' ')).toContain('a.cost.input');
    expect(errors.join(' ')).toContain('a.cost.output');
  });

  it('validates prices nested in a context tier', () => {
    const errors = validateCatalog(
      catalog({
        a: model({
          cost: { input: 1, tiers: [{ tier: { type: 'context', size: 272000 }, input: -2 }] },
        }),
      })
    );

    expect(errors).toEqual([expect.stringContaining('a.cost.tiers[0].input')]);
  });

  // The tier descriptor sits alongside the rates but is metadata, so it must not
  // be rate-checked — `size` is a token count, not a price.
  it('accepts a well-formed tier without complaining about its descriptor', () => {
    const errors = validateCatalog(
      catalog({
        a: model({
          cost: { input: 1, tiers: [{ tier: { type: 'context', size: 272000 }, input: 2 }] },
        }),
      })
    );

    expect(errors).toEqual([]);
  });

  it('rejects reasoning_options on a model that is not marked reasoning', () => {
    const errors = validateCatalog(
      catalog({ a: model({ reasoning: false, reasoning_options: [{ type: 'toggle' }] }) })
    );

    expect(errors).toEqual([expect.stringContaining('a.reasoning is not true')]);
  });

  it('rejects an effort option with no values', () => {
    const errors = validateCatalog(
      catalog({ a: model({ reasoning: true, reasoning_options: [{ type: 'effort' }] }) })
    );

    expect(errors).toEqual([expect.stringContaining('effort option without `values`')]);
  });

  // Real entries omit these, and demanding them would force a placeholder price
  // or date, which is worse than an absent field.
  it('accepts a model with no cost, knowledge or structured_output', () => {
    expect(validateCatalog(catalog({ a: model() }))).toEqual([]);
  });

  it('rejects a catalog with no models rather than passing vacuously', () => {
    expect(validateCatalog(catalog({}))).toEqual([expect.stringContaining('empty')]);
    expect(validateCatalog({})).toEqual([expect.stringContaining('missing the top-level')]);
  });
});
