import { describe, expect, it } from 'vitest';

import getModelDetailPageData from './model-detail-data';

describe('getModelDetailPageData', () => {
  it('builds the markdown and table of contents from the same sections', () => {
    const { content, tableOfContents } = getModelDetailPageData({
      id: 'example-model',
      name: 'Example Model',
      providerName: 'Example Provider',
      endpoints: ['chat/completions', 'responses'],
      inputsLabel: 'text, image',
      contextLabel: '128K',
      releaseLabel: 'Jul 2026',
      costInputLabel: '$1',
      costOutputLabel: '$2',
    });

    expect(content).toContain('## Provider\n\nExample Provider provides Example Model.');
    expect(content).toContain('## Inputs\n\nText, image');
    expect(content).toContain('## Input /M\n\n$1');
    expect(content).toContain('## Output /M\n\n$2');
    expect(tableOfContents.map(({ title, id }) => ({ title, id }))).toEqual([
      { title: 'About', id: 'about' },
      { title: 'Command', id: 'command' },
      { title: 'Model ID', id: 'model-id' },
      { title: 'Provider', id: 'provider' },
      { title: 'Inputs', id: 'inputs' },
      { title: 'Context', id: 'context' },
      { title: 'Released', id: 'released' },
      { title: 'Input /M', id: 'input-m' },
      { title: 'Output /M', id: 'output-m' },
    ]);
  });
});
