import { describe, it, expect } from 'vitest';

import { compareOpsForDisplay } from './api-ref.mjs';

describe('compareOpsForDisplay', () => {
  it('sorts by summary A->Z', () => {
    const ops = [
      { summary: 'List projects' },
      { summary: 'Create project' },
      { summary: 'Delete project' },
    ];
    expect([...ops].sort(compareOpsForDisplay).map((o) => o.summary)).toEqual([
      'Create project',
      'Delete project',
      'List projects',
    ]);
  });

  it('sinks deprecated ops to the bottom regardless of title', () => {
    const ops = [
      { summary: 'Add thing', deprecated: true },
      { summary: 'Zap thing' },
      { summary: 'Begin thing' },
    ];
    expect([...ops].sort(compareOpsForDisplay).map((o) => o.summary)).toEqual([
      'Begin thing',
      'Zap thing',
      'Add thing',
    ]);
  });
});
