import { describe, expect, it } from 'vitest';

import { buildAccessSplit } from './access';

const rows = [
  { dimension: 'access', value: 'read_only', share: 6.7 },
  { dimension: 'sign_in', value: 'api_key', share: 18 },
  { dimension: 'access', value: 'pinned_role', share: 0.5 },
  { dimension: 'sign_in', value: 'oauth', share: 82.5 },
  { dimension: 'access', value: 'full_access', share: 92.1 },
  { dimension: 'access', value: 'limited_categories', share: 0.8 },
  { dimension: 'access', value: 'project_scoped', share: 3.6 },
];

describe('buildAccessSplit', () => {
  it('labels both dimensions in a fixed order', () => {
    const { signIn, access } = buildAccessSplit(rows);

    expect(signIn.map(({ label, share }) => [label, share])).toEqual([
      ['OAuth', 82.5],
      ['API key', 18],
    ]);
    expect(access.map(({ label }) => label)).toEqual([
      'Full access',
      'Read-only',
      'One project',
      'Limited tool categories',
      'Pinned Postgres role',
    ]);
  });

  it('rejects an unknown or missing value', () => {
    expect(() =>
      buildAccessSplit([...rows, { dimension: 'access', value: 'yolo', share: 1 }])
    ).toThrow('Unknown MCP access value "access:yolo"');
    expect(() => buildAccessSplit(rows.filter(({ value }) => value !== 'oauth'))).toThrow(
      'Missing MCP access value "sign_in:oauth"'
    );
  });
});
