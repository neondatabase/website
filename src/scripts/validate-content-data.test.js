import { createRequire } from 'module';

import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);
const { validateContentData } = require('../../scripts/validate-content-data.js');

describe('content data schema', () => {
  it('validates content/data YAML files', () => {
    const errors = validateContentData();
    expect(errors).toEqual([]);
  });
});
