import { describe, expect, it } from 'vitest';

import { buildCustomerSize } from './size-bands';

const rows = [
  ['largest_1', 45, 41.2],
  ['free', 7.3, 4.8],
  ['next_9', 31.6, 25.8],
  ['smaller_50', 14.4, 8],
  ['next_40', 19.2, 11.5],
].flatMap(([band, mcp, cli]) => [
  { band, surface: 'cli', share: cli },
  { band, surface: 'mcp', share: mcp },
]);

describe('buildCustomerSize', () => {
  it('orders bands from free to the largest 1%, MCP before the CLI', () => {
    const bands = buildCustomerSize(rows);

    expect(bands.map(({ label }) => label)).toEqual([
      'Free',
      'Paying, smaller 50%',
      'Next 40%',
      'Next 9%',
      'Largest 1%',
    ]);
    expect(bands[4].surfaces.map(({ label, share }) => [label, share])).toEqual([
      ['MCP server', 45],
      ['Neon CLI', 41.2],
    ]);
  });

  it('rejects an unknown or missing value', () => {
    expect(() =>
      buildCustomerSize([...rows, { band: 'top_10', surface: 'mcp', share: 1 }])
    ).toThrow('Unknown customer size value "top_10:mcp"');
    expect(() =>
      buildCustomerSize(rows.filter(({ band, surface }) => !(band === 'free' && surface === 'cli')))
    ).toThrow('Missing customer size value "free:cli"');
  });
});
