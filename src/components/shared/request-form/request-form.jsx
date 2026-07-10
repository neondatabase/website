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
import backendFormDarkBg from 'images/pages/docs/request-form/backend-form-dark-bg.png';
import backendFormLightBg from 'images/pages/docs/request-form/backend-form-light-bg.png';
import patternSvg from 'images/pages/docs/request-form/pattern.svg';
import { cn } from 'utils/cn';
import { emailRegexp } from 'utils/forms';
import sendGtagEvent from 'utils/send-gtag-event';

import DATA from './data';

const RequestForm = ({
  className,
  type,
  title: titleOverride,
  description: descriptionOverride,
  buttonText: buttonTextOverride,
  confirmation: confirmationOverride,
}) => {
  const {
    title: defaultTitle,
    description: defaultDescription,
    placeholder,
    buttonText: defaultButtonText,
    confirmation: defaultConfirmation,
    options,
    extendedOptions,
  } = DATA[type];

  // Allow pages to override the display copy while keeping the type-based analytics.
  const title = titleOverride || defaultTitle;
  const description = descriptionOverride || defaultDescription;
  const buttonText = buttonTextOverride || defaultButtonText;
  const confirmation = confirmationOverride || defaultConfirmation;

  const hasOptions = Array.isArray(options) && options.length > 0;

  const isRecognized = false;
  const [selected, setSelected] = useState('');
  const [email, setEmail] = useState('');
  const [query, setQuery] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const filteredOptions = useMemo(() => {
    if (!hasOptions) return [];
    if (query === '') return options;
    return options.filter(
      (option) =>
        option.name.toLowerCase().includes(query.toLowerCase()) ||
        option.id?.toLowerCase().includes(query.toLowerCase())
    );
  }, [hasOptions, options, query]);

  const matchingOption = useMemo(
    () => filteredOptions.find((option) => option.name.toLowerCase() === query.toLowerCase()),
    [filteredOptions, query]
  );

  useEffect(() => {
    const hasSelection = hasOptions ? !!selected : true;
    setIsValid(hasSelection && (isRecognized || emailRegexp.test(email)));
  }, [hasOptions, selected, email, isRecognized]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isValid) {
      if (window.zaraz) {
        const { eventName, eventProps } = DATA[type];
        const eventData = { email };
        if (hasOptions && selected && eventProps?.name) {
          eventData[eventProps.name] = selected.name;
          if (eventProps.id && selected.id) {
            eventData[eventProps.id] = selected.id;
          }
        }
        if (!isRecognized && email) {
          sendGtagEvent('identify', { email });
        }
        sendGtagEvent(eventName, eventData);
      }
      setIsSent(true);
    }
  };

  const isBackendPlatformForm = type === 'backend-platform';
  const backendFormBgClassName =
    'pointer-events-none absolute -top-3.25 left-[max(27rem,calc(100%_-_22.5rem))] aspect-400/275 w-100 md:hidden';

  return (
    <figure
      className={cn(
        'doc-cta not-prose relative my-5 overflow-hidden border border-gray-new-80 bg-gray-new-98 px-7 py-6 sm:p-6',
        'dark:border-gray-new-20 dark:bg-gray-new-8',
        isBackendPlatformForm && 'p-5 sm:p-5',
        className
      )}
    >
      {isBackendPlatformForm ? (
        <>
          <Image
            className={cn(backendFormBgClassName, 'dark:hidden')}
            src={backendFormLightBg}
            alt=""
            width={400}
            height={275}
          />
          <Image
            className={cn(backendFormBgClassName, 'hidden dark:block')}
            src={backendFormDarkBg}
            alt=""
            width={400}
            height={275}
          />
        </>
      ) : (
        <Image
          className="absolute top-0 right-0 bottom-0 h-full w-auto object-cover md:hidden"
          src={patternSvg}
          alt=""
          width={188}
          height={195}
        />
      )}
      <div className="relative z-10">
        <h2 className="my-0! text-xl leading-tight font-medium tracking-tight text-black-pure dark:text-white">
          {title}
        </h2>
        <p className="mt-2.5 max-w-md text-base leading-normal font-normal tracking-tight text-gray-new-20 opacity-90 dark:text-gray-new-80">
          {description}
        </p>
        {!isSent ? (
          <form
            className="mt-6 flex items-end gap-4 md:flex-col md:items-start"
            onSubmit={handleSubmit}
          >
            {hasOptions && (
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
                        'h-11 w-full min-w-82.5 border border-gray-new-80 bg-white py-2 pr-8 pl-4 text-base leading-snug tracking-extra-tight placeholder:text-gray-new-40 xl:text-sm md:min-w-0',
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
            )}
            {!isRecognized && (
              <input
                type="email"
                name="email"
                value={email}
                className={cn(
                  'h-11 min-w-64 border border-gray-new-80 bg-white px-4 py-2 text-base leading-snug tracking-extra-tight remove-autocomplete-styles placeholder:text-gray-new-40 md:w-full',
                  '2xl:min-w-52 xl:min-w-40',
                  'focus:outline focus:-outline-offset-1 focus:outline-gray-new-70',
                  'dark:border-gray-new-30 dark:bg-gray-new-15 dark:placeholder:text-gray-new-60 dark:focus:outline-gray-new-30',
                  isBackendPlatformForm && 'min-w-82.5 2xl:min-w-82.5 xl:min-w-82.5 md:min-w-0'
                )}
                placeholder="Email"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            )}

            <Button
              className={cn(
                'rounded-full px-7 py-3.5 text-base leading-none font-medium tracking-tight md:w-full',
                !isValid
                  ? 'pointer-events-none bg-gray-new-40 select-none dark:bg-gray-new-80'
                  : 'bg-black-pure dark:bg-white'
              )}
              theme="white-filled-multi"
              type="submit"
              disabled={!isValid}
            >
              {buttonText}
            </Button>
          </form>
        ) : (
          <div className="mt-6 flex min-h-10 items-center gap-2 sm:min-h-0 sm:items-start">
            <CheckIcon className="-mt-1 size-4 shrink-0 text-green-45 sm:mt-1" aria-hidden />
            <p className="text-[17px] font-light">
              {confirmation || 'Request logged. We appreciate your feedback!'}
            </p>
          </div>
        )}
      </div>
    </figure>
  );
};

RequestForm.propTypes = {
  className: PropTypes.string,
  type: PropTypes.oneOf(Object.keys(DATA)).isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  buttonText: PropTypes.string,
  confirmation: PropTypes.string,
};

export default RequestForm;
