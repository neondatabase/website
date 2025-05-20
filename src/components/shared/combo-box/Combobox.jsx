'use client';

import {
  Combobox as HeadlessCombobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Field,
  Label,
} from '@headlessui/react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useState, useMemo } from 'react';

import ChevronIcon from 'icons/chevron-down.inline.svg';

const Combobox = ({ label, value, onChange, placeholder, options }) => {
  const [query, setQuery] = useState('');

  const filteredOptions = useMemo(() => {
    if (query === '') return options;
    return options.filter(
      (option) =>
        option.name.toLowerCase().includes(query.toLowerCase()) ||
        option.id?.toLowerCase().includes(query.toLowerCase())
    );
  }, [options, query]);

  return (
    <Field>
      {label && <Label>{label}</Label>}
      <HeadlessCombobox
        value={value}
        immediate
        onChange={(value) => {
          onChange?.(value);
        }}
        onClose={() => setQuery('')}
      >
        <div className="relative">
          <ComboboxInput
            className={clsx(
              'h-10 w-full rounded border-none bg-gray-new-94 py-3 pl-4 pr-8 xl:text-sm',
              'focus:outline-none data-[focus]:outline-1 data-[focus]:-outline-offset-1 data-[focus]:outline-gray-new-70',
              'dark:bg-gray-new-15 dark:data-[focus]:outline-gray-new-30'
            )}
            displayValue={(option) => options.find((o) => o.id === option)?.name}
            autoComplete="off"
            placeholder={placeholder}
            onChange={(event) => setQuery(event.target.value)}
          />
          <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
            <ChevronIcon className="size-4 stroke-black-new dark:stroke-white" />
          </ComboboxButton>
        </div>
        <ComboboxOptions
          anchor="bottom"
          className={clsx(
            'z-50 !max-h-[200px] w-[var(--input-width)] rounded border border-gray-new-94 bg-gray-new-98',
            '[--anchor-gap:var(--spacing-1)] [--anchor-max-height:50vh] empty:invisible',
            'transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0',
            'dark:border-gray-new-15 dark:bg-gray-new-10 dark:text-white'
          )}
          modal={false}
          transition
        >
          {filteredOptions.map((option, index) => (
            <ComboboxOption
              key={index}
              value={option.id}
              className={clsx(
                'group flex min-h-10 cursor-pointer select-none flex-wrap items-center gap-1.5 px-4 py-2 text-sm data-[focus]:bg-gray-new-94',
                'dark:data-[focus]:bg-gray-new-15'
              )}
            >
              {option.name ?? option.id}
              {option.showId && (
                <code
                  className={clsx(
                    'whitespace-nowrap rounded-sm bg-gray-new-90 px-1.5 py-1 text-xs leading-none',
                    'dark:bg-gray-new-20'
                  )}
                >
                  {option.id}
                </code>
              )}
            </ComboboxOption>
          ))}
        </ComboboxOptions>
      </HeadlessCombobox>
    </Field>
  );
};

Combobox.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.string.isRequired,
      showId: PropTypes.bool,
    })
  ).isRequired,
};

export default Combobox;
