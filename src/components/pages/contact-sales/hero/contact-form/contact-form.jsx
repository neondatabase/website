'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import useCookie from 'react-use/lib/useCookie';
import useLocation from 'react-use/lib/useLocation';
import * as yup from 'yup';

import Button from 'components/shared/button';
import Field from 'components/shared/field';
import Link from 'components/shared/link';
import { FORM_STATES, HUBSPOT_CONTACT_SALES_FORM_ID } from 'constants/forms';
import LINKS from 'constants/links';
import { doNowOrAfterSomeTime, sendHubspotFormData } from 'utils/forms';

const schema = yup
  .object({
    name: yup.string().required('Your name is a required field'),
    email: yup
      .string()
      .email('Please enter a valid email')
      .required('Email address is a required field'),
    companySize: yup.string().notOneOf(['hidden'], 'Required field'),
    message: yup.string().required('Message is a required field'),
  })
  .required();

const labelClassName = 'text-sm text-gray-new-90';
const errorClassName = '!top-0';

const ContactForm = () => {
  const [formState, setFormState] = useState(FORM_STATES.DEFAULT);

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [hubspotutk] = useCookie('hubspotutk');
  const { href } = useLocation();
  const [formError, setFormError] = useState('');

  const context = {
    hutk: hubspotutk,
    pageUri: href,
  };

  const onSubmit = async (data, e) => {
    e.preventDefault();
    const { name, email, companyWebsite, companySize, message } = data;
    const loadingAnimationStartedTime = Date.now();
    setFormError('');
    setFormState(FORM_STATES.LOADING);

    try {
      const response = await sendHubspotFormData({
        formId: HUBSPOT_CONTACT_SALES_FORM_ID,
        context,
        values: [
          {
            name: 'full_name',
            value: name,
          },
          {
            name: 'email',
            value: email,
          },
          {
            name: 'company_website',
            value: companyWebsite,
          },
          {
            name: 'company_size',
            value: companySize,
          },
          {
            name: 'TICKET.subject',
            value: 'Contact sales',
          },
          {
            name: 'TICKET.content',
            value: message,
          },
        ],
      });

      if (response.ok) {
        doNowOrAfterSomeTime(() => {
          setFormState(FORM_STATES.SUCCESS);
          reset();
          setFormError('');
        }, loadingAnimationStartedTime);
      } else {
        throw new Error('Something went wrong. Please reload the page and try again.');
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        doNowOrAfterSomeTime(() => {
          setFormState(FORM_STATES.ERROR);
          setFormError(error?.message ?? error);
        }, 2000);
      }
    }
  };

  const isDisabled = formState === FORM_STATES.LOADING || formState === FORM_STATES.SUCCESS;

  return (
    <form
      className={clsx(
        'relative z-10 grid gap-y-6 rounded-xl border border-gray-new-10 bg-[#020203] p-8 shadow-contact xl:gap-y-5 xl:p-[30px] lg:gap-y-6 sm:p-5',
        'bg-[radial-gradient(131.75%_102.44%_at_16.67%_0%,_rgba(20,24,31,.5),_rgba(20,24,31,0.30)_47.96%,_rgba(20,24,31,0))]'
      )}
      method="POST"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Field
        name="name"
        label="Your name *"
        autoComplete="name"
        placeholder="Marques Hansen"
        theme="transparent"
        labelClassName={labelClassName}
        errorClassName={errorClassName}
        error={errors.name?.message}
        isDisabled={isDisabled}
        {...register('name')}
      />
      <Field
        name="email"
        label="Email *"
        type="email"
        autoComplete="email"
        placeholder="info@acme.com"
        theme="transparent"
        labelClassName={labelClassName}
        errorClassName={errorClassName}
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
          errorClassName={errorClassName}
          isDisabled={isDisabled}
          {...register('companyWebsite')}
        />
        <Field
          className="grow"
          name="companySize"
          label="Company Size *"
          tag="select"
          defaultValue="hidden"
          theme="transparent"
          labelClassName={labelClassName}
          errorClassName={errorClassName}
          isDisabled={isDisabled}
          error={errors.companySize?.message}
          {...register('companySize')}
        >
          <option value="hidden" disabled hidden>
            &nbsp;
          </option>
          <option value="0_1">0-1 employees</option>
          <option value="2_4">2-4 employees</option>
          <option value="5_19">5-19 employees</option>
          <option value="20_99">20-99 employees</option>
          <option value="100_499">100-499 employees</option>
          <option value="500">&ge; 500 employees</option>
        </Field>
      </div>
      <Field
        name="message"
        label="Message *"
        tag="textarea"
        theme="transparent"
        labelClassName={labelClassName}
        textareaClassName="min-h-[170px] xl:min-h-[148px]"
        errorClassName={errorClassName}
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
          className="min-w-[176px] py-[15px] font-medium 2xl:text-base xl:min-w-[138px] lg:min-w-[180px] sm:w-full sm:py-[13px]"
          type="submit"
          theme="primary"
          size="xs"
          disabled={formState === FORM_STATES.LOADING || formState === FORM_STATES.SUCCESS}
        >
          {formState === FORM_STATES.SUCCESS ? 'Sent!' : 'Submit'}
        </Button>
        {formError && (
          <span
            className="absolute left-1/2 top-[calc(100%+1rem)] w-full -translate-x-1/2 text-sm leading-none text-secondary-1"
            data-test="error-message"
          >
            {formError}
          </span>
        )}
      </div>
    </form>
  );
};

ContactForm.propTypes = {
  formState: PropTypes.oneOf(Object.values(FORM_STATES)).isRequired,
  setFormState: PropTypes.func.isRequired,
};

export default ContactForm;
