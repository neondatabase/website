import { describe, expect, it } from 'vitest';

import { buildClientShares, buildToolShares, pointRadiusAt } from './share-series';

const week = (weekStart, shares) =>
  Object.entries(shares).map(([key, share]) => ({ weekStart, key, share }));

const clients = [
  ...week('2026-10-19', { codex: 24, cursor: 10, replit: 1.2, 'custom-code': 2, other: 5 }),
  ...week('2026-10-26', { codex: 25.8, cursor: 9.5, replit: 1.4, 'custom-code': 2.4, other: 4.6 }),
];

describe('buildClientShares', () => {
  it('ranks named clients first and the grouped buckets last', () => {
    const { latestWeek, ranked } = buildClientShares(clients);

    expect(latestWeek).toBe('2026-10-26');
    expect(ranked.map(({ key, share, change }) => [key, share, change])).toEqual([
      ['codex', 25.8, 1.8],
      ['cursor', 9.5, -0.5],
      ['replit', 1.4, 0.2],
      ['other', 4.6, -0.4],
      ['custom-code', 2.4, 0.4],
    ]);
  });

  it('charts named clients that reached the minimum share', () => {
    const { series } = buildClientShares(clients);

    expect(series.map(({ key, data }) => [key, data])).toEqual([
      ['codex', [24, 25.8]],
      ['cursor', [10, 9.5]],
    ]);
  });

  it('keeps a week without a published row as a gap, not zero', () => {
    const rows = [
      ...week('2026-10-19', { codex: 24, other: 6 }),
      ...week('2026-10-26', { codex: 25.8, cursor: 6, other: 4.6 }),
    ];
    const { ranked, series } = buildClientShares(rows);

    expect(ranked.find(({ key }) => key === 'cursor').change).toBeNull();
    expect(series.find(({ key }) => key === 'cursor').data).toEqual([null, 6]);
  });

  it('rejects a client the page has no label for', () => {
    expect(() => buildClientShares(week('2026-10-26', { muse: 6 }))).toThrow(
      'No label for MCP client "muse"'
    );
  });
});

describe('buildToolShares', () => {
  it('lists the most used tools last week with the change from the week before', () => {
    const tools = [
      ...week('2026-10-19', { run_sql: 80, create_branch: 22, list_projects: 70 }),
      ...week('2026-10-26', { run_sql: 81.8, create_branch: 23.6, list_projects: 71.5 }),
    ];

    expect(buildToolShares(tools, { limit: 2 }).ranked).toEqual([
      { key: 'run_sql', share: 81.8, change: 1.8 },
      { key: 'list_projects', share: 71.5, change: 1.5 },
    ]);
  });
});

describe('pointRadiusAt', () => {
  it('shows a point only for a value with gaps on both sides', () => {
    const values = [null, 6, null, 7, 8];

    expect(values.map((_, index) => pointRadiusAt(values, index))).toEqual([0, 3, 0, 0, 0]);
  });
});
