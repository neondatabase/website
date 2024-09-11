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
import { doNowOrAfterSomeTime, sendHubspotFormData } from 'utils/forms';

const schema = yup
  .object({
    name: yup.string().required('Your name is a required field'),
    email: yup
      .string()
      .email('Please enter a valid email')
      .required('Email address is a required field'),
    companySize: yup
      .string()
      .notOneOf(['hidden'], 'Please select a company size')
      .required('Company size is a required field'),
    message: yup.string().required('Message is a required field'),
  })
  .required();

const ContactUsForm = ({ className = null }) => {
  const [formState, setFormState] = useState(FORM_STATES.DEFAULT);
  const [hubspotutk] = useCookie('hubspotutk');
  const { href } = useLocation();
  const [formError, setFormError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

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

  return (
    <form
      className={clsx(
        'relative z-10 grid gap-x-[20px] gap-y-6 rounded-xl border border-gray-new-10 bg-[radial-gradient(128.16%_100%_at_38.89%_0%,#18191B80_0%,#18191B4D_47.96%,#18191B00_100%)] p-9 xl:p-6 xs:p-5',
        className
      )}
      method="POST"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Field
        className="font-ibm-plex-sans"
        labelClassName="text-sm text-gray-new-90"
        theme="transparent"
        name="name"
        label="Your name *"
        autoComplete="name"
        error={errors.name?.message}
        isDisabled={formState === FORM_STATES.LOADING}
        {...register('name')}
      />
      <Field
        className="font-ibm-plex-sans"
        labelClassName="text-sm text-gray-new-90"
        theme="transparent"
        name="email"
        label="Email address *"
        type="email"
        autoComplete="email"
        isDisabled={formState === FORM_STATES.LOADING}
        error={errors.email?.message}
        {...register('email')}
      />
      <div className="flex space-x-10 2xl:space-x-6 sm:grid sm:gap-y-5 sm:space-x-0">
        <Field
          className="shrink-0 basis-[54%] font-ibm-plex-sans 2xl:basis-[45%] lg:basis-[49%]"
          labelClassName="text-sm text-gray-new-90"
          theme="transparent"
          name="companyWebsite"
          label="Company website"
          isDisabled={formState === FORM_STATES.LOADING}
          {...register('companyWebsite')}
        />
        <Field
          className="grow font-ibm-plex-sans"
          labelClassName="text-sm text-gray-new-90"
          theme="transparent"
          name="companySize"
          label="Company size *"
          tag="select"
          defaultValue="hidden"
          isDisabled={formState === FORM_STATES.LOADING}
          error={errors.companySize?.message}
          {...register('companySize')}
        >
          <option value="hidden" disabled hidden>
            &nbsp;
          </option>
          <option value="1_4">1-4 employees</option>
          <option value="5_19">5-19 employees</option>
          <option value="20_99">20-99 employees</option>
          <option value="100_499">100-499 employees</option>
          <option value="500">&ge; 500 employees</option>
        </Field>
      </div>
      <Field
        className="font-ibm-plex-sans"
        labelClassName="text-sm text-gray-new-90"
        inputClassName="!min-h-16 !h-16"
        theme="transparent"
        name="message"
        label="Message *"
        tag="textarea"
        isDisabled={formState === FORM_STATES.LOADING}
        error={errors.message?.message}
        {...register('message')}
      />
      <div className="relative mt-2.5 flex items-center xl:-mt-1.5 lg:-mt-1.5 md:flex-col">
        <p className="text-left text-sm font-light leading-snug text-gray-new-70">
          By submitting, you agree to{' '}
          <Link
            className="pb-1 !text-base 2xl:!text-base md:!inline"
            to="/privacy-policy"
            theme="white-underlined"
            size="xs"
          >
            Neon’s Privacy Policy
          </Link>
          .
        </p>
        <Button
          className="w-[168px] shrink-0 !px-9 !py-6 !text-base !font-medium !tracking-tighter lg:!py-5 md:order-1 md:mt-6 md:w-full xs:!h-10 xs:!text-sm"
          type="submit"
          theme="primary"
          size="lg"
          disabled={formState === FORM_STATES.LOADING || formState === FORM_STATES.SUCCESS}
        >
          {formState === FORM_STATES.SUCCESS ? 'Submitted' : 'Submit'}
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

ContactUsForm.propTypes = {
  className: PropTypes.string,
};

export default ContactUsForm;
