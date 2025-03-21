'use client';

import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useState, useEffect, useMemo } from 'react';

import Button from 'components/shared/button';
import CheckIcon from 'icons/check.inline.svg';
import ChevronIcon from 'icons/chevron-down.inline.svg';
import { emailRegexp } from 'utils/forms';
import sendGtagEvent from 'utils/send-gtag-event';

import DATA from './data';

function getCookie(name) {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

const RequestForm = ({ type }) => {
  const { title, description, placeholder, buttonText, options, extendedOptions } = DATA[type];

  const isRecognized = !!getCookie('ajs_user_id');
  const [selected, setSelected] = useState('');
  const [email, setEmail] = useState('');
  const [query, setQuery] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const filteredOptions = useMemo(() => {
    if (query === '') return options;
    return options.filter(
      (option) =>
        option.name.toLowerCase().includes(query.toLowerCase()) ||
        option.id?.toLowerCase().includes(query.toLowerCase())
    );
  }, [options, query]);

  const matchingOption = useMemo(
    () => filteredOptions.find((option) => option.name.toLowerCase() === query.toLowerCase()),
    [filteredOptions, query]
  );

  useEffect(() => {
    // Form is valid if an option is selected and either user is recognized or valid email is given
    setIsValid(!!selected && (isRecognized || emailRegexp.test(email)));
  }, [selected, email, isRecognized]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isValid) {
      if (window.zaraz) {
        const { eventName, eventProps } = DATA[type];
        const eventData = {
          [eventProps.name]: selected.name,
        };
        if (eventProps.id && selected.id) {
          eventData[eventProps.id] = selected.id;
        }
        if (!isRecognized && email) {
          sendGtagEvent('identify', { email });
        }
        sendGtagEvent(eventName, eventData);
      }
      setIsSent(true);
    }
  };

  return (
    <figure
      className={clsx(
        'doc-cta not-prose my-5 rounded-[10px] border border-gray-new-94 bg-gray-new-98 px-7 py-6 sm:p-6',
        'dark:border-gray-new-15 dark:bg-gray-new-10'
      )}
    >
      <h2 className="!my-0 font-title text-2xl font-medium leading-dense tracking-extra-tight">
        {title}
      </h2>
      <p className="mt-2.5 font-light leading-tight text-gray-new-30 dark:text-gray-new-70">
        {description}
      </p>
      {!isSent ? (
        <form
          className="mt-6 flex items-end gap-4 md:flex-col md:items-start"
          onSubmit={handleSubmit}
        >
          <div className="flex-1 md:w-full">
            <Combobox
              value={selected}
              immediate
              onChange={(value) => {
                setSelected(value);
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
                  displayValue={(option) => option?.name}
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
                    value={option}
                    className={clsx(
                      'group flex min-h-10 cursor-pointer select-none flex-wrap items-center gap-1.5 px-4 py-2 text-sm data-[focus]:bg-gray-new-94',
                      'dark:data-[focus]:bg-gray-new-15'
                    )}
                  >
                    {option.name}
                    {option.id && (
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
                {extendedOptions && query !== '' && !matchingOption && (
                  <ComboboxOption
                    value={{ name: query }}
                    className={clsx(
                      'group flex min-h-10 cursor-pointer select-none flex-wrap items-center gap-1.5 px-4 py-2 text-sm data-[focus]:bg-gray-new-94',
                      'dark:data-[focus]:bg-gray-new-15'
                    )}
                  >
                    Other: {query}
                  </ComboboxOption>
                )}
              </ComboboxOptions>
            </Combobox>
          </div>
          {!isRecognized && (
            <input
              type="email"
              name="email"
              value={email}
              className={clsx(
                'remove-autocomplete-styles h-10 min-w-64 rounded border-none bg-gray-new-94 px-4 py-3 md:w-full',
                '2xl:min-w-52 xl:min-w-40 xl:text-sm',
                'focus:outline focus:-outline-offset-1 focus:outline-gray-new-70',
                'dark:bg-gray-new-15 dark:focus:outline-gray-new-30'
              )}
              placeholder="Email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          )}

          <Button
            className={clsx(
              'px-6 py-3 font-semibold leading-none md:w-full',
              !isValid && 'pointer-events-none select-none opacity-70'
            )}
            type="submit"
            theme="primary"
            disabled={!isValid}
          >
            {buttonText}
          </Button>
        </form>
      ) : (
        <div className="mt-6 flex min-h-10 items-center gap-2 sm:min-h-0 sm:items-start">
          <CheckIcon className="-mt-1 size-4 shrink-0 text-green-45 sm:mt-1" aria-hidden />
          <p className="text-[17px] font-light">Request logged. We appreciate your feedback!</p>
        </div>
      )}
    </figure>
  );
};

RequestForm.propTypes = {
  type: PropTypes.oneOf(Object.keys(DATA)).isRequired,
};

export default RequestForm;
