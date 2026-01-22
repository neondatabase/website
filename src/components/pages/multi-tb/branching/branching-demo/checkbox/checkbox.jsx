import { clsx } from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

const CustomCheckbox = ({ checked, onChange, id, label, tabIndex, disabled }) => (
  <>
    <input
      type="checkbox"
      checked={checked}
      id={id}
      className="peer pointer-events-none absolute inset-0 h-full w-full opacity-0"
      aria-label={`Select ${label}`}
      tabIndex={tabIndex}
      disabled={disabled}
      onChange={onChange}
    />
    <div
      className={clsx(
        'flex size-3 items-center justify-center rounded-full lg:size-[9px]',
        'border border-white mix-blend-overlay transition-colors',
        'peer-checked:border-0 peer-checked:bg-white peer-checked:mix-blend-normal',
        'peer-hover:border-white peer-hover:mix-blend-normal',
        !disabled && 'group-focus:ring group-focus:ring-white group-focus:ring-opacity-50'
      )}
      role="presentation"
    >
      {checked && (
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle cx="6" cy="6" r="5.5" fill="#E4E5E7" stroke="#E4E5E7" />
          <path d="M3 6L5 8L9 4" stroke="#161718" strokeLinecap="round" />
        </svg>
      )}
    </div>
  </>
);

CustomCheckbox.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  tabIndex: PropTypes.number,
  disabled: PropTypes.bool,
};

export default CustomCheckbox;
