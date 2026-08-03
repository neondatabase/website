import { describe, it, expect } from 'vitest';

import { findMissingSpecTags } from './tag-config.mjs';

describe('findMissingSpecTags', () => {
  const specWith = (tagsByOp) => ({
    paths: Object.fromEntries(
      Object.entries(tagsByOp).map(([opId, tag], i) => [
        `/path-${i}`,
        { get: { operationId: opId, tags: tag ? [tag] : [] } },
      ])
    ),
  });

  it('returns spec tags with no matching config entry', () => {
    const cfg = { tags: [{ slug: 'alpha', specName: 'alpha' }] };
    const spec = specWith({ opOne: 'alpha', opTwo: 'Bravo' });
    expect(findMissingSpecTags(cfg, spec)).toEqual(['Bravo']);
  });

  it('returns nothing when every spec tag is configured', () => {
    const cfg = {
      tags: [
        { slug: 'alpha', specName: 'alpha' },
        { slug: 'bravo', specName: 'bravo' },
      ],
    };
    // 'Bravo' → toTagSlug → 'bravo' → matches config slug.
    const spec = specWith({ opOne: 'alpha', opTwo: 'Bravo' });
    expect(findMissingSpecTags(cfg, spec)).toEqual([]);
  });

  it('respects operationOverrides (op reassigned to a configured tag)', () => {
    const cfg = {
      tags: [{ slug: 'alpha', specName: 'alpha' }],
      operationOverrides: { opTwo: 'alpha' },
    };
    const spec = specWith({ opTwo: 'Bravo' });
    expect(findMissingSpecTags(cfg, spec)).toEqual([]);
  });

  it('sorts and de-dupes multiple missing tags', () => {
    const cfg = { tags: [] };
    const spec = specWith({ opOne: 'Zed', opTwo: 'Alpha', opThree: 'Alpha' });
    expect(findMissingSpecTags(cfg, spec)).toEqual(['Alpha', 'Zed']);
  });

  it('handles an empty or pathless spec', () => {
    const cfg = { tags: [{ slug: 'alpha', specName: 'alpha' }] };
    expect(findMissingSpecTags(cfg, {})).toEqual([]);
    expect(findMissingSpecTags(cfg, null)).toEqual([]);
  });
});
