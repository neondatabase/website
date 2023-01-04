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
import { HUBSPOT_PRICING_FORM_ID } from 'constants/forms';
import { sendHubspotFormData } from 'utils/forms';

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
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const context = {
    hutk: hubspotutk,
    pageUri: href,
  };

  const onSubmit = async (data) => {
    const { name, email, companyWebsite, companySize, message } = data;
    setIsLoading(true);
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
        setIsLoading(false);
        setIsSuccess(true);
      } else {
        setIsLoading(false);
        setErrorMessage('Something went wrong. Please reload the page and try again.');
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      setErrorMessage('Something went wrong. Please reload the page and try again.');
    }
  };
  return (
    <section className="bg-black pt-44 pb-40 text-white">
      <Container className="text-center" size="md">
        <h1 className="text-[72px] font-bold leading-tight">Talk to our Sales team</h1>
        <p className="mx-auto mt-1.5 max-w-[787px] text-xl">
          Are you interested in exceeding your free tier limits and learn about pricing? Please fill
          out the form provided below and our team will review your submission
        </p>
        <div className="mx-auto mt-16 flex max-w-[1216px]">
          <div className="relative w-full max-w-[696px] shrink-0 before:absolute before:inset-0 before:h-full before:w-full before:rounded-[20px] before:bg-primary-1 before:opacity-60 before:blur-[70px]">
            <form
              className="relative z-10 grid gap-y-10 rounded-xl bg-gray-1 p-12 pb-14"
              style={{ boxShadow: '0px 20px 40px rgba(26, 26, 26, 0.4)' }}
              onSubmit={handleSubmit(onSubmit)}
            >
              <Field
                name="name"
                label="Your name *"
                register={register('name')}
                error={errors.name?.message}
              />
              <Field
                name="email"
                label="Email address *"
                type="email"
                register={register('email')}
                error={errors.email?.message}
              />
              <div className="flex space-x-10">
                <Field
                  className="basis-[340px]"
                  name="companyWebsite"
                  label="Company website"
                  register={register('companyWebsite')}
                />
                <Field name="companySize" label="Company size" register={register('companySize')} />
              </div>
              <Field name="message" label="Message" tag="textarea" register={register('message')} />
              <div className="relative mt-2 flex items-center">
                <Button
                  className="w-[194px] !px-9 !py-6 !text-lg"
                  type="submit"
                  loading={isLoading}
                  theme="primary"
                  size="xs"
                  disabled={isLoading || isSuccess}
                >
                  {isSuccess ? 'Sent!' : 'Send message'}
                </Button>
                <p className="ml-7 leading-tight">
                  By submitting you agree to{' '}
                  <Link className="pb-1" to="/privacy" theme="underline-primary-1" size="xs">
                    Neon’s Privacy Policy
                  </Link>
                  .
                </p>
                {errorMessage && (
                  <span className="absolute left-1/2 top-[calc(100%+1rem)] w-full -translate-x-1/2 text-sm leading-none text-secondary-1">
                    {errorMessage}
                  </span>
                )}
              </div>
            </form>
          </div>
          <div className="relative my-9 grow rounded-r-[20px] bg-secondary-2 pt-10 font-mono text-black before:absolute before:inset-0 before:h-full before:w-full before:rounded-[20px] before:bg-secondary-2 before:opacity-70 before:blur-[70px]">
            <div className="relative z-10 flex h-full flex-col">
              <h2
                className="text-[56px] font-bold leading-none"
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
              <p className="mt-2.5 text-[23px] font-bold leading-snug text-[#3E3E29]">
                Only pay for what you use.
              </p>
              <StaticImage className="mt-auto" src="./images/illustration.png" alt="Illustration" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Hero;
