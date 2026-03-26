'use client';

import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/react';
import Image from 'next/image';
import PropTypes from 'prop-types';
import { useState, useEffect, useMemo } from 'react';

import Button from 'components/shared/button';
import CheckIcon from 'icons/check.inline.svg';
import ChevronIcon from 'icons/chevron-down.inline.svg';
import patternSvg from 'images/pages/docs/request-form/pattern.svg';
import { cn } from 'utils/cn';
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
      className={cn(
        'doc-cta not-prose relative my-5 overflow-hidden border border-gray-new-80 bg-[rgba(228,241,235,0.4)] px-7 py-6 sm:p-6',
        'dark:border-gray-new-30 dark:bg-gray-new-10'
      )}
    >
      <Image
        className="absolute top-0 right-0 bottom-0 h-full w-auto object-cover md:hidden"
        src={patternSvg}
        alt=""
        width={188}
        height={195}
      />
      <div className="relative z-10">
        <h2 className="my-0! text-xl leading-tight font-medium tracking-tight text-black-pure dark:text-white">
          {title}
        </h2>
        <p className="mt-2.5 max-w-[490px] text-base leading-normal font-normal tracking-tight text-gray-new-20 opacity-90 dark:text-gray-new-85">
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
                    className={cn(
                      'h-11 w-full border border-gray-new-80 bg-white py-2 pr-8 pl-4 text-[15px] leading-snug tracking-extra-tight placeholder:text-gray-new-40 xl:text-sm',
                      'focus:outline-none data-focus:outline-1 data-focus:-outline-offset-1 data-focus:outline-gray-new-70',
                      'dark:border-gray-new-30 dark:bg-gray-new-15 dark:placeholder:text-gray-new-60 dark:data-focus:outline-gray-new-30'
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
                  className={cn(
                    'z-50 max-h-[200px]! w-(--input-width) border border-gray-new-80 bg-white',
                    '[--anchor-gap:var(--spacing-1)] [--anchor-max-height:50vh] empty:invisible',
                    'transition duration-100 ease-in data-leave:data-closed:opacity-0',
                    'dark:border-gray-new-30 dark:bg-gray-new-10 dark:text-white'
                  )}
                  modal={false}
                  transition
                >
                  {filteredOptions.map((option, index) => (
                    <ComboboxOption
                      key={index}
                      value={option}
                      className={cn(
                        'group flex min-h-10 cursor-pointer flex-wrap items-center gap-1.5 px-4 py-2 text-sm select-none data-focus:bg-gray-new-94',
                        'dark:data-focus:bg-gray-new-15'
                      )}
                    >
                      {option.name}
                      {option.id && (
                        <code
                          className={cn(
                            'rounded bg-gray-new-90 px-1.5 py-0.5 font-mono text-sm leading-tight font-normal tracking-tight whitespace-nowrap text-black-pure',
                            'dark:bg-gray-new-20 dark:text-white'
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
                      className={cn(
                        'group flex min-h-10 cursor-pointer flex-wrap items-center gap-1.5 px-4 py-2 text-sm select-none data-focus:bg-gray-new-94',
                        'dark:data-focus:bg-gray-new-15'
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
                className={cn(
                  'h-11 min-w-64 border border-gray-new-80 bg-white px-4 py-2 text-[15px] leading-snug tracking-extra-tight remove-autocomplete-styles placeholder:text-gray-new-40 md:w-full',
                  '2xl:min-w-52 xl:min-w-40 xl:text-sm',
                  'focus:outline focus:-outline-offset-1 focus:outline-gray-new-70',
                  'dark:border-gray-new-30 dark:bg-gray-new-15 dark:placeholder:text-gray-new-60 dark:focus:outline-gray-new-30'
                )}
                placeholder="Email"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            )}

            <Button
              className={cn(
                'rounded-full bg-black-pure px-7 py-3.5 text-base leading-none font-medium tracking-tight text-white dark:text-black-pure md:w-full',
                !isValid
                  ? 'pointer-events-none bg-gray-new-40 select-none dark:bg-gray-new-80'
                  : 'bg-black-pure dark:bg-white'
              )}
              type="submit"
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
      </div>
    </figure>
  );
};

RequestForm.propTypes = {
  type: PropTypes.oneOf(Object.keys(DATA)).isRequired,
};

export default RequestForm;
