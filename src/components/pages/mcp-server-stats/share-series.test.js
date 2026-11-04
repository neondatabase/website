import { describe, expect, it } from 'vitest';

import { OTHER_COLOR } from './clients';
import { buildShareSeries } from './share-series';

const week = (weekStart, shares) =>
  Object.entries(shares).map(([client, share]) => ({ weekStart, client, share }));

const rows = [
  ...week('2026-10-12', { chatgpt: 46, cursor: 32, grok: 0.5, other: 21.5 }),
  ...week('2026-10-19', { chatgpt: 44, cursor: 33, grok: 0.6, other: 22.4 }),
  ...week('2026-10-26', { chatgpt: 40, cursor: 35, grok: 0.7, manus: 0, other: 24.3 }),
];

describe('buildShareSeries', () => {
  it('folds clients that never reach 1% into Other for the chart', () => {
    const { chartSeries } = buildShareSeries(rows);

    expect(chartSeries.map((series) => series.client)).toEqual(['chatgpt', 'cursor', 'other']);
    expect(chartSeries.at(-1).data).toEqual([22, 23, 25]);
  });

  it('ranks clients with a share last week, with the change from the week before', () => {
    const { latestWeek, previousWeek, latest } = buildShareSeries(rows);

    expect(latestWeek).toBe('2026-10-26');
    expect(previousWeek).toBe('2026-10-19');
    expect(latest.map(({ client, share, change }) => [client, share, change])).toEqual([
      ['chatgpt', 40, -4],
      ['cursor', 35, 2],
      ['grok', 0.7, 0.1],
      ['other', 24.3, 1.9],
    ]);
    expect(latest.find(({ client }) => client === 'grok').color).toBe(OTHER_COLOR);
  });

  it('rejects a client the page has no label for', () => {
    expect(() => buildShareSeries(week('2026-10-26', { muse: 100 }))).toThrow(
      'No label for MCP client "muse"'
    );
  });
});
