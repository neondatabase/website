import { describe, expect, it } from 'vitest';

import { formatWeekLabel, sparklinePaths, summarizeWeeklyInstalls } from './summary';

describe('summarizeWeeklyInstalls', () => {
  it('has nothing to show before the first published week', () => {
    expect(summarizeWeeklyInstalls([])).toBeNull();
  });

  it('has nothing to show until someone installs the template', () => {
    expect(
      summarizeWeeklyInstalls([
        { weekStart: '2026-11-16', installs: 0 },
        { weekStart: '2026-11-23', installs: 0 },
      ])
    ).toBeNull();
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
      total: '5',
      since: 'Nov 16, 2026',
      values: [0, 4, 1],
      weeks: [
        { installs: '0', label: 'Week of Nov 16, 2026' },
        { installs: '4', label: 'Week of Nov 23, 2026' },
        { installs: '1', label: 'Week of Nov 30, 2026' },
      ],
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

describe('formatWeekLabel', () => {
  it('pads single-digit days so every label has the same length', () => {
    expect(formatWeekLabel('2026-11-02')).toBe('Week of Nov 02, 2026');
    expect(formatWeekLabel('2026-11-02')).toHaveLength(formatWeekLabel('2026-11-23').length);
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
