import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';

export const FIELD_TAGS = {
  INPUT: 'input',
  TEXTAREA: 'textarea',
  SELECT: 'select',
};

const Field = forwardRef(
  (
    {
      className,
      name,
      label,
      labelClassName,
      type = 'text',
      children,
      tag: Tag = 'input',
      tagClassName,
      error,
      errorClassName,
      isDisabled,
      ...otherProps
    },
    ref
  ) => (
    <div className={clsx('relative flex flex-col items-start', className)}>
      <label className={clsx('leading-none text-gray-new-80', labelClassName)} htmlFor={name}>
        {label}
      </label>
      <Tag
        className={clsx(
          'remove-autocomplete-styles-black-theme mt-2.5 w-full appearance-none rounded border-[3px] bg-white/[0.04] px-4 text-lg text-white outline-none transition-colors duration-200 focus:bg-black',
          (Tag === FIELD_TAGS.INPUT || Tag === FIELD_TAGS.SELECT) && 'h-14 md:h-12',
          Tag === FIELD_TAGS.TEXTAREA && 'min-h-[112px] py-3.5',
          Tag === FIELD_TAGS.SELECT &&
            'bg-[url(/images/chevron-down.svg)] bg-[center_right_1rem] bg-no-repeat',
          error
            ? 'border-secondary-1 focus:border-secondary-1'
            : 'border-transparent focus:border-primary-1',
          tagClassName
        )}
        ref={ref}
        id={name}
        name={name}
        type={type}
        disabled={isDisabled}
        {...otherProps}
      >
        {Tag === FIELD_TAGS.SELECT ? children : null}
      </Tag>

      {error && (
        <p
          className={clsx(
            'absolute top-[calc(100%+0.5rem)] text-sm leading-none text-secondary-1',
            errorClassName
          )}
          data-test="error-field-message"
        >
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
  labelClassName: PropTypes.string,
  type: PropTypes.string,
  tag: PropTypes.oneOf(Object.values(FIELD_TAGS)),
  tagClassName: PropTypes.string,
  error: PropTypes.string,
  errorClassName: PropTypes.string,
  children: PropTypes.node,
  isDisabled: PropTypes.bool,
};

export default Field;
