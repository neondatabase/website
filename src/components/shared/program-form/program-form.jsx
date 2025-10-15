'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import Button from 'components/shared/button';
import Field from 'components/shared/field';
import { FORM_STATES } from 'constants/forms';
import CheckIcon from 'icons/check.inline.svg';
import { doNowOrAfterSomeTime } from 'utils/forms';
import sendGtagEvent from 'utils/send-gtag-event';

import DATA from './data';

function getCookie(name) {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

// Schema for validation
const createSchema = (isRecognized, useCustomEmail) =>
  yup.object({
    url: yup.string().required('This field is required').url('Please enter a valid URL'),
    email: yup.string().when([], {
      is: () => !isRecognized || useCustomEmail,
      then: (schema) =>
        schema.email('Please enter a valid email address').required('This field is required'),
      otherwise: (schema) => schema,
    }),
  });

const fieldProps = {
  theme: 'transparent',
  inputClassName: 'h-12 mt-2.5',
  labelClassName: 'text-base',
};

const ProgramForm = ({ type }) => {
  const { title, description, placeholder, buttonText } = DATA[type];

  // TEST: Temporarily set to true to test recognized user flow
  const isRecognized = !!getCookie('ajs_user_id');
  const [useCustomEmail, setUseCustomEmail] = useState(false);
  const [formState, setFormState] = useState(FORM_STATES.DEFAULT);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(createSchema(isRecognized, useCustomEmail)),
    mode: 'onSubmit',
  });

  const onSubmit = async (data, e) => {
    e.preventDefault();
    const { url, email } = data;
    const loadingAnimationStartedTime = Date.now();

    setFormState(FORM_STATES.LOADING);

    try {
      if (window.zaraz) {
        const { eventName } = DATA[type];

        // Send identify event if user provided email (either not recognized or using custom email)
        const emailToSend = isRecognized && !useCustomEmail ? null : email;

        if (emailToSend) {
          await sendGtagEvent('identify', { email: emailToSend });
        }
        await sendGtagEvent(eventName, { email: emailToSend, url });
      }

      doNowOrAfterSomeTime(() => {
        setFormState(FORM_STATES.SUCCESS);
      }, loadingAnimationStartedTime);
    } catch (error) {
      if (error.name !== 'AbortError') {
        doNowOrAfterSomeTime(() => {
          setFormState(FORM_STATES.ERROR);
        }, loadingAnimationStartedTime);
      }
    }
  };

  return (
    <figure
      className="doc-cta not-prose relative my-5 scroll-mt-20 rounded-[10px] border border-gray-new-94 bg-gray-new-98 p-8 dark:border-gray-new-15 dark:bg-program-form-bg dark:shadow-contact lg:scroll-mt-5 sm:p-6"
      id={`${type}-form`}
    >
      <h2 className="!my-0 text-2xl font-semibold leading-none tracking-extra-tight">{title}</h2>
      <p className="mt-3.5 max-w-[356px] tracking-tight text-gray-new-30 dark:text-[#A1A1AA]">
        {description}
      </p>
      {formState !== FORM_STATES.SUCCESS ? (
        <form className="mt-8" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-7">
            <Field
              {...fieldProps}
              name="url"
              label="Project URL *"
              placeholder={placeholder}
              error={errors.url?.message}
              isDisabled={formState === FORM_STATES.LOADING}
              {...register('url')}
            />

            {isRecognized ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3 rounded bg-green-45/10 p-3 dark:bg-green-45/20 sm:flex-col sm:items-start">
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
                  <Field
                    {...fieldProps}
                    name="email"
                    label="Contact Email *"
                    type="email"
                    placeholder="Enter your preferred email"
                    error={errors.email?.message}
                    isDisabled={formState === FORM_STATES.LOADING}
                    {...register('email')}
                  />
                )}
              </div>
            ) : (
              <Field
                {...fieldProps}
                name="email"
                label="Contact Email *"
                type="email"
                placeholder="Enter your email address"
                error={errors.email?.message}
                isDisabled={formState === FORM_STATES.LOADING}
                {...register('email')}
              />
            )}
          </div>

          <Button
            className="mt-8 h-12 w-full px-6 font-semibold leading-none"
            type="submit"
            theme="primary"
            disabled={formState === FORM_STATES.LOADING}
          >
            {formState === FORM_STATES.LOADING ? 'Submitting...' : buttonText}
          </Button>
        </form>
      ) : (
        <div className="mt-6 flex min-h-10 items-center gap-2 sm:min-h-0 sm:items-start">
          <CheckIcon className="-mt-1 size-4 shrink-0 text-green-45 sm:mt-1" aria-hidden />
          <p className="text-[17px] font-light">
            We&apos;ve received your application and will be in touch soon.
          </p>
        </div>
      )}
    </figure>
  );
};

ProgramForm.propTypes = {
  type: PropTypes.oneOf(Object.keys(DATA)).isRequired,
};

export default ProgramForm;
