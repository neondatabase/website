'use client';

import PropTypes from 'prop-types';
import { useState } from 'react';

import Tooltip from 'components/shared/tooltip';

import { sparklinePaths, summarizeWeeklyInstalls, weeklyInstallRowsPropType } from './summary';

const TOOLTIP_ID = 'weekly-installs-since';

const SPARKLINE = { width: 300, height: 64, inset: 1 };

const toPercent = (value, size) => `${(value / size) * 100}%`;

const Sparkline = ({ values, activeIndex, onActiveIndexChange }) => {
  const { line, area, points } = sparklinePaths(values, SPARKLINE);
  const [markerX, markerY] = points[activeIndex ?? points.length - 1];
  const left = toPercent(markerX, SPARKLINE.width);

  const handlePointerMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1);
    onActiveIndexChange(Math.round(ratio * (values.length - 1)));
  };

  return (
    <div
      className="relative mt-4 h-16 touch-none"
      aria-hidden
      onPointerMove={handlePointerMove}
      onPointerLeave={() => onActiveIndexChange(null)}
    >
      <svg
        className="absolute inset-0 size-full overflow-visible text-green-45"
        viewBox={`0 0 ${SPARKLINE.width} ${SPARKLINE.height}`}
        preserveAspectRatio="none"
      >
        <path d={area} fill="currentColor" fillOpacity={0.08} />
        <path
          d={line}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {activeIndex !== null && (
        <span
          className="pointer-events-none absolute inset-y-0 w-px bg-gray-new-30"
          style={{ left }}
        />
      )}
      <span
        className="pointer-events-none absolute size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-45"
        style={{ left, top: toPercent(markerY, SPARKLINE.height) }}
      />
    </div>
  );
};

Sparkline.propTypes = {
  values: PropTypes.arrayOf(PropTypes.number).isRequired,
  activeIndex: PropTypes.number,
  onActiveIndexChange: PropTypes.func.isRequired,
};

const WeeklyInstalls = ({ rows }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const summary = summarizeWeeklyInstalls(rows);
  if (!summary) return null;

  const active = activeIndex === null ? null : summary.weeks[activeIndex];

  return (
    <div className="flex flex-col gap-2.5 border-t border-gray-new-20 py-4">
      <dt className="flex justify-between gap-4 font-mono text-xs leading-none font-medium tracking-tight text-gray-new-50 uppercase">
        Weekly installs
        <span className="tabular-nums" aria-live="polite">
          {active ? (
            active.label
          ) : (
            <>
              <span className="font-semibold text-white">{summary.total}</span>{' '}
              <button
                className="cursor-help uppercase underline decoration-gray-new-50 decoration-dashed underline-offset-4 outline-none focus-visible:text-white"
                type="button"
                data-tooltip-id={TOOLTIP_ID}
                data-tooltip-content={`Counted since ${summary.since}`}
              >
                all time
              </button>
            </>
          )}
        </span>
      </dt>
      <dd className="text-white">
        <span className="block text-2xl leading-none tracking-tighter tabular-nums">
          {active ? active.installs : summary.latest}
        </span>
        {summary.values.length > 1 && (
          <Sparkline
            values={summary.values}
            activeIndex={activeIndex}
            onActiveIndexChange={setActiveIndex}
          />
        )}
        <Tooltip id={TOOLTIP_ID} place="top" />
      </dd>
    </div>
  );
};

WeeklyInstalls.propTypes = {
  rows: weeklyInstallRowsPropType.isRequired,
};

export default WeeklyInstalls;
