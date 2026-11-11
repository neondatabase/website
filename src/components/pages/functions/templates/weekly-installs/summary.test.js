import { describe, expect, it } from 'vitest';

import { formatWeekRange, sparklinePaths, summarizeWeeklyInstalls } from './summary';

describe('summarizeWeeklyInstalls', () => {
  it('has nothing to show before the first published week', () => {
    expect(summarizeWeeklyInstalls([])).toBeNull();
  });

  it('shows the latest week, and totals every week since the first', () => {
    expect(
      summarizeWeeklyInstalls([
        { weekStart: '2026-11-16', installs: 0 },
        { weekStart: '2026-11-23', installs: 4 },
        { weekStart: '2026-11-30', installs: 1 },
      ])
    ).toEqual({
      latest: '1',
      latestWeek: 'Nov 30–Dec 6',
      total: '5',
      since: 'Nov 16',
      values: [0, 4, 1],
    });
  });

  it('abbreviates a large total', () => {
    const rows = Array.from({ length: 20 }, (_, index) => ({
      weekStart: `2027-01-${String(index + 1).padStart(2, '0')}`,
      installs: 535,
    }));
    expect(summarizeWeeklyInstalls(rows)).toMatchObject({ latest: '535', total: '10.7K' });
  });
});

describe('formatWeekRange', () => {
  it('names the month once when the week stays in it', () => {
    expect(formatWeekRange('2026-11-16')).toBe('Nov 16–22');
  });
});

describe('sparklinePaths', () => {
  const box = { width: 100, height: 40, inset: 4 };

  it('draws a flat line along the bottom when every week is zero', () => {
    const { line, last } = sparklinePaths([0, 0, 0], box);
    expect(line).toBe('M4.0 36.0 L50.0 36.0 L96.0 36.0');
    expect(last).toEqual({ x: 96, y: 36 });
  });

  it('puts the busiest week at the top of the box', () => {
    const { line } = sparklinePaths([2, 8, 4], box);
    expect(line).toBe('M4.0 28.0 L50.0 4.0 L96.0 20.0');
  });
});
