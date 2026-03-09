'use client';

/* eslint-disable jsx-a11y/control-has-associated-label */
import { yupResolver } from '@hookform/resolvers/yup';
import Image from 'next/image';
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
import formPattern from 'images/pages/contact-sales/form-pattern.png';
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
    firstname: yup.string().required('Required Field'),
    lastname: yup.string().required('Required Field'),
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

const labelClassName = 'text-[15px] leading-snug tracking-tight text-gray-new-90 md:text-sm';
const inputClassName =
  '!mt-0 !h-11 !rounded-none border-gray-new-20 !bg-black-pure !px-4 !text-base !leading-snug !tracking-tight text-white placeholder:!text-gray-new-50 focus:!border-white focus:!ring-1 focus:!ring-primary-1 md:!text-[15px]';
const selectClassName = `${inputClassName} !pr-10 !bg-[url(/images/chevron-down-gray.svg)]`;
const textareaClassName = `${inputClassName} !min-h-[132px] !items-start !py-[11px] xl:!min-h-[120px]`;

const AZURE_MIGRATION_MESSAGE = "I'd like to migrate my Azure managed account.";

const ContactForm = () => {
  const [formState, setFormState] = useState(FORM_STATES.DEFAULT);
  const [isBroken, setIsBroken] = useState(false);

  const {
    register,
    reset,
    setValue,
    watch,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      companySize: 'hidden',
      reasonForContact: 'hidden',
      message: '',
    },
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('message') === 'azure-migration') {
      setValue('message', AZURE_MIGRATION_MESSAGE);
    }
  }, [setValue]);

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

  const reasonValue = watch('reasonForContact');
  const companySizeValue = watch('companySize');

  const isDisabled = formState === FORM_STATES.LOADING || formState === FORM_STATES.SUCCESS;

  return (
    <form
      className="relative z-10 grid grid-cols-2 gap-6 gap-y-6 overflow-hidden border border-gray-new-20 bg-black-pure/80 px-8 py-7 xl:gap-5 xl:px-7 xl:py-6 lg:max-w-full md:grid-cols-1 md:px-5 md:py-5"
      method="POST"
      id="contact-sales-form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Field
        className="gap-y-2"
        errorTheme="tooltip"
        name="firstname"
        label="First Name*"
        autoComplete="given-name"
        placeholder="Marques"
        theme="transparent"
        labelClassName={labelClassName}
        inputClassName={inputClassName}
        error={errors.firstname?.message}
        isDisabled={isDisabled}
        {...register('firstname')}
      />
      <Field
        className="gap-y-2"
        errorTheme="tooltip"
        name="lastname"
        label="Last Name*"
        autoComplete="family-name"
        placeholder="Hansen"
        theme="transparent"
        labelClassName={labelClassName}
        inputClassName={inputClassName}
        error={errors.lastname?.message}
        isDisabled={isDisabled}
        {...register('lastname')}
      />
      <Field
        className="gap-y-2"
        errorTheme="tooltip"
        name="email"
        label="Work Email*"
        type="email"
        autoComplete="email"
        placeholder="info@acme.com"
        theme="transparent"
        labelClassName={labelClassName}
        inputClassName={inputClassName}
        isDisabled={isDisabled}
        error={errors.email?.message}
        {...register('email')}
      />
      <Field
        className="gap-y-2"
        errorTheme="tooltip"
        name="companyWebsite"
        label="Company Website"
        placeholder="acme.com"
        theme="transparent"
        labelClassName={labelClassName}
        inputClassName={inputClassName}
        isDisabled={isDisabled}
        {...register('companyWebsite')}
      />
      <Field
        className="gap-y-2"
        errorTheme="tooltip"
        name="reasonForContact"
        label="Reason for Contact*"
        tag="select"
        theme="transparent"
        labelClassName={labelClassName}
        inputClassName={`${selectClassName}${reasonValue !== 'hidden' ? ' !text-white' : ' !text-gray-new-50'}`}
        isDisabled={isDisabled}
        error={errors.reasonForContact?.message}
        {...register('reasonForContact')}
      >
        <option value="hidden" disabled hidden>
          Demo/POC
        </option>
        <option value="Demo/POC">Demo/POC</option>
        <option value="Enterprise Pricing">Enterprise Pricing</option>
        <option value="HIPAA">HIPAA</option>
      </Field>
      <Field
        className="gap-y-2"
        errorTheme="tooltip"
        name="companySize"
        label="Company Size"
        tag="select"
        theme="transparent"
        labelClassName={labelClassName}
        inputClassName={`${selectClassName}${companySizeValue !== 'hidden' ? ' !text-white' : ' !text-gray-new-50'}`}
        isDisabled={isDisabled}
        error={errors.companySize?.message}
        {...register('companySize')}
      >
        <option value="hidden" disabled hidden>
          0-1 Employees
        </option>
        <option value="0_1">0-1 Employees</option>
        <option value="2_4">2-4 Employees</option>
        <option value="5_19">5-19 Employees</option>
        <option value="20_99">20-99 Employees</option>
        <option value="100_499">100-499 Employees</option>
        <option value="500">&ge; 500 Employees</option>
      </Field>
      <Field
        className="relative z-10 col-span-full gap-y-2"
        errorTheme="tooltip"
        name="message"
        label="Message*"
        tag="textarea"
        theme="transparent"
        labelClassName={labelClassName}
        inputClassName={textareaClassName}
        isDisabled={isDisabled}
        error={errors.message?.message}
        placeholder="Your message..."
        {...register('message')}
      />

      <div className="relative z-0 col-span-full mt-1 flex items-end justify-between gap-6 sm:flex-col sm:items-start sm:gap-4">
        <p className="max-w-[300px] text-sm leading-[1.5] tracking-tight text-gray-new-60 sm:max-w-full">
          By submitting you agree to the{' '}
          <Link className="decoration-dashed" to={LINKS.terms} theme="grey-85-underlined">
            Terms Service
          </Link>{' '}
          and acknowledge the{' '}
          <Link className="decoration-dashed" to={LINKS.privacyPolicy} theme="grey-85-underlined">
            Privacy Policy
          </Link>
          .
        </p>
        <Button
          className="min-w-[152px] px-10 sm:w-full sm:min-w-0"
          type="submit"
          theme="white-filled"
          size="new"
          disabled={
            formState === FORM_STATES.LOADING ||
            formState === FORM_STATES.SUCCESS ||
            formState === FORM_STATES.ERROR
          }
        >
          {formState === FORM_STATES.SUCCESS ? 'Sent!' : 'Submit'}
        </Button>
      </div>
      <Image
        className="absolute -bottom-px -right-px -z-10 max-w-none"
        src={formPattern}
        alt=""
        width={576}
        height={228}
        priority
      />
      {isBroken && <ErrorMessage onClose={() => setIsBroken(false)} />}
    </form>
  );
};

export default ContactForm;
