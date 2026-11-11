import PropTypes from 'prop-types';

import { sparklinePaths, summarizeWeeklyInstalls } from './summary';

const LABEL_CLASS_NAME =
  'font-mono text-xs leading-none font-medium tracking-tight text-gray-new-50 uppercase';

const SPARKLINE = { width: 320, height: 96, inset: 4 };

const Sparkline = ({ values }) => {
  const { line, area, last } = sparklinePaths(values, SPARKLINE);

  return (
    <svg
      className="mt-5 h-auto w-full text-green-45"
      viewBox={`0 0 ${SPARKLINE.width} ${SPARKLINE.height}`}
      aria-hidden
    >
      <path d={area} fill="currentColor" fillOpacity={0.06} />
      <path
        d={line}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <circle cx={last.x} cy={last.y} r={4} fill="currentColor" />
    </svg>
  );
};

Sparkline.propTypes = {
  values: PropTypes.arrayOf(PropTypes.number).isRequired,
};

const WeeklyInstalls = ({ rows }) => {
  const summary = summarizeWeeklyInstalls(rows);
  if (!summary) return null;

  return (
    <section className="border-t border-gray-new-20 pt-4" aria-labelledby="weekly-installs">
      <div className="flex items-baseline justify-between gap-4">
        <h2 id="weekly-installs" className={LABEL_CLASS_NAME}>
          Weekly installs
        </h2>
        <p className={LABEL_CLASS_NAME}>
          {summary.total} since {summary.since}
        </p>
      </div>
      <p className="mt-4 text-[32px] leading-none tracking-tighter text-white">{summary.latest}</p>
      <p className="mt-2 text-sm leading-none tracking-extra-tight text-gray-new-50">
        {summary.latestWeek}
      </p>
      {summary.values.length > 1 && <Sparkline values={summary.values} />}
    </section>
  );
};

WeeklyInstalls.propTypes = {
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      weekStart: PropTypes.string.isRequired,
      installs: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default WeeklyInstalls;
