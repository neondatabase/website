import { GROUPED_CLIENTS, getClient } from './clients';

const round1 = (value) => Math.round(value * 10) / 10;

// Rows are { weekStart, key, share }, where share is a percent of the week's
// active users. A user counts under every key they used, so a week can total
// more than 100. A week without a row for a key is unpublished, not zero: the
// publisher drops clients below its user floor.
function indexWeeks(rows) {
  const weeks = [...new Set(rows.map((row) => row.weekStart))].sort();
  const byKey = new Map();
  rows.forEach(({ weekStart, key, share }) => {
    if (!byKey.has(key)) byKey.set(key, new Map());
    byKey.get(key).set(weekStart, share);
  });
  const shareOf = (key, week) => byKey.get(key)?.get(week) ?? null;
  return { weeks, keys: [...byKey.keys()], shareOf };
}

function latestShares({ weeks, keys, shareOf }) {
  const latestWeek = weeks[weeks.length - 1];
  const previousWeek = weeks[weeks.length - 2] ?? null;
  const latest = keys
    .filter((key) => shareOf(key, latestWeek) !== null)
    .map((key) => {
      const share = shareOf(key, latestWeek);
      const previous = previousWeek ? shareOf(key, previousWeek) : null;
      return { key, share, change: previous === null ? null : round1(share - previous) };
    });
  return { latestWeek, latest };
}

export function buildClientShares(rows, { chartMinShare = 5 } = {}) {
  const index = indexWeeks(rows);
  const { latestWeek, latest } = latestShares(index);

  const ranked = latest
    .map((entry) => ({
      ...entry,
      ...getClient(entry.key),
      isGrouped: GROUPED_CLIENTS.has(entry.key),
    }))
    .sort((a, b) => {
      const groupedA = GROUPED_CLIENTS.has(a.key);
      const groupedB = GROUPED_CLIENTS.has(b.key);
      if (groupedA !== groupedB) return groupedA ? 1 : -1;
      return b.share - a.share;
    });

  const series = index.keys
    .filter(
      (key) =>
        !GROUPED_CLIENTS.has(key) &&
        index.weeks.some((week) => (index.shareOf(key, week) ?? 0) >= chartMinShare)
    )
    .sort((a, b) => (index.shareOf(b, latestWeek) ?? 0) - (index.shareOf(a, latestWeek) ?? 0))
    .map((key) => ({
      key,
      ...getClient(key),
      data: index.weeks.map((week) => index.shareOf(key, week)),
    }));

  return { weeks: index.weeks, latestWeek, ranked, series };
}

export function buildToolShares(rows, { limit = 10 } = {}) {
  const { latestWeek, latest } = latestShares(indexWeeks(rows));
  return {
    latestWeek,
    ranked: latest.sort((a, b) => b.share - a.share).slice(0, limit),
  };
}
