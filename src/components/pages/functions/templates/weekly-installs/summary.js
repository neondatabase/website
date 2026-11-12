import PropTypes from 'prop-types';

export const weeklyInstallRowsPropType = PropTypes.arrayOf(
  PropTypes.shape({
    weekStart: PropTypes.string.isRequired,
    installs: PropTypes.number.isRequired,
  })
);

const toDate = (weekStart) => new Date(`${weekStart}T00:00:00Z`);

const formatDay = (date, options = {}) =>
  date.toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric', ...options });

const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });
const whole = new Intl.NumberFormat('en-US');

export const formatInstallsCompact = (value) => compact.format(value);
export const formatInstallsWhole = (value) => whole.format(value);

// Two-digit days keep the hover label the same width in a monospace font as the pointer moves.
export const formatWeekLabel = (weekStart) =>
  `Week of ${formatDay(toDate(weekStart), { day: '2-digit', year: 'numeric' })}`;

export const totalWeeklyInstalls = (rows) => rows.reduce((sum, row) => sum + row.installs, 0);

// Rows are every published week for one template, oldest first, zeros included.
export const summarizeWeeklyInstalls = (rows) => {
  const total = totalWeeklyInstalls(rows);
  if (total === 0) return null;
  const latest = rows[rows.length - 1];
  return {
    latest: whole.format(latest.installs),
    total: compact.format(total),
    since: formatDay(toDate(rows[0].weekStart), { year: 'numeric' }),
    values: rows.map((row) => row.installs),
    weeks: rows.map((row) => ({
      installs: whole.format(row.installs),
      label: formatWeekLabel(row.weekStart),
    })),
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
    points,
  };
};
