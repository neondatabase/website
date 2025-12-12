'use client';

import clsx from 'clsx';
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion';
import PropTypes from 'prop-types';
import { useState } from 'react';

import GradientBorder from 'components/shared/gradient-border';
import { FORM_STATES } from 'constants/forms';
import SendIcon from 'icons/send.inline.svg';
import CheckIcon from 'icons/subscription-form-check.inline.svg';
import { doNowOrAfterSomeTime, emailRegexp } from 'utils/forms';
import sendGtagEvent from 'utils/send-gtag-event';

function getCookie(name) {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

const appearAndExitAnimationVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const themeClassNames = {
  sidebar: {
    block: 'flex-col gap-3 p-3.5 lg:flex-row lg:items-center lg:gap-[72px]',
    title: 'text-[15px] lg:shrink-0 lg:text-lg',
    input: 'pr-20 lg:pr-32',
    sendText: 'hidden lg:block',
    errorMessage: 'mt-5 sm:mt-6',
  },
  default: {
    block: 'items-center gap-[72px] px-6 py-[18px]',
    title: 'shrink-0 text-lg',
    input: 'pr-32',
    sendIcon: 'hidden',
    errorMessage: 'mt-1.5 sm:mt-6',
  },
};

const ChangelogForm = ({ isSidebar = false, className }) => {
  const theme = isSidebar ? 'sidebar' : 'default';
  const classNames = themeClassNames[theme];

  const isRecognized = !!getCookie('ajs_user_id');
  const [email, setEmail] = useState('');
  const [formState, setFormState] = useState(FORM_STATES.DEFAULT);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (event) => {
    setEmail(event.currentTarget.value.trim());
    setFormState(FORM_STATES.DEFAULT);
    setErrorMessage('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email) {
      setErrorMessage('Please enter your email');
      setFormState(FORM_STATES.ERROR);
    } else if (!emailRegexp.test(email)) {
      setErrorMessage('Please enter a valid email');
      setFormState(FORM_STATES.ERROR);
    } else {
      setErrorMessage('');
      setFormState(FORM_STATES.LOADING);

      const loadingAnimationStartedTime = Date.now();

      try {
        if (window.zaraz) {
          // Send identify event if user is not recognized
          if (!isRecognized) {
            await sendGtagEvent('identify', { email });
          }
          // Send changelog subscription event
          await sendGtagEvent('Changelog Subscription', { email });
        }

        doNowOrAfterSomeTime(() => {
          setFormState(FORM_STATES.SUCCESS);
          setEmail('Thank you!');
        }, loadingAnimationStartedTime);
        doNowOrAfterSomeTime(() => {
          setFormState(FORM_STATES.DEFAULT);
          setEmail('');
        }, loadingAnimationStartedTime + 3000);
      } catch (error) {
        doNowOrAfterSomeTime(() => {
          setFormState(FORM_STATES.ERROR);
          setErrorMessage('Please reload the page and try again');
        }, loadingAnimationStartedTime);
      }
    }
  };

  return (
    <div
      className={clsx(
        'changelog-form safe-paddings relative flex scroll-mt-20 rounded-lg bg-gray-new-94',
        classNames.block,
        className,
        'lg:scroll-mt-10 lg:p-[18px] lg:pt-[14px] md:gap-10 sm:flex-col sm:items-start sm:gap-2.5',
        'dark:bg-transparent dark:bg-subscribe-form-dark dark:shadow-[0px_2px_10px_0px_rgba(0,0,0,.4),0px_2px_30px_0px_rgba(0,0,0,.5)]'
      )}
      id="changelog-form"
    >
      <h2
        className={clsx(classNames.title, 'font-medium leading-snug tracking-tighter xs:text-base')}
      >
        Subscribe to our changelog.
        <br /> No spam, guaranteed.
      </h2>
      <form className="relative w-full flex-1" method="POST" noValidate onSubmit={handleSubmit}>
        <input
          className={clsx(
            'remove-autocomplete-styles h-[38px] w-full appearance-none pl-4 tracking-extra-tight',
            (formState === FORM_STATES.DEFAULT || formState === FORM_STATES.ERROR) &&
              classNames.input,
            'rounded-full border bg-white text-[13px] focus:outline-none dark:bg-black-new lg:text-base xs:pr-20',
            formState === FORM_STATES.ERROR
              ? 'border-secondary-1'
              : 'border-gray-new-90 dark:border-gray-new-15',
            formState === FORM_STATES.SUCCESS && 'dark:text-green-45',
            'placeholder:text-gray-new-50/60 dark:placeholder:text-gray-new-70/60'
          )}
          type="email"
          name="email"
          value={email}
          placeholder="Your email..."
          disabled={formState === FORM_STATES.LOADING || formState === FORM_STATES.SUCCESS}
          onChange={handleInputChange}
        />
        <LazyMotion features={domAnimation}>
          <AnimatePresence>
            {(formState === FORM_STATES.DEFAULT || formState === FORM_STATES.ERROR) && (
              <m.button
                className={clsx(
                  'absolute inset-y-1 right-1 rounded-full outline-none',
                  'h-[30px] min-w-16 px-6',
                  'text-black-new transition-colors duration-200',
                  formState === FORM_STATES.ERROR
                    ? 'bg-secondary-1/50'
                    : 'bg-green-45 hover:bg-[#00FFAA]'
                )}
                type="submit"
                initial="initial"
                animate="animate"
                exit="exit"
                aria-label="Subscribe"
                disabled={formState !== FORM_STATES.DEFAULT}
                variants={appearAndExitAnimationVariants}
              >
                <span
                  className={clsx(
                    classNames.sendText,
                    'text-[13px] font-semibold tracking-extra-tight xs:hidden'
                  )}
                >
                  Subscribe
                </span>
                <SendIcon className={clsx(classNames.sendIcon, 'lg:hidden xs:block')} />
              </m.button>
            )}
            {formState === FORM_STATES.LOADING && (
              <m.div
                className="absolute inset-y-1 right-1 size-[30px] rounded-full bg-green-45"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={appearAndExitAnimationVariants}
                aria-hidden
              >
                <svg
                  className="absolute left-1/2 top-1/2 size-5"
                  width="20"
                  height="20"
                  viewBox="0 0 58 58"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ transform: 'scale(1, -1) rotate(-90deg) translate(-50%, -50%)' }}
                >
                  <m.path
                    d="M3 29C3 43.3594 14.6406 55 29 55C43.3594 55 55 43.3594 55 29C55 14.6406 43.3594 3 29 3C14.6406 3 3 14.6406 3 29Z"
                    strokeLinecap="round"
                    stroke="#0c0d0d"
                    strokeWidth="6"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1, transition: { duration: 2, delay: 0.2 } }}
                  />
                </svg>
              </m.div>
            )}
            {formState === FORM_STATES.SUCCESS && (
              <m.div
                className="absolute inset-y-1 right-1 rounded-full bg-green-45 text-black"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={appearAndExitAnimationVariants}
                data-test="success-message"
              >
                <CheckIcon className="size-[30px]" />
              </m.div>
            )}
          </AnimatePresence>
        </LazyMotion>

        {formState === FORM_STATES.ERROR && errorMessage && (
          <span
            className={clsx(
              'absolute left-1/2 top-full -translate-x-1/2 whitespace-nowrap',
              'text-xs leading-none tracking-extra-tight text-secondary-1',
              classNames.errorMessage
            )}
            data-test="error-message"
          >
            {errorMessage}
          </span>
        )}
      </form>
      <GradientBorder className="hidden !rounded-[10px] dark:block" withBlend />
    </div>
  );
};

ChangelogForm.propTypes = {
  isSidebar: PropTypes.bool,
  className: PropTypes.string,
};

export default ChangelogForm;
