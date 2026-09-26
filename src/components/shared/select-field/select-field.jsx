'use client';

import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import PropTypes from 'prop-types';
import { forwardRef } from 'react';

import Field from 'components/shared/field';
import ChevronIcon from 'icons/chevron-down-select.inline.svg';
import CheckIcon from 'icons/home/copied.inline.svg';
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
          <ChevronIcon className="shrink-0" aria-hidden />
        </Field>
        <ListboxOptions
          anchor="bottom start"
          modal={false}
          className={cn(
            'z-50 max-h-[143px]! w-(--button-width) overflow-y-auto border border-gray-new-20 bg-black-pure p-0.5 text-[15px] leading-snug tracking-extra-tight text-gray-new-80 [--anchor-gap:4px] [--anchor-padding:12px] focus:outline-none',
            '[scrollbar-color:#494b50_transparent] [scrollbar-width:thin]',
            'supports-[selector(::-webkit-scrollbar)]:pr-0 supports-[selector(::-webkit-scrollbar)]:[scrollbar-color:auto] supports-[selector(::-webkit-scrollbar)]:[scrollbar-width:auto]',
            '[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-2 [&::-webkit-scrollbar-thumb]:border-transparent [&::-webkit-scrollbar-thumb]:bg-gray-new-30 [&::-webkit-scrollbar-thumb]:bg-clip-padding'
          )}
        >
          {options.map((option) => (
            <ListboxOption
              key={option.value}
              value={option.value}
              className="group flex h-[35px] cursor-pointer items-center justify-between gap-3 px-3 transition-colors select-none data-focus:bg-gray-new-10 data-selected:bg-gray-new-15 data-selected:text-white data-selected:data-focus:bg-gray-new-15"
            >
              <span>{option.label}</span>
              <CheckIcon
                className="shrink-0 text-white opacity-0 group-data-selected:opacity-100 [&_path]:stroke-[1.2]"
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
