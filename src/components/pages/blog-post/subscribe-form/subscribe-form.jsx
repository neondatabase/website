'use client';

import clsx from 'clsx';
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion';
import { useState } from 'react';
import useCookie from 'react-use/lib/useCookie';
import useLocation from 'react-use/lib/useLocation';

import LinesIllustration from 'components/shared/lines-illustration';
import { HUBSPOT_NEWSLETTERS_FORM_ID } from 'constants/forms';
import useLocalStorage from 'hooks/use-local-storage';
import CheckIcon from 'icons/subscription-form-check.inline.svg';
import { doNowOrAfterSomeTime, emailRegexp, sendHubspotFormData } from 'utils/forms';

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

const SubscribeForm = () => {
  const [email, setEmail] = useState('');
  const [formState, setFormState] = useState(STATES.DEFAULT);
  const [submittedEmail, setSubmittedEmail] = useLocalStorage('submittedEmailNewsletterForm', []);
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
          formId: HUBSPOT_NEWSLETTERS_FORM_ID,
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
            setErrorMessage('Something went wrong. Please reload the page and try again');
          }, loadingAnimationStartedTime);
        }
      } catch (error) {
        doNowOrAfterSomeTime(() => {
          setFormState(STATES.ERROR);
          setErrorMessage('Something went wrong. Please reload the page and try again');
        }, loadingAnimationStartedTime);
      }
    }
  };

  return (
    <section className="subscribe-form safe-paddings overflow-hidden pt-[118px] pb-[125px] xl:pt-[104px] xl:pb-[123px] lg:pt-20 lg:pb-28 md:pt-16 md:pb-24">
      <div className="mx-auto flex max-w-[1166px] items-center justify-between pr-12 2xl:px-10 2xl:pr-0 lg:flex-col lg:px-8 md:px-4">
        <div className="relative z-20 lg:text-center">
          <h2 className="text-4xl leading-none tracking-tighter xl:text-[36px] sm:text-[32px]">
            Subscribe to <mark className="bg-transparent text-green">Neon’s News</mark>
          </h2>
          <p className="mt-3.5 text-lg leading-tight tracking-[-0.02em] text-gray-new-80 lg:mt-2.5 sm:mx-auto sm:max-w-[300px]">
            Get insider access to Neon's latest news and events
          </p>
        </div>
        <form
          className="relative w-full max-w-[518px] xl:max-w-[456px] lg:mt-5 md:mt-7"
          onSubmit={handleSubmit}
        >
          <div className="relative z-20">
            <input
              className={clsx(
                'remove-autocomplete-styles h-14 w-full appearance-none rounded-[50px] border bg-black-new pl-7 pr-36 text-white placeholder:text-white/60 focus:outline-none',
                formState === STATES.ERROR ? 'border-secondary-1' : 'border-green',
                formState === STATES.SUCCESS ? 'text-green' : 'text-white'
              )}
              type="email"
              name="email"
              value={email}
              placeholder="Your email address..."
              disabled={formState === STATES.LOADING || formState === STATES.SUCCESS}
              onChange={handleInputChange}
            />
            <LazyMotion features={domAnimation}>
              <AnimatePresence>
                {(formState === STATES.DEFAULT || formState === STATES.ERROR) && (
                  <m.button
                    className={clsx(
                      'absolute inset-y-2 right-2 h-10 rounded-[80px] py-3 px-7 font-bold leading-none text-black transition-colors duration-200 sm:py-3 sm:px-5',
                      formState === STATES.ERROR
                        ? 'bg-secondary-1/50'
                        : 'bg-green hover:bg-[#00FFAA]'
                    )}
                    type="submit"
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={appearAndExitAnimationVariants}
                  >
                    Subscribe
                  </m.button>
                )}
                {formState === STATES.LOADING && (
                  <m.div
                    className={clsx(
                      'absolute top-1/2 right-2 flex -translate-y-1/2 items-center justify-center rounded-full'
                    )}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={appearAndExitAnimationVariants}
                    aria-hidden
                  >
                    <div className="h-10 w-10 rounded-full border-4 border-gray-new-20" />
                    <svg
                      className="absolute top-1/2 left-1/2 h-10 w-10"
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
                        stroke="#00e699"
                        strokeWidth="6"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1, transition: { duration: 2, delay: 0.2 } }}
                      />
                    </svg>
                  </m.div>
                )}
                {formState === STATES.SUCCESS && (
                  <m.div
                    className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-green text-black"
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={appearAndExitAnimationVariants}
                  >
                    <CheckIcon className="h-10 w-10" />
                  </m.div>
                )}
              </AnimatePresence>
            </LazyMotion>

            {formState === STATES.ERROR && errorMessage && (
              <span className="absolute top-full left-7 mt-2.5 text-sm leading-none tracking-[-0.02em] text-secondary-1 sm:text-xs sm:leading-tight">
                {errorMessage}
              </span>
            )}
          </div>
          <LinesIllustration
            className="z-10 w-full"
            spread="4"
            color={formState === STATES.ERROR ? '#FF4C79' : '#00E599'}
            size="sm"
          />
        </form>
      </div>
    </section>
  );
};

export default SubscribeForm;
