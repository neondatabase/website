import { CHART_COLORS, CHART_MIN_SHARE, OTHER_COLOR, getClientLabel } from './clients';

const round1 = (value) => Math.round(value * 10) / 10;

export function buildShareSeries(rows) {
  const weeks = [...new Set(rows.map((row) => row.weekStart))].sort();
  const byClient = new Map();
  rows.forEach(({ weekStart, client, share }) => {
    if (!byClient.has(client)) byClient.set(client, new Map());
    byClient.get(client).set(weekStart, share);
  });

  const clients = [...byClient.keys()];
  const shareOf = (client, week) => byClient.get(client)?.get(week) ?? 0;
  const latestWeek = weeks[weeks.length - 1];
  const previousWeek = weeks[weeks.length - 2] ?? null;

  const charted = clients
    .filter(
      (client) =>
        client !== 'other' && weeks.some((week) => shareOf(client, week) >= CHART_MIN_SHARE)
    )
    .sort((a, b) => shareOf(b, latestWeek) - shareOf(a, latestWeek));
  const colorOf = (client) => {
    const index = charted.indexOf(client);
    return index === -1 ? OTHER_COLOR : CHART_COLORS[index % CHART_COLORS.length];
  };

  const chartSeries = charted.map((client) => ({
    client,
    label: getClientLabel(client),
    color: colorOf(client),
    data: weeks.map((week) => shareOf(client, week)),
  }));
  chartSeries.push({
    client: 'other',
    label: getClientLabel('other'),
    color: OTHER_COLOR,
    data: weeks.map((week) =>
      round1(
        clients
          .filter((client) => !charted.includes(client))
          .reduce((sum, client) => sum + shareOf(client, week), 0)
      )
    ),
  });

  const latest = clients
    .filter((client) => client === 'other' || shareOf(client, latestWeek) > 0)
    .map((client) => ({
      client,
      label: getClientLabel(client),
      color: colorOf(client),
      share: shareOf(client, latestWeek),
      change: previousWeek
        ? round1(shareOf(client, latestWeek) - shareOf(client, previousWeek))
        : null,
    }))
    .sort((a, b) => {
      if (a.client === 'other') return 1;
      if (b.client === 'other') return -1;
      return b.share - a.share;
    });

  return { weeks, latestWeek, previousWeek, chartSeries, latest };
}
