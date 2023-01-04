import { StaticImage } from 'gatsby-plugin-image';
import React from 'react';

import Button from 'components/shared/button';
import Container from 'components/shared/container';
import Field from 'components/shared/field';
import Link from 'components/shared/link';

const Hero = () => (
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
            className="relative z-10 flex flex-col space-y-10 rounded-xl bg-gray-1 p-12"
            style={{ boxShadow: '0px 20px 40px rgba(26, 26, 26, 0.4)' }}
          >
            <Field name="name" label="Your name *" />
            <Field name="email" label="Email address *" type="email" />
            <div className="flex space-x-10">
              <Field className="basis-[340px]" name="company_website" label="Company website" />
              <Field name="company_size" label="Company size" />
            </div>
            <Field name="message" label="Message" tag="textarea" />
            <div className="flex items-center justify-between space-x-7">
              <Button className="px-9 py-6 text-lg font-bold leading-none" theme="primary">
                Send message
              </Button>
              <p className="leading-tight">
                By submitting you agree to{' '}
                <Link className="pb-1" to="/privacy" theme="underline-primary-1" size="xs">
                  Neon’s Privacy Policy
                </Link>
                .
              </p>
            </div>
          </form>
        </div>
        <div className="relative my-10 grow rounded-r-[20px] bg-secondary-2 pt-10 font-mono text-black before:absolute before:inset-0 before:h-full before:w-full before:rounded-[20px] before:bg-secondary-2 before:opacity-70 before:blur-[70px]">
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
            <StaticImage class="mt-auto" src="./images/illustration.png" />
          </div>
        </div>
      </div>
    </Container>
  </section>
);

export default Hero;
