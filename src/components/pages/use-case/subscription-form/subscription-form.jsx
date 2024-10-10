'use client';

import clsx from 'clsx';
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion';
import Image from 'next/image';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useCookie, useLocalStorage, useLocation } from 'react-use';

import BgDecor from 'components/shared/use-case-calculator/bg-decor';
import { HUBSPOT_USE_CASES_FORM_ID } from 'constants/forms';
import ErrorIcon from 'icons/error.inline.svg';
import CheckIcon from 'icons/subscription-form-check.inline.svg';
import { doNowOrAfterSomeTime, emailRegexp, sendHubspotFormData } from 'utils/forms';

import blueGlow from './images/blue-glow.svg';
import greenGlow from './images/green-glow.svg';
import SendIcon from './images/send.inline.svg';

const STATES = {
  DEFAULT: 'default',
  SUCCESS: 'success',
  ERROR: 'error',
  LOADING: 'loading',
};

const appearAndExitAnimationVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const SubscriptionForm = ({ title, description }) => {
  const [email, setEmail] = useState('');
  const [formState, setFormState] = useState(STATES.DEFAULT);
  const [submittedEmail, setSubmittedEmail] = useLocalStorage('submittedEmailUseCaseForm', []);

  const [errorMessage, setErrorMessage] = useState('');
  const [hubspotutk] = useCookie('hubspotutk');
  const { href } = useLocation();
  const handleInputChange = (event) => {
    setEmail(event.currentTarget.value.trim());
    setFormState(STATES.DEFAULT);
    setErrorMessage('');
  };

  const context = {
    hutk: hubspotutk,
    pageUri: href,
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email) {
      setErrorMessage('Please enter your email');
      setFormState(STATES.ERROR);
    } else if (!emailRegexp.test(email)) {
      setErrorMessage('Please enter a valid email');
      setFormState(STATES.ERROR);
    } else if (submittedEmail.includes(email)) {
      setErrorMessage('You have already submitted this email');
      setFormState(STATES.ERROR);
    } else {
      setSubmittedEmail([...submittedEmail, email]);
      setErrorMessage('');
      setFormState(STATES.LOADING);

      const loadingAnimationStartedTime = Date.now();

      try {
        const response = await sendHubspotFormData({
          formId: HUBSPOT_USE_CASES_FORM_ID,
          context,
          values: [
            {
              name: 'email',
              value: email,
            },
          ],
        });

        if (response.ok) {
          doNowOrAfterSomeTime(() => {
            setFormState(STATES.SUCCESS);
            setEmail('Thank you for subscribing!');
          }, loadingAnimationStartedTime);
        } else {
          doNowOrAfterSomeTime(() => {
            setFormState(STATES.ERROR);
            setErrorMessage('Please reload the page and try again');
          }, loadingAnimationStartedTime);
        }
      } catch (error) {
        doNowOrAfterSomeTime(() => {
          setFormState(STATES.ERROR);
          setErrorMessage('Please reload the page and try again');
        }, loadingAnimationStartedTime);
      }
    }
  };

  return (
    <figure className="not-prose relative mt-12 flex w-full flex-col rounded-[10px] bg-gray-new-8 bg-[linear-gradient(127deg,#0F0F10_0%,#070708_81.66%)] p-8 xl:mt-10 lg:mt-8 sm:mt-6 sm:p-6">
      <div className="relative z-10">
        <h2 className="!my-0 font-title text-2xl font-medium leading-tight tracking-extra-tight">
          {title}
        </h2>
        <p className="mt-1.5 max-w-[636px] tracking-extra-tight text-gray-new-70 lg:max-w-[800px]">
          {description}
        </p>
        <form className="relative mt-[18px] w-full" onSubmit={handleSubmit}>
          <input
            className="remove-autocomplete-styles-apply-form h-12 w-full rounded-full bg-[linear-gradient(95deg,rgba(37,47,62,0.00)_75.17%,#252F3E_110.82%),rgba(24,25,27,0.80)] px-4 py-2.5 text-gray-new-70 placeholder:text-gray-new-40 focus:outline-none"
            type="email"
            name="email"
            value={email}
            placeholder="Email address"
            disabled={formState === STATES.LOADING || formState === STATES.SUCCESS}
            onChange={handleInputChange}
          />
          <LazyMotion features={domAnimation}>
            <AnimatePresence>
              {(formState === STATES.DEFAULT || formState === STATES.ERROR) && (
                <m.button
                  className="absolute right-1 top-1 h-10 rounded-full bg-primary-1 px-[26px] font-semibold leading-none tracking-tighter text-black hover:bg-[#00e5bf] sm:flex sm:w-10 sm:items-center sm:justify-center sm:px-0"
                  type="submit"
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <span className="sm:hidden">Reach out to us</span>
                  <SendIcon className="hidden h-6 w-6 sm:block" />
                </m.button>
              )}
              {formState === STATES.LOADING && (
                <m.div
                  className={clsx(
                    'absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-green-45'
                  )}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={appearAndExitAnimationVariants}
                  aria-hidden
                >
                  <svg
                    className="absolute left-1/2 top-1/2 h-[22px] w-[22px]"
                    width="58"
                    height="58"
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
              {formState === STATES.SUCCESS && (
                <m.div
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-green-45 text-black"
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={appearAndExitAnimationVariants}
                  data-test="success-message"
                >
                  <CheckIcon className="h-10 w-10" />
                </m.div>
              )}
            </AnimatePresence>
          </LazyMotion>
          {formState === STATES.ERROR && errorMessage && (
            <span
              className="absolute top-full z-50 flex h-[42px] translate-y-3 items-center gap-x-2 rounded-md border border-secondary-1/30 bg-[#21191d] px-3 text-sm leading-tight text-[#FF4B7A]
                        before:absolute before:-top-1.5 before:left-[22px] before:h-[11px] before:w-[11px] before:rotate-45 before:rounded-tl-sm before:border-l before:border-t before:border-secondary-1/30 before:bg-[#21191d]"
            >
              <ErrorIcon className="h-4.5 w-4.5" /> {errorMessage}
            </span>
          )}
        </form>
      </div>
      <BgDecor hasBorder hasNoise hasPattern>
        <Image
          className="absolute bottom-0 right-0"
          src={greenGlow}
          width={378}
          height={238}
          alt=""
        />
        <Image
          className="absolute left-0 top-0 h-full w-auto"
          src={blueGlow}
          width={298}
          height={177}
          alt=""
        />
      </BgDecor>
    </figure>
  );
};

export default SubscriptionForm;

SubscriptionForm.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};
