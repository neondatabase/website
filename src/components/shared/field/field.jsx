import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

const Field = ({ className, name, label, type, tag: Tag, register, error, ...otherProps }) => (
  <div className={clsx('relative flex flex-col items-start', className)}>
    <label className="leading-none" htmlFor={name}>
      {label}
    </label>
    <Tag
      className={clsx(
        'remove-autocomplete-styles-black-theme mt-2.5 w-full rounded border-[3px] bg-[#404040] px-4 py-3.5 text-lg leading-none text-white outline-none transition-colors duration-200 focus:bg-black',
        Tag === 'input' && 'h-14 md:h-12',
        Tag === 'textarea' && 'min-h-[112px]',
        error
          ? 'border-secondary-1 focus:border-secondary-1'
          : 'border-transparent focus:border-primary-1'
      )}
      id={name}
      name={name}
      type={type}
      {...register}
      {...otherProps}
    />
    {error && (
      <p className="absolute top-[calc(100%+0.5rem)] text-sm leading-none text-secondary-1">
        {error}
      </p>
    )}
  </div>
);

Field.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  tag: PropTypes.oneOf(['input', 'textarea']),
  register: PropTypes.shape({}),
  error: PropTypes.string,
};

Field.defaultProps = {
  className: null,
  type: 'text',
  tag: 'input',
  register: {},
  error: null,
};

export default Field;
