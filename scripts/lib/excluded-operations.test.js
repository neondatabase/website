import { describe, it, expect } from 'vitest';

import { EXCLUDED_OPERATION_IDS, withoutExcludedOperations } from './excluded-operations.mjs';

describe('EXCLUDED_OPERATION_IDS', () => {
  it('is currently empty: no operations are hidden from the API reference', () => {
    // The branch-trigger operations that used to live here were un-hidden so
    // the API reference documents them alongside the `neon triggers` command.
    expect([...EXCLUDED_OPERATION_IDS]).toEqual([]);
  });
});

describe('withoutExcludedOperations', () => {
  it('returns the ids unchanged while the exclusion set is empty, preserving order', () => {
    const input = [
      'listProjects',
      'createProjectBranchTrigger',
      'getProject',
      'listProjectBranchTriggers',
    ];
    expect(withoutExcludedOperations(input)).toEqual(input);
  });

  it('accepts any iterable (e.g. a Set) and returns an array', () => {
    const result = withoutExcludedOperations(new Set(['getProject', 'getProjectBranchTrigger']));
    expect(result).toEqual(['getProject', 'getProjectBranchTrigger']);
  });
});
