import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';

export const FIELD_TAGS = {
  INPUT: 'input',
  TEXTAREA: 'textarea',
};

const Field = forwardRef(
  ({ className, name, label, type, tag: Tag, error, ...otherProps }, ref) => (
    <div className={clsx('relative flex flex-col items-start', className)}>
      <label className="leading-none" htmlFor={name}>
        {label}
      </label>
      <Tag
        className={clsx(
          'remove-autocomplete-styles-black-theme mt-2.5 w-full rounded border-[3px] bg-[#404040] px-4 py-3.5 text-lg leading-none text-white outline-none transition-colors duration-200 focus:bg-black',
          Tag === FIELD_TAGS.INPUT && 'h-14 md:h-12',
          Tag === FIELD_TAGS.TEXTAREA && 'min-h-[112px]',
          error
            ? 'border-secondary-1 focus:border-secondary-1'
            : 'border-transparent focus:border-primary-1'
        )}
        ref={ref}
        id={name}
        name={name}
        type={type}
        {...otherProps}
      />
      {error && (
        <p className="absolute top-[calc(100%+0.5rem)] text-sm leading-none text-secondary-1">
          {error}
        </p>
      )}
    </div>
  )
);

Field.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  tag: PropTypes.oneOf(Object.values(FIELD_TAGS)),
  error: PropTypes.string,
};

Field.defaultProps = {
  className: null,
  type: 'text',
  tag: 'input',
  error: null,
};

export default Field;
