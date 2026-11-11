'use client';

import PropTypes from 'prop-types';
import { useState } from 'react';

import {
  formatDownloadDate,
  formatDownloadsCompact,
  formatDownloadsFull,
  getTemplateDownloads,
} from 'utils/function-registry-downloads';

const WIDTH = 300;
const HEIGHT = 64;

const TemplateDownloads = ({ id }) => {
  const { total, weekly } = getTemplateDownloads(id);
  const [activeIndex, setActiveIndex] = useState(null);

  const max = Math.max(...weekly.map((week) => week.count), 1);
  const step = WIDTH / (weekly.length - 1);
  const points = weekly.map((week, index) => [index * step, HEIGHT - (week.count / max) * HEIGHT]);
  const line = points.map(([x, y], index) => `${index ? 'L' : 'M'}${x},${y}`).join(' ');
  const area = `${line} L${WIDTH},${HEIGHT} L0,${HEIGHT} Z`;

  const markerIndex = activeIndex ?? weekly.length - 1;
  const [markerX, markerY] = points[markerIndex];
  const marker = weekly[markerIndex];

  const handlePointerMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1);
    setActiveIndex(Math.round(ratio * (weekly.length - 1)));
  };

  return (
    <div className="flex flex-col gap-2.5 border-t border-gray-new-20 py-4">
      <dt className="flex justify-between gap-4 font-mono text-xs leading-none font-medium tracking-tight text-gray-new-50 uppercase">
        Weekly downloads
        <span className="tabular-nums" aria-live="polite">
          {activeIndex === null
            ? `${formatDownloadsCompact(total)} all time`
            : `Week of ${formatDownloadDate(marker.date)}`}
        </span>
      </dt>
      <dd className="text-white">
        <span className="block text-2xl leading-none tracking-tighter tabular-nums">
          {formatDownloadsFull(marker.count)}
        </span>
        <div
          className="relative mt-4 h-16 touch-none"
          role="img"
          aria-label={`Weekly downloads over the last year, ${formatDownloadsFull(total)} in total`}
          onPointerMove={handlePointerMove}
          onPointerLeave={() => setActiveIndex(null)}
        >
          <svg
            className="absolute inset-0 size-full overflow-visible text-green-45"
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            preserveAspectRatio="none"
            aria-hidden
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
              style={{ left: `${(markerX / WIDTH) * 100}%` }}
              aria-hidden
            />
          )}
          <span
            className="pointer-events-none absolute size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-45"
            style={{ left: `${(markerX / WIDTH) * 100}%`, top: `${(markerY / HEIGHT) * 100}%` }}
            aria-hidden
          />
        </div>
      </dd>
    </div>
  );
};

TemplateDownloads.propTypes = {
  id: PropTypes.string.isRequired,
};

export default TemplateDownloads;
