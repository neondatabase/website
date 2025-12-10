'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import useCookie from 'react-use/lib/useCookie';
import * as yup from 'yup';

import Button from 'components/shared/button';
import Field from 'components/shared/field';
import Heading from 'components/shared/heading';
import Link from 'components/shared/link';
import { FORM_STATES } from 'constants/forms';
import LINKS from 'constants/links';
import CloseIcon from 'icons/close.inline.svg';
import { checkBlacklistEmails } from 'utils/check-blacklist-emails';
import { doNowOrAfterSomeTime } from 'utils/forms';
import sendGtagEvent from 'utils/send-gtag-event';

const ErrorMessage = ({ onClose }) => (
  <div className="absolute inset-0 flex items-center justify-center p-5" data-test="error-message">
    <div className="relative z-10 flex max-w-sm flex-col items-center text-center">
      <Heading
        tag="h3"
        theme="white"
        className="text-[32px] font-medium leading-none tracking-extra-tight sm:text-[28px]"
      >
        Oops, looks like there&apos;s a technical problem
      </Heading>
      <p className="mt-3.5 max-w-[236px] leading-tight tracking-extra-tight text-gray-new-70">
        Please reach out to us directly at{' '}
        <Link
          className="border-b border-green-45/40 hover:border-green-45"
          theme="green"
          to="mailto:partnerships@neon.tech"
          target="_blank"
          rel="noopener noreferrer"
        >
          partnerships@neon.tech
        </Link>
      </p>
    </div>
    <Button
      className="absolute right-4 top-4 z-20 p-2 text-white opacity-50 transition-opacity duration-300 hover:opacity-100"
      type="button"
      handleClick={onClose}
      aria-label="Close error message"
    >
      <CloseIcon className="size-4" />
      <span className="sr-only">Close error message</span>
    </Button>
    <span className="absolute inset-0 bg-[#0E0E11]/40 backdrop-blur-md" />
  </div>
);

ErrorMessage.propTypes = {
  onClose: PropTypes.func.isRequired,
};

const schema = yup
  .object({
    companyName: yup.string().required('Required field'),
    firstname: yup.string().required('Required field'),
    lastname: yup.string().required('Required field'),
    email: yup
      .string()
      .email('Please enter a valid email')
      .required('Required field')
      .test(checkBlacklistEmails({ validation: { useDefaultBlockList: true } })),
    jobTitle: yup.string().optional(),
    additionalDetails: yup.string().optional(),
    ajs_anonymous_id: yup.string().optional(),
  })
  .required();

const labelClassName = 'text-sm text-gray-new-90';

const PartnerForm = () => {
  const [formState, setFormState] = useState(FORM_STATES.DEFAULT);
  const [isBroken, setIsBroken] = useState(false);
  const [ajsAnonymousId] = useCookie('ajs_anonymous_id');

  const {
    register,
    reset,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      ajs_anonymous_id: ajsAnonymousId || 'none',
    },
  });

  useEffect(() => {
    const hasErrors = Object.keys(errors).length > 0;
    if (formState !== FORM_STATES.LOADING && formState !== FORM_STATES.SUCCESS) {
      if (hasErrors) setFormState(FORM_STATES.ERROR);
      else setFormState(FORM_STATES.DEFAULT);
    }
  }, [errors, isValid, formState]);

  const onSubmit = async (data, e) => {
    e.preventDefault();
    const { firstname, lastname, email, companyName, jobTitle, additionalDetails } = data;
    const loadingAnimationStartedTime = Date.now();
    setIsBroken(false);
    setFormState(FORM_STATES.LOADING);

    try {
      const eventName = 'Partner Form Submitted';
      const eventProps = {
        email,
        first_name: firstname,
        last_name: lastname,
        company_name: companyName,
        job_title: jobTitle,
        additional_details: additionalDetails,
      };

      if (window.zaraz && email) {
        await sendGtagEvent('identify', { email });
        await sendGtagEvent(eventName, eventProps);
      }

      doNowOrAfterSomeTime(() => {
        setFormState(FORM_STATES.SUCCESS);
        reset();
        setIsBroken(false);
      }, loadingAnimationStartedTime);
    } catch (error) {
      if (error.name !== 'AbortError') {
        doNowOrAfterSomeTime(() => {
          setFormState(FORM_STATES.BROKEN);
          setIsBroken(true);
        }, 2000);
      }
    }
  };

  const isDisabled = formState === FORM_STATES.LOADING || formState === FORM_STATES.SUCCESS;

  const getButtonContent = () => {
    if (formState === FORM_STATES.LOADING) {
      return (
        <div className="flex items-center justify-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          Submitting...
        </div>
      );
    }
    if (formState === FORM_STATES.SUCCESS) {
      return 'Submitted!';
    }
    return 'Submit';
  };

  return (
    <form
      className={clsx(
        'relative z-10 grid w-full max-w-none gap-y-6 p-8',
        'rounded-xl border border-gray-new-10 bg-[#020203]/70 bg-contact-form-bg shadow-contact',
        'xl:p-6 lg:gap-y-5 md:gap-y-6'
      )}
      method="POST"
      id="partner-form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Field
        name="companyName"
        label="Your Company Name*"
        theme="transparent"
        labelClassName={labelClassName}
        isDisabled={isDisabled}
        error={errors.companyName?.message}
        {...register('companyName')}
      />
      <div className="grid grid-cols-2 gap-6 lg:gap-5 md:contents md:flex-col md:gap-6">
        <Field
          name="firstname"
          label="First Name*"
          theme="transparent"
          labelClassName={labelClassName}
          error={errors.firstname?.message}
          isDisabled={isDisabled}
          {...register('firstname')}
        />
        <Field
          name="lastname"
          label="Last Name*"
          theme="transparent"
          labelClassName={labelClassName}
          error={errors.lastname?.message}
          isDisabled={isDisabled}
          {...register('lastname')}
        />
      </div>
      <Field
        name="email"
        label="Your Business Email*"
        type="email"
        theme="transparent"
        labelClassName={labelClassName}
        isDisabled={isDisabled}
        error={errors.email?.message}
        {...register('email')}
      />
      <Field
        name="jobTitle"
        label="Your Job Title"
        theme="transparent"
        labelClassName={labelClassName}
        isDisabled={isDisabled}
        error={errors.jobTitle?.message}
        {...register('jobTitle')}
      />
      <Field
        name="additionalDetails"
        label="Additional Details"
        tag="textarea"
        rows={4}
        theme="transparent"
        labelClassName={labelClassName}
        isDisabled={isDisabled}
        error={errors.additionalDetails?.message}
        {...register('additionalDetails')}
      />

      {/* Hidden field for ajs_anonymous_id */}
      <input type="hidden" name="ajs_anonymous_id" {...register('ajs_anonymous_id')} />

      <div className="relative">
        <Button
          className={clsx(
            'mt-1 h-[46px] w-full font-semibold lg:h-10 sm:mt-0',
            formState === FORM_STATES.ERROR && 'pointer-events-none !bg-secondary-1/50'
          )}
          type="submit"
          theme="primary"
          size="xs"
          disabled={formState === FORM_STATES.LOADING || formState === FORM_STATES.SUCCESS}
        >
          {getButtonContent()}
        </Button>
      </div>

      <p className="text-sm leading-tight text-gray-new-70">
        By submitting, you agree to the{' '}
        <Link
          className="hover:text-green-50 text-green-45 transition-colors"
          to={LINKS.terms}
          target="_blank"
        >
          Terms of Service
        </Link>{' '}
        and acknowledge the{' '}
        <Link
          className="hover:text-green-50 text-green-45 transition-colors"
          to={LINKS.privacy}
          target="_blank"
        >
          Privacy Policy
        </Link>
        .
      </p>

      {isBroken && <ErrorMessage onClose={() => setIsBroken(false)} />}
    </form>
  );
};

export default PartnerForm;
