'use client';

import clsx from 'clsx';
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion';
import Image from 'next/image';
import React, { useState } from 'react';
import useCookie from 'react-use/lib/useCookie';
import useLocation from 'react-use/lib/useLocation';

import Button from 'components/shared/button';
import Link from 'components/shared/link';
import { HUBSPOT_EARLY_ACCESS_FORM_ID } from 'constants/forms';
import LINKS from 'constants/links';
import useLocalStorage from 'hooks/use-local-storage';
import logoBlack from 'images/logo-black.svg';
import logoWhite from 'images/logo-white.svg';
import { doNowOrAfterSomeTime, emailRegexp, sendHubspotFormData } from 'utils/forms';
import sendGtagEvent from 'utils/send-gtag-event';

import CheckIcon from './images/check.inline.svg';
import illustration from './images/illustration.png';

const appearAndExitAnimationVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const Hero = () => {
  const [email, setEmail] = useState('');
  const [formState, setFormState] = useState('default');
  const [errorMessage, setErrorMessage] = useState('');
  const [submittedEmail, setSubmittedEmail] = useLocalStorage('submittedEmailEarlySuccessForm', []);
  const [hubspotutk] = useCookie('hubspotutk');
  const { href } = useLocation();
  const context = {
    hutk: hubspotutk,
    pageUri: href,
  };
  const handleInputChange = (event) => setEmail(event.currentTarget.value.trim());

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!email) {
      setErrorMessage('Please enter your email');
    } else if (!emailRegexp.test(email)) {
      setErrorMessage('Please enter a valid email');
    } else if (submittedEmail.includes(email)) {
      setErrorMessage('You have already submitted this email');
    } else {
      setSubmittedEmail([...submittedEmail, email]);
      setErrorMessage('');
      setFormState('loading');

      const loadingAnimationStartedTime = Date.now();

      sendHubspotFormData({
        formId: HUBSPOT_EARLY_ACCESS_FORM_ID,
        context,
        values: [
          {
            name: 'email',
            value: email,
          },
        ],
      })
        .then((response) => {
          if (response.ok) {
            sendGtagEvent('early_access_submitted');

            doNowOrAfterSomeTime(() => {
              setFormState('success');

              setTimeout(() => {
                setFormState('default');
                setEmail('');
              }, 2000);
            }, loadingAnimationStartedTime);
          } else {
            doNowOrAfterSomeTime(() => {
              setFormState('default');
              setErrorMessage('Something went wrong. Please reload the page and try again');
            }, loadingAnimationStartedTime);
          }
        })
        .catch(() => {
          doNowOrAfterSomeTime(() => {
            setFormState('default');
            setErrorMessage('Something went wrong. Please reload the page and try again');
          }, loadingAnimationStartedTime);
        });
    }
  };

  return (
    <section className="safe-paddings flex h-screen min-h-[760px] lg:h-auto lg:min-h-screen lg:flex-col">
      <div className="relative min-w-[768px] bg-black p-8 text-white 2xl:min-w-0 lg:order-last lg:max-w-none lg:py-7 md:px-4">
        <div className="m-auto max-w-[520px]">
          <Link className="inline-block align-top lg:hidden" to="/">
            <img src={logoWhite} alt="Neon" width={128} height={36} />
          </Link>
          <h2 className="mt-28 text-[28px]  font-bold 2xl:mt-12 lg:mt-0 lg:max-w-[450px] md:text-[26px]">
            Neon Technical Preview
          </h2>
          <p className="mt-5 border-t border-t-[#2E3338] pt-5 font-semibold">Free Tier includes:</p>
          <ul className="mt-5 space-y-4">
            {['compute up to 1 vCPU / 256 MB', 'up to 10 GiB storage', '3 projects per user'].map(
              (item, index) => (
                <li className="flex items-center space-x-2 font-bold" key={index}>
                  <CheckIcon />
                  <span>{item}</span>
                </li>
              )
            )}
          </ul>
        </div>
        <Image
          className="!absolute bottom-0 right-0 lg:!hidden"
          src={illustration}
          alt=""
          aria-hidden
        />
      </div>
      <div className="flex grow items-center justify-center">
        <div className="max-w-[470px] lg:pb-10 lg:pt-3.5 md:w-full md:max-w-none md:px-4">
          <Link className="lg:alight-top hidden lg:inline-block" to="/">
            <img src={logoBlack} alt="Neon" />
          </Link>
          <h1 className="text-[28px] font-bold lg:mt-10 lg:text-center md:text-[26px]">
            Get serverless, fault-tolerant, branchable Postgres
          </h1>
          <p className="mt-2.5 lg:text-center">
            Start with free tier. Setup takes under 5 seconds.
          </p>
          <form className="mt-7 lg:mt-5" noValidate onSubmit={handleSubmit}>
            <LazyMotion features={domAnimation}>
              <div className="relative">
                <input
                  className={clsx(
                    'remove-autocomplete-styles h-11 w-full appearance-none rounded border border-[#c7ccd1] px-3.5 transition-colors duration-200',
                    errorMessage && 'border-[#FF4C79]'
                  )}
                  name="email"
                  type="email"
                  value={email}
                  placeholder="Enter your email"
                  autoComplete="email"
                  style={{ boxShadow: '0px 1px 2px rgba(23, 26, 28, 0.06)' }}
                  readOnly={formState !== 'default'}
                  onChange={handleInputChange}
                />

                <AnimatePresence>
                  {errorMessage && (
                    <m.span
                      className="absolute -bottom-1 left-0 w-full translate-y-full text-[12px] font-semibold text-[#FF4C79]"
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      variants={appearAndExitAnimationVariants}
                    >
                      {errorMessage}
                    </m.span>
                  )}
                </AnimatePresence>
              </div>
              <div className="mt-7 flex items-center justify-between lg:mt-6 lg:flex-col lg:items-center lg:justify-center lg:space-y-6">
                <Button
                  className="relative"
                  size="xs"
                  theme="primary"
                  disabled={formState !== 'default'}
                >
                  <span
                    className={clsx(
                      'transition-opacity duration-200',
                      (formState === 'loading' || formState === 'success') && 'opacity-0'
                    )}
                  >
                    Request Early Access
                  </span>
                  <span
                    className={clsx(
                      'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200',
                      formState !== 'success' && 'opacity-0'
                    )}
                  >
                    Success!
                  </span>
                  {formState === 'loading' && (
                    <AnimatePresence>
                      <m.svg
                        className="absolute left-1/2 top-1/2 h-[28px] w-[28px]"
                        width="58"
                        height="58"
                        viewBox="0 0 58 58"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ transform: 'scale(1, -1) rotate(-90deg) translate(-50%, -50%)' }}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        variants={appearAndExitAnimationVariants}
                      >
                        <m.path
                          d="M3 29C3 43.3594 14.6406 55 29 55C43.3594 55 55 43.3594 55 29C55 14.6406 43.3594 3 29 3C14.6406 3 3 14.6406 3 29Z"
                          strokeLinecap="round"
                          stroke="#1a1a1a"
                          strokeWidth="6"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1, transition: { duration: 2, delay: 0.2 } }}
                        />
                      </m.svg>
                    </AnimatePresence>
                  )}
                </Button>
                <p className="text-[14px]">
                  Have an invite code?{' '}
                  <Link
                    className="font-semibold text-[#0D80F2] hover:underline"
                    to={LINKS.dashboard}
                  >
                    Log In
                  </Link>
                </p>
              </div>
            </LazyMotion>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Hero;
