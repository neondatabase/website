'use client';

import {
  Combobox as HeadlessCombobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useState, useMemo } from 'react';

import CustomChevronIcon from 'components/shared/footer/images/chevrons.inline.svg';

import CheckIcon from '../code-block-wrapper/images/check.inline.svg';

const Combobox = ({ value, onChange, placeholder, options }) => {
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
            'h-8 rounded border-none bg-gray-new-98 py-2 pl-4 pr-8 text-sm',
            'text-gray-new-30 focus:outline-none',
            'dark:bg-gray-new-10 dark:text-gray-new-80'
          )}
          displayValue={(option) => options.find((o) => o.id === option)?.name}
          autoComplete="off"
          placeholder={placeholder}
          readOnly
          onChange={(event) => setQuery(event.target.value)}
        />
        <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
          <CustomChevronIcon className="size-4 stroke-gray-new-80 dark:stroke-gray-new-30" />
        </ComboboxButton>
      </div>
      <ComboboxOptions
        anchor="bottom"
        className={clsx(
          'z-50 !max-h-[200px] w-[var(--input-width)] rounded border border-gray-new-94 bg-gray-new-98',
          'text-sm [--anchor-gap:var(--spacing-1)] [--anchor-max-height:50vh] empty:invisible',
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
              'group relative flex min-h-8 cursor-pointer select-none flex-wrap items-center gap-1.5 py-2 pl-8 pr-4 text-sm data-[focus]:bg-gray-new-94',
              'text-gray-new-30 data-[focus]:bg-gray-new-94',
              'dark:text-gray-new-80 dark:data-[focus]:bg-gray-new-15'
            )}
          >
            <div className="absolute left-0 flex h-full items-center px-2.5">
              {option.id === value && (
                <CheckIcon className="size-4 stroke-black-new dark:stroke-white" />
              )}
            </div>

            {option.name ?? option.id}
            {option.showId && (
              <code
                className={clsx(
                  'whitespace-nowrap rounded-sm bg-gray-new-90 px-1.5 py-1 text-xs leading-none',
                  'text-gray-new-20 dark:bg-gray-new-20 dark:text-gray-new-80'
                )}
              >
                {option.id}
              </code>
            )}
          </ComboboxOption>
        ))}
      </ComboboxOptions>
    </HeadlessCombobox>
  );
};

Combobox.propTypes = {
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
