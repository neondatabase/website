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

// Schema for validation
const createSchema = () =>
  yup.object({
    url: yup.string().required('This field is required'),
    email: yup
      .string()
      .email('Please enter a valid email address')
      .required('This field is required'),
  });

const fieldProps = {
  theme: 'transparent',
  inputClassName: 'h-12 mt-2.5',
  labelClassName: 'text-base',
};

const ProgramForm = ({ type }) => {
  const { title, description, placeholder, buttonText } = DATA[type];
  const [formState, setFormState] = useState(FORM_STATES.DEFAULT);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(createSchema()),
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

        // Send identify event with user provided email
        await sendGtagEvent('identify', { email });
        await sendGtagEvent(eventName, { email, url });
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
        <div
          className="mt-6 flex min-h-10 items-center gap-2 sm:min-h-0 sm:items-start"
          data-test="success-message"
        >
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
