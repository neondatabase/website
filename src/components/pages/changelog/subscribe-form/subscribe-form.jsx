'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion';
import Image from 'next/image';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import Field from 'components/shared/field';
import { FORM_STATES } from 'constants/forms';
import CheckIcon from 'icons/subscription-form-check.inline.svg';
import patternImage from 'images/pages/docs/cta/pattern.png';
import { cn } from 'utils/cn';
import { doNowOrAfterSomeTime } from 'utils/forms';
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

const schema = yup
  .object({
    email: yup
      .string()
      .trim()
      .email('Please enter a valid email')
      .required('Please enter your email'),
  })
  .required();

const SubscribeForm = ({ className }) => {
  const isRecognized = !!getCookie('ajs_user_id');
  const [formState, setFormState] = useState(FORM_STATES.DEFAULT);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
    },
  });

  useEffect(() => {
    const hasErrors = Object.keys(errors).length > 0;
    if (formState !== FORM_STATES.LOADING && formState !== FORM_STATES.SUCCESS) {
      if (hasErrors) setFormState(FORM_STATES.ERROR);
      else setFormState(FORM_STATES.DEFAULT);
    }
  }, [errors, formState]);

  const onSubmit = async ({ email }, event) => {
    event.preventDefault();
    setFormState(FORM_STATES.LOADING);

    const loadingAnimationStartedTime = Date.now();

    try {
      if (window.zaraz) {
        if (!isRecognized) {
          await sendGtagEvent('identify', { email });
        }
        await sendGtagEvent('Changelog Subscription', { email });
      }

      doNowOrAfterSomeTime(() => {
        setFormState(FORM_STATES.SUCCESS);
        setValue('email', 'Thank you!');
      }, loadingAnimationStartedTime);

      doNowOrAfterSomeTime(() => {
        setFormState(FORM_STATES.DEFAULT);
        reset();
      }, loadingAnimationStartedTime + 3000);
    } catch (_error) {
      doNowOrAfterSomeTime(() => {
        setFormState(FORM_STATES.ERROR);
        setError('email', {
          type: 'manual',
          message: 'Please reload the page and try again',
        });
      }, loadingAnimationStartedTime);
    }
  };

  return (
    <section
      className={cn(
        'relative border border-[#C7D4CE] bg-[#E4F1EB]/40 px-5 py-5',
        'dark:border-gray-new-30 dark:bg-gray-new-10',
        className
      )}
      id="changelog-form"
    >
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        <Image
          className="absolute top-1/2 right-0 bottom-0 h-41 w-auto -translate-y-1/2 object-cover sm:hidden"
          src={patternImage}
          alt=""
          width={188}
          height={163}
          loading="eager"
        />
      </div>

      <div className="relative z-10">
        <h2 className="text-xl leading-tight font-medium tracking-tight text-black-new dark:text-white sm:text-lg/tight">
          Subscribe to our changelog. No spam, guaranteed.
        </h2>

        <form className="relative mt-5" method="POST" noValidate onSubmit={handleSubmit(onSubmit)}>
          <div className="flex max-w-[608px] items-start gap-3 sm:max-w-none sm:flex-col">
            <div className="relative w-full">
              <Field
                className="w-full"
                theme="transparent"
                errorTheme="tooltip"
                errorClassName="[--error-tooltip-bg:#fff] dark:[--error-tooltip-bg:#18191B]"
                name="email"
                label="Email"
                labelClassName="hidden"
                type="email"
                placeholder="Enter your email address"
                isDisabled={formState === FORM_STATES.LOADING || formState === FORM_STATES.SUCCESS}
                error={errors.email?.message}
                inputClassName={cn(
                  'remove-autocomplete-styles m-0 h-11 rounded-none! border-gray-new-80 px-4 py-0 text-base leading-none tracking-tight transition-colors duration-200',
                  'bg-white! text-black-new placeholder:text-gray-new-50',
                  'focus:outline-none focus:border-gray-new-80 focus:border-gray-30',
                  'dark:border-gray-new-30 dark:focus:border-gray-new-30 dark:bg-gray-new-15! dark:text-white dark:placeholder:text-gray-new-50',
                  errors.email
                    ? 'border-secondary-1 dark:border-secondary-1'
                    : 'border-[#CCD6D0] dark:border-[#3E4548]'
                )}
                {...register('email', {
                  setValueAs: (value) => (typeof value === 'string' ? value.trim() : value),
                })}
              />
            </div>

            <LazyMotion features={domAnimation}>
              <AnimatePresence mode="wait">
                {(formState === FORM_STATES.DEFAULT || formState === FORM_STATES.ERROR) && (
                  <m.button
                    key="submit"
                    className={cn(
                      'flex h-11 min-w-[150px] items-center justify-center rounded-full px-7 text-[15px] leading-none font-medium tracking-tight transition-colors duration-200 sm:w-full',
                      'bg-black-new text-white hover:bg-black-new/90',
                      'dark:bg-white dark:text-black-new dark:hover:bg-gray-new-90'
                    )}
                    type="submit"
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    disabled={formState !== FORM_STATES.DEFAULT}
                    variants={appearAndExitAnimationVariants}
                  >
                    Subscribe
                  </m.button>
                )}

                {formState === FORM_STATES.LOADING && (
                  <m.div
                    key="loading"
                    className={cn(
                      'flex h-11 min-w-[150px] items-center justify-center rounded-full sm:w-full',
                      'bg-black-new text-white dark:bg-white dark:text-black-new'
                    )}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={appearAndExitAnimationVariants}
                    aria-hidden
                  >
                    <span className="size-5 animate-spin rounded-full border-2 border-current/20 border-t-current" />
                  </m.div>
                )}

                {formState === FORM_STATES.SUCCESS && (
                  <m.div
                    key="success"
                    className={cn(
                      'flex h-11 min-w-[150px] items-center justify-center rounded-full sm:w-full',
                      'bg-black-new text-white dark:bg-white dark:text-black-new'
                    )}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={appearAndExitAnimationVariants}
                    data-test="success-message"
                    aria-hidden
                  >
                    <CheckIcon className="size-8" />
                  </m.div>
                )}
              </AnimatePresence>
            </LazyMotion>
          </div>
        </form>
      </div>
    </section>
  );
};

SubscribeForm.propTypes = {
  className: PropTypes.string,
};

export default SubscribeForm;
