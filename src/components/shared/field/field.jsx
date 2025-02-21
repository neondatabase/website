import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';

export const FIELD_TAGS = {
  INPUT: 'input',
  TEXTAREA: 'textarea',
  SELECT: 'select',
};

const themes = {
  default:
    'mt-2.5 w-full border-[3px] border-transparent px-4 text-lg text-white outline-none focus:bg-black h-14 md:h-12',
  transparent:
    'w-full h-10 border border-gray-new-15 outline-none !bg-transparent mt-2 px-[15px] placeholder:text-gray-new-40 placeholder:text-base',
  checkbox:
    'absolute pointer-events-none top-1/2 left-0 -translate-y-1/2 w-[18px] h-[18px] border !border-white/10 hover:!border-white/50 before:absolute before:inset-0 before:z-10 before:bg-center before:bg-no-repeat checked:bg-white before:bg-[url("/images/check.svg")] before:bg-[length:14px_14px] before:opacity-0 before:transition-opacity before:duration-200 checked:before:opacity-100 disabled:!border-white/10',
};

const baseStyles =
  'remove-autocomplete-styles appearance-none bg-white/[0.04] rounded transition-colors duration-200';

const Field = forwardRef(
  (
    {
      className,
      theme = 'default',
      name,
      value,
      label,
      labelClassName,
      textareaClassName,
      type = 'text',
      children = null,
      tag: Tag = 'input',
      inputClassName,
      wrapperClassName,
      error,
      errorClassName,
      isDisabled,
      ...otherProps
    },
    ref
  ) => (
    <div className={clsx('relative flex flex-col items-start', className)}>
      <label
        className={clsx(
          'leading-none text-gray-new-80',
          theme === 'checkbox' && 'w-fit cursor-pointer pl-7',
          isDisabled && '!cursor-default',
          labelClassName
        )}
        htmlFor={theme === 'checkbox' ? value : name}
      >
        {label}
      </label>
      <div className={clsx('w-full rounded', wrapperClassName)}>
        <Tag
          className={clsx(
            baseStyles,
            themes[theme],
            {
              'block min-h-[112px] py-3.5': Tag === FIELD_TAGS.TEXTAREA,
              'cursor-pointer truncate bg-[url(/images/chevron-down.svg)] bg-[length:12px] bg-[center_right_1rem] bg-no-repeat pr-8':
                Tag === FIELD_TAGS.SELECT,
            },
            Tag === FIELD_TAGS.TEXTAREA && textareaClassName,
            error ? '!border-secondary-1' : 'focus:border-primary-1',
            isDisabled && '!cursor-default',
            inputClassName
          )}
          ref={ref}
          id={theme === 'checkbox' ? value : name}
          name={name}
          value={theme === 'checkbox' ? value : null}
          type={type}
          disabled={isDisabled}
          {...otherProps}
        >
          {children}
        </Tag>
      </div>

      {error && (
        <p
          className={clsx(
            'error-message absolute !top-auto bottom-full right-0 z-10 max-w-[350px] translate-y-4 text-end text-sm leading-none text-secondary-1',
            'sm:static sm:ml-auto sm:mt-2 sm:translate-y-0 [&_a:hover]:no-underline [&_a]:underline [&_a]:underline-offset-2',
            errorClassName
          )}
          data-test="error-field-message"
          dangerouslySetInnerHTML={{ __html: error }}
        />
      )}
    </div>
  )
);

Field.propTypes = {
  className: PropTypes.string,
  theme: PropTypes.oneOf(Object.values(FIELD_TAGS)),
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  label: PropTypes.string.isRequired,
  labelClassName: PropTypes.string,
  textareaClassName: PropTypes.string,
  type: PropTypes.string,
  tag: PropTypes.oneOf(Object.values(FIELD_TAGS)),
  inputClassName: PropTypes.string,
  wrapperClassName: PropTypes.string,
  error: PropTypes.string,
  errorClassName: PropTypes.string,
  children: PropTypes.node,
  isDisabled: PropTypes.bool,
};

export default Field;
