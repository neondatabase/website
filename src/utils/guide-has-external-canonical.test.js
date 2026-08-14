import { describe, expect, it } from 'vitest';

import { guideHasExternalCanonical } from './guide-has-external-canonical';

describe('guideHasExternalCanonical', () => {
  it('is true for the Sentry Functions guide', () => {
    expect(guideHasExternalCanonical('/guides/sentry-neon-functions')).toBe(true);
  });

  it('is false for a guide without canonical', () => {
    expect(guideHasExternalCanonical('/guides/sentry-neon-mcp')).toBe(false);
  });

  it('is false for non-guide paths', () => {
    expect(guideHasExternalCanonical('/docs/introduction')).toBe(false);
    expect(guideHasExternalCanonical('/guides')).toBe(false);
  });
});
