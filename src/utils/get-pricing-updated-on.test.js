import { describe, expect, it } from 'vitest';

import getPricingUpdatedOn from './get-pricing-updated-on';

describe('getPricingUpdatedOn', () => {
  it('reads the date from public/pricing.md', () => {
    expect(getPricingUpdatedOn()).toMatch(/^\d{4}-\d{2}-\d{2}T00:00:00\.000Z$/);
  });

  it('parses the Last updated line', () => {
    expect(getPricingUpdatedOn('# Pricing\n\nLast updated: 2026-10-31\n')).toBe(
      '2026-10-31T00:00:00.000Z'
    );
  });

  it('throws when the line is missing', () => {
    expect(() => getPricingUpdatedOn('# Pricing\n')).toThrow('Last updated');
  });
});
