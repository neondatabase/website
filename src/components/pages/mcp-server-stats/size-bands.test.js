import { describe, expect, it } from 'vitest';

import { buildCustomerSize } from './size-bands';

const rows = [
  ['other_paying', 18, 11],
  ['largest_1', 45, 41.2],
].flatMap(([band, mcp, cli]) => [
  { band, surface: 'cli', share: cli },
  { band, surface: 'mcp', share: mcp },
]);

describe('buildCustomerSize', () => {
  it('puts the largest 1% first, MCP before the CLI', () => {
    const bands = buildCustomerSize(rows);

    expect(bands.map(({ label }) => label)).toEqual(['Largest 1%', 'Other customers']);
    expect(bands[0].surfaces.map(({ label, share }) => [label, share])).toEqual([
      ['MCP server', 45],
      ['Neon CLI', 41.2],
    ]);
  });

  it('rejects an unknown or missing value', () => {
    expect(() =>
      buildCustomerSize([...rows, { band: 'top_10', surface: 'mcp', share: 1 }])
    ).toThrow('Unknown customer size value "top_10:mcp"');
    expect(() =>
      buildCustomerSize(
        rows.filter(({ band, surface }) => !(band === 'other_paying' && surface === 'cli'))
      )
    ).toThrow('Missing customer size value "other_paying:cli"');
  });
});
