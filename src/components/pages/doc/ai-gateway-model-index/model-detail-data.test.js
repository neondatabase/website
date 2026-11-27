import { describe, expect, it } from 'vitest';

import getModelDetailPageData from './model-detail-data';

describe('getModelDetailPageData', () => {
  it('builds the markdown and table of contents from the same sections', () => {
    const { content, tableOfContents } = getModelDetailPageData({
      id: 'example-model',
      name: 'Example Model',
      labName: 'Example Lab',
      providerName: 'Example Provider',
      endpoints: ['chat/completions', 'responses'],
      inputsLabel: 'text, image',
      contextLabel: '128K',
      releaseLabel: 'Jul 2026',
      costInputLabel: '$1',
      costOutputLabel: '$2',
    });

    expect(content).toContain('## Lab\n\nExample Lab makes Example Model.');
    expect(content).toContain('## Provider\n\nExample Provider\n');
    expect(content).toContain('## Inputs\n\nText, image');
    expect(content).toContain('## Input /M\n\n$1');
    expect(content).toContain('## Output /M\n\n$2');
    expect(tableOfContents.map(({ title, id }) => ({ title, id }))).toEqual([
      { title: 'About', id: 'about' },
      { title: 'Command', id: 'command' },
      { title: 'Model ID', id: 'model-id' },
      { title: 'Lab', id: 'lab' },
      { title: 'Provider', id: 'provider' },
      { title: 'Inputs', id: 'inputs' },
      { title: 'Context', id: 'context' },
      { title: 'Released', id: 'released' },
      { title: 'Input /M', id: 'input-m' },
      { title: 'Output /M', id: 'output-m' },
    ]);
  });

  it('adds the image output price after the text output price when the model has one', () => {
    const { content, tableOfContents } = getModelDetailPageData({
      id: 'example-image-model',
      name: 'Example Image Model',
      labName: 'Example Lab',
      providerName: 'Example Provider',
      endpoints: [],
      inputsLabel: 'text, image',
      contextLabel: '66K',
      releaseLabel: 'Nov 2025',
      costInputLabel: '$2',
      costOutputLabel: '$12',
      costOutputImageLabel: '$120',
    });

    expect(content).toContain(
      '## Output /M\n\n$12\n\n## Image output /M\n\n$120. The cost per image depends on the image size; see [Image output pricing](/docs/ai-gateway/models#image-output-pricing).'
    );
    expect(tableOfContents.slice(-2).map(({ title, id }) => ({ title, id }))).toEqual([
      { title: 'Output /M', id: 'output-m' },
      { title: 'Image output /M', id: 'image-output-m' },
    ]);
  });

  // No Inputs, Context, or Output /M — those describe chat completion behavior, not a fixed
  // vector length, and there is no completion to charge for.
  it('reports Dimensions instead of the chat-shaped sections for an embedding model', () => {
    const { content, tableOfContents } = getModelDetailPageData({
      id: 'qwen3-embedding-0-6b',
      name: 'Qwen3 Embedding 0.6B',
      labName: 'Alibaba',
      providerName: 'Alibaba',
      endpoints: ['embeddings'],
      isEmbedding: true,
      dimensions: 1024,
      releaseLabel: 'Jun 2025',
      costInputLabel: '$0.02',
    });

    expect(content).toContain('## Dimensions\n\n1024');
    expect(content).not.toContain('## Inputs');
    expect(content).not.toContain('## Context');
    expect(content).not.toContain('## Output /M');
    expect(tableOfContents.map(({ title }) => title)).toEqual([
      'About',
      'Command',
      'Model ID',
      'Lab',
      'Provider',
      'Dimensions',
      'Released',
      'Input /M',
    ]);
  });

  it('reports identity, context, release and input price for a decision model', () => {
    const { content, tableOfContents } = getModelDetailPageData({
      id: 'example-decision',
      name: 'Example Decision',
      labName: 'Example',
      providerName: 'Databricks',
      endpoints: [],
      isDecision: true,
      contextLabel: '131K',
      releaseLabel: 'Sep 2026',
      costInputLabel: '$0.10',
    });

    expect(content).toContain('System One decision model');
    expect(content).toContain('## Input /M\n\n$0.10');
    expect(content).not.toContain('## Dimensions');
    expect(content).toContain('## Context\n\n131K');
    expect(tableOfContents.map(({ title }) => title)).toEqual([
      'About',
      'Command',
      'Model ID',
      'Lab',
      'Provider',
      'Context',
      'Released',
      'Input /M',
    ]);
  });
});
