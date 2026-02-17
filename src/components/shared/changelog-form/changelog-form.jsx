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
    block:
      'flex-col gap-3 p-3.5 lg:flex-row lg:items-center lg:gap-[72px] dark:border dark:border-gray-new-20',
    title: 'text-base lg:shrink-0 lg:text-lg font-medium leading-tight tracking-extra-tight',
    description:
      'text-[15px] font-normal leading-snug tracking-extra-tight text-gray-new-30 dark:text-gray-new-70 opacity-90',
    input: 'pr-20 lg:pr-32',
    sendText: 'hidden lg:block',
    errorMessage: 'mt-5 sm:mt-6',
  },
  default: {
    block: 'items-center gap-[72px] px-6 py-[18px]',
    title: 'shrink-0 text-lg',
    input: 'pr-32',
    sendIcon: 'hidden',
    submitButton: 'px-6 min-w-16',
    errorMessage: 'mt-1.5 sm:mt-6',
  },
};
const ELLIPSES = [
  {
    color: '#FF6200',
    width: 114,
    height: 85,
    rotate: -28,
    blur: 24,
    left: 155,
    top: 40,
  },
  {
    color: '#1C7154',
    width: 261,
    height: 132,
    rotate: -30,
    blur: 30,
    top: 50,
    left: 10,
  },
  {
    color: '#DDF2FF',
    width: 64,
    height: 47,
    rotate: -38,
    blur: 22,
    top: 81,
    left: 127,
  },
];

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
        'changelog-form safe-paddings relative flex scroll-mt-20 overflow-hidden rounded-none bg-gray-new-94',
        'border border-gray-new-90',
        classNames.block,
        className,
        'lg:scroll-mt-10 lg:p-[18px] lg:pt-[14px] md:gap-10 sm:flex-col sm:items-start sm:gap-2.5',
        'dark:border-[#303236] dark:bg-[rgba(19,20,21,0.6)]'
      )}
      id="changelog-form"
    >
      <div
        className="pointer-events-none absolute bottom-0 right-0 h-[119px] w-[254px] overflow-hidden"
        style={{
          maskImage: "url('/images/background-dots.png')",
          WebkitMaskImage: "url('/images/background-dots.png')",
          maskRepeat: 'no-repeat',
          maskSize: '300% 640.336%',
          maskPosition: '0px -579.5px',
          WebkitMaskRepeat: 'no-repeat',
          WebkitMaskSize: '300% 640.336%',
          WebkitMaskPosition: '0px -579.5px',
        }}
      >
        <div className="absolute top-[35px]">
          {ELLIPSES.map((ellipse, i) => (
            <div
              key={i}
              className="absolute rounded-full mix-blend-color-dodge"
              style={{
                width: ellipse.width,
                height: ellipse.height,
                background: ellipse.color,
                filter: `blur(${ellipse.blur}px)`,
                transform: `rotate(${ellipse.rotate}deg)`,
                top: ellipse.top,
                left: ellipse.left,
              }}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-3.5">
        <h2
          className={clsx(
            classNames.title,
            'relative z-10 font-medium leading-snug tracking-tighter xs:text-base'
          )}
        >
          Subscribe to our changelog
        </h2>
        <p
          className={clsx(
            classNames.description,
            'relative z-10 text-[15px] font-normal leading-snug tracking-extra-tight text-gray-new-30 dark:text-gray-new-70'
          )}
        >
          Receive only our latest updates.
          <br /> No spam, guaranteed.
        </p>
      </div>
      <form
        className="relative z-10 w-full flex-1"
        method="POST"
        noValidate
        onSubmit={handleSubmit}
      >
        <input
          className={clsx(
            'remove-autocomplete-styles h-[38px] w-full appearance-none pl-4 tracking-extra-tight',
            (formState === FORM_STATES.DEFAULT || formState === FORM_STATES.ERROR) &&
              classNames.input,
            'rounded-full border bg-white text-[13px] backdrop-blur-xl focus:outline-none dark:bg-[rgba(19,20,21,0.60)] lg:text-base xs:pr-20',
            formState === FORM_STATES.ERROR
              ? 'border-secondary-1'
              : 'border-gray-new-90 dark:border-gray-new-20',
            formState === FORM_STATES.SUCCESS && 'dark:text-green-45',
            'placeholder:text-gray-new-50/60 dark:placeholder:text-gray-new-40'
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
                  'h-[30px] px-1.5',
                  classNames.submitButton,
                  'text-black-new transition-colors duration-200',
                  formState === FORM_STATES.ERROR
                    ? 'bg-secondary-1/50'
                    : 'bg-white hover:bg-gray-new-90'
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
      <GradientBorder className="hidden dark:block" withBlend />
    </div>
  );
};

ChangelogForm.propTypes = {
  isSidebar: PropTypes.bool,
  className: PropTypes.string,
};

export default ChangelogForm;
