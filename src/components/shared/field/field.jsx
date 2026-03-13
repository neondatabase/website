import clsx from 'clsx';
import Image from 'next/image';
import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';

import warningIcon from 'icons/input-warning.svg';

export const FIELD_TAGS = {
  INPUT: 'input',
  TEXTAREA: 'textarea',
  SELECT: 'select',
};

const themes = {
  default:
    'mt-2.5 w-full border-[3px] border-transparent px-4 text-lg text-white outline-none focus:bg-black h-12',
  transparent:
    'w-full h-10 border border-gray-new-15 outline-none !bg-transparent mt-2 px-[15px] placeholder:text-gray-new-40 placeholder:text-base',
  checkbox:
    'absolute pointer-events-none top-1/2 left-0 -translate-y-1/2 w-[18px] h-[18px] border !border-white/10 hover:!border-white/50 before:absolute before:inset-0 before:z-10 before:bg-center before:bg-no-repeat checked:bg-white before:bg-[url(/images/check.svg)] before:bg-[length:14px_14px] before:opacity-0 before:transition-opacity before:duration-200 checked:before:opacity-100 disabled:!border-white/10',
};

const errorThemes = {
  default:
    '!absolute bottom-full right-0 z-10 m-0 max-w-[350px] translate-y-4 text-end text-sm leading-none text-secondary-1 sm:!static sm:ml-auto sm:mt-2 sm:translate-y-0 [&_a:hover]:no-underline [&_a]:underline [&_a]:underline-offset-2',
  tooltip:
    'absolute z-20 top-full translate-y-2.5 tracking-tight left-0 flex py-2 pr-3 pl-2 gap-x-1 leading-tight text-[#FF3621]/80 text-sm border border-[#FF3621]/50 shadow-[0_1px_6px_rgba(210,45,84,.2)] bg-[#000] before:absolute before:inset-0 before:bg-[#ff3621]/[0.06]',
};

const baseStyles =
  'remove-autocomplete-styles appearance-none bg-white/[0.04] rounded transition-colors duration-200';

const Field = forwardRef(
  (
    {
      className,
      theme = 'default',
      errorTheme = 'default',
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
            {
              'focus:border-primary-1': !error,
              '!border-[#FF3621]/50': !!error && errorTheme === 'tooltip',
              '!border-secondary-1': !!error && errorTheme !== 'tooltip',
            },
            !error && '',
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
        <div className={clsx(errorThemes[errorTheme], errorClassName)}>
          {errorTheme === 'tooltip' && (
            <>
              <span className="absolute left-2.5 top-0 z-40 h-2.5 w-2.5 -translate-y-1.5 rotate-45 border-l border-t border-[#FF3621]/50 bg-[linear-gradient(135deg,#000_0%,#000_60%,rgba(0,0,0,0)_60%)] before:absolute before:inset-0 before:bg-[linear-gradient(135deg,rgba(255,54,33,.06)_0%,rgba(255,54,33,.06)_60%,rgba(0,0,0,0)_60%)]" />
              <Image className="size-4 shrink-0" src={warningIcon} alt="" width={16} height={16} />
            </>
          )}
          <p
            className="error-message"
            data-test="error-field-message"
            dangerouslySetInnerHTML={{ __html: error }}
          />
        </div>
      )}
    </div>
  )
);

Field.propTypes = {
  className: PropTypes.string,
  theme: PropTypes.oneOf(Object.values(FIELD_TAGS)),
  errorTheme: PropTypes.oneOf(Object.values(errorThemes)),
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
