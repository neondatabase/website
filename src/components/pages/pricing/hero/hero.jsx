import { yupResolver } from '@hookform/resolvers/yup';
import { StaticImage } from 'gatsby-plugin-image';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useCookie, useLocation } from 'react-use';
import * as yup from 'yup';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import Field from 'components/shared/field';
import Link from 'components/shared/link';
import { HUBSPOT_PRICING_FORM_ID, FORM_STATES } from 'constants/forms';
import { doNowOrAfterSomeTime, sendHubspotFormData } from 'utils/forms';

const schema = yup
  .object({
    name: yup.string().required('Your name is a required field'),
    email: yup
      .string()
      .email('Please enter a valid email')
      .required('Email address is a required field'),
  })
  .required();

const Hero = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [hubspotutk] = useCookie('hubspotutk');
  const { href } = useLocation();
  const [formState, setFormState] = useState(FORM_STATES.DEFAULT);
  const [formError, setFormError] = useState('');
  const context = {
    hutk: hubspotutk,
    pageUri: href,
  };

  const onSubmit = async (data) => {
    const { name, email, companyWebsite, companySize, message } = data;

    setFormError('');
    setFormState(FORM_STATES.LOADING);
    try {
      const response = await sendHubspotFormData({
        formId: HUBSPOT_PRICING_FORM_ID,
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
            name: 'message',
            value: message,
          },
        ],
      });

      if (response.ok) {
        doNowOrAfterSomeTime(() => {
          setFormState(FORM_STATES.SUCCESS);
          setFormError('');
        }, 2000);
      } else {
        setFormState(FORM_STATES.ERROR);
        setFormError('Something went wrong. Please reload the page and try again.');
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
    <section className="bg-black pt-44 pb-40 text-white xl:pt-[136px] xl:pb-36 lg:pt-9 lg:pb-28 md:pb-24">
      <Container className="text-center" size="md">
        <h1 className="text-[72px] font-bold leading-tight xl:text-[56px] xl:leading-dense md:text-[36px]">
          Talk to our Sales team
        </h1>
        <p className="mx-auto mt-1.5 max-w-[787px] text-xl xl:max-w-[616px] xl:text-base md:mt-2">
          Are you interested in exceeding your free tier limits and learn about pricing? Please fill
          out the form provided below and our team will review your submission
        </p>
        <div className="mx-auto mt-16 flex max-w-[1216px] xl:mt-12 lg:mt-9 lg:max-w-[583px] lg:flex-col lg:space-y-9 md:mt-6 md:space-y-6">
          <div className="relative w-full max-w-[696px] shrink-0 before:absolute before:inset-0 before:h-full before:w-full before:rounded-[20px] before:bg-primary-1 before:opacity-60 before:blur-[70px] xl:max-w-[535px] lg:max-w-none md:before:blur-[60px]">
            <form
              className="relative z-10 grid gap-y-10 rounded-[20px] bg-gray-1 p-12 pb-14 xl:gap-y-9 xl:p-10 xl:pb-10 md:gap-y-5 md:p-6 md:pb-6"
              style={{ boxShadow: '0px 20px 40px rgba(26, 26, 26, 0.4)' }}
              onSubmit={handleSubmit(onSubmit)}
            >
              <Field
                name="name"
                label="Your name *"
                autoComplete="name"
                error={errors.name?.message}
                {...register('name')}
              />
              <Field
                name="email"
                label="Email address *"
                type="email"
                autoComplete="email"
                error={errors.email?.message}
                {...register('email')}
              />
              <div className="flex space-x-10 xl:space-x-8 md:grid md:gap-y-5 md:space-x-0">
                <Field
                  className="shrink-0 basis-[56%] xl:basis-[45%] lg:basis-[50%]"
                  name="companyWebsite"
                  label="Company website"
                  {...register('companyWebsite')}
                />
                <Field
                  className="grow"
                  name="companySize"
                  label="Company size"
                  tag="select"
                  {...register('companySize')}
                >
                  <option selected disabled hidden>
                    &nbsp;
                  </option>
                  <option value="10"> &lt; 10 employees</option>
                  <option value="10_49">10-49 employees</option>
                  <option value="50_249">50-249 employees</option>
                  <option value="250"> &ge; 250 employees</option>
                </Field>
              </div>
              <Field name="message" label="Message" tag="textarea" {...register('message')} />
              <div className="relative mt-2 flex items-center xl:mt-1 md:mt-0 md:flex-col md:items-start">
                <Button
                  className="w-[194px] !px-9 !py-6 !text-lg md:order-1 md:mt-6 md:w-full"
                  type="submit"
                  loading={formState === FORM_STATES.LOADING}
                  theme="primary"
                  size="xs"
                  disabled={formState === FORM_STATES.LOADING || formState === FORM_STATES.SUCCESS}
                >
                  {formState === FORM_STATES.SUCCESS ? 'Sent!' : 'Send message'}
                </Button>
                <p className="ml-7 text-left leading-tight md:ml-0">
                  By submitting you agree to{' '}
                  <Link
                    className="pb-1 !text-base xl:!text-base md:!inline"
                    to="/privacy-policy"
                    theme="underline-primary-1"
                    size="xs"
                  >
                    Neon’s Privacy Policy
                  </Link>
                  .
                </p>
                {formError && (
                  <span className="absolute left-1/2 top-[calc(100%+1rem)] w-full -translate-x-1/2 text-sm leading-none text-secondary-1">
                    {formError}
                  </span>
                )}
              </div>
            </form>
          </div>
          <div className="relative my-9 flex-1 rounded-r-[20px] bg-secondary-2 pt-10 font-mono text-black before:absolute before:inset-0 before:h-full before:w-full before:rounded-[20px] before:bg-secondary-2 before:opacity-70 before:blur-[70px] lg:my-0 lg:rounded-[20px] lg:pt-0 md:before:blur-[60px]">
            <div className="relative z-10 flex h-full w-full flex-col overflow-hidden lg:flex-row md:flex-col md:items-center">
              <div className="px-11 lg:order-1 lg:self-center lg:pl-[18px] lg:pr-8 lg:text-left md:order-none md:px-8 md:pr-4 md:pl-4 md:pt-5 md:text-center">
                <h2
                  className="text-[56px] font-bold leading-none xl:text-5xl lg:text-[36px]"
                  style={{
                    background: 'linear-gradient(180deg, #1A1A1A 0%, rgba(26, 26, 26, 0.8) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    textFillColor: 'transparent',
                  }}
                >
                  On Demand!
                </h2>
                <p className="mt-2.5 text-[23px] font-bold leading-snug text-[#3E3E29] xl:text-xl lg:max-w-[208px] md:max-w-none">
                  Only pay for what you use.
                </p>
              </div>
              <div className="absolute bottom-0 left-1/2 w-[620px] -translate-x-1/2 xl:w-[554px] lg:static lg:-mb-3 lg:-ml-2.5 lg:w-[320px] lg:translate-x-0 lg:pt-2.5 md:-mb-4 md:ml-0 md:mt-4 md:w-[334px] md:pt-0">
                <StaticImage
                  src="./images/illustration-pricing.png"
                  alt="Illustration"
                  objectFit="cover"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Hero;
