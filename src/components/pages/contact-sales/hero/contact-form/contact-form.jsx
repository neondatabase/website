'use client';

/* eslint-disable jsx-a11y/control-has-associated-label */
import { yupResolver } from '@hookform/resolvers/yup';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import Button from 'components/shared/button';
import Field from 'components/shared/field';
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
      <h3 className="font-title text-[32px] font-medium leading-none tracking-extra-tight sm:text-[28px]">
        Oops, looks like there&apos;s a technical problem
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
    firstname: yup.string().required('Your first name is a required field'),
    lastname: yup.string().required('Your last name is a required field'),
    email: yup
      .string()
      .email('Please enter a valid email')
      .required('Email address is a required field')
      .test(checkBlacklistEmails({ validation: { useDefaultBlockList: true } })),
    companySize: yup.string().notOneOf(['hidden'], 'Required field'),
    reasonForContact: yup.string().notOneOf(['hidden'], 'Required field'),
    message: yup.string().required('Message is a required field'),
  })
  .required();

const labelClassName = 'text-sm text-gray-new-90';

const ContactForm = () => {
  const [formState, setFormState] = useState(FORM_STATES.DEFAULT);
  const [isBroken, setIsBroken] = useState(false);

  const {
    register,
    reset,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      companySize: 'hidden',
      reasonForContact: 'hidden',
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
    const { firstname, lastname, email, companyWebsite, companySize, reasonForContact, message } =
      data;
    const loadingAnimationStartedTime = Date.now();
    setIsBroken(false);
    setFormState(FORM_STATES.LOADING);

    try {
      const eventName = 'Contact Sales Form Submitted';
      const eventProps = {
        email,
        first_name: firstname,
        last_name: lastname,
        company_website: companyWebsite,
        company_size: companySize,
        reason_for_contact: reasonForContact,
        message,
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
      className="relative z-10 grid gap-y-6 overflow-hidden rounded-xl border border-gray-new-10 bg-[#020203] bg-contact-form-bg p-8 shadow-contact xl:gap-y-5 xl:p-[30px] lg:gap-y-6 sm:p-5"
      method="POST"
      id="contact-sales-form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Field
        name="firstname"
        label="First Name*"
        autoComplete="name"
        placeholder="Marques"
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
        placeholder="Hansen"
        theme="transparent"
        labelClassName={labelClassName}
        error={errors.lastname?.message}
        isDisabled={isDisabled}
        {...register('lastname')}
      />
      <Field
        name="email"
        label="Work Email*"
        type="email"
        autoComplete="email"
        placeholder="info@acme.com"
        theme="transparent"
        labelClassName={labelClassName}
        isDisabled={isDisabled}
        error={errors.email?.message}
        {...register('email')}
      />
      <div className="flex gap-5 xl:gap-4 md:flex-col sm:contents sm:flex-col">
        <Field
          className="shrink-0 basis-[55%]"
          name="companyWebsite"
          label="Company Website"
          theme="transparent"
          labelClassName={labelClassName}
          isDisabled={isDisabled}
          {...register('companyWebsite')}
        />
        <Field
          className="grow"
          name="companySize"
          label="Company Size*"
          tag="select"
          theme="transparent"
          labelClassName={labelClassName}
          isDisabled={isDisabled}
          error={errors.companySize?.message}
          {...register('companySize')}
        >
          <option value="hidden" disabled hidden />
          <option value="0_1">0-1 employees</option>
          <option value="2_4">2-4 employees</option>
          <option value="5_19">5-19 employees</option>
          <option value="20_99">20-99 employees</option>
          <option value="100_499">100-499 employees</option>
          <option value="500">&ge; 500 employees</option>
        </Field>
      </div>
      <Field
        name="reasonForContact"
        label="Reason for Contact*"
        tag="select"
        theme="transparent"
        labelClassName={labelClassName}
        isDisabled={isDisabled}
        error={errors.reasonForContact?.message}
        {...register('reasonForContact')}
      >
        <option value="hidden" disabled hidden />
        <option value="Demo/POC">Demo/POC</option>
        <option value="Enterprise Pricing">Enterprise Pricing</option>
        <option value="HIPAA">HIPAA</option>
      </Field>
      <Field
        name="message"
        label="Message*"
        tag="textarea"
        theme="transparent"
        labelClassName={labelClassName}
        textareaClassName="min-h-[170px] xl:min-h-[148px]"
        isDisabled={isDisabled}
        error={errors.message?.message}
        {...register('message')}
      />

      <div className="relative flex items-center justify-between gap-6 xl:gap-5 lg:gap-6 sm:flex-col sm:items-start sm:gap-5">
        <p className="text-light text-sm leading-snug text-gray-new-70 xl:tracking-tighter">
          By submitting you agree to the{' '}
          <Link className="text-nowrap text-white" to={LINKS.terms} theme="white-underlined">
            Terms Service
          </Link>{' '}
          and acknowledge the{' '}
          <Link
            className="text-nowrap text-white"
            to={LINKS.privacyPolicy}
            theme="white-underlined"
          >
            Privacy Policy
          </Link>
          .
        </p>
        <Button
          className={clsx(
            'min-w-[176px] py-[15px] font-medium 2xl:text-base xl:min-w-[138px] lg:min-w-[180px] sm:w-full sm:py-[13px]',
            formState === FORM_STATES.ERROR && 'pointer-events-none !bg-secondary-1/50'
          )}
          type="submit"
          theme="primary"
          size="xs"
          disabled={formState === FORM_STATES.LOADING || formState === FORM_STATES.SUCCESS}
        >
          {formState === FORM_STATES.SUCCESS ? 'Sent!' : 'Submit'}
        </Button>
      </div>
      {isBroken && <ErrorMessage onClose={() => setIsBroken(false)} />}
    </form>
  );
};

ContactForm.propTypes = {
  formState: PropTypes.oneOf(Object.values(FORM_STATES)).isRequired,
  setFormState: PropTypes.func.isRequired,
};

export default ContactForm;
