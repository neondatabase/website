'use client';

import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import PropTypes from 'prop-types';
import { forwardRef } from 'react';

import Field from 'components/shared/field';
import CheckIcon from 'icons/check.inline.svg';
import ChevronIcon from 'icons/chevron-down.inline.svg';
import { cn } from 'utils/cn';

const SelectField = forwardRef(
  (
    {
      name,
      label,
      value,
      onChange,
      onBlur,
      options,
      placeholder = 'Select an option',
      isDisabled = false,
      error,
      inputClassName,
      ...fieldProps
    },
    ref
  ) => {
    const selectedOption = options.find((option) => option.value === value);

    return (
      <Listbox
        name={name}
        value={value}
        onChange={onChange}
        disabled={isDisabled}
        invalid={!!error}
      >
        <Field
          {...fieldProps}
          ref={ref}
          name={name}
          label={label}
          tag={ListboxButton}
          type="button"
          onBlur={onBlur}
          aria-label={label}
          isDisabled={isDisabled}
          error={error}
          inputClassName={cn(
            'group flex cursor-pointer items-center justify-between gap-3 text-left',
            inputClassName
          )}
        >
          <span className={cn('truncate', !selectedOption && 'text-gray-new-50')}>
            {selectedOption?.label ?? placeholder}
          </span>
          <ChevronIcon
            className="size-4 shrink-0 text-gray-new-60 transition-transform duration-200 group-data-open:rotate-180"
            aria-hidden
          />
        </Field>
        <ListboxOptions
          anchor="bottom start"
          modal={false}
          className="z-50 max-h-60! w-(--button-width) overflow-y-auto border border-gray-new-20 bg-black-pure p-1 text-base leading-snug tracking-tight text-white [--anchor-gap:4px] [--anchor-padding:12px] focus:outline-none"
        >
          {options.map((option) => (
            <ListboxOption
              key={option.value}
              value={option.value}
              className="group flex min-h-10 cursor-pointer items-center justify-between gap-3 px-3 py-2 transition-colors select-none data-focus:bg-gray-new-10 data-selected:bg-gray-new-15 data-selected:data-focus:bg-gray-new-30"
            >
              <span>{option.label}</span>
              <CheckIcon
                className="size-4 shrink-0 text-green-45 opacity-0 group-data-selected:opacity-100"
                aria-hidden
              />
            </ListboxOption>
          ))}
        </ListboxOptions>
      </Listbox>
    );
  }
);

SelectField.displayName = 'SelectField';

SelectField.propTypes = {
  ...Field.propTypes,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  placeholder: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default SelectField;
