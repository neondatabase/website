'use client';

import clsx from 'clsx';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { boolean } from 'yup';

import Button from 'components/shared/button';
import CheckIcon from 'icons/check.inline.svg';
import { emailRegexp } from 'utils/forms';
import sendGtagEvent from 'utils/send-gtag-event';

import DATA from './data';

const scaleCardBorderVariants = {
  from: {
    opacity: 0,
  },
  to: {
    opacity: [0, 0.4, 0.2, 1, 0.5, 1],
    transition: {
      ease: 'easeInOut',
      duration: 1,
    },
  },
  exit: {
    opacity: 0,
  },
};

function getCookie(name) {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

const ProgramForm = ({ type, focus = false }) => {
  const { title, description, placeholder, buttonText } = DATA[type];

  const isRecognized = !!getCookie('ajs_user_id');
  const [url, setUrl] = useState('');
  const [email, setEmail] = useState('');
  const [useCustomEmail, setUseCustomEmail] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [isSent, setIsSent] = useState(false);

  useEffect(() => {
    // Form is valid if URL is provided and either:
    // - user is recognized and not using custom email, OR
    // - user is recognized, using custom email, and provided valid email, OR
    // - user is not recognized and provided valid email
    const emailValid = isRecognized
      ? !useCustomEmail || emailRegexp.test(email)
      : emailRegexp.test(email);

    setIsValid(!!url && emailValid);
  }, [url, email, isRecognized, useCustomEmail]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isValid) {
      if (window.zaraz) {
        const { eventName } = DATA[type];

        // Send identify event if user provided email (either not recognized or using custom email)
        const emailToSend = isRecognized && !useCustomEmail ? null : email;

        if (emailToSend) {
          await sendGtagEvent('identify', { email: emailToSend });
        }
        await sendGtagEvent(eventName, { email: emailToSend, url });
      }
      setIsSent(true);
    }
  };

  return (
    <figure
      className={clsx(
        'doc-cta not-prose relative my-5 rounded-[10px] border border-gray-new-94 bg-gray-new-98 px-7 py-6 sm:p-6',
        'dark:border-gray-new-15 dark:bg-gray-new-10'
      )}
    >
      <a name={`${type}-form`} className="absolute -top-24" />
      <h2 className="!my-0 font-title text-2xl font-medium leading-dense tracking-extra-tight">
        {title}
      </h2>
      <p className="mt-2.5 font-light leading-tight text-gray-new-30 dark:text-gray-new-70">
        {description}
      </p>
      {!isSent ? (
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="url"
              className="mb-2 block text-sm font-medium text-gray-new-40 dark:text-gray-new-60"
            >
              Project URL *
            </label>
            <input
              type="text"
              id="url"
              name="url"
              value={url}
              className={clsx(
                'remove-autocomplete-styles h-12 w-full rounded border-none bg-gray-new-94 px-4 py-3',
                'focus:outline focus:-outline-offset-1 focus:outline-gray-new-70',
                'dark:bg-gray-new-15 dark:focus:outline-gray-new-30'
              )}
              placeholder={placeholder}
              required
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-new-40 dark:text-gray-new-60"
            >
              Contact Email {!isRecognized && '*'}
            </label>
            {isRecognized ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3 rounded bg-green-45/10 p-3 dark:bg-green-45/20">
                  <div className="flex items-center gap-3">
                    <CheckIcon className="size-4 shrink-0 text-green-45" aria-hidden />
                    <span className="text-sm text-gray-new-30 dark:text-gray-new-70">
                      We have your Neon Account Email
                    </span>
                  </div>
                  <label
                    htmlFor="override"
                    className="flex cursor-pointer items-center gap-2 whitespace-nowrap text-sm"
                  >
                    <input
                      name="override"
                      id="override"
                      type="checkbox"
                      checked={useCustomEmail}
                      className="rounded border-gray-new-70 text-green-45 focus:ring-green-45"
                      onChange={(e) => setUseCustomEmail(e.target.checked)}
                    />
                    <span className="text-gray-new-40 dark:text-gray-new-60">
                      Use a different email address
                    </span>
                  </label>
                </div>
                {useCustomEmail && (
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    className={clsx(
                      'remove-autocomplete-styles h-12 w-full rounded border-none bg-gray-new-94 px-4 py-3',
                      'focus:outline focus:-outline-offset-1 focus:outline-gray-new-70',
                      'dark:bg-gray-new-15 dark:focus:outline-gray-new-30'
                    )}
                    placeholder="Enter your preferred email"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                  />
                )}
              </div>
            ) : (
              <input
                type="email"
                name="email"
                value={email}
                className={clsx(
                  'remove-autocomplete-styles h-12 w-full rounded border-none bg-gray-new-94 px-4 py-3',
                  'focus:outline focus:-outline-offset-1 focus:outline-gray-new-70',
                  'dark:bg-gray-new-15 dark:focus:outline-gray-new-30'
                )}
                placeholder="Enter your email address"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            )}
          </div>

          <Button
            className={clsx('h-12 w-full px-6 font-semibold leading-none')}
            type="submit"
            theme="primary"
          >
            {buttonText}
          </Button>
        </form>
      ) : (
        <div className="mt-6 flex min-h-10 items-center gap-2 sm:min-h-0 sm:items-start">
          <CheckIcon className="-mt-1 size-4 shrink-0 text-green-45 sm:mt-1" aria-hidden />
          <p className="text-[17px] font-light">
            We've received your application and will be in touch soon
            {isRecognized && !useCustomEmail
              ? ' using your Neon account email'
              : email
                ? ` at ${email}`
                : ''}
            .
          </p>
        </div>
      )}
      {focus && (
        <LazyMotion features={domAnimation}>
          <m.span
            className="pointer-events-none absolute left-0 top-0 z-20 h-full w-full rounded-[10px] border border-green-45/70 md:!opacity-100"
            initial="from"
            exit="exit"
            variants={scaleCardBorderVariants}
            animate="to"
            aria-hidden
          />
        </LazyMotion>
      )}
    </figure>
  );
};

ProgramForm.propTypes = {
  type: PropTypes.oneOf(Object.keys(DATA)).isRequired,
  focus: boolean,
};

export default ProgramForm;
