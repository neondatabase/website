'use client';

import clsx from 'clsx';
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion';
import Image from 'next/image';
import PropTypes from 'prop-types';
import { useState } from 'react';
import useCookie from 'react-use/lib/useCookie';
import useLocation from 'react-use/lib/useLocation';

import LinesIllustration from 'components/shared/lines-illustration';
import { HUBSPOT_NEWSLETTERS_FORM_ID } from 'constants/forms';
import useLocalStorage from 'hooks/use-local-storage';
import CheckIcon from 'icons/subscription-form-check.inline.svg';
import { doNowOrAfterSomeTime, emailRegexp, sendHubspotFormData } from 'utils/forms';

import SendIcon from './images/send.inline.svg';
import subscribeSmPattern from './images/subscribe-sm.pattern.svg';

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

const SubscribeForm = ({ className = null, size = 'lg', dataTest }) => {
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
    <section
      className={clsx(
        'subscribe-form safe-paddings scroll-mt-20 overflow-hidden',
        {
          'pb-[125px] pt-[118px] xl:pb-[123px] xl:pt-[104px] lg:pb-28 lg:pt-20 md:pb-24 md:pt-16':
            size === 'lg',
          'mt:pt-7 -mx-7 rounded-xl bg-black-new px-[60px] py-[70px] 2xl:mx-0 2xl:px-7 xl:py-14 lt:px-11 lg:pb-16 md:px-5 md:pb-12 md:pt-7':
            size === 'md',
          'relative overflow-hidden rounded-md px-7 py-6': size === 'sm',
          'before:absolute before:inset-0 before:z-[0] before:rounded-md before:bg-secondary-9 before:bg-opacity-10 before:bg-subscribe-sm after:absolute after:inset-px after:z-[0] after:rounded-md after:bg-black-new':
            size === 'sm',
        },
        className
      )}
      id={dataTest}
    >
      {size === 'sm' && (
        <Image
          className="absolute bottom-px right-1 z-[1] h-[98px] w-[458px]"
          src={subscribeSmPattern}
          width={458}
          height={98}
          alt=""
        />
      )}
      <div
        className={clsx(
          'mx-auto flex items-center justify-between',
          size === 'sm' ? 'md:flex-col md:items-center' : 'lg:flex-col',
          {
            'pr-12 2xl:px-10 2xl:pr-0 lg:px-8 md:px-4': size === 'lg',
          }
        )}
      >
        <div className="relative z-20 lg:text-center">
          {size === 'sm' ? (
            <h2 className="w-[220px] shrink font-title text-2xl font-medium leading-dense tracking-tighter">
              Subscribe to receive our latest updates
            </h2>
          ) : (
            <>
              <h2 className="font-title text-4xl font-medium leading-none tracking-tighter xl:text-[32px] sm:text-[28px]">
                Subscribe to <mark className="bg-transparent text-green-45">Neon’s News</mark>
              </h2>
              <p className="mt-4 text-lg leading-none tracking-[-0.02em] text-gray-new-80 xl:mt-2 xl:text-base xl:leading-tight sm:mx-auto sm:mt-2.5 sm:max-w-[300px]">
                Get insider access to Neon's latest news and events
              </p>
            </>
          )}
        </div>
        <form
          className={clsx('relative w-full md:mt-7', {
            'max-w-[518px] xl:max-w-[456px] lg:mt-5': size === 'lg',
            'max-w-[518px] 2xl:max-w-[400px] xl:max-w-[350px] lt:mt-0 lt:max-w-[416px] lg:mt-5 lg:max-w-[464px] sm:mt-6':
              size === 'md',
            'max-w-[350px]': size === 'sm',
          })}
          method="POST"
          data-test={dataTest}
          noValidate
          onSubmit={handleSubmit}
        >
          <div className="relative z-20">
            <input
              className={clsx(
                'remove-autocomplete-styles w-full appearance-none rounded-[50px] border bg-black-new pl-7 text-white placeholder:text-white/60 focus:outline-none md:pr-32 xs:pr-7',
                size === 'sm'
                  ? 'h-12 pr-32 2xl:pl-5 2xl:pr-[120px] xl:pl-7 xl:pr-32'
                  : 'h-14 pr-36',
                formState === STATES.ERROR ? 'border-secondary-1' : 'border-green-45',
                formState === STATES.SUCCESS ? 'text-green-45' : 'text-white'
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
                      'absolute inset-y-2 right-2 rounded-[80px] font-bold leading-none text-black transition-colors duration-200 sm:px-5 xs:flex xs:h-10 xs:w-10 xs:items-center xs:justify-center xs:px-0',
                      size === 'sm'
                        ? 'h-8 px-5 py-2 2xl:px-4 xl:px-5 xs:inset-y-1 xs:right-1'
                        : 'h-10 px-7 py-3',
                      formState === STATES.ERROR
                        ? 'bg-secondary-1/50'
                        : 'bg-green-45 hover:bg-[#00FFAA]'
                    )}
                    type="submit"
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    aria-label="Subscribe"
                    variants={appearAndExitAnimationVariants}
                  >
                    <span className="xs:hidden">Subscribe</span>
                    <SendIcon className="hidden h-6 w-6 xs:block" />
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
                className={clsx(
                  'absolute left-7 top-full text-sm leading-none tracking-[-0.02em] text-secondary-1 sm:text-xs sm:leading-tight',
                  size === 'sm' ? 'mt-1.5' : 'mt-2.5'
                )}
                data-test="error-message"
              >
                {errorMessage}
              </span>
            )}
          </div>
          {size !== 'sm' && (
            <LinesIllustration
              className="z-10 !w-[125%]"
              color={formState === STATES.ERROR ? '#FF4C79' : '#00E599'}
              bgColor="#0C0D0D"
            />
          )}
        </form>
      </div>
    </section>
  );
};

SubscribeForm.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOf(['lg', 'md', 'sm']),
  dataTest: PropTypes.string,
};

export default SubscribeForm;
