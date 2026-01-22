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
import Link from 'components/shared/link';
import { FORM_STATES } from 'constants/forms';
import CloseIcon from 'icons/close.inline.svg';
import { checkBlacklistEmails } from 'utils/check-blacklist-emails';
import { doNowOrAfterSomeTime } from 'utils/forms';
import sendGtagEvent from 'utils/send-gtag-event';

const ErrorMessage = ({ onClose }) => (
  <div className="absolute inset-0 flex items-center justify-center p-5" data-test="error-message">
    <div className="relative z-10 flex max-w-sm flex-col items-center text-center">
      <h3 className="font-title text-[32px] font-medium leading-none tracking-extra-tight sm:text-[28px]">
        Oops, looks like there's a technical problem
      </h3>
      <p className="mt-3.5 max-w-[236px] leading-tight tracking-extra-tight text-gray-new-70">
        Please reach out to us directly at{' '}
        <Link
          className="border-b border-green-45/40 hover:border-green-45"
          theme="green"
          to="mailto:atli@neon.tech"
        >
          atli@neon.tech
        </Link>
      </p>
    </div>
    <button className="absolute right-4 top-4 z-20" type="button" onClick={onClose}>
      <CloseIcon className="size-4 text-white opacity-50 transition-opacity duration-300 hover:opacity-100" />
      <span className="sr-only">Close error message</span>
    </button>
    <span className="absolute inset-0 bg-[#0E0E11]/40 backdrop-blur-md" />
  </div>
);

ErrorMessage.propTypes = {
  onClose: PropTypes.func.isRequired,
};

const schema = yup
  .object({
    firstname: yup.string().required('Reequired field'),
    lastname: yup.string().required('Required field'),
    email: yup
      .string()
      .email('Please enter a valid email')
      .required('Required field')
      .test(checkBlacklistEmails({ validation: { useDefaultBlockList: true } })),
    companyWebsite: yup.string().required('Required field'),
    investor: yup.string().required('Required field'),
    ajs_anonymous_id: yup.string().optional(),
  })
  .required();

const labelClassName = 'text-sm text-gray-new-90';

const ContactForm = () => {
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
    const { firstname, lastname, email, companyWebsite, investor } = data;
    const loadingAnimationStartedTime = Date.now();
    setIsBroken(false);
    setFormState(FORM_STATES.LOADING);

    try {
      const eventName = 'Startup Form Submitted';
      const eventProps = {
        email,
        first_name: firstname,
        last_name: lastname,
        company_website: companyWebsite,
        investor,
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

  return (
    <form
      className={clsx(
        'relative z-10 grid scroll-mt-10 gap-y-6 p-8',
        'rounded-xl border border-gray-new-10 bg-[#020203]/70 bg-contact-form-bg shadow-contact',
        'xl:p-6 lg:gap-y-5 md:gap-y-6'
      )}
      method="POST"
      id="startups-form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid grid-cols-2 gap-6 lg:gap-5 md:contents md:flex-col md:gap-6">
        <Field
          name="firstname"
          label="First Name*"
          autoComplete="name"
          placeholder="Jane"
          theme="transparent"
          labelClassName={labelClassName}
          error={errors.firstname?.message}
          isDisabled={isDisabled}
          {...register('firstname')}
        />
        <Field
          name="lastname"
          label="Last Name*"
          autoComplete="name"
          placeholder="Doe"
          theme="transparent"
          labelClassName={labelClassName}
          error={errors.lastname?.message}
          isDisabled={isDisabled}
          {...register('lastname')}
        />
      </div>
      <Field
        name="email"
        label="Company Email Address*"
        type="email"
        autoComplete="email"
        placeholder="info@acme.com"
        theme="transparent"
        labelClassName={labelClassName}
        isDisabled={isDisabled}
        error={errors.email?.message}
        {...register('email')}
      />
      <Field
        name="companyWebsite"
        label="Company Website*"
        placeholder="your.company.com"
        theme="transparent"
        labelClassName={labelClassName}
        isDisabled={isDisabled}
        error={errors.companyWebsite?.message}
        {...register('companyWebsite')}
      />
      <Field
        name="investor"
        label="Major Investor, Accelerator, etc.*"
        placeholder="Y Combinator, Techstars, etc."
        theme="transparent"
        labelClassName={labelClassName}
        isDisabled={isDisabled}
        error={errors.investor?.message}
        {...register('investor')}
      />

      {/* Hidden field for ajs_anonymous_id - not submitted to HubSpot */}
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
          {formState === FORM_STATES.SUCCESS ? 'Applied!' : 'Apply Now'}
        </Button>
      </div>
      {isBroken && <ErrorMessage onClose={() => setIsBroken(false)} />}
    </form>
  );
};

export default ContactForm;
