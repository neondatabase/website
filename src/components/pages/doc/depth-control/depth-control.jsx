'use client';

import PropTypes from 'prop-types';

import { cn } from 'utils/cn';

const OPTIONS = [
  { value: 0, label: '−' },
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 99, label: '∞' },
];

const DepthControl = ({ value, onChange, label = 'Depth' }) => (
  <div className="flex items-center gap-1.5">
    <span className="text-sm tracking-wide text-gray-new-50 dark:text-gray-new-60">{label}</span>
    <div className="flex gap-px border border-gray-new-80 bg-white p-0.5 dark:border-gray-new-20 dark:bg-black-pure">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            'px-2 py-0.5 font-mono text-sm font-semibold transition-all duration-100',
            value === opt.value
              ? 'bg-gray-new-90 text-black-pure dark:bg-gray-new-20 dark:text-white'
              : 'text-gray-new-50 hover:text-gray-new-30 dark:text-gray-new-60 dark:hover:text-gray-new-80'
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  </div>
);

DepthControl.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
};

export default DepthControl;
