const DAY_MS = 24 * 60 * 60 * 1000;

const toDate = (weekStart) => new Date(`${weekStart}T00:00:00Z`);

const formatDay = (date, options = {}) =>
  date.toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric', ...options });

const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });
const whole = new Intl.NumberFormat('en-US');

export const formatWeekRange = (weekStart) => {
  const start = toDate(weekStart);
  const end = new Date(start.getTime() + 6 * DAY_MS);
  const endLabel =
    start.getUTCMonth() === end.getUTCMonth()
      ? formatDay(end, { month: undefined })
      : formatDay(end);
  return `${formatDay(start)}–${endLabel}`;
};

// Rows are every published week for one template, oldest first, zeros included.
export const summarizeWeeklyInstalls = (rows) => {
  if (rows.length === 0) return null;
  const latest = rows[rows.length - 1];
  return {
    latest: whole.format(latest.installs),
    latestWeek: formatWeekRange(latest.weekStart),
    total: compact.format(rows.reduce((sum, row) => sum + row.installs, 0)),
    since: formatDay(toDate(rows[0].weekStart)),
    values: rows.map((row) => row.installs),
  };
};

export const sparklinePaths = (values, { width, height, inset }) => {
  const max = Math.max(...values);
  const step = (width - 2 * inset) / (values.length - 1);
  const points = values.map((value, index) => [
    inset + index * step,
    height - inset - (max === 0 ? 0 : (value / max) * (height - 2 * inset)),
  ]);
  const line = points
    .map(([x, y], index) => `${index === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`)
    .join(' ');
  const [lastX, lastY] = points[points.length - 1];
  return {
    line,
    area: `${line} L${lastX.toFixed(1)} ${height} L${inset.toFixed(1)} ${height} Z`,
    last: { x: lastX, y: lastY },
  };
};
