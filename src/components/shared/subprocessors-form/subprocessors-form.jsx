'use client';

import clsx from 'clsx';
import { useState, useEffect } from 'react';

import Button from 'components/shared/button';
import CheckIcon from 'icons/check.inline.svg';
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

const SubprocessorsForm = () => {
  const { title, description, buttonText } = DATA;

  const isRecognized = !!getCookie('ajs_user_id');
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isSent, setIsSent] = useState(false);

  useEffect(() => {
    // Form is valid if either user is recognized or valid email is given
    setIsValid(isRecognized || emailRegexp.test(email));
  }, [email, isRecognized]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isValid) {
      if (window.zaraz) {
        const { eventName } = DATA;
        if (!isRecognized && email) {
          sendGtagEvent('identify', { email });
        }
        sendGtagEvent(eventName, { email });
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
          {!isRecognized && (
            <input
              type="email"
              name="email"
              value={email}
              className={clsx(
                'remove-autocomplete-styles h-10 flex-1 rounded border-none bg-gray-new-94 px-4 py-3 md:w-full',
                'xl:text-sm',
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
          <p className="text-[17px] font-light">
            Thanks for subscribing! You&apos;ll receive updates when the subprocessor list changes.
          </p>
        </div>
      )}
    </figure>
  );
};

export default SubprocessorsForm;
