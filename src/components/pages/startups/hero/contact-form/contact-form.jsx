'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import Image from 'next/image';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import useCookie from 'react-use/lib/useCookie';
import * as yup from 'yup';

import Button from 'components/shared/button';
import Field from 'components/shared/field';
import Link from 'components/shared/link';
import { FORM_STATES } from 'constants/forms';
import CloseIcon from 'icons/close.inline.svg';
import { checkBlacklistEmails } from 'utils/check-blacklist-emails';
import { cn } from 'utils/cn';
import { doNowOrAfterSomeTime } from 'utils/forms';
import sendGtagEvent from 'utils/send-gtag-event';

import LINKS from '../../../../../constants/links';
import formPattern from '../../../../../images/pages/contact-sales/form-pattern.png';

const ErrorMessage = ({ onClose }) => (
  <div className="absolute inset-0 flex items-center justify-center p-5" data-test="error-message">
    <div className="relative z-10 flex max-w-sm flex-col items-center text-center">
      <h3 className="font-title text-[32px] leading-none font-medium tracking-extra-tight sm:text-[28px]">
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
    <button className="absolute top-4 right-4 z-20" type="button" onClick={onClose}>
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

const labelClassName = 'text-[15px] leading-snug tracking-tight text-gray-new-90 md:text-sm';
const inputClassName =
  '!mt-0 !h-11 !rounded-none border-gray-new-20 !bg-black-pure !px-4 !text-base !leading-snug !tracking-tight text-white placeholder:!text-gray-new-50 focus:!border-white';

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
      className={cn(
        'relative z-10 grid scroll-mt-10 gap-y-6 overflow-hidden border border-gray-new-20 bg-black-pure/80 px-8 py-7',
        'xl:gap-5 xl:px-7 xl:py-6 lg:max-w-full md:px-5 md:py-5'
      )}
      method="POST"
      id="startups-form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 className="text-xl leading-snug font-medium tracking-tighter text-white">
        Apply to the Databricks Startup Program
      </h2>
      <div className="grid grid-cols-2 gap-6 lg:gap-5 md:contents md:flex-col md:gap-6">
        <Field
          className="gap-y-2"
          errorTheme="tooltip"
          name="firstname"
          label="First Name*"
          autoComplete="given-name"
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
          theme="transparent"
          labelClassName={labelClassName}
          inputClassName={inputClassName}
          error={errors.lastname?.message}
          isDisabled={isDisabled}
          {...register('lastname')}
        />
      </div>
      <Field
        className="gap-y-2"
        errorTheme="tooltip"
        name="email"
        label="Company Email Address*"
        type="email"
        autoComplete="email"
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
        label="Company Website*"
        theme="transparent"
        labelClassName={labelClassName}
        inputClassName={inputClassName}
        isDisabled={isDisabled}
        error={errors.companyWebsite?.message}
        {...register('companyWebsite')}
      />
      <Field
        className="gap-y-2"
        errorTheme="tooltip"
        name="investor"
        label="Primary Investor, Accelerator, etc.*"
        theme="transparent"
        labelClassName={labelClassName}
        inputClassName={inputClassName}
        isDisabled={isDisabled}
        error={errors.investor?.message}
        {...register('investor')}
      />

      {/* Hidden field for ajs_anonymous_id - not submitted to HubSpot */}
      <input type="hidden" name="ajs_anonymous_id" {...register('ajs_anonymous_id')} />

      <div className="relative z-0 col-span-full mt-1 flex items-end justify-between gap-6 sm:flex-col sm:items-start sm:gap-4">
        <p className="max-w-[300px] text-sm leading-[1.5] tracking-tight text-gray-new-60 sm:max-w-full">
          By submitting you agree to the{' '}
          <Link className="decoration-dashed" to={LINKS.websiteTerms} theme="grey-85-underlined">
            Terms of Use
          </Link>{' '}
          and acknowledge the{' '}
          <Link className="decoration-dashed" to={LINKS.privacyPolicy} theme="grey-85-underlined">
            Privacy Notice
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
          {formState === FORM_STATES.SUCCESS ? 'Applied!' : 'Apply Now'}
        </Button>
      </div>
      <Image
        className="absolute -right-px -bottom-px -z-10 max-w-none"
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
