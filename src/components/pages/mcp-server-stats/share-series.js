import { GROUPED_CLIENTS, getClient } from './clients';

const round1 = (value) => Math.round(value * 10) / 10;

// Rows are { weekStart, key, share }, where share is a percent of the week's
// active users. A user counts under every key they used, so a week can total
// more than 100.
function indexWeeks(rows) {
  const weeks = [...new Set(rows.map((row) => row.weekStart))].sort();
  const byKey = new Map();
  rows.forEach(({ weekStart, key, share }) => {
    if (!byKey.has(key)) byKey.set(key, new Map());
    byKey.get(key).set(weekStart, share);
  });
  const shareOf = (key, week) => byKey.get(key)?.get(week) ?? 0;
  return { weeks, keys: [...byKey.keys()], shareOf };
}

function latestShares({ weeks, keys, shareOf }) {
  const latestWeek = weeks[weeks.length - 1];
  const previousWeek = weeks[weeks.length - 2] ?? null;
  const latest = keys
    .filter((key) => shareOf(key, latestWeek) > 0)
    .map((key) => ({
      key,
      share: shareOf(key, latestWeek),
      change: previousWeek ? round1(shareOf(key, latestWeek) - shareOf(key, previousWeek)) : null,
    }));
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
        index.weeks.some((week) => index.shareOf(key, week) >= chartMinShare)
    )
    .sort((a, b) => index.shareOf(b, latestWeek) - index.shareOf(a, latestWeek))
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
