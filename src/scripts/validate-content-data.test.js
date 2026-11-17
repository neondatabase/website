import { createRequire } from 'module';

import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);
const { toPlainText, validateContentData } = require('../../scripts/validate-content-data.js');

describe('content data schema', () => {
  it('validates content/data YAML files', () => {
    const errors = validateContentData();
    expect(errors).toEqual([]);
  });
});

describe('toPlainText', () => {
  it('keeps link text and drops link targets, emphasis, and tags', () => {
    expect(
      toPlainText('**Vapi uses** [autoscaling](https://neon.com/docs) and <cite>`pooling`</cite>.')
    ).toBe('Vapi uses autoscaling and pooling.');
  });
});
