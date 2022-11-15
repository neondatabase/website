import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { StaticImage } from 'gatsby-plugin-image';
import React from 'react';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import { HUBSPOT_LAUNCH_WEEK_FORM_ID } from 'constants/forms';
import useEmailSubmitForm from 'hooks/use-email-submit-form';
import CheckIcon from 'icons/subscription-form-check.inline.svg';
import ErrorIcon from 'icons/subscription-form-error.inline.svg';
import SendIcon from 'icons/subscription-form-send.inline.svg';

import backgroundLines from './images/bg-lines.svg';
import Line from './images/white-line.inline.svg';

const appearAndExitAnimationVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const Hero = () => {
  const { email, formState, errorMessage, handleInputChange, handleSubmit } = useEmailSubmitForm({
    formId: HUBSPOT_LAUNCH_WEEK_FORM_ID,
    successText: 'Thanks for registering!',
  });
  return (
    <div className="relative flex h-[calc(100vh-44px)] max-h-[1080px] min-h-[765px] flex-col overflow-hidden bg-black pt-[214px] pb-20 text-white lg:min-h-0 lg:pt-[28%] sm:h-[calc(100vh-206px)]">
      <Container className="relative h-full w-full" size="md">
        <img
          className="absolute -top-10 left-1/2 max-w-[1240px] -translate-x-1/2"
          src={backgroundLines}
          alt=""
          width={1240}
          height={871}
          aria-hidden
        />
        <div className="absolute -bottom-20 left-1/2 w-[92%] -translate-x-1/2 3xl:w-[1650px] lg:w-[1000px] md:w-[900px]">
          <StaticImage src="./images/background.png" alt="" width={1650} height={568} aria-hidden />
        </div>
        <div className="relative z-10 flex flex-col items-center">
          <time
            className="rounded-[40px] bg-secondary-2 py-2 px-4 text-xs font-bold uppercase leading-none text-black"
            dateTime="2022-12-05"
          >
            5 December 2022
          </time>
          <h1 className="mt-5 text-center text-[72px] font-bold leading-dense 2xl:text-6xl xl:text-5xl lg:text-4xl">
            Neon Launch Week
          </h1>
          <p className="mt-5 max-w-[640px] text-center text-xl leading-normal">
            Register to Neon Launch Week at 5th of December and be the first who will see the latest
            updates from our team
          </p>
          <div className="relative">
            <Line className="absolute top-[calc(100%+5px)] right-24 2xl:top-full lg:hidden" />
            <form
              className={clsx(
                'relative ml-[14px] mt-8 before:absolute before:-bottom-3.5 before:-left-3.5 before:h-full before:w-full before:rounded-full before:bg-secondary-2 2xl:ml-2.5 2xl:before:-bottom-2.5 2xl:before:-left-2.5 xl:ml-2 xl:before:-bottom-2 xl:before:-left-2 lg:mx-auto lg:max-w-[584px] md:before:w-[calc(100%+8px)]'
              )}
              noValidate
              onSubmit={handleSubmit}
            >
              <input
                className={clsx(
                  'remove-autocomplete-styles t-2xl relative block h-24 w-[696px] rounded-full border-4 border-black bg-white pl-7 pr-[218px] font-semibold leading-none text-black placeholder-black outline-none transition-colors duration-200 3xl:w-[576px] 2xl:h-20 2xl:w-[478px] 2xl:pr-[187px] xl:h-[72px] xl:w-[448px] xl:pr-[164px] lg:w-full lg:pl-5 md:pr-20',
                  errorMessage && 'border-secondary-1'
                )}
                name="email"
                type="email"
                placeholder="Your email address..."
                autoComplete="email"
                value={email}
                readOnly={formState !== 'default'}
                onChange={handleInputChange}
              />

              {/* Error message */}
              <AnimatePresence>
                {errorMessage && (
                  <motion.span
                    className="t-base absolute left-1/2 -bottom-5 w-full translate-y-full -translate-x-1/2 text-center font-semibold !leading-snug text-secondary-1 lg:-bottom-4"
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={appearAndExitAnimationVariants}
                  >
                    {errorMessage}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Button */}
              <AnimatePresence>
                {formState === 'default' && (
                  <motion.div
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={appearAndExitAnimationVariants}
                  >
                    <Button
                      className="absolute right-3 top-1/2 -translate-y-1/2 2xl:right-2.5 xl:right-2 md:h-14 md:w-14 md:rounded-full md:p-0"
                      size="sm"
                      type="submit"
                      theme="primary"
                      disabled={formState !== 'default'}
                    >
                      <span className="md:sr-only">Register</span>
                      <SendIcon className="hidden md:ml-1.5 md:block" aria-hidden />
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Loading state */}
              <AnimatePresence>
                {formState === 'loading' && (
                  <motion.div
                    className="absolute right-3 top-1/2 flex h-[72px] w-[72px] -translate-y-1/2 items-center justify-center rounded-full bg-black 2xl:right-2.5 2xl:h-[60px] 2xl:w-[60px] xl:right-2 xl:h-[56px] xl:w-[56px]"
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={appearAndExitAnimationVariants}
                    aria-hidden
                  >
                    <div className="h-[58px] w-[58px] rounded-full border-[6px] border-gray-2 2xl:h-[48px] 2xl:w-[48px] xl:h-[42px] xl:w-[42px]" />
                    <svg
                      className="absolute top-1/2 left-1/2 2xl:h-[48px] 2xl:w-[48px] xl:h-[42px] xl:w-[42px]"
                      width="58"
                      height="58"
                      viewBox="0 0 58 58"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ transform: 'scale(1, -1) rotate(-90deg) translate(-50%, -50%)' }}
                    >
                      <motion.path
                        d="M3 29C3 43.3594 14.6406 55 29 55C43.3594 55 55 43.3594 55 29C55 14.6406 43.3594 3 29 3C14.6406 3 3 14.6406 3 29Z"
                        strokeLinecap="round"
                        stroke="#00e699"
                        strokeWidth="6"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1, transition: { duration: 2, delay: 0.2 } }}
                      />
                    </svg>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Success state */}
              <AnimatePresence>
                {(formState === 'success' || formState === 'error') && (
                  <motion.div
                    className="absolute right-3 top-1/2 -translate-y-1/2 2xl:right-2.5 xl:right-2"
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={appearAndExitAnimationVariants}
                    aria-hidden
                  >
                    {formState === 'success' && <CheckIcon className="2xl:w-[60px] xl:w-[56px]" />}
                    {formState === 'error' && <ErrorIcon className="2xl:w-[60px] xl:w-[56px]" />}
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Hero;
