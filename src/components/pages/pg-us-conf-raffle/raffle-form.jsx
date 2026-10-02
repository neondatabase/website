'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import Button from 'components/shared/button';
import Field from 'components/shared/field';
import Link from 'components/shared/link';
import LINKS from 'constants/links';
import CloseIcon from 'icons/close.inline.svg';
import formPattern from 'images/pages/contact-sales/form-pattern.png';

const schema = yup.object({
  firstname: yup.string().trim().max(100, 'Use 100 characters or fewer').required('Required Field'),
  lastname: yup.string().trim().max(100, 'Use 100 characters or fewer').required('Required Field'),
  email: yup
    .string()
    .trim()
    .email('Please enter a valid email')
    .max(254)
    .required('Required Field'),
});

const labelClassName = 'text-[15px] leading-snug tracking-tight text-gray-new-90 md:text-sm';
const inputClassName =
  '!mt-0 !h-11 !rounded-none border-gray-new-20 !bg-black-pure !px-4 !text-base !leading-snug !tracking-tight text-white placeholder:!text-gray-new-50 focus:!border-white';

const RaffleForm = () => {
  const [status, setStatus] = useState('idle');
  const successRef = useRef(null);
  const submissionRef = useRef(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    setStatus('idle');
    try {
      const fields = JSON.stringify(data);
      if (submissionRef.current?.fields !== fields) {
        submissionRef.current = { fields, requestId: crypto.randomUUID() };
      }
      const response = await fetch('/api/pg-us-conf-raffle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, requestId: submissionRef.current.requestId }),
      });
      const result = await response.json();
      if (!response.ok || result?.success !== true) throw new Error('Submission failed');
      setStatus('success');
      requestAnimationFrame(() => successRef.current?.focus());
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="relative z-10 overflow-hidden border border-gray-new-20 bg-black-pure/80 px-8 py-7 xl:px-7 xl:py-6 md:px-5 md:py-5">
      {status === 'success' ? (
        <div
          className="relative z-10 flex min-h-[366px] flex-col justify-center"
          role="status"
          ref={successRef}
          tabIndex={-1}
        >
          <p className="mb-5 text-sm tracking-tight text-green-45">You&apos;re in</p>
          <h2 className="font-title text-[36px] leading-tight font-medium tracking-extra-tight text-white md:text-[30px]">
            Thanks for entering the raffle
          </h2>
          <p className="mt-4 max-w-sm text-base leading-normal tracking-tight text-gray-new-70">
            Your entry has been received. We&apos;ll contact you at the email address you provided
            if you win the $500 LEGO gift card.
          </p>
        </div>
      ) : (
        <form
          className="relative z-10 grid grid-cols-2 gap-6 gap-y-6 xl:gap-5 md:grid-cols-1"
          id="pg-us-conf-raffle-form"
          data-test="raffle-form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="col-span-full mb-6">
            <h2 className="font-title text-[28px] leading-tight font-medium tracking-extra-tight text-white">
              Register for the raffle
            </h2>
          </div>
          <Field
            className="gap-y-2"
            errorTheme="tooltip"
            name="firstname"
            label="First Name*"
            autoComplete="given-name"
            placeholder="Alex"
            theme="transparent"
            labelClassName={labelClassName}
            inputClassName={inputClassName}
            error={errors.firstname?.message}
            isDisabled={isSubmitting}
            aria-required="true"
            aria-invalid={!!errors.firstname}
            {...register('firstname')}
          />
          <Field
            className="gap-y-2"
            errorTheme="tooltip"
            name="lastname"
            label="Last Name*"
            autoComplete="family-name"
            placeholder="Lopez"
            theme="transparent"
            labelClassName={labelClassName}
            inputClassName={inputClassName}
            error={errors.lastname?.message}
            isDisabled={isSubmitting}
            aria-required="true"
            aria-invalid={!!errors.lastname}
            {...register('lastname')}
          />
          <Field
            className="relative z-10 col-span-full gap-y-2"
            errorTheme="tooltip"
            name="email"
            label="Email*"
            type="email"
            autoComplete="email"
            placeholder="alex@example.com"
            theme="transparent"
            labelClassName={labelClassName}
            inputClassName={inputClassName}
            error={errors.email?.message}
            isDisabled={isSubmitting}
            aria-required="true"
            aria-invalid={!!errors.email}
            {...register('email')}
          />
          <div className="relative z-0 col-span-full mt-1 flex items-end justify-between gap-6 sm:flex-col sm:items-start sm:gap-4">
            <p className="max-w-[300px] text-sm leading-[1.5] tracking-tight text-balance text-gray-new-60 sm:max-w-full">
              By submitting, you acknowledge the{' '}
              <Link
                className="decoration-dashed"
                to={LINKS.privacyPolicy}
                theme="grey-85-underlined"
              >
                Privacy Notice
              </Link>
              .
            </p>
            <Button
              className="min-w-[152px] px-10 sm:w-full sm:min-w-0"
              type="submit"
              theme="white-filled"
              size="new"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting…' : 'Enter the raffle'}
            </Button>
          </div>
          {status === 'error' && (
            <div
              className="absolute inset-0 z-20 flex items-center justify-center p-5"
              role="alert"
            >
              <div className="relative z-10 flex max-w-sm flex-col items-center text-center">
                <h3 className="font-title text-[32px] leading-none font-medium tracking-extra-tight sm:text-[28px]">
                  Oops, looks like there&apos;s a technical problem
                </h3>
                <p className="mt-3.5 max-w-[236px] leading-tight tracking-extra-tight text-gray-new-70">
                  Please try again, or{' '}
                  <Link
                    className="border-b border-green-45/40 hover:border-green-45"
                    theme="green"
                    to="https://forms.gle/C7TgUq7nPLA2L5d76"
                  >
                    enter using Google Forms
                  </Link>
                  .
                </p>
              </div>
              <button
                className="absolute top-4 right-4 z-20"
                type="button"
                onClick={() => setStatus('idle')}
              >
                <CloseIcon className="size-4 text-white opacity-50 transition-opacity duration-300 hover:opacity-100" />
                <span className="sr-only">Close error message</span>
              </button>
              <span className="absolute inset-0 bg-[#0E0E11]/40 backdrop-blur-md" />
            </div>
          )}
        </form>
      )}
      <Image
        className="pointer-events-none absolute -right-px -bottom-px -z-10 max-w-none"
        src={formPattern}
        alt=""
        width={576}
        height={228}
        priority
      />
    </div>
  );
};

export default RaffleForm;
