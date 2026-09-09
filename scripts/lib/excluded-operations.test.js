import { describe, it, expect } from 'vitest';

import { EXCLUDED_OPERATION_IDS, withoutExcludedOperations } from './excluded-operations.mjs';

describe('EXCLUDED_OPERATION_IDS', () => {
  it('lists exactly the five branch-trigger operations', () => {
    expect([...EXCLUDED_OPERATION_IDS].sort()).toEqual([
      'createProjectBranchTrigger',
      'deleteProjectBranchTrigger',
      'getProjectBranchTrigger',
      'listProjectBranchTriggers',
      'updateProjectBranchTrigger',
    ]);
  });
});

describe('withoutExcludedOperations', () => {
  it('removes excluded ids and keeps the rest, preserving input order', () => {
    const input = [
      'listProjects',
      'createProjectBranchTrigger',
      'getProject',
      'listProjectBranchTriggers',
    ];
    expect(withoutExcludedOperations(input)).toEqual(['listProjects', 'getProject']);
  });

  it('accepts any iterable (e.g. a Set) and returns an array', () => {
    const result = withoutExcludedOperations(new Set(['getProject', 'getProjectBranchTrigger']));
    expect(result).toEqual(['getProject']);
  });
});
