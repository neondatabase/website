const DAY_MS = 24 * 60 * 60 * 1000;

const toDate = (weekStart) => new Date(`${weekStart}T00:00:00Z`);

const format = (date, options) => date.toLocaleDateString('en-US', { timeZone: 'UTC', ...options });

export const formatWeekShort = (weekStart) =>
  format(toDate(weekStart), { month: 'short', day: 'numeric' });

export const formatWeekRange = (weekStart) => {
  const start = toDate(weekStart);
  const end = new Date(start.getTime() + 6 * DAY_MS);
  const sameMonth = start.getUTCMonth() === end.getUTCMonth();
  const endLabel = sameMonth
    ? format(end, { day: 'numeric' })
    : format(end, { month: 'short', day: 'numeric' });
  return `${formatWeekShort(weekStart)}–${endLabel}`;
};
